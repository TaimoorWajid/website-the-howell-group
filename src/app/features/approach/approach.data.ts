import { PROJECT_PHASES, SERVICES } from '../../core/data/company.data';

interface PhaseContent {
  id: string;
  introduction: string;
  steps: readonly { number: number; text: string }[];
  activities: readonly string[];
  services: readonly string[];
}
// Lifecycle PDF p1; Creating Solutions pp/slides 9 and 13.
// Shared phase names remain the same across homepage, services and this page.
const CONTENT: readonly PhaseContent[] = [
  {
    id: 'project-development',
    introduction:
      'Start with the need behind the project. Establish the business case and the constraints that will guide decisions.',
    steps: [
      { number: 1, text: 'Define the initial scope and project constraints.' },
    ],
    activities: [
      'Distinguish needs from wants and establish the business case.',
      'Define scope, time and cost, and the owner’s approval requirements.',
      'Develop the scope document, initial budget and summary project schedule.',
    ],
    services: ['program-management'],
  },
  {
    id: 'team-development',
    introduction:
      'Bring the people and organizations together around clear expectations, responsibilities and a shared delivery approach.',
    steps: [
      { number: 2, text: 'Establish stakeholder involvement.' },
      { number: 3, text: 'Select team members and clarify expectations.' },
      { number: 4, text: 'Negotiate and finalize design agreements.' },
    ],
    activities: [
      'Define roles, responsibilities and the delivery and cost models.',
      'Establish communication protocols and a decision-making framework.',
      'Coordinate team selection, project contacts and design agreements.',
    ],
    services: ['program-management', 'contract-management'],
  },
  {
    id: 'design',
    introduction:
      'Translate the owner’s needs and user input into a coordinated design, moving from feasibility through design documentation.',
    steps: [{ number: 5, text: 'Develop the design.' }],
    activities: [
      'Review feasibility and develop conceptual and schematic proposals.',
      'Bring user input into the basis of design and material decisions.',
      'Develop plans, specifications and supporting design information.',
    ],
    services: ['design-management'],
  },
  {
    id: 'agency-review',
    introduction:
      'Coordinate the documents and review activities relevant to the project and its authorities. Requirements vary with location, scope and facility use.',
    steps: [
      {
        number: 6,
        text: 'Process documents through the relevant authorities.',
      },
    ],
    activities: [
      'Address applicable master planning, specific planning and entitlement activities.',
      'Coordinate plan review, conditions of use and permit documentation.',
      'Track authority comments and required documents through the review process.',
    ],
    services: ['design-management'],
  },
  {
    id: 'preconstruction',
    introduction:
      'Prepare for delivery by bringing agreements, procurement, estimates and schedules into alignment before construction begins.',
    steps: [
      { number: 7, text: 'Negotiate and finalize construction agreements.' },
      {
        number: 8,
        text: 'Develop project-specific permits, estimates and schedules.',
      },
    ],
    activities: [
      'Coordinate procurement, requests for proposals, scope reviews and construction agreements.',
      'Update estimates, validate schedules and consider value alternatives.',
      'Coordinate applicable facility permits and preparation for the start of construction.',
    ],
    services: ['contract-management', 'construction-management'],
  },
  {
    id: 'construction',
    introduction:
      'Coordinate production and installation with the project team, maintaining owner-side oversight of progress, cost, quality and safety.',
    steps: [
      {
        number: 9,
        text: 'Manage production and installation with attention to quality and safety.',
      },
    ],
    activities: [
      'Coordinate progress meetings, schedule updates and field reporting.',
      'Track payment applications, cost reports, projections and changes.',
      'Maintain project documentation, including submittals, requests for information and inspection records.',
    ],
    services: ['construction-management'],
  },
  {
    id: 'close-out',
    introduction:
      'Keep the end in view from the beginning. Bring outstanding work and final records together to support the transition out of construction.',
    steps: [{ number: 10, text: 'Complete project closeout.' }],
    activities: [
      'Coordinate punch lists and final project documentation.',
      'Collect as-built drawings, operating and maintenance manuals and warranties.',
      'Bring together relevant test reports, final changes and closeout records.',
    ],
    services: ['construction-management'],
  },
  {
    id: 'operation-patient-ready',
    introduction:
      'Support handover and the transition to operations, with the information and training the operating team needs for the facility’s intended use.',
    steps: [
      { number: 11, text: 'Support operational training and licensing.' },
    ],
    activities: [
      'Coordinate operational training and the handover of facility information.',
      'Support applicable licensing activities with the owner and relevant authorities.',
      'Make warranty and maintenance information available to the operating team.',
    ],
    services: ['program-management', 'construction-management'],
  },
];
export const APPROACH_PHASES = PROJECT_PHASES.map((phase, index) => ({
  ...phase,
  ...CONTENT[index],
  relatedServices: SERVICES.filter((service) =>
    CONTENT[index].services.includes(service.slug),
  ),
}));
