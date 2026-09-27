import { CompanyInformation, ProjectPhase, ServiceDetail, TeamMember } from '../models/content.models';

// Field-level evidence and publication decisions: docs/client-content/content-source-register.md.
// Curated local content uses the same contracts as the CMS collections.
export const COMPANY: Readonly<CompanyInformation> = {
  name: 'The Howell Group',
  tagline: 'We Deliver Your Mission',
  positioning: 'Owner representation and coordinated healthcare project delivery, from planning through operational readiness.',
  market: 'Focused on healthcare in Southern California, with flexibility to support clients elsewhere.',
  address: '1847 Providence Way, Corona, CA 92878',
  email: 'info@thehowellgroup.co', phone: '949-610-5111', phoneHref: 'tel:+19496105111'
};

export const SERVICES: readonly ServiceDetail[] = [
  { id: 'program-management', slug: 'program-management', title: 'Program Management', description: "Coordinating related projects around the owner's purpose, with oversight of the whole program.",
    heading: "Keep the whole program in view.",
    introduction: "We coordinate related projects around your mission, connecting campus-wide priorities, delivery strategy and the decisions that shape each project.",
    coverage: [
      {
        title: "Program priorities",
        body: "Align related projects with the owner’s purpose and consider how individual decisions affect the overall program."
      },
      {
        title: "Delivery strategy",
        body: "Consider the delivery method, procurement approach and team structure in the context of the owner’s organization."
      },
      {
        title: "Campus-wide planning",
        body: "Coordinate planning across a building or campus, bringing project-level activity into the wider program discussion."
      }
    ],
    ownerSupport: "Program oversight gives owners a view beyond any single project. We help teams understand shared priorities and bring the right information to the people responsible for decisions.",
    lifecycleSummary: "Start with the program’s purpose and delivery strategy, then keep individual projects connected as they move toward operation.",
    phaseNotes: [
      {
        number: "01",
        body: "Establish program priorities, scope and constraints."
      },
      {
        number: "02",
        body: "Align responsibilities, delivery methods and decision-making."
      },
      {
        number: "03",
        body: "Keep design activity connected to the wider program."
      },
      {
        number: "06",
        body: "Coordinate project-level activity against program priorities."
      },
      {
        number: "08",
        body: "Keep operational readiness in view across the program."
      }
    ],
    relatedServices: [
      "design-management",
      "construction-management",
      "financial-management"
    ],
    teamExperience: [
      {
        projectSlug: "los-angeles-downtown-medical-center",
        attribution: "Marc Howell’s professional experience includes planning and program management for the Los Angeles Downtown Medical Center campus program."
      }
    ],
    invitation: {
      heading: "Bring your program into focus.",
      body: "Tell us about your campus, related projects and the priorities you need to coordinate."
    }
  },
  { id: 'design-management', slug: 'design-management', title: 'Design Management', description: 'Guiding the design team around client needs, project duration, milestones and cost.',
    heading: "Connect design decisions to owner needs.",
    introduction: "We coordinate design development around the people who will use the facility, keeping milestones, schedule and cost connected to the owner’s needs.",
    coverage: [
      {
        title: "Design-team coordination",
        body: "Develop a coordinated team with shared project goals and clear communication from discovery through execution."
      },
      {
        title: "Owner and user needs",
        body: "Bring stakeholder and user perspectives into the design conversation, with a focus on human-centered solutions."
      },
      {
        title: "Milestones, time and cost",
        body: "Manage design development with attention to project duration, milestones and cost as decisions take shape."
      }
    ],
    ownerSupport: "We help the owner and design team maintain a common understanding of the brief. Coordinated input and clear decisions keep design development connected to project priorities.",
    lifecycleSummary: "Design management begins with the brief and team, carries through design development and supports coordination as the project moves into review and preconstruction.",
    phaseNotes: [
      {
        number: "01",
        body: "Understand the owner’s needs and project constraints."
      },
      {
        number: "02",
        body: "Establish the design team and stakeholder involvement."
      },
      {
        number: "03",
        body: "Coordinate design development, milestones and cost alignment."
      },
      {
        number: "04",
        body: "Keep design-team communication connected through agency review."
      },
      {
        number: "05",
        body: "Support design coordination as estimates and schedules develop."
      }
    ],
    relatedServices: [
      "program-management",
      "contract-management",
      "construction-management"
    ],
    invitation: {
      heading: "Give your design team clear direction.",
      body: "Tell us about the facility, its users and the design decisions ahead."
    }
  },
  { id: 'construction-management', slug: 'construction-management', title: 'Construction Management', description: "Representing the owner's interests through oversight of scope, quality, schedule, cost, safety and function.",
    heading: "Owner interests. Through every construction decision.",
    introduction: "We provide construction oversight on the owner’s behalf, bringing scope, quality, schedule, cost, safety and function into the same conversation.",
    coverage: [
      {
        title: "Scope and quality",
        body: "Keep construction activity focused on the agreed scope, project requirements and the facility’s intended function."
      },
      {
        title: "Schedule and cost",
        body: "Coordinate communication around construction progress, schedule and cost so the owner can make informed decisions."
      },
      {
        title: "Safety and readiness",
        body: "Maintain attention to safety and quality during construction, with close out and operational readiness considered from the beginning."
      }
    ],
    ownerSupport: "We represent the owner’s interests and coordinate with the designers, contractors and other team members responsible for delivery. Our role is oversight and management of construction.",
    lifecycleSummary: "Earlier involvement supports coordination before work begins. During construction and close out, the focus stays on the facility’s intended use and readiness for operation.",
    phaseNotes: [
      {
        number: "05",
        body: "Coordinate scope, estimates, schedules and preparation for construction."
      },
      {
        number: "06",
        body: "Oversee scope, quality, schedule, cost, safety and function."
      },
      {
        number: "07",
        body: "Coordinate close out with attention to the end from the beginning."
      },
      {
        number: "08",
        body: "Support the transition to operational training and licensing."
      }
    ],
    relatedServices: [
      "design-management",
      "contract-management",
      "program-management"
    ],
    teamExperience: [
      {
        projectSlug: "kpc-global-oc",
        attribution: "Marc Howell’s professional experience includes onsite construction management for operating-room and central-plant projects at Global Orange County Medical Center."
      }
    ],
    invitation: {
      heading: "Keep construction aligned with your mission.",
      body: "Tell us where the project stands and where owner-side oversight could help."
    }
  },
  { id: 'contract-management', slug: 'contract-management', title: 'Contract Management', description: 'Developing and negotiating agreements on the client’s behalf to support the project’s delivery.',
    heading: "Agreements shaped around project delivery.",
    introduction: "We develop and negotiate project agreements on the client’s behalf, connecting the agreement with the chosen delivery approach and the team’s responsibilities.",
    coverage: [
      {
        title: "Project agreements",
        body: "Develop agreements around the project’s needs and the owner’s delivery strategy."
      },
      {
        title: "Negotiation on your behalf",
        body: "Negotiate terms with project participants to determine an effective agreement for the client."
      },
      {
        title: "Team alignment",
        body: "Keep roles, expectations and the selected delivery approach connected as agreements are developed."
      }
    ],
    ownerSupport: "Clear agreements help owners and project participants understand what they are working toward. Howell contributes project-delivery knowledge and coordination to the agreement process.",
    lifecycleSummary: "Design agreements take shape alongside team development, with construction agreements established ahead of detailed preparation for the work.",
    phaseNotes: [
      {
        number: "02",
        body: "Negotiate terms and finalize formal design agreements."
      },
      {
        number: "05",
        body: "Negotiate terms and finalize construction agreements before delivery."
      }
    ],
    relatedServices: [
      "program-management",
      "design-management",
      "construction-management"
    ],
    invitation: {
      heading: "Align the agreement with the work ahead.",
      body: "Tell us about your delivery approach, project team and agreements to be developed."
    }
  },
  { id: 'financial-management', slug: 'financial-management', title: 'Financial Management', description: 'Financial solutions through a capital financial advisor partnership, including investment, refinancing and alternative financing.',
    heading: "Financial options for the mission ahead.",
    introduction: "Through a capital financial advisor partnership, we help clients explore financial solutions in the context of their capital plans and project priorities.",
    coverage: [
      {
        title: "Investment and debt",
        body: "Direct investment, private equity, private debt and collateralized funding."
      },
      {
        title: "Capital restructuring",
        body: "Recapitalization and refinancing to address changing capital needs."
      },
      {
        title: "Strategic transactions",
        body: "Mergers and acquisitions, divestitures, strategic alliances and management buyouts."
      },
      {
        title: "Grants and alternative financing",
        body: "Grants, equipment leasing and energy-as-a-service are among the solutions available through the advisor partnership."
      }
    ],
    ownerSupport: "The advisor partnership brings financial options into the discussion alongside the owner’s capital needs. The appropriate path depends on the client’s circumstances and the advisor’s evaluation.",
    lifecycleSummary: "Financial discussions can begin with the business case during Project Development and be revisited as scope, cost and timing evolve. The engagement is shaped around the capital need, rather than a fixed construction phase.",
    phaseNotes: [
      {
        number: "01",
        body: "Consider financial options alongside the business case and capital priorities."
      },
      {
        number: "05",
        body: "Revisit capital needs as estimates and the delivery schedule develop."
      }
    ],
    relatedServices: [
      "program-management",
      "contract-management"
    ],
    invitation: {
      heading: "Discuss the capital needs behind your project.",
      body: "Tell us about your capital priorities and the financial questions you would like to explore through our advisor partnership."
    }
  }
];

export const TEAM: readonly TeamMember[] = [
  { id: 'marc-howell', name: 'Marc Howell', role: 'Partner', bio: 'Experience in planning, design, construction and owner representation across healthcare projects.', image: { src: '/images/people/marc-howell.webp', alt: 'Marc Howell', width: 596, height: 397 } },
  { id: 'eric-laurin', name: 'Eric Laurin', role: 'Partner', bio: 'Owner-side project experience with a focus on healthcare, teamwork and project financial tracking.', image: { src: '/images/people/eric-laurin.webp', alt: 'Eric Laurin', width: 595, height: 396 } },
  { id: 'brett-smith', name: 'Brett Smith', bio: 'Construction project oversight across medical, commercial and multifamily environments, from preconstruction through completion.', image: { src: '/images/people/brett-smith.webp', alt: 'Brett Smith', width: 482, height: 482 } }
];

export const PROJECT_PHASES: readonly ProjectPhase[] = [
  'Project Development', 'Team Development', 'Design', 'Agency Review',
  'Preconstruction', 'Construction', 'Close Out', 'Operation / Patient Ready'
].map((title, index) => ({ number: String(index + 1).padStart(2, '0'), title }));
