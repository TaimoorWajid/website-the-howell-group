import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { APP_CONFIG } from '../config/app-config';

export interface SeoConfig { title: string; description?: string; canonicalPath?: string; image?: string; noIndex?: boolean; breadcrumbs?: readonly { name: string; path: string }[]; }

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  update(config: SeoConfig): void {
    const description = config.description ?? APP_CONFIG.defaultDescription;
    this.title.setTitle(config.title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'robots', content: config.noIndex ? 'noindex, nofollow' : 'index, follow' });
    if (config.image) this.meta.updateTag({ property: 'og:image', content: new URL(config.image, APP_CONFIG.siteUrl).toString() });
    else this.meta.removeTag('property="og:image"');
    this.setCanonical(config.canonicalPath ?? '/');
    this.setBreadcrumbs(config.breadcrumbs);
  }

  private setBreadcrumbs(breadcrumbs: SeoConfig['breadcrumbs']): void {
    const existing = this.document.getElementById('howell-breadcrumbs');
    if (!breadcrumbs?.length) { existing?.remove(); return; }
    const script = existing ?? this.document.createElement('script');
    script.id = 'howell-breadcrumbs';
    script.setAttribute('type', 'application/ld+json');
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem', position: index + 1, name: crumb.name,
        item: new URL(crumb.path, APP_CONFIG.siteUrl).toString()
      }))
    }).replace(/</g, '\\u003c');
    if (!existing) this.document.head.appendChild(script);
  }

  private setCanonical(path: string): void {
    const href = new URL(path, APP_CONFIG.siteUrl).toString();
    let link = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) { link = this.document.createElement('link'); link.rel = 'canonical'; this.document.head.appendChild(link); }
    link.href = href;
  }
}
