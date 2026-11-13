import { Project, ProjectImage } from '../models/content.models';

export interface PortfolioImage extends ProjectImage {
  width: number;
  height: number;
  caption?: string;
}

export interface PortfolioProject extends Project {
  gallery?: readonly PortfolioImage[];
  credits?: readonly { label: string; value: string }[];
  bedCount?: string;
  jurisdiction?: string;
  overview?: { paragraphs: readonly string[]; image?: PortfolioImage };
  contribution?: { brief?: string; role?: string; outcome?: string };
  images: [ProjectImage & { width: number; height: number }];
}

// Verified names and image associations: https://thehowellgroup.co/projects/
// The configured CMS is unavailable. Shared with project listing, detail pages, and homepage;
// sourced fields follow verified client project pages and internal provenance records.
export const PORTFOLIO_PROJECTS: readonly PortfolioProject[] = [
  {
    id: 'aliso-ridge-behavioral-hospital',
    slug: 'aliso-ridge-behavioral-hospital',
    title: 'Aliso Ridge Behavioral Hospital',
    images: [
      {
        src: '/images/projects/client/aliso-ridge-behavioral-hospital.webp',
        alt: 'Aerial view of Aliso Ridge Behavioral Hospital and its landscaped grounds',
        width: 682,
        height: 384,
      },
    ],
    area: '80,000 sq ft',
    bedCount: '119 beds',
    jurisdiction: 'HCAI (OSHPD) 1',
    location: '200 Freedom Ln, Aliso Viejo, CA 92656',
    credits: [
      { label: 'Developer', value: 'Watch Hill Capital' },
      { label: 'Architect', value: 'HMC Architects' },
      { label: 'MEP Engineer', value: 'TK1SC' },
      { label: 'Structural Engineer', value: 'KPFF' },
      { label: 'Contractor', value: 'KPRS' },
    ],
    gallery: [
      {
        src: '/images/projects/client/aliso-ridge-behavioral-hospital-gallery-1.webp',
        alt: 'Entrance canopy and stone facade at Aliso Ridge Behavioral Hospital',
        width: 681,
        height: 455,
      },
      {
        src: '/images/projects/client/aliso-ridge-behavioral-hospital-gallery-2.webp',
        alt: 'Daylit common area with tables and seating at Aliso Ridge Behavioral Hospital',
        width: 681,
        height: 383,
      },
      {
        src: '/images/projects/client/aliso-ridge-behavioral-hospital-gallery-3.webp',
        alt: 'Commercial kitchen at Aliso Ridge Behavioral Hospital',
        width: 1500,
        height: 1002,
      },
      {
        src: '/images/projects/client/aliso-ridge-behavioral-hospital-gallery-4.webp',
        alt: 'Patient corridor at Aliso Ridge Behavioral Hospital',
        width: 681,
        height: 455,
      },
      {
        src: '/images/projects/client/aliso-ridge-behavioral-hospital-gallery-5.webp',
        alt: 'Commercial kitchen equipment at Aliso Ridge Behavioral Hospital',
        width: 681,
        height: 455,
      },
      {
        src: '/images/projects/client/aliso-ridge-behavioral-hospital-gallery-6.webp',
        alt: 'Construction work at Aliso Ridge Behavioral Hospital',
        width: 1600,
        height: 1200,
      },
      {
        src: '/images/projects/client/aliso-ridge-behavioral-hospital-gallery-7.webp',
        alt: 'Exterior staircase at Aliso Ridge Behavioral Hospital',
        width: 1600,
        height: 900,
      },
      {
        src: '/images/projects/client/aliso-ridge-behavioral-hospital-gallery-8.webp',
        alt: 'Dining area at Aliso Ridge Behavioral Hospital',
        width: 681,
        height: 455,
      },
      {
        src: '/images/projects/client/aliso-ridge-behavioral-hospital-gallery-9.webp',
        alt: 'Aerial view of Aliso Ridge Behavioral Hospital and its grounds',
        width: 681,
        height: 511,
      },
    ],
    overview: {
      paragraphs: [
        'A new 119-bed hospital for acute and crisis behavioral care, delivered as ground-up construction under HCAI (OSHPD) 1 jurisdiction.',
      ],
      image: {
        src: '/images/projects/client/aliso-ridge-behavioral-hospital-gallery-1.webp',
        alt: 'Entrance canopy and stone facade at Aliso Ridge Behavioral Hospital',
        width: 681,
        height: 455,
      },
    },
    contribution: {
      outcome: '$6.6M savings on a $43.5M project.',
    },
  },
  {
    id: 'anaheim-community-hospital',
    slug: 'anaheim-community-hospital',
    title: 'Anaheim Community Hospital',
    images: [
      {
        src: '/images/projects/client/anaheim-community-hospital.webp',
        alt: 'Columned entrance and driveway at Anaheim Community Hospital',
        width: 644,
        height: 430,
      },
    ],
    area: '68,209 sq ft',
    jurisdiction: 'HCAI (OSHPD) 1',
    credits: [
      { label: 'Architect', value: 'HMC Architects' },
      { label: 'Developer', value: 'Watch Hill Capital' },
      { label: 'MEP Engineer', value: 'TK1SC' },
      { label: 'Structural Engineer', value: 'KPFF' },
      { label: 'Contractor', value: 'Miles & Kelley' },
    ],
    gallery: [
      {
        src: '/images/projects/client/anaheim-community-hospital-gallery-1.webp',
        alt: 'Reception and waiting area at Anaheim Community Hospital',
        width: 682,
        height: 455,
      },
      {
        src: '/images/projects/client/anaheim-community-hospital-gallery-2.webp',
        alt: 'Main entrance and driveway at Anaheim Community Hospital',
        width: 681,
        height: 455,
      },
      {
        src: '/images/projects/client/anaheim-community-hospital-gallery-3.webp',
        alt: 'Fluoroscopy',
        width: 681,
        height: 455,
      },
      {
        src: '/images/projects/client/anaheim-community-hospital-gallery-4.webp',
        alt: 'Rooftop mechanical equipment and piping at Anaheim Community Hospital',
        width: 1600,
        height: 1200,
      },
      {
        src: '/images/projects/client/anaheim-community-hospital-gallery-5.webp',
        alt: 'Interior patient corridor at Anaheim Community Hospital',
        width: 681,
        height: 455,
      },
      {
        src: '/images/projects/client/anaheim-community-hospital-gallery-6.webp',
        alt: 'Commercial kitchen equipment at Anaheim Community Hospital',
        width: 681,
        height: 455,
      },
      {
        src: '/images/projects/client/anaheim-community-hospital-gallery-7.webp',
        alt: 'Intake and observation windows at Anaheim Community Hospital',
        width: 681,
        height: 456,
      },
      {
        src: '/images/projects/client/anaheim-community-hospital-gallery-8.webp',
        alt: 'New Generator Yard',
        width: 1600,
        height: 900,
      },
      {
        src: '/images/projects/client/anaheim-community-hospital-gallery-9.webp',
        alt: 'Patient bedroom at Anaheim Community Hospital',
        width: 681,
        height: 455,
      },
    ],
    overview: {
      paragraphs: [
        'Extensive remodel and ground-up construction for acute medical-surgical care as well as an acute and crisis behavioral hospital. The project is under HCAI (OSHPD) 1 jurisdiction.',
      ],
      image: {
        src: '/images/projects/client/anaheim-community-hospital-gallery-1.webp',
        alt: 'Reception and waiting area at Anaheim Community Hospital',
        width: 682,
        height: 455,
      },
    },
    // Dummy content — replace with the real outcome figure once Eric confirms it.
    contribution: {
      outcome: 'Outcome to be confirmed.',
    },
  },
  {
    id: 'kpc-global-oc',
    slug: 'kpc-global-oc',
    title: 'KPC Global OC',
    images: [
      {
        src: '/images/projects/client/kpc-global-oc.webp',
        alt: 'Exterior of Orange County Global Medical Center, the KPC Global OC project',
        width: 1200,
        height: 800,
      },
    ],
    area: '80,000 sq ft',
    jurisdiction: 'HCAI (OSHPD) 1',
    credits: [
      { label: 'Owner', value: 'KPC Healthcare Inc.' },
      { label: 'Architects', value: 'JCS and Alexander Hibbs' },
      { label: 'MEP Engineer', value: 'IMEG' },
      { label: 'Contractor', value: 'Nelson HCS' },
      { label: 'Structural Engineer', value: 'IMEG' },
    ],
    gallery: [
      {
        src: '/images/projects/client/kpc-global-oc-gallery-1.webp',
        alt: 'Orange County Global Medical Center sign',
        width: 158,
        height: 104,
      },
      {
        src: '/images/projects/client/kpc-global-oc-gallery-2.webp',
        alt: 'Groundbreaking Ceremony',
        width: 1600,
        height: 1067,
      },
      {
        src: '/images/projects/client/kpc-global-oc-gallery-3.webp',
        alt: 'Entrance to operating room 3 at Orange County Global Medical Center',
        width: 1116,
        height: 2296,
      },
      {
        src: '/images/projects/client/kpc-global-oc-gallery-4.webp',
        alt: 'Operating room ceiling work at Orange County Global Medical Center',
        width: 1600,
        height: 899,
      },
      {
        src: '/images/projects/client/kpc-global-oc-gallery-5.webp',
        alt: "National Healthcare Facilities and Engineering Week. Don't miss out on our Craft Smoked BBQ Lunch!",
        width: 1600,
        height: 900,
      },
      {
        src: '/images/projects/client/kpc-global-oc-gallery-6.webp',
        alt: 'Central Plant Delivery & placement at Orange County Global Medical Center',
        width: 1600,
        height: 900,
      },
      {
        src: '/images/projects/client/kpc-global-oc-gallery-7.webp',
        alt: 'Rigging in the driving rain at Orange County Global Medical Center',
        width: 1600,
        height: 900,
      },
      {
        src: '/images/projects/client/kpc-global-oc-gallery-8.webp',
        alt: "Demo'd cooling towers below / building for new above",
        width: 309,
        height: 180,
      },
      {
        src: '/images/projects/client/kpc-global-oc-gallery-9.webp',
        alt: 'Formed columns for CT assembly.',
        width: 1600,
        height: 900,
      },
    ],
    overview: {
      paragraphs: [
        'Current program of 9 operating room surgical lighting and HVAC remodel, new cooling towers yard, and new central plant. $13.5M program in process. $229.5K savings on $893,848K OR project.',
      ],
      image: {
        src: '/images/projects/client/kpc-global-oc.webp',
        alt: 'Exterior of Orange County Global Medical Center, the KPC Global OC project',
        width: 1200,
        height: 800,
      },
    },
    // Dummy content — replace with the real outcome figure once Eric confirms it.
    contribution: {
      outcome: 'Outcome to be confirmed.',
    },
  },
  {
    id: 'western-university-medical-school',
    slug: 'western-university-medical-school',
    title: 'Western University Medical School',
    images: [
      {
        src: '/images/projects/client/western-university-medical-school.webp',
        alt: 'Glass-fronted Western University Medical School building with an exterior staircase',
        width: 1200,
        height: 800,
      },
    ],
    area: '5,900 sq ft',
    jurisdiction: 'City of Pomona',
    credits: [
      { label: 'Owner', value: 'Western University of Health Sciences' },
      { label: 'Architects', value: 'LPA' },
      { label: 'MEP Engineer', value: 'Goss Engineering' },
      { label: 'Structural Engineer', value: 'LPA' },
      { label: 'Contractor', value: 'Nelson HCS' },
    ],
    gallery: [
      {
        src: '/images/projects/client/western-university-medical-school-gallery-1.webp',
        alt: 'Interior observation room at the Western University simulation lab',
        width: 1000,
        height: 1333,
      },
      {
        src: '/images/projects/client/western-university-medical-school-gallery-2.webp',
        alt: 'Renovation work inside the Western University simulation lab',
        width: 1500,
        height: 1125,
      },
      {
        src: '/images/projects/client/western-university-medical-school-gallery-3.webp',
        alt: 'Hospital training room with a bed at the Western University simulation lab',
        width: 854,
        height: 1139,
      },
      {
        src: '/images/projects/client/western-university-medical-school-gallery-4.webp',
        alt: 'Observation room in the Western University simulation lab',
        width: 1600,
        height: 1200,
      },
      {
        src: '/images/projects/client/western-university-medical-school-gallery-5.webp',
        alt: 'Open simulation room in the Western University medical school',
        width: 854,
        height: 1139,
      },
      {
        src: '/images/projects/client/western-university-medical-school-gallery-6.webp',
        alt: 'Clinical training room with hospital bed in the Western University simulation lab',
        width: 1600,
        height: 1200,
      },
      {
        src: '/images/projects/client/western-university-medical-school-gallery-7.webp',
        alt: 'Clinical practice room in the Western University simulation lab',
        width: 1600,
        height: 2133,
      },
      {
        src: '/images/projects/client/western-university-medical-school-gallery-8.webp',
        alt: 'Hallway in the Western University simulation lab',
        width: 1600,
        height: 1200,
      },
      {
        src: '/images/projects/client/western-university-medical-school-gallery-9.webp',
        alt: 'Clinical training kitchenette in the Western University simulation lab',
        width: 1600,
        height: 2133,
      },
    ],
    overview: {
      paragraphs: [
        'Renovation of an existing Type III, mixed-use occupancy, converting offices, conference rooms, simulation rooms, and a staff lounge into a hospital simulation lab for training university student physicians and nurses.',
      ],
      image: {
        src: '/images/projects/client/western-university-medical-school-gallery-3.webp',
        alt: 'Hospital training room with a bed at the Western University simulation lab',
        width: 854,
        height: 1139,
      },
    },
    contribution: {
      outcome: '$128K savings on a $1.3M project.',
    },
  },
  {
    id: 'los-angeles-downtown-medical-center',
    slug: 'los-angeles-downtown-medical-center',
    title: 'Los Angeles Downtown Medical Center',
    images: [
      {
        src: '/images/projects/client/los-angeles-downtown-medical-center.webp',
        alt: 'Illuminated entrance and signage at Los Angeles Downtown Medical Center',
        width: 1200,
        height: 900,
      },
    ],
    area: '+/-50,00 sq ft',
    jurisdiction: 'OSHPD 1',
    location: '1711 West Temple Street, Los Angeles, CA 90026',
    credits: [
      { label: 'Owner', value: 'LADMC' },
      { label: 'Architects', value: 'HED' },
      { label: 'Mechanical / Plumbing Engineer', value: 'Kevin A. Smola and Assoc., Inc.' },
      { label: 'Electrical Engineer', value: 'Salas O’Brien' },
      { label: 'Structural Engineer', value: 'Degenkolb Engineers' },
      { label: 'Geologist', value: 'Terracon Consultants' },
      { label: 'Contractor', value: 'Building Resources Companies' },
    ],
    gallery: [
      {
        src: '/images/projects/client/los-angeles-downtown-medical-center-gallery-2.webp',
        alt: 'Demo begins for 3 floors of Behavioral health.',
        width: 1513,
        height: 1135,
      },
      {
        src: '/images/projects/client/los-angeles-downtown-medical-center-gallery-6.webp',
        alt: 'Central Plant',
        width: 1221,
        height: 1628,
      },
      {
        src: '/images/projects/client/los-angeles-downtown-medical-center-gallery-8.webp',
        alt: 'Motors ready to rig into penthouse for all 6 Elevators replacement.',
        width: 1600,
        height: 1200,
      },
    ],
    overview: {
      paragraphs: [
        'Program including 3 partial floors conversion to Behavioral Health, 5 Elevator replacements, Generator & area upgrade. Major Fire Sprinkler introduction project and separate fire alarm introduction project to 8 story MOB side.',
      ],
      image: {
        src: '/images/projects/client/los-angeles-downtown-medical-center-gallery-2.webp',
        alt: 'Demo begins for 3 floors of Behavioral health.',
        width: 1513,
        height: 1135,
      },
    },
    // Dummy content — replace with the real outcome figure once Eric confirms it.
    contribution: {
      outcome: 'Outcome to be confirmed.',
    },
  },
  {
    id: 'kpc-global-chapman',
    slug: 'kpc-global-chapman',
    title: 'KPC Global Chapman',
    images: [
      {
        src: '/images/projects/client/kpc-global-chapman.webp',
        alt: 'Chapman Global Medical Center exterior and entrance signage, the KPC Global Chapman project',
        width: 978,
        height: 652,
      },
    ],
    area: '2,684 sq ft',
    jurisdiction: 'HCAI (OSHPD) 1',
    credits: [
      { label: 'Owner', value: 'KPC Healthcare Inc.' },
      { label: 'Architects', value: 'Alexander Hibbs' },
      { label: 'MEP Engineer', value: 'IMEG' },
      { label: 'Structural Engineer', value: 'IMEG' },
      { label: 'Contractor', value: 'Nelson HCS' },
    ],
    gallery: [
      {
        src: '/images/projects/client/kpc-global-chapman-gallery-1.webp',
        alt: 'Glass-fronted entrance to Chapman Global Medical Center',
        width: 439,
        height: 331,
      },
      {
        src: '/images/projects/client/kpc-global-chapman-gallery-2.webp',
        alt: 'Operating room with surgical lighting at Chapman Global Medical Center',
        width: 1166,
        height: 778,
      },
      {
        src: '/images/projects/client/kpc-global-chapman-gallery-3.webp',
        alt: 'Aerial view of Chapman Global Medical Center',
        width: 1219,
        height: 650,
      },
      {
        src: '/images/projects/client/kpc-global-chapman-gallery-4.webp',
        alt: 'Electrical distribution panel at Chapman Global Medical Center',
        width: 700,
        height: 700,
      },
      {
        src: '/images/projects/client/kpc-global-chapman-gallery-5.webp',
        alt: 'Operating room equipment at Chapman Global Medical Center',
        width: 1600,
        height: 900,
      },
      {
        src: '/images/projects/client/kpc-global-chapman-gallery-6.webp',
        alt: 'Workers performing overhead construction at Chapman Global Medical Center',
        width: 221,
        height: 379,
      },
      {
        src: '/images/projects/client/kpc-global-chapman-gallery-7.webp',
        alt: 'Operating room with surgical lights at Chapman Global Medical Center',
        width: 457,
        height: 304,
      },
      {
        src: '/images/projects/client/kpc-global-chapman-gallery-8.webp',
        alt: 'Exterior of Chapman Global Medical Center',
        width: 978,
        height: 652,
      },
      {
        src: '/images/projects/client/kpc-global-chapman-gallery-9.webp',
        alt: 'Medical equipment room at Chapman Global Medical Center',
        width: 700,
        height: 700,
      },
    ],
    overview: {
      paragraphs: [
        'Current program of three operating-room surgical lighting and HVAC remodels under HCAI (OSHPD) 1 jurisdiction.',
      ],
      image: {
        src: '/images/projects/client/kpc-global-chapman-gallery-2.webp',
        alt: 'Operating room with surgical lighting at Chapman Global Medical Center',
        width: 1166,
        height: 778,
      },
    },
    contribution: {
      outcome: '$68.3K savings on a $310.2K project.',
    },
  },
];
