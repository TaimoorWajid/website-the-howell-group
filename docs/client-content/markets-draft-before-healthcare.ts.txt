export type MarketSlug = 'commercial' | 'residential' | 'railways' | 'education' | 'healthcare' | 'hospitals' | 'behavioral-health' | 'tenant-improvement' | 'advanced-technologies';
export type MarketServiceId = 'program-management' | 'design-management' | 'construction-management' | 'partnership-consulting';
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
  services: readonly MarketServiceId[];
  invitation: string;
}

export interface MarketImage { src: string; alt: string; width: number; height: number; }
export interface Market {
  slug: MarketSlug;
  name: string;
  kind: 'market' | 'overview' | 'cross-sector';
  parentSlug?: MarketSlug;
  image: MarketImage;
  detail: MarketDetail;
}

// Shared by the overview, navigation and the reusable market detail template.
// These are user-approved destinations, not claims of completed market experience.
const MARKET_BASE: readonly Omit<Market, 'detail'>[] = [
  { slug: 'commercial', name: 'Commercial', kind: 'market', image: { src: '/images/projects/project-04.jpg', alt: 'Daylit workplace interior with desks and meeting spaces', width: 1600, height: 1068 } },
  { slug: 'residential', name: 'Residential', kind: 'market', image: { src: '/images/projects/project-05.jpg', alt: 'House surrounded by a planted residential landscape', width: 1600, height: 1067 } },
  { slug: 'railways', name: 'Railways', kind: 'market', image: { src: '/images/markets/railways.webp', alt: 'Freight train moving along railway tracks', width: 1400, height: 825 } },
  { slug: 'education', name: 'Education', kind: 'market', image: { src: '/images/projects/client/western-university-medical-school.webp', alt: 'University building with a glass facade and exterior staircase', width: 1200, height: 800 } },
  { slug: 'healthcare', name: 'Healthcare', kind: 'overview', image: { src: '/images/projects/client/anaheim-community-hospital-gallery-3.webp', alt: 'Medical imaging equipment in an examination room', width: 681, height: 455 } },
  { slug: 'hospitals', name: 'Hospitals', kind: 'market', parentSlug: 'healthcare', image: { src: '/images/projects/client/anaheim-community-hospital.webp', alt: 'Hospital entrance with a covered driveway and white columns', width: 644, height: 430 } },
  { slug: 'behavioral-health', name: 'Behavioral Health', kind: 'market', parentSlug: 'healthcare', image: { src: '/images/projects/client/aliso-ridge-behavioral-hospital-gallery-2.webp', alt: 'Daylit behavioral-health common area with tables and seating', width: 681, height: 383 } },
  { slug: 'tenant-improvement', name: 'Tenant Improvement', kind: 'cross-sector', image: { src: '/images/projects/client/los-angeles-downtown-medical-center-gallery-2.webp', alt: 'Interior renovation with exposed ceilings and building services', width: 1513, height: 1135 } },
  { slug: 'advanced-technologies', name: 'Advanced Technologies', kind: 'market', image: { src: '/images/markets/advanced-technologies.webp', alt: 'Server racks and network cabling in a data center', width: 1400, height: 786 } }
];


