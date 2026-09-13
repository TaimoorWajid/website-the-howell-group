import { SERVICE_CHAPTERS } from '../../features/services/services.data';

// Detail routes are placeholders; link to the published service chapters.
export const FOOTER_LINKS = {
  home: '/',
  contact: '/contact',
  explore: [
    { label: 'Home', route: '/' },
    { label: 'About Us', route: '/about' },
    { label: 'Projects', route: '/projects' },
    { label: 'Insights', route: '/insights' },
    { label: 'Contact', route: '/contact' }
  ],
  services: SERVICE_CHAPTERS.map(chapter => ({
    label: chapter.name, route: '/services', fragment: chapter.id
  }))
} as const;
