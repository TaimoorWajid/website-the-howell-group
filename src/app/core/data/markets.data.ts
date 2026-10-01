export type MarketSlug = 'hospitals' | 'skilled-nursing-intermediate-care' | 'licensed-clinics-outpatient' | 'correctional-treatment-centers' | 'behavioral-health';
export type MarketServiceId = 'program-management' | 'design-management' | 'construction-management' | 'contract-management' | 'financial-management';
export interface MarketImage { src: string; alt: string; width: number; height: number; caption: string; }
export interface MarketDetail {
  heading: readonly [string, string];
  intro: string;
  introductionHeading: string;
  introductionCopy: string;
  introductionImage: MarketImage;
  prioritiesHeading: string;
  priorities: readonly [{ title: string; copy: string }, { title: string; copy: string }, { title: string; copy: string }];
  relatedMarkets: readonly MarketSlug[];
  projectSlugs: readonly string[];
  projectAttribution?: string;
  services: readonly MarketServiceId[];
  serviceCopy: string;
  invitation: string;
}
export interface Market {
  slug: MarketSlug;
  name: string;
  kind: 'market';
  image: MarketImage;
  detail: MarketDetail;
}
// Source decisions and the original broad-sector drafts remain private in docs/client-content.
// Considerations describe the project brief, not experience or regulatory credentials.
const nursing: MarketImage = { src: '/images/markets/skilled-nursing.webp', alt: 'Daylit skilled nursing resident lounge with accessible circulation and garden views', width: 1536, height: 1024, caption: 'Resident care environment' };
const outpatient: MarketImage = { src: '/images/markets/outpatient-clinic.webp', alt: 'Outpatient clinic reception with an adjoining examination room', width: 1536, height: 1024, caption: 'Outpatient care environment' };
const correctional: MarketImage = { src: '/images/markets/correctional-treatment.webp', alt: 'Correctional healthcare treatment wing with a staff station and examination room', width: 1536, height: 1024, caption: 'Clinical treatment environment' };
const hospital: MarketImage = { src: '/images/projects/client/kpc-global-oc.webp', alt: 'Orange County Global Medical Center exterior', width: 1200, height: 800, caption: 'KPC Global OC' };
const behavioral: MarketImage = { src: '/images/projects/client/aliso-ridge-behavioral-hospital-gallery-2.webp', alt: 'Daylit common area at Aliso Ridge Behavioral Hospital', width: 681, height: 383, caption: 'Aliso Ridge Behavioral Hospital' };

