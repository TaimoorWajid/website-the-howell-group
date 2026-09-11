export interface ServiceChapter { id: string; number: string; name: string; title: string; body: string; link: string; image: string; }
// The generic detail route still renders FoundationPageComponent. Do not invent published slugs.
export const SERVICE_CHAPTERS: readonly ServiceChapter[] = [
  { id: 'program-management', number: '01', name: 'Program Management', title: 'Start with the whole picture.', body: "Align scope, stakeholders and priorities around the owner's mission.", link: 'Discuss program management', image: '/images/projects/project-01.jpg' },
  { id: 'design-management', number: '02', name: 'Design Management', title: 'Keep the vision connected.', body: 'Bring design decisions, performance and budget into the same conversation.', link: 'Discuss design management', image: '/images/projects/project-02.jpg' },
  { id: 'construction-management', number: '03', name: 'Construction Management', title: 'Turn decisions into delivery.', body: 'Coordinate quality, cost, schedule and communication through construction.', link: 'Discuss construction management', image: '/images/why-howell/concrete-interior.webp' },
  { id: 'partnership-consulting', number: '04', name: 'Partnership & Consulting', title: 'Perspective when it matters.', body: 'Bring experienced counsel to complex questions and critical project decisions.', link: 'Discuss partnership & consulting', image: '/images/projects/project-04.jpg' }
];
export const SERVICE_CAPABILITIES = [
  { number: '01', title: 'Scope & priorities', body: 'Keep the brief connected to the mission.', image: '/images/why-howell/concrete-interior.webp' },
  { number: '02', title: 'Cost & schedule', body: 'See the trade-offs before decisions are made.', image: '/images/projects/project-02.jpg' },
  { number: '03', title: 'Quality & coordination', body: 'Bring the right people into the conversation.', image: '/images/projects/project-01.jpg' },
  { number: '04', title: 'Risk & decisions', body: 'Surface uncertainty. Clarify the next step.', image: '/images/projects/project-03.jpg' }
] as const;
export const ENGAGEMENT_STAGES = [
  { number: '01', title: 'Defining the project', body: "Let's clarify the mission, priorities and path ahead." },
  { number: '02', title: 'Moving into delivery', body: "Let's align the team around the next stage." },
  { number: '03', title: 'Facing a critical decision', body: "Let's bring perspective to the question in front of you." }
] as const;
