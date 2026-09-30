import { SERVICES } from '../../core/data/company.data';

// Shared service names and canonical detail destinations.
export const FOOTER_LINKS = {
  home: '/',
  contact: '/contact',
  explore: [
    { label: 'Home', route: '/' },
    { label: 'About Us', route: '/about' },
    { label: 'Our Approach', route: '/our-approach' },
    { label: 'Projects', route: '/projects' },
    { label: 'Markets', route: '/markets' },
    { label: 'Careers', route: '/careers' },
    { label: 'Contact', route: '/contact' }
  ],
  services: SERVICES.map(service => ({
    label: service.title, route: '/services/' + service.slug
  }))
} as const;