export const MARKETS: readonly Market[] = [
  { slug: 'hospitals', name: 'General Acute Care Buildings', kind: 'market', image: hospital, detail: {
    heading: ['Care continues.', 'Delivery stays coordinated.'],
    intro: 'General acute care projects bring clinical environments, essential infrastructure and ongoing hospital operations into one coordinated brief.',
    introductionHeading: 'Plan the work around the care.',
    introductionCopy: 'Clinical teams, facility operators and project partners each see different dependencies. Understanding their needs helps frame the scope, sequence and decisions around changes to an operating hospital.',
    introductionImage: { src: '/images/projects/client/kpc-global-oc-gallery-6.webp', alt: 'Crane and equipment delivery beside the operating Orange County Global Medical Center', width: 1600, height: 900, caption: 'KPC Global OC · infrastructure work' },
    prioritiesHeading: 'Clinical needs. Continuity. Infrastructure.',
    priorities: [{ title: 'Clinical environments', copy: 'Consider patient routes, clinical adjacencies and the support spaces that connect care teams.' }, { title: 'Operational continuity', copy: 'Discuss access, phasing and transitions with the people responsible for ongoing care.' }, { title: 'Infrastructure coordination', copy: 'Bring building systems, equipment interfaces and delivery dependencies into the project plan.' }],
    relatedMarkets: ['licensed-clinics-outpatient'], projectSlugs: ['kpc-global-oc'],
    projectAttribution: 'Marc Howell’s individual professional experience includes onsite construction management for operating-room and central-plant work at KPC Global OC. This is team-member experience, not a claim of Howell company delivery.',
    services: ['program-management', 'design-management', 'construction-management'],
    serviceCopy: 'Program Management connects campus priorities and delivery decisions. Design Management coordinates owner and user needs with the design team. Construction Management provides oversight of scope, quality, schedule and cost on the owner’s behalf.',
    invitation: 'Let’s discuss your acute care project.'
  } },
  { slug: 'skilled-nursing-intermediate-care', name: 'Skilled Nursing & Intermediate Care Facilities', kind: 'market', image: nursing, detail: {
    heading: ['Daily care.', 'Thoughtful change.'],
    intro: 'Skilled nursing and intermediate care projects begin with resident needs, daily routines and the staff workflows that support them.',
    introductionHeading: 'Consider the people who spend each day here.',
    introductionCopy: 'Improvements can affect personal spaces, shared areas and the paths staff use throughout a shift. A clear brief brings these relationships into decisions about design and delivery.',
    introductionImage: { src: '/images/markets/skilled-nursing-resident-room.webp', alt: 'Skilled nursing resident bedroom with generous bedside circulation and garden views', width: 1536, height: 1024, caption: 'Personal space and daily care' },
    prioritiesHeading: 'Residents. Routines. Improvements.',
    priorities: [{ title: 'Resident needs', copy: 'Discuss comfort, privacy and access with the people who understand residents’ daily lives.' }, { title: 'Staff workflows', copy: 'Consider the connections between care spaces, supplies and staff support areas.' }, { title: 'Thoughtful improvements', copy: 'Coordinate the sequence of work with facility routines and the intended use of each space.' }],
    relatedMarkets: [], projectSlugs: [], services: ['design-management', 'construction-management', 'contract-management'],
    serviceCopy: 'Design Management brings owner and user input into design development. Construction Management tracks scope, schedule, cost and quality on the owner’s behalf. Contract Management supports the development and negotiation of project agreements around the agreed work.',
    invitation: 'Let’s discuss your resident care environment.'
  } },
  { slug: 'licensed-clinics-outpatient', name: 'Licensed Clinics & Outpatient Services', kind: 'market', image: outpatient, detail: {
    heading: ['Access to care.', 'Connected clinical spaces.'],
    intro: 'Clinic and outpatient projects connect patient access, clinical workflows and the fit-out and equipment decisions that shape a visit.',
    introductionHeading: 'Follow the patient journey and the work behind it.',
    introductionCopy: 'Arrival, consultation and treatment each place different demands on a space. Bringing care-team input and equipment needs into the brief helps the project team coordinate the fit-out.',
    introductionImage: { src: '/images/markets/outpatient-exam-room.webp', alt: 'Outpatient examination room with coordinated clinical equipment and staff workspace', width: 1536, height: 1024, caption: 'Clinical workflow and equipment' },
    prioritiesHeading: 'Access. Workflow. Equipment.',
    priorities: [{ title: 'Patient access', copy: 'Consider arrival, waiting and movement between clinical spaces.' }, { title: 'Clinical workflows', copy: 'Discuss room relationships, staff movement and support needs with care teams.' }, { title: 'Fit-out coordination', copy: 'Align equipment requirements, building services and design information before installation.' }],
    relatedMarkets: ['hospitals'], projectSlugs: [], services: ['design-management', 'construction-management', 'contract-management'],
    serviceCopy: 'Design Management coordinates the design team, user input and milestones with schedule and cost. Contract Management develops project agreements on the client’s behalf, while Construction Management oversees delivery and project documentation for the owner.',
    invitation: 'Let’s discuss your clinic or outpatient project.'
  } },
  { slug: 'correctional-treatment-centers', name: 'Correctional Treatment Centers', kind: 'market', image: correctional, detail: {
    heading: ['Care and operations.', 'Coordinated together.'],
    intro: 'Correctional treatment projects require a shared understanding of care delivery, facility operations and controlled access.',
    introductionHeading: 'Make the interfaces part of the brief.',
    introductionCopy: 'Care teams and facility operators bring different responsibilities to the same environment. Project planning should make those interfaces clear, including movement, access and the sequence of work.',
    introductionImage: { src: '/images/markets/correctional-care-exterior.webp', alt: 'Treatment building entrance and sheltered walkway within a controlled-access care environment', width: 1536, height: 1024, caption: 'Care, access and operations' },
    prioritiesHeading: 'Care delivery. Operations. Access.',
    priorities: [{ title: 'Care delivery', copy: 'Clarify clinical spaces and support needs with the teams responsible for treatment.' }, { title: 'Facility operations', copy: 'Discuss daily activities and project dependencies with facility operators.' }, { title: 'Controlled access', copy: 'Bring access requirements and movement between areas into team coordination and delivery planning.' }],
    relatedMarkets: [], projectSlugs: [], services: ['program-management', 'design-management', 'contract-management'],
    serviceCopy: 'Program Management helps align priorities, responsibilities and project decisions. Design Management coordinates owner and user requirements with the design team. Contract Management develops and negotiates agreements on the client’s behalf to define the work and expectations.',
    invitation: 'Let’s discuss your treatment-center project.'
  } },
  { slug: 'behavioral-health', name: 'Acute Psychiatric Hospital Buildings', kind: 'market', image: behavioral, detail: {
    heading: ['Dignity and privacy.', 'Supportive surroundings.'],
    intro: 'Acute psychiatric hospital projects call for thoughtful attention to personal dignity, privacy and the environments in which care teams work.',
    introductionHeading: 'Begin with the experience of care.',
    introductionCopy: 'Care-team input helps the project team understand daily routines, personal spaces and shared areas. These considerations belong in the brief and in the decisions that follow.',
    introductionImage: { src: '/images/projects/client/aliso-ridge-behavioral-hospital-gallery-1.webp', alt: 'Welcoming entrance to Aliso Ridge Behavioral Hospital', width: 681, height: 457, caption: 'Aliso Ridge Behavioral Hospital · arrival' },
    prioritiesHeading: 'Dignity. Privacy. Team coordination.',
    priorities: [{ title: 'Dignity in the setting', copy: 'Consider arrivals, transitions and the character of the spaces people use each day.' }, { title: 'Privacy and support', copy: 'Discuss personal space and shared environments with the people responsible for care.' }, { title: 'Care-team coordination', copy: 'Bring staff workflows and operational needs into design reviews and delivery decisions.' }],
    relatedMarkets: [], projectSlugs: [], services: ['design-management', 'construction-management'],
    serviceCopy: 'Design Management connects owner and care-team input with design development, milestones and cost. Construction Management provides owner-side oversight of scope, quality, schedule and cost as the project moves into delivery.',
    invitation: 'Let’s discuss your psychiatric care environment.'
  } }
];
