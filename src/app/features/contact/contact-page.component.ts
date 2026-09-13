import { afterNextRender, Component, ElementRef, inject, NgZone, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import { AnimationManagerService } from '../../core/animations/animation-manager.service';
import { SeoService } from '../../core/services/seo.service';
import { ContactInquiryComponent } from './contact-inquiry.component';

@Component({ selector: 'app-contact-page', imports: [RouterLink, ContactInquiryComponent], templateUrl: './contact-page.component.html', styleUrl: './contact-page.component.scss' })
export class ContactPageComponent implements OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly animations = inject(AnimationManagerService);
  private readonly zone = inject(NgZone);
  private media?: gsap.MatchMedia;
  constructor() {
    inject(SeoService).update({ title: 'Contact | The Howell Group', description: "Every great project starts with a conversation. Tell us what you're planning, what matters most and where you need a clearer path forward.", canonicalPath: '/contact' });
    afterNextRender(() => this.zone.runOutsideAngular(() => {
      this.animations.setup(); this.media = gsap.matchMedia();
      this.media.add('(prefers-reduced-motion: no-preference)', context => {
        const root = this.host.nativeElement;
        try {
          gsap.from(root.querySelector('h1'), { y: 12, opacity: 0, duration: .65, ease: 'power2.out' });
          gsap.from(root.querySelector('.inquiry-image'), { clipPath: 'inset(0 100% 0 0)', duration: 1, ease: 'power3.out', scrollTrigger: { trigger: root.querySelector('.inquiry-image'), start: 'top 90%', once: true } });
          gsap.from(root.querySelectorAll('.conversation-prompt'), { y: 10, opacity: 0, duration: .6, stagger: .12, scrollTrigger: { trigger: root.querySelector('.conversation'), start: 'top 85%', once: true } });
          gsap.from(root.querySelectorAll('.closing-drawing path'), { strokeDashoffset: 1, duration: 1.2, stagger: .1, ease: 'power2.out', scrollTrigger: { trigger: root.querySelector('.contact-closing'), start: 'top 85%', once: true } });
        } catch { context.revert(); }
      });
    }));
  }
  ngOnDestroy(): void { this.media?.revert(); }
}
