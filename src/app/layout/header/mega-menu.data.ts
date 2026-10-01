import { COMPANY, SERVICES } from '../../core/data/company.data';
import { MegaMenuConfig } from './mega-menu.types';
import { MARKETS } from '../../core/data/markets.data';

// Use established parent routes until real detail content is published. Sample
// project locations and sectors are not company claims.
export const MEGA_MENUS: readonly MegaMenuConfig[] = [
  {
    id: 'projects',
    label: 'Projects',
    path: '/projects',
    introduction: 'Considered places. Lasting purpose.',
    sections: [
      {
        title: 'Explore our work',
        items: [
          {
            title: 'Projects',
            icon: 'grid',
            description: 'Explore our healthcare project portfolio.',
            route: '/projects',
          },
        ],
      },
      {
        title: 'Behind the work',
        items: [
          {
            title: 'Our services',
            icon: 'layers',
            description: 'Expertise across the project journey.',
            route: '/services',
          },
          {
            title: 'About Howell',
            icon: 'people',
            description: 'Meet the thinking behind the details.',
            route: '/about',
          },
        ],
      },
    ],
    feature: {
      image: '/images/projects/client/kpc-global-oc.webp',
      alt: 'Orange County Global Medical Center exterior',
      eyebrow: 'Healthcare environments',
      title: 'KPC Global OC',
      route: '/projects',
      cta: 'Explore projects',
    },
  },
  {
    id: 'services',
    label: 'Services',
    path: '/services',
    introduction: 'Owner interests. Coordinated teams.',
    sections: [
      {
        title: 'Project delivery',
        items: SERVICES.slice(0, 3).map((service) => ({
          title: service.title,
          icon: 'layers' as const,
          description: service.description ?? '',
          route: '/services/' + service.slug,
        })),
      },
      {
        title: 'Agreements & finance',
        items: SERVICES.slice(3).map((service) => ({
          title: service.title,
          icon: 'checklist' as const,
          description: service.description ?? '',
          route: '/services/' + service.slug,
        })),
      },
    ],
    feature: {
      image: '/images/services/coordinated-building.svg',
      alt: '',
      eyebrow: 'Our expertise',
      title: COMPANY.tagline,
      description: COMPANY.positioning,
      route: '/services',
      cta: 'View all services',
    },
  },
  {
    id: 'markets',
    label: 'Markets',
    path: '/markets',
    introduction: COMPANY.market,
    sections: [
      {
        title: 'Explore markets',
        items: MARKETS.slice(0, 3).map((market) => ({
          title: market.name,
          icon: 'building' as const,
          description: `Explore ${market.name.toLowerCase()} environments.`,
          route: `/markets/${market.slug}`,
        })),
      },
      {
        title: 'More care environments',
        items: MARKETS.slice(3).map((market) => ({
          title: market.name,
          icon: 'layers' as const,
          description: 'Explore this care environment.',
          route: `/markets/${market.slug}`,
        })),
      },
    ],
    feature: {
      image: '/images/projects/project-04.jpg',
      alt: 'Illustrative interior',
      eyebrow: 'Our markets',
      title: 'Places where care happens.',
      route: '/markets',
      cta: 'Explore all markets',
    },
  },
  {
    id: 'about',
    label: 'About',
    path: '/about',
    introduction: COMPANY.tagline,
    sections: [
      {
        title: 'The Howell Group',
        items: [
          {
            title: 'About us',
            icon: 'people',
            description: 'Our perspective on building what matters.',
            route: '/about',
          },
          {
            title: 'Our approach',
            icon: 'compass',
            description:
              'Explore the project lifecycle, from development to operation.',
            route: '/our-approach',
          },
        ],
      },
      {
        title: 'Connect with Howell',
        items: [
          {
            title: 'Careers',
            icon: 'briefcase',
            description: 'Explore your next chapter with Howell.',
            route: '/careers',
          },
          {
            title: 'Get in touch',
            icon: 'mail',
            description: 'Start a conversation with our team.',
            route: '/contact',
          },
        ],
      },
    ],
    feature: {
      image: '/images/projects/project-01.jpg',
      alt: 'Contemporary architecture in natural light',
      eyebrow: 'The Howell Group',
      title: COMPANY.tagline,
      route: '/about',
      cta: 'Learn more',
    },
  },
];
