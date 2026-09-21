import { MegaMenuConfig } from './mega-menu.types';
import { MARKETS } from '../../core/data/markets.data';

// Use established parent routes until real detail content is published. Sample
// project locations, sectors and editorial articles are not company claims.
export const MEGA_MENUS: readonly MegaMenuConfig[] = [
  { id: 'projects', label: 'Projects', path: '/projects', introduction: 'Considered places. Lasting purpose.', sections: [
    { title: 'Explore our work', items: [{ title: 'Projects', icon: 'grid', description: 'Explore the places we bring to life.', route: '/projects' }] },
    { title: 'Behind the work', items: [{ title: 'Our services', icon: 'layers', description: 'Expertise across the project journey.', route: '/services' }, { title: 'About Howell', icon: 'people', description: 'Meet the thinking behind the details.', route: '/about' }] }
  ], feature: { image: '/images/projects/project-03.jpg', alt: 'Architectural study of a contemporary structure', eyebrow: 'Form & purpose', title: 'A considered approach to every place.', route: '/projects', cta: 'Explore projects' } },
  { id: 'services', label: 'Services', path: '/services', introduction: 'From first vision to final detail.', sections: [
    { title: 'Delivery', items: [{ title: 'Construction', icon: 'building', description: 'Disciplined delivery from groundworks to handover.', route: '/services' }, { title: 'Design + Build', icon: 'blueprint', description: 'A joined-up process from intent to detail.', route: '/services' }, { title: 'Project Management', icon: 'checklist', description: 'Clear leadership across every moving part.', route: '/services' }] },
    { title: 'Strategy', items: [{ title: 'Development', icon: 'development', description: 'Opportunity, context and long-term value.', route: '/services' }, { title: 'Advisory', icon: 'conversation', description: 'Perspective when decisions matter most.', route: '/services' }] }
  ], feature: { image: '/images/projects/project-02.jpg', alt: 'Geometric architectural facade', eyebrow: 'Our expertise', title: 'Vision. Precision. Delivery.', description: 'Construction expertise at every stage.', route: '/services', cta: 'View all services' } },
  { id: 'markets', label: 'Markets', path: '/markets', introduction: 'Different places. Distinct priorities.', sections: [
    { title: 'Explore markets', items: MARKETS.filter(market => !market.parentSlug && market.kind !== 'cross-sector').map(market => ({ title: market.name, icon: 'building' as const, description: `Explore ${market.name.toLowerCase()} environments.`, route: `/markets/${market.slug}` })) },
    { title: 'Care environments & cross-sector work', items: MARKETS.filter(market => market.parentSlug || market.kind === 'cross-sector').map(market => ({ title: market.name, icon: 'layers' as const, description: market.kind === 'cross-sector' ? 'Consider change within existing spaces.' : 'Explore this care environment.', route: `/markets/${market.slug}` })) }
  ], feature: { image: '/images/projects/project-04.jpg', alt: 'Illustrative workplace interior', eyebrow: 'Our markets', title: 'Choose a market.', route: '/markets', cta: 'Explore all markets' } },
  { id: 'about', label: 'About', path: '/about', introduction: 'Building with purpose.', sections: [
    { title: 'The Howell Group', items: [{ title: 'About us', icon: 'people', description: 'Our perspective on building what matters.', route: '/about' }, { title: 'Our approach', icon: 'compass', description: 'Explore how our expertise comes together.', route: '/services' }] },
    { title: 'People & perspectives', items: [{ title: 'Careers', icon: 'briefcase', description: 'Explore your next chapter with Howell.', route: '/careers' }, { title: 'Insights', icon: 'journal', description: 'Ideas and perspectives from the group.', route: '/insights' }, { title: 'Get in touch', icon: 'mail', description: 'Start a conversation with our team.', route: '/contact' }] }
  ], feature: { image: '/images/projects/project-01.jpg', alt: 'Contemporary architecture in natural light', eyebrow: 'The Howell Group', title: 'Building with purpose. Delivering with confidence.', route: '/about', cta: 'Learn more' } },
  { id: 'insights', label: 'Insights', path: '/insights', introduction: 'Ideas for the built environment.', sections: [
    { title: 'Journal', items: [{ title: 'News & insights', icon: 'journal', description: 'Explore the latest perspectives from Howell.', route: '/insights' }] },
    { title: 'Explore further', items: [{ title: 'Our projects', icon: 'grid', description: 'Discover the work behind the thinking.', route: '/projects' }, { title: 'Contact the team', icon: 'mail', description: 'Connect with us for enquiries.', route: '/contact' }] }
  ], feature: { image: '/images/projects/project-04.jpg', alt: 'Daylight in a contemporary interior', eyebrow: 'Perspectives', title: 'Space for a different perspective.', route: '/insights', cta: 'Explore insights' } }
];
