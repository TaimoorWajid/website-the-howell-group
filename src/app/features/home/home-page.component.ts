import { ProjectJourneyComponent } from './components/project-journey/project-journey.component';
import { PeopleBeforeProcessComponent } from './components/people-before-process/people-before-process.component';
import { ServicesExperienceComponent } from './components/services-experience/services-experience.component';
import { WhyHowellSectionComponent } from './components/why-howell-section/why-howell-section.component';
import { HomeHeroComponent } from './components/home-hero/home-hero.component';
import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import {
  ScrollRevealCard,
  ScrollRevealGridCardsComponent,
} from '../../shared/components/scroll-reveal-grid-cards/scroll-reveal-grid-cards.component';
import { FeaturedProjectsComponent } from '../../shared/components/featured-projects/featured-projects.component';
import { PORTFOLIO_PROJECTS } from '../../core/data/projects.data';
import { COMPANY } from '../../core/data/company.data';
import { FeaturedProject } from '../../shared/components/featured-projects/featured-projects.types';
import { AnimationManagerService } from '../../core/animations/animation-manager.service';

@Component({
  selector: 'app-home-page',
  imports: [
    ProjectJourneyComponent,
    PeopleBeforeProcessComponent,
    ServicesExperienceComponent,
    WhyHowellSectionComponent,
    HomeHeroComponent,
    RouterLink,
    RevealDirective,
    ScrollRevealGridCardsComponent,
    FeaturedProjectsComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly seo = inject(SeoService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly animations = inject(AnimationManagerService);

  protected readonly featuredProjects: readonly FeaturedProject[] =
    PORTFOLIO_PROJECTS.map((project) => ({
      id: project.id,
      title: project.title,
      route: '/projects/' + project.slug,
      area: project.area,
      bedCount: project.bedCount,
      jurisdiction: project.jurisdiction,
      description: project.overview?.paragraphs.join(' '),
      outcome: project.contribution?.outcome,
      image: project.images[0].src,
      imageAlt: project.images[0].alt,
    }));
  protected readonly scrollRevealCards: ReadonlyArray<ScrollRevealCard> = [
    {
      number: '01',
      title: 'Your mission',
      description:
        'Define the need, scope and priorities before choosing a path forward.',
      image: '/images/services/program-management.webp',
      imageAlt: 'Project planners reviewing a campus model and plans',
    },
    {
      number: '02',
      title: 'One team',
      description:
        'Align owners, designers and contractors around clear responsibilities and shared goals.',
      image: '/images/services/construction-management.webp',
      imageAlt:
        'Construction team members coordinating site work using a tablet',
    },
    {
      number: '03',
      title: 'Clear decisions',
      description:
        'Connect scope, schedule and cost with the information owners need to make decisions.',
      image: '/images/services/financial-management.webp',
      imageAlt:
        'Advisors reviewing project plans, budgets and financial information',
    },
    {
      number: '04',
      title: 'Patient ready',
      description:
        'Plan for close out, operational training and licensing from the beginning.',
      image: '/images/markets/outpatient-exam-room.webp',
      imageAlt:
        'Completed examination room with clinical equipment and a staff workstation',
    },
  ];

  constructor() {
    afterNextRender(() => {
      // The card runway is expanded by a later Angular render. Pin coordinates
      // measured before that render are stale even though the viewport did not resize.
      let frame: number | undefined;
      const observer = new ResizeObserver(() => {
        if (frame !== undefined) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          frame = undefined;
          this.animations.refresh();
        });
      });
      this.host.nativeElement
        .querySelectorAll('.home-page > *')
        .forEach((section) => observer.observe(section, { box: 'border-box' }));
      this.destroyRef.onDestroy(() => {
        observer.disconnect();
        if (frame !== undefined) cancelAnimationFrame(frame);
      });
    });
    this.seo.update({
      title: COMPANY.name + ' | ' + COMPANY.tagline,
      description: COMPANY.positioning + ' ' + COMPANY.market,
      canonicalPath: '/',
    });
  }
}