// Editorial copy describes planning considerations, not company credentials or outcomes.
const MARKET_DETAILS: Record<MarketSlug, MarketDetail> = {
  commercial: {
    heading: ['Spaces that work.', 'Room to adapt.'],
    intro: 'Commercial spaces bring occupant needs, day-to-day operations and future change together.',
    introductionHeading: 'A place for the working day.',
    introductionCopy: 'Arrivals, shared amenities and the spaces behind the scenes all shape how a building supports its occupants. Planning begins with how the place will be used.',
    introductionImage: { src: '/images/projects/project-01.jpg', alt: 'Contemporary building exterior used as an architectural study', width: 1600, height: 1067 },
    prioritiesHeading: 'The working day. The longer view.',
    priorities: [{ title: 'Occupants and arrival', copy: 'Consider access, shared spaces and the rhythms of a working day.' }, { title: 'Operational needs', copy: 'Bring building services, maintenance and day-to-day use into the conversation.' }, { title: 'Adaptability', copy: 'Allow for changing teams, tenants and patterns of use.' }],
    relatedMarkets: ['tenant-improvement'], projectSlugs: [], services: ['program-management', 'design-management', 'construction-management', 'partnership-consulting'], invitation: 'Let’s talk about your commercial project.'
  },
  residential: {
    heading: ['Places to live.', 'Considered for everyday life.'],
    intro: 'Residential environments connect the privacy of home with shared spaces and the routines of daily living.',
    introductionHeading: 'The everyday details matter.',
    introductionCopy: 'From the front door to outdoor spaces, each transition affects how a home is experienced. Consider individual needs alongside the places residents share.',
    introductionImage: { src: '/images/projects/project-05.jpg', alt: 'A house and its surrounding residential planting', width: 1600, height: 1067 },
    prioritiesHeading: 'Daily life. Shared space. Lasting use.',
    priorities: [{ title: 'Daily living', copy: 'Think through arrival, privacy, storage and the movement between rooms.' }, { title: 'Shared spaces', copy: 'Consider how common areas connect residents without overlooking individual needs.' }, { title: 'Long-term use', copy: 'Bring maintenance, changing households and future use into early decisions.' }],
    relatedMarkets: [], projectSlugs: [], services: ['design-management', 'construction-management', 'partnership-consulting'], invitation: 'Let’s talk about your residential project.'
  },
  railways: {
    heading: ['Connected routes.', 'Coordinated decisions.'],
    intro: 'Railway projects bring physical interfaces, access needs and delivery sequencing into close alignment.',
    introductionHeading: 'Every interface needs a clear plan.',
    introductionCopy: 'The relationship between tracks, facilities and surrounding activity shapes the work. Understanding access and dependencies helps frame the decisions ahead.',
    introductionImage: { src: '/images/markets/railways.webp', alt: 'A freight train approaching along railway tracks', width: 1400, height: 825 },
    prioritiesHeading: 'Interfaces. Access. Sequence.',
    priorities: [{ title: 'Connected interfaces', copy: 'Identify where systems, structures and responsibilities meet.' }, { title: 'Access and activity', copy: 'Consider the routes, work areas and access arrangements the project will need.' }, { title: 'Delivery sequencing', copy: 'Understand dependencies and the order in which work can move forward.' }],
    relatedMarkets: [], projectSlugs: [], services: ['program-management', 'construction-management', 'partnership-consulting'], invitation: 'Let’s talk about your railway project.'
  },
  education: {
    heading: ['Space to learn.', 'Room for what comes next.'],
    intro: 'Learning environments connect teaching, campus life and the ways students move through their day.',
    introductionHeading: 'Learning extends beyond the classroom.',
    introductionCopy: 'Quiet study, collaborative work and movement between spaces all belong in the brief. Each setting asks how a campus can respond to evolving learning needs.',
    introductionImage: { src: '/images/projects/client/western-university-medical-school-gallery-3.webp', alt: 'A hospital simulation training room at a university', width: 854, height: 1139 },
    prioritiesHeading: 'Learning today. Possibility tomorrow.',
    priorities: [{ title: 'Learning and teaching', copy: 'Consider the activities, tools and different ways people learn.' }, { title: 'Campus movement', copy: 'Connect arrivals, shared spaces and the transitions between destinations.' }, { title: 'Evolving needs', copy: 'Look ahead to changes in programs, teaching methods and space requirements.' }],
    relatedMarkets: ['tenant-improvement'], projectSlugs: ['western-university-medical-school'], services: ['program-management', 'design-management', 'construction-management', 'partnership-consulting'], invitation: 'Let’s talk about your education project.'
  },
  healthcare: {
    heading: ['Places for care.', 'Planned around people.'],
    intro: 'Care environments bring people, operations and purpose into close focus.',
    introductionHeading: 'The environment is part of the experience.',
    introductionCopy: 'From the first arrival to the spaces behind the scenes, every decision shapes how a care setting works.',
    introductionImage: { src: '/images/projects/client/anaheim-community-hospital-gallery-1.webp', alt: 'Reception and waiting area in a care environment', width: 682, height: 455 },
    prioritiesHeading: 'Three lenses. One connected place.',
    priorities: [{ title: 'People and arrival', copy: 'Clear routes. Welcoming spaces. Thoughtful transitions.' }, { title: 'Teams and operations', copy: 'Space for the work that supports care.' }, { title: 'Change over time', copy: 'Consider how needs and spaces may evolve.' }],
    relatedMarkets: ['hospitals', 'behavioral-health'], projectSlugs: ['anaheim-community-hospital', 'aliso-ridge-behavioral-hospital'], services: ['program-management', 'design-management', 'construction-management', 'partnership-consulting'], invitation: 'Let’s talk about your healthcare project.'
  },
  hospitals: {
    heading: ['Care in motion.', 'Planning the connections.'],
    intro: 'Hospital environments bring clinical relationships, ongoing operations and project phasing into the same conversation.',
    introductionHeading: 'The spaces between matter, too.',
    introductionCopy: 'Patient routes, staff movement and support spaces connect the clinical setting. Understanding these relationships helps define a project’s priorities and sequence.',
    introductionImage: { src: '/images/projects/client/kpc-global-oc-gallery-3.webp', alt: 'Entrance to an operating room in a hospital', width: 1116, height: 2296 },
    prioritiesHeading: 'Connected care. Considered change.',
    priorities: [{ title: 'Clinical adjacencies', copy: 'Consider how clinical, support and circulation spaces relate to one another.' }, { title: 'Operational continuity', copy: 'Understand the activities and services that surround the work.' }, { title: 'Phased work', copy: 'Bring access, transitions and sequencing into the plan from the outset.' }],
    relatedMarkets: ['healthcare'], projectSlugs: ['anaheim-community-hospital', 'kpc-global-oc'], services: ['program-management', 'design-management', 'construction-management', 'partnership-consulting'], invitation: 'Let’s talk about your hospital project.'
  },
  'behavioral-health': {
    heading: ['Dignity in the details.', 'People at the center.'],
    intro: 'Behavioral health environments call for thoughtful attention to privacy, daily routines and supportive surroundings.',
    introductionHeading: 'Consider the experience of being here.',
    introductionCopy: 'Arrivals, personal spaces and places to gather contribute to the setting. Planning asks how different needs can be acknowledged throughout the environment.',
    introductionImage: { src: '/images/projects/client/aliso-ridge-behavioral-hospital-gallery-1.webp', alt: 'Entrance to a behavioral health hospital', width: 681, height: 455 },
    prioritiesHeading: 'Dignity. Privacy. Support.',
    priorities: [{ title: 'Dignity and arrival', copy: 'Consider how people are welcomed and how transitions are experienced.' }, { title: 'Privacy and connection', copy: 'Think through personal space alongside opportunities for appropriate connection.' }, { title: 'Supportive surroundings', copy: 'Bring daily routines, staff needs and the character of shared spaces into focus.' }],
    relatedMarkets: ['healthcare'], projectSlugs: ['aliso-ridge-behavioral-hospital', 'anaheim-community-hospital'], services: ['program-management', 'design-management', 'construction-management', 'partnership-consulting'], invitation: 'Let’s talk about your behavioral health project.'
  },
  'tenant-improvement': {
    heading: ['Existing spaces.', 'New ways to use them.'],
    intro: 'Tenant improvement connects existing conditions with occupant needs and coordinated change across sectors.',
    introductionHeading: 'Start with what is already there.',
    introductionCopy: 'The structure, services and surrounding activity form the starting point. A clear understanding of existing space helps frame what needs to change.',
    introductionImage: { src: '/images/projects/project-04.jpg', alt: 'Workplace interior illustrating potential use of an occupied space', width: 1600, height: 1068 },
    prioritiesHeading: 'Understand. Adapt. Coordinate.',
    priorities: [{ title: 'Existing conditions', copy: 'Bring the building’s physical conditions and available information into view.' }, { title: 'Occupant needs', copy: 'Clarify the activities, adjacencies and everyday requirements of the people using the space.' }, { title: 'Coordinated change', copy: 'Consider design decisions, building services and the sequence of work together.' }],
    relatedMarkets: ['commercial', 'education'], projectSlugs: [], services: ['design-management', 'construction-management', 'partnership-consulting'], invitation: 'Let’s talk about your tenant improvement project.'
  },
  'advanced-technologies': {
    heading: ['Technical spaces.', 'Connected thinking.'],
    intro: 'Technology-focused environments bring equipment requirements, infrastructure and future adaptability into the project brief.',
    introductionHeading: 'Define the needs behind the systems.',
    introductionCopy: 'Technical requirements influence space, services and coordination. Understanding those dependencies helps keep the wider project purpose in view.',
    introductionImage: { src: '/images/markets/advanced-technologies.webp', alt: 'Network connections and equipment within server racks', width: 1400, height: 786 },
    prioritiesHeading: 'Requirements. Infrastructure. Adaptability.',
    priorities: [{ title: 'Technical requirements', copy: 'Clarify equipment, environmental and operational needs before decisions become fixed.' }, { title: 'Infrastructure coordination', copy: 'Connect space planning with the services and systems that support it.' }, { title: 'Future adaptability', copy: 'Consider how equipment, capacity and patterns of use may change.' }],
    relatedMarkets: ['tenant-improvement'], projectSlugs: [], services: ['program-management', 'design-management', 'construction-management', 'partnership-consulting'], invitation: 'Let’s talk about your advanced technologies project.'
  }
};

export const MARKETS: readonly Market[] = MARKET_BASE.map(market => ({ ...market, detail: MARKET_DETAILS[market.slug] }));
