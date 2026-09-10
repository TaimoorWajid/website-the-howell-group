import { FeaturedProject } from './featured-projects.types';

/** Fictional editorial samples, not claims about Howell's completed work.
 * Replace metadata and the local images in public/images/projects before launch.
 */
export const FEATURED_PROJECT_SAMPLES: readonly FeaturedProject[] = [
  { id: 'sample-01', title: 'Riverside Medical Center', location: 'Los Angeles, California', category: 'Healthcare', area: '185,000 SF', year: '2025', status: 'Completed', client: 'Sample healthcare client', description: 'A calm, light-filled environment designed around the experience of patients and caregivers.', image: '/images/projects/project-01.jpg', imageAlt: 'Architectural study of a contemporary building', placeholder: true },
  { id: 'sample-02', title: 'The Foundry Quarter', location: 'Austin, Texas', category: 'Mixed-use', area: '240,000 SF', year: '2026', status: 'In progress', description: 'A new civic address bringing work, gathering and everyday life into one connected place.', image: '/images/projects/project-02.jpg', imageAlt: 'Geometric facade used as illustrative project photography', placeholder: true },
  { id: 'sample-03', title: 'Northline Research Campus', location: 'Raleigh, North Carolina', category: 'Science & technology', area: '126,000 SF', year: '2024', status: 'Completed', description: 'Precise, adaptable spaces supporting the next generation of research and discovery.', image: '/images/projects/project-03.jpg', imageAlt: 'Modern architectural structure against the sky', placeholder: true },
  { id: 'sample-04', title: 'Westhaven Workplace', location: 'Denver, Colorado', category: 'Commercial', area: '92,000 SF', year: '2025', status: 'Completed', description: 'Daylight, natural materials and thoughtful planning create a more considered working day.', image: '/images/projects/project-04.jpg', imageAlt: 'Bright contemporary workplace interior', placeholder: true },
  { id: 'sample-05', title: 'Cedar House Residences', location: 'Portland, Oregon', category: 'Residential', area: '68,000 SF', year: '2026', status: 'In development', description: 'Homes shaped by their landscape, with a quiet emphasis on material, proportion and longevity.', image: '/images/projects/project-05.jpg', imageAlt: 'Contemporary residence in a planted landscape', placeholder: true }
];
