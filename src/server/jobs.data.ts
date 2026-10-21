import { Job } from '../app/core/models/careers.models';

/**
 * Live job openings, bundled with the server so they are always available
 * no matter what the hosting deploys (some hosts only deploy dist/).
 * Source of truth: data/jobs.json at the repo root — edit that file, then
 * regenerate this one (or ask Muse). Do not edit both by hand.
 */
export const LIVE_JOBS: Job[] = [
  {
    "id": "THG-101",
    "slug": "senior-project-manager",
    "title": "Senior Project Manager",
    "department": "Project delivery",
    "location": "Southern California",
    "workplace": "On-site",
    "employmentType": "Full-time",
    "summary": "Bring clarity to complex projects. Guide the team from early planning through handover, connecting the owner’s priorities with the decisions that move a project forward.",
    "responsibilities": [
      "Lead project planning, budgets, schedules and reporting from preconstruction through closeout.",
      "Build productive relationships with owners, designers, consultants and construction partners.",
      "Identify risks early and turn complex decisions into clear, actionable recommendations.",
      "Coordinate quality, safety and delivery expectations across the project team."
    ],
    "qualifications": [
      "Experience managing commercial construction projects through multiple phases.",
      "Strong command of budgeting, scheduling, contract administration and project controls.",
      "Clear communication and a collaborative approach to resolving challenges.",
      "A degree in construction management, engineering or related experience."
    ]
  }
];
