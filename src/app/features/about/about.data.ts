import { TEAM } from '../../core/data/company.data';
import { TeamMember } from '../../core/models/content.models';

export const ABOUT_PERSPECTIVES = [
  {
    number: '01',
    label: 'THE OWNER',
    title: 'Start with what matters.',
    body: 'Understand the client’s mission and represent the owner’s interests throughout the project.',
  },
  {
    number: '02',
    label: 'THE TEAM',
    title: 'Bring the perspectives together.',
    body: 'Develop people-centric teams with clear responsibilities, open communication and shared priorities.',
  },
  {
    number: '03',
    label: 'THE OUTCOME',
    title: 'Move forward with a shared purpose.',
    body: 'Tailor the process to the project, bringing people and decisions together around the client’s goals.',
  },
] as const;

export const ABOUT_VALUES = [
  {
    number: '01',
    title: 'Integrity',
    body: 'Be open and honest. Respect every person and every role.',
    image: '/images/projects/client/anaheim-community-hospital-gallery-1.webp',
    width: 682,
    height: 455,
  },
  {
    number: '02',
    title: 'Intent',
    body: 'Understand the client’s mission and keep it at the center of decisions.',
    image:
      '/images/projects/client/western-university-medical-school-gallery-8.webp',
    width: 1600,
    height: 1200,
  },
  {
    number: '03',
    title: 'Capabilities',
    body: 'Bring the right people together and define their responsibilities.',
    image: '/images/projects/client/kpc-global-oc-gallery-2.webp',
    width: 1600,
    height: 1067,
  },
  {
    number: '04',
    title: 'Results',
    body: 'Work together toward the project’s agreed scope and goals.',
    image: '/images/projects/client/kpc-global-chapman-gallery-2.webp',
    width: 1166,
    height: 778,
  },
] as const;

// About-specific biography copy; identities, titles and portraits come from shared TEAM.
// Brochure physical pages 5, 8 and 11; see the internal content-source register.
const ABOUT_BIOGRAPHIES: Readonly<Record<string, string>> = {
  'marc-howell':
    'Marc brings experience in planning, programming, design, construction and owner representation across healthcare renovations and new facilities. His work spans design-bid-build, design-build, progressive design-build and construction management at risk.',
  'eric-laurin':
    'Eric’s experience spans concept through close out, with a focus on healthcare and owner representation. He brings teams together around project needs and leads project financial tracking and client technology integration.',
  'brett-smith':
    'Brett brings construction project oversight experience across medical, commercial and multifamily projects. From preconstruction through completion, he keeps stakeholder expectations and interests central to project coordination.',
};
export const ABOUT_TEAM: readonly TeamMember[] = TEAM.map((person) => ({
  ...person,
  bio: ABOUT_BIOGRAPHIES[String(person.id)] ?? person.bio,
}));
