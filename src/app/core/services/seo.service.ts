import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { APP_CONFIG } from '../config/app-config';

export interface SeoConfig { title: string; description?: string; canonicalPath?: string; image?: string; noIndex?: boolean; }

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
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
    if (config.image) this.meta.updateTag({ property: 'og:image', content: config.image });
    if (!isPlatformBrowser(this.platformId)) this.setCanonical(config.canonicalPath ?? '/');
  }

  private setCanonical(path: string): void {
    const href = new URL(path, APP_CONFIG.siteUrl).toString();
    let link = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) { link = this.document.createElement('link'); link.rel = 'canonical'; this.document.head.appendChild(link); }
    link.href = href;
  }
}
