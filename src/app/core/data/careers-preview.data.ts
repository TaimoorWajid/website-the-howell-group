import { Job } from '../models/careers.models';

// Illustrative roles only. Live vacancies are supplied through CAREERS_JOBS_FILE.
export const PREVIEW_JOBS: Job[] = [
  {
    id: 'THG-101',
    slug: 'senior-project-manager',
    title: 'Senior Project Manager',
    department: 'Project delivery',
    location: 'Southern California',
    workplace: 'On-site',
    employmentType: 'Full-time',
    summary:
      'Bring clarity to complex projects. Guide the team from early planning through handover, connecting the owner’s priorities with the decisions that move a project forward.',
    responsibilities: [
      'Lead project planning, budgets, schedules and reporting from preconstruction through closeout.',
      'Build productive relationships with owners, designers, consultants and construction partners.',
      'Identify risks early and turn complex decisions into clear, actionable recommendations.',
      'Coordinate quality, safety and delivery expectations across the project team.',
    ],
    qualifications: [
      'Experience managing commercial construction projects through multiple phases.',
      'Strong command of budgeting, scheduling, contract administration and project controls.',
      'Clear communication and a collaborative approach to resolving challenges.',
      'A degree in construction management, engineering or related experience.',
    ],
  },
  {
    id: 'THG-102',
    slug: 'project-engineer',
    title: 'Project Engineer',
    department: 'Project delivery',
    location: 'Southern California',
    workplace: 'On-site',
    employmentType: 'Full-time',
    summary:
      'Turn careful coordination into real progress. Support the details, documentation and relationships that help a project team deliver with confidence.',
    responsibilities: [
      'Coordinate submittals, RFIs, drawings and project documentation.',
      'Support schedule updates, cost tracking and procurement activities.',
      'Work with field teams to track issues and follow through on resolutions.',
      'Prepare clear progress reports and help maintain an organized project record.',
    ],
    qualifications: [
      'An interest in construction delivery and a careful eye for detail.',
      'Experience reading construction drawings and working with project documentation.',
      'Strong organization, communication and problem-solving skills.',
      'A relevant degree or equivalent practical experience.',
    ],
  },
  {
    id: 'THG-103',
    slug: 'preconstruction-manager',
    title: 'Preconstruction Manager',
    department: 'Preconstruction',
    location: 'Southern California',
    workplace: 'Hybrid',
    employmentType: 'Full-time',
    summary:
      'Help good ideas become buildable plans. Connect design, cost and constructability so owners can make informed decisions from the very beginning.',
    responsibilities: [
      'Develop conceptual estimates and detailed cost plans as designs evolve.',
      'Evaluate constructability, sequencing, procurement and value alternatives.',
      'Coordinate pricing with trade partners and reconcile scope assumptions.',
      'Present cost and risk information in a clear, useful way for the owner.',
    ],
    qualifications: [
      'Experience in estimating or preconstruction for commercial projects.',
      'Ability to interpret plans, quantify scope and explain cost drivers.',
      'A thoughtful, collaborative approach to design and trade coordination.',
      'Proficiency with estimating tools and spreadsheet-based analysis.',
    ],
  },
  {
    id: 'THG-104',
    slug: 'project-coordinator',
    title: 'Project Coordinator',
    department: 'Business operations',
    location: 'Southern California',
    workplace: 'Hybrid',
    employmentType: 'Full-time',
    summary:
      'Keep people, information and priorities connected. Bring structure and follow-through to the day-to-day work behind successful projects.',
    responsibilities: [
      'Coordinate meetings, action items and project communications.',
      'Maintain accurate records, project files and document workflows.',
      'Support procurement, invoicing and team reporting.',
      'Help teams anticipate deadlines and keep commitments visible.',
    ],
    qualifications: [
      'Strong administrative and organizational skills.',
      'Confidence using spreadsheets and collaborative office tools.',
      'Clear written communication and attentive follow-through.',
      'Experience in a project-based environment or related transferable skills.',
    ],
  },
];
