import { SERVICES } from '../../core/data/company.data';
export interface ServiceChapter {
  id: string;
  number: string;
  name: string;
  title: string;
  body: string;
  link: string;
  route: string;
  image: string;
}
// Presentation adapters for the shared, source-backed service records.
const SERVICE_TITLES = [
  'Start with the whole picture.',
  'Keep the vision connected.',
  'Turn decisions into delivery.',
  'Align the agreement with the mission.',
  'Connect the project with financial solutions.',
];
const SERVICE_IMAGES = [
  'program-management',
  'design-management',
  'construction-management',
  'contract-management',
  'financial-management',
].map((name) => `/images/services/${name}.webp`);
export const SERVICE_CHAPTERS: readonly ServiceChapter[] = SERVICES.map(
  (service, index) => ({
    id: service.slug,
    number: String(index + 1).padStart(2, '0'),
    name: service.title,
    title: SERVICE_TITLES[index],
    body: service.description ?? '',
    link: 'Explore ' + service.title.toLowerCase(),
    route: '/services/' + service.slug,
    image: SERVICE_IMAGES[index],
  }),
);
export const SERVICE_CAPABILITIES = SERVICE_CHAPTERS.map((chapter) => ({
  number: chapter.number,
  title: chapter.name,
  body: chapter.body,
  image: chapter.image,
  route: chapter.route,
}));
export const ENGAGEMENT_STAGES = [
  {
    number: '01',
    title: 'Defining the project',
    body: "Let's clarify the mission, priorities and path ahead.",
  },
  {
    number: '02',
    title: 'Moving into delivery',
    body: "Let's align the team around the next stage.",
  },
  {
    number: '03',
    title: 'Facing a critical decision',
    body: "Let's bring perspective to the question in front of you.",
  },
] as const;
