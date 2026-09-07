import { Component, signal } from '@angular/core';
import { RevealDirective } from '../../../shared/directives/reveal.directive';

interface ServiceItem { name: string; description: string; }

@Component({ selector: 'app-home-services', imports: [RevealDirective], template: `<section class="services" aria-labelledby="services-title"><div class="section-shell services-inner"><div class="services-intro"><p class="section-label" appReveal>04 / Capabilities</p><h2 id="services-title" appReveal>From first line<br />to <em>final detail.</em></h2></div><div class="service-list" appReveal>@for (service of serviceItems; track service.name; let i = $index) { <button type="button" class="service-item" [class.is-active]="activeService() === i" (mouseenter)="activeService.set(i)" (focus)="activeService.set(i)" (click)="activeService.set(i)"><span class="service-number">0{{ i + 1 }}</span><span class="service-name">{{ service.name }}</span><span class="service-description">{{ service.description }}</span><span class="service-arrow" aria-hidden="true">↗</span></button> }</div></div></section>`, styles: [`
    .services { background: var(--color-charcoal); color: var(--color-white); padding: clamp(7rem, 14vw, 13rem) 0; }
    .services-inner { display: grid; gap: 10vw; grid-template-columns: minmax(15rem, .8fr) minmax(22rem, 1.2fr); } .section-shell { margin: 0 auto; max-width: var(--content-max-width); padding-left: var(--page-gutter); padding-right: var(--page-gutter); } .section-label { color: var(--color-teal); font-size: .68rem; letter-spacing: .15em; margin: 0; text-transform: uppercase; } h2 { font-size: clamp(3rem, 6.5vw, 7rem); letter-spacing: -.07em; line-height: .88; margin: 5rem 0 0; } h2 em { color: var(--color-teal); font-style: normal; }
    .service-list { border-top: 1px solid rgba(255,255,255,.25); } .service-item { align-items: center; background: transparent; border: 0; border-bottom: 1px solid rgba(255,255,255,.25); color: var(--color-white); cursor: pointer; display: grid; gap: 1rem; grid-template-columns: 2rem 1fr minmax(9rem, .7fr) 1rem; padding: 1.4rem 0; text-align: left; width: 100%; } .service-item:hover, .service-item:focus-visible, .service-item.is-active { color: var(--color-teal); } .service-number { color: var(--color-red); font-size: .65rem; } .service-name { font-family: var(--font-display); font-size: clamp(1.25rem, 2.5vw, 2rem); letter-spacing: -.025em; } .service-description { color: rgba(255,255,255,.55); font-size: .75rem; line-height: 1.45; } .service-item:hover .service-description, .service-item:focus-visible .service-description, .service-item.is-active .service-description { color: rgba(255,255,255,.85); } .service-arrow { color: var(--color-red); font-size: 1.1rem; }
    @media (max-width: 48rem) { .services-inner { display: block; } h2 { margin: 3rem 0 5rem; } .service-item { grid-template-columns: 2rem 1fr 1rem; } .service-description { display: none; } }
  `] })
export class HomeServicesComponent {
  protected readonly activeService = signal(0);
  protected readonly serviceItems: ServiceItem[] = [
    { name: 'Construction', description: 'Delivery with discipline, from groundworks to handover.' },
    { name: 'Development', description: 'Clear thinking around opportunity, context and long-term value.' },
    { name: 'Design + Build', description: 'A joined-up process where intent survives into detail.' },
    { name: 'Project Management', description: 'Calm, rigorous leadership across every moving part.' },
    { name: 'Advisory', description: 'An experienced perspective when the decisions matter most.' }
  ];
}
