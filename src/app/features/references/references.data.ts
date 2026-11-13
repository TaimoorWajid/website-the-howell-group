// Reference letters provided by the client (The Howell Group).
// Letter text is transcribed verbatim from the supplied PDFs — original
// spelling and punctuation are kept, including in quoted wording.

export interface ReferenceSignatory {
  name: string;
  role: string;
}

export interface ReferenceLetter {
  id: string;
  /** Original letter image (from the client-supplied PDFs), shown on the page. */
  image: string;
  imageWidth: number;
  imageHeight: number;
  paragraphs: readonly string[];
  signatories: readonly ReferenceSignatory[];
  company: string;
  project?: string;
  date?: string;
  subject?: string;
}

/**
 * Paired rows for the page layout: two short letters stacked on one side,
 * one long letter on the other, so no empty space is left between cards.
 * The pairing is balanced by the letters' image heights.
 */
export interface ReferenceRow {
  stack: readonly ReferenceLetter[];
  feature: ReferenceLetter;
}

export const REFERENCES: readonly ReferenceLetter[] = [
  {
    id: 'ladmc',
    image: '/images/references/ladmc.webp',
    imageWidth: 1669,
    imageHeight: 863,
    paragraphs: [
      "Working with The Howell Group on a series of projects has been a valuable partnership. Their team is knowledgeable about regulatory requirements, which is especially important for a project of this complexity. They are dependable, responsive, and take accountability for their work. We appreciate their open communication, practical approach to resolving challenges, and focus on managing project costs while keeping the project on track and within budget. THG has earned our trust, and we would gladly recommend them to others.",
    ],
    signatories: [
      { name: 'Bill Nelson', role: 'Chief Executive Officer' },
      { name: 'Vicki Rollins', role: 'Chief Operating Officer' },
    ],
    company: 'L.A. Downtown Medical Center',
    project: 'Los Angeles Downtown Medical Center',
  },
  {
    id: 'nelsonhps',
    image: '/images/references/nelsonhps.webp',
    imageWidth: 1614,
    imageHeight: 2038,
    paragraphs: [
      'To whom it may concern,',
      "The Howell Group (THG) has proven themselves to be a fair, Client focused Trusted Advisor. When we decide on whom to hire as our Project Managers, the market is full of firms claiming they know our Marketplace and understand our needs as an Owner. THG has proven these aren't claims, they're truths. We utilized THG on multiple, very challenging and technical projects, they performed as promised and exceeded our expectations. As an Owner we seek consistent reproduceable outcomes, THG has delivered these to us. Their industry knowledge and their understanding of the need for transparency gives us the desired information to make educated decisions. I recommend THG and will seek their professional support for additional projects.",
    ],
    signatories: [{ name: 'Bruce A. Nelson', role: 'President' }],
    company: 'NelsonHPS Program Managers',
  },
  {
    id: 'miles-kelley',
    image: '/images/references/miles-kelley.webp',
    imageWidth: 1819,
    imageHeight: 1595,
    paragraphs: [
      'Having worked with The Howell Group for three years on the Anaheim Hospital OC program, I have come to know your team well. Miles & Kelley appreciates your efforts in furthering the completion of this project. The Howell Group was steadfast in their dedication to the project and to the goals of Ownership. This was a complicated renovation project of a 50-year-old building with many unforeseeable non-conforming conditions, structural challenges and surveys, inspections, and field reviews by HCAi (formerly OSHPD). The Howell Group deftly and successfully navigated all these conditions.',
      "Marc Howell's knowledge of building codes and his deft research on code issues facilitated a number of issues during construction. This certainly saved appreciable time and effort.",
      "The Howell Group's approach to problems and their diligence and integrity in managing the project finances made the difference. There were a few tense moments during the course of the project, but all potential conflicts were successfully and amiably resolved.",
      "Should you need me to speak to your firm's capabilities, please feel free to use me as a reference.",
    ],
    signatories: [{ name: 'Greg Miles', role: 'President' }],
    company: 'Miles & Kelley Construction Company, Inc.',
    project: 'Anaheim Hospital OC program',
  },
  {
    id: 'watch-hill',
    image: '/images/references/watch-hill.webp',
    imageWidth: 1673,
    imageHeight: 989,
    paragraphs: [
      "No better team to get your healthcare project completed on time, on budget, and navigate the sometimes choppy waters of construction. I've used the Howell Group on several different projects and can attest to their professionalism, diligence, and team nature focus.",
    ],
    signatories: [
      { name: 'David Lebowitz', role: 'Executive Vice President' },
    ],
    company: 'Watch Hill Capital (Santa Monica, CA)',
  },
  {
    id: 'independent-solutions',
    image: '/images/references/independent-solutions.webp',
    imageWidth: 1930,
    imageHeight: 1880,
    paragraphs: [
      'We wanted to take a moment to express the difference we believe Howell Group brings to complex healthcare construction projects.',
      'Over the past decade we have worked on many projects together. During that time, many challenges came up, and it impressive how your team jumps in and makes a real difference in getting the project over the finish line. Your team brings a whole new meaning to Boots on the Ground.',
      'While working with you at the Aliso Viejo Behavioral Health your leadership assisted to get the project completed in time for the targeted opening. You were personally onsite every day and played a major role in the successful opening. The most impressive experience I had with your group was at the Anaheim OC Hospital. Creativity, out of the box thinking coupled with the strong leadership that your team provided allowed the near impossible to take place.',
      "The most important item I want to express is that we see a true difference in the cost savings the owner experiences in our scope of work when the Howell Group is providing the Construction Management. Despite being a great steward of the owner's money, you always treat us consultants with respect and help us be successful.",
      'Thank you!',
    ],
    signatories: [{ name: 'Cindy Dickens', role: 'President' }],
    company: 'Independent Solutions',
    project: 'Aliso Viejo Behavioral Health / Anaheim OC Hospital',
  },
  {
    id: 'anaheim-community-hospital',
    image: '/images/references/anaheim-community-hospital.webp',
    imageWidth: 2312,
    imageHeight: 1207,
    paragraphs: [
      "Working with The Howell Group (THG) on a very challenging project, I have come to rely on them as a trusted partner. They exceeded my every expectation to deliver ‘what’ and ‘when’. Outcomes with complex projects that have multiple aspects occurring at the same time requires a disciplined approach if they are to be successful. THG was right on target and the projects were completed. Their ability to be completely transparent and provide me with the necessary information to make informed decisions was extremely valuable. I would use them again and can recommend them without hesitation. Thank you THG team!",
    ],
    signatories: [
      {
        name: 'Glenn Raup',
        role: 'RN, PhD, MBA, MSN, CENP, CEN — Chief Operating Officer / Chief Nursing Officer',
      },
    ],
    company: 'Anaheim Community Hospital',
  },
  {
    id: 'western-university',
    image: '/images/references/western-university.webp',
    imageWidth: 2649,
    imageHeight: 1446,
    paragraphs: [
      'I wanted to express my gratitude for the great work and exceptional customer support provided by your leadership on our University Simulation Lab project. There is unmistakable proof of expertise, due diligence and care provided to projects under your management that brings much efficiency and accountability to key deliverables. The leadership provided was extremely valuable in helping minimize or avoid time and cost escalations. Most notably was the assistance in providing TRUE customer support in helping look out for customer interests among the many push and pull demands of a project. You are without-a-doubt, proven top of class and quality Project Management. I thank you for the amazing efforts, skillset, professionalism, and results. Wishing you much continued success!',
      'Be well & stay safe',
    ],
    signatories: [
      {
        name: 'Steve Vega, B.S.',
        role: 'Construction Project Manager, Division of Institutional Shared Services, Capital Planning & Construction',
      },
    ],
    company: 'Western University of Health Sciences',
    project: 'University Simulation Lab',
  },
  {
    id: 'davishbc',
    image: '/images/references/davishbc.webp',
    imageWidth: 1621,
    imageHeight: 1987,
    paragraphs: [
      'To Whom it May Concern,',
      'We are writing this letter to wholeheartedly recommend the Howell Group for their exceptional project and construction management services. As the leadership of DavisHBC, we have had the privilege of working closely with the Howell Group and members thereof on various healthcare infrastructure projects, such as Hoag Hospital Irvine, Anaheim Community Hospital, and the construction of the ground-up facility Aliso Ridge Behavioral Health Hospital. We have seen how the Howell Group\u2019s commitment, professionalism, and expertise have consistently exceeded our expectations.',
      "At DavisHBC, we take the protection of our hospital clients and their projects very seriously. It is our specialty to work closely with project management and keep them informed and prepared for successful engagement with HCAi/OSHPD -- California\u2019s hospital and acute care building authority. We know firsthand that project management is a key component when estimating the success of all parties involved in the construction and remodel of acute care systems in California.",
      "It is clear to us after working with Marc Howell and Eric Laurin personally on projects of diverse sizes and scope that they have proficiency in managing acute care construction on all levels. It\u2019s always a pleasure to collaborate with Marc, as he has a dynamic ability to bring project stakeholders together and hold all parties accountable for their roles and deliverables. This is essential when it comes to an OSPHD project, not only because it empowers the team, but importantly because it opens the doors for the community the healthcare facility serves.",
      'We fully endorse the Howell Group for any hospital construction project in California. Their expertise, professionalism, and dedication to delivering outstanding results make them an invaluable partner in the field of healthcare infrastructure development. We are always available to speak further of their good work, if needed',
    ],
    signatories: [
      { name: 'Todd A. Davis', role: 'CEO, DavisHBC' },
      { name: 'Michael L. Davis II', role: 'Senior Consultant, DavisHBC' },
    ],
    company: 'DavisHBC',
    project:
      'Hoag Hospital Irvine / Anaheim Community Hospital / Aliso Ridge Behavioral Health Hospital',
    date: 'December 9, 2023',
    subject: 'Letter of Recommendation for the Howell Group',
  },
] as const;

const BY_ID = new Map(REFERENCES.map((reference) => [reference.id, reference]));

function reference(id: string): ReferenceLetter {
  const found = BY_ID.get(id);
  if (!found) {
    throw new Error(`Unknown reference id: ${id}`);
  }
  return found;
}

export const REFERENCE_ROWS: readonly ReferenceRow[] = [
  {
    stack: [reference('ladmc'), reference('watch-hill')],
    feature: reference('nelsonhps'),
  },
  {
    stack: [reference('anaheim-community-hospital'), reference('western-university')],
    feature: reference('davishbc'),
  },
  {
    stack: [reference('miles-kelley')],
    feature: reference('independent-solutions'),
  },
];

