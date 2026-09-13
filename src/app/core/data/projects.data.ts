import { Project, ProjectImage } from '../models/content.models';

export interface PortfolioProject extends Project {
  images: [ProjectImage & { width: number; height: number }];
}

// Verified names and image associations: https://thehowellgroup.co/projects/
// The configured CMS is unavailable. Share this collection with the detail template;
// do not substitute the homepage's fictional editorial samples.
export const PORTFOLIO_PROJECTS: readonly PortfolioProject[] = [
  { id: 'aliso-ridge-behavioral-hospital', slug: 'aliso-ridge-behavioral-hospital', title: 'Aliso Ridge Behavioral Hospital', images: [{ src: '/images/projects/client/aliso-ridge-behavioral-hospital.webp', alt: 'Aerial view of Aliso Ridge Behavioral Hospital and its landscaped grounds', width: 682, height: 384 }] },
  { id: 'anaheim-community-hospital', slug: 'anaheim-community-hospital', title: 'Anaheim Community Hospital', images: [{ src: '/images/projects/client/anaheim-community-hospital.webp', alt: 'Columned entrance and driveway at Anaheim Community Hospital', width: 644, height: 430 }] },
  { id: 'kpc-global-oc', slug: 'kpc-global-oc', title: 'KPC Global OC', images: [{ src: '/images/projects/client/kpc-global-oc.webp', alt: 'Exterior of Orange County Global Medical Center, the KPC Global OC project', width: 1200, height: 800 }] },
  { id: 'western-university-medical-school', slug: 'western-university-medical-school', title: 'Western University Medical School', images: [{ src: '/images/projects/client/western-university-medical-school.webp', alt: 'Glass-fronted Western University Medical School building with an exterior staircase', width: 1200, height: 800 }] },
  { id: 'los-angeles-downtown-medical-center', slug: 'los-angeles-downtown-medical-center', title: 'Los Angeles Downtown Medical Center', images: [{ src: '/images/projects/client/los-angeles-downtown-medical-center.webp', alt: 'Illuminated entrance and signage at Los Angeles Downtown Medical Center', width: 1200, height: 900 }] },
  { id: 'kpc-global-chapman', slug: 'kpc-global-chapman', title: 'KPC Global Chapman', images: [{ src: '/images/projects/client/kpc-global-chapman.webp', alt: 'Chapman Global Medical Center exterior and entrance signage, the KPC Global Chapman project', width: 978, height: 652 }] }
];
