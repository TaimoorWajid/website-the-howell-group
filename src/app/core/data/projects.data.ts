import { Project, ProjectImage } from '../models/content.models';

export interface PortfolioImage extends ProjectImage { width: number; height: number; caption?: string; }

export interface PortfolioProject extends Project {
  gallery?: readonly PortfolioImage[];
  howellRole?: string;
  completion?: string;
  overview?: { paragraphs: readonly string[]; image?: PortfolioImage };
  contribution?: { brief?: string; role?: string; outcome?: string };
  images: [ProjectImage & { width: number; height: number }];
}

// Verified names and image associations: https://thehowellgroup.co/projects/
// The configured CMS is unavailable. Share this collection with the detail template;
// do not substitute the homepage's fictional editorial samples.
export const PORTFOLIO_PROJECTS: readonly PortfolioProject[] = [
  {
    "id": "aliso-ridge-behavioral-hospital",
    "slug": "aliso-ridge-behavioral-hospital",
    "title": "Aliso Ridge Behavioral Hospital",
    "images": [
      {
        "src": "/images/projects/client/aliso-ridge-behavioral-hospital.webp",
        "alt": "Aerial view of Aliso Ridge Behavioral Hospital and its landscaped grounds",
        "width": 682,
        "height": 384
      }
    ],
    "area": "80,000 sq ft",
    "gallery": [
      {
        "src": "/images/projects/client/aliso-ridge-behavioral-hospital-gallery-1.webp",
        "alt": "Entrance canopy and stone facade at Aliso Ridge Behavioral Hospital",
        "width": 681,
        "height": 455
      },
      {
        "src": "/images/projects/client/aliso-ridge-behavioral-hospital-gallery-2.webp",
        "alt": "Daylit common area with tables and seating at Aliso Ridge Behavioral Hospital",
        "width": 681,
        "height": 383
      },
      {
        "src": "/images/projects/client/aliso-ridge-behavioral-hospital-gallery-3.webp",
        "alt": "Commercial kitchen at Aliso Ridge Behavioral Hospital",
        "width": 1500,
        "height": 1002
      }
    ],
    "overview": {
      "paragraphs": [
        "A new 119-bed hospital for acute and crisis behavioral care, delivered as ground-up construction under HCAI (OSHPD) 1 jurisdiction."
      ],
      "image": {
        "src": "/images/projects/client/aliso-ridge-behavioral-hospital-gallery-1.webp",
        "alt": "Entrance canopy and stone facade at Aliso Ridge Behavioral Hospital",
        "width": 681,
        "height": 455
      }
    },
    "contribution": {
      "outcome": "Savings of $6.6 million on a $43.5 million project."
    }
  },
  {
    "id": "anaheim-community-hospital",
    "slug": "anaheim-community-hospital",
    "title": "Anaheim Community Hospital",
    "images": [
      {
        "src": "/images/projects/client/anaheim-community-hospital.webp",
        "alt": "Columned entrance and driveway at Anaheim Community Hospital",
        "width": 644,
        "height": 430
      }
    ],
    "area": "68,209 sq ft",
    "gallery": [
      {
        "src": "/images/projects/client/anaheim-community-hospital-gallery-1.webp",
        "alt": "Reception and waiting area at Anaheim Community Hospital",
        "width": 682,
        "height": 455
      },
      {
        "src": "/images/projects/client/anaheim-community-hospital-gallery-2.webp",
        "alt": "Main entrance and driveway at Anaheim Community Hospital",
        "width": 681,
        "height": 455
      },
      {
        "src": "/images/projects/client/anaheim-community-hospital-gallery-3.webp",
        "alt": "Imaging equipment and examination table at Anaheim Community Hospital",
        "width": 681,
        "height": 455
      }
    ],
    "overview": {
      "paragraphs": [
        "Extensive remodeling and new construction for acute medical-surgical care and acute and crisis behavioral care, under HCAI (OSHPD) 1 jurisdiction."
      ],
      "image": {
        "src": "/images/projects/client/anaheim-community-hospital-gallery-1.webp",
        "alt": "Reception and waiting area at Anaheim Community Hospital",
        "width": 682,
        "height": 455
      }
    }
  },
  {
    "id": "kpc-global-oc",
    "slug": "kpc-global-oc",
    "title": "KPC Global OC",
    "images": [
      {
        "src": "/images/projects/client/kpc-global-oc.webp",
        "alt": "Exterior of Orange County Global Medical Center, the KPC Global OC project",
        "width": 1200,
        "height": 800
      }
    ],
    "area": "80,000 sq ft",
    "gallery": [
      {
        "src": "/images/projects/client/kpc-global-oc.webp",
        "alt": "Exterior of Orange County Global Medical Center, the KPC Global OC project",
        "width": 1200,
        "height": 800
      },
      {
        "src": "/images/projects/client/kpc-global-oc-gallery-2.webp",
        "alt": "Excavation and equipment work at Orange County Global Medical Center",
        "width": 1600,
        "height": 1067
      },
      {
        "src": "/images/projects/client/kpc-global-oc-gallery-3.webp",
        "alt": "Entrance to operating room 3 at Orange County Global Medical Center",
        "width": 1116,
        "height": 2296
      }
    ],
    "overview": {
      "paragraphs": [
        "The project scope includes surgical lighting and HVAC remodeling in nine operating rooms, a new cooling-tower yard and a new central plant."
      ],
      "image": {
        "src": "/images/projects/client/kpc-global-oc.webp",
        "alt": "Exterior of Orange County Global Medical Center, the KPC Global OC project",
        "width": 1200,
        "height": 800
      }
    }
  },
  {
    "id": "western-university-medical-school",
    "slug": "western-university-medical-school",
    "title": "Western University Medical School",
    "images": [
      {
        "src": "/images/projects/client/western-university-medical-school.webp",
        "alt": "Glass-fronted Western University Medical School building with an exterior staircase",
        "width": 1200,
        "height": 800
      }
    ],
    "area": "5,900 sq ft",
    "gallery": [
      {
        "src": "/images/projects/client/western-university-medical-school-gallery-1.webp",
        "alt": "Interior observation room at the Western University simulation lab",
        "width": 1000,
        "height": 1333
      },
      {
        "src": "/images/projects/client/western-university-medical-school-gallery-2.webp",
        "alt": "Renovation work inside the Western University simulation lab",
        "width": 1500,
        "height": 1125
      },
      {
        "src": "/images/projects/client/western-university-medical-school-gallery-3.webp",
        "alt": "Hospital training room with a bed at the Western University simulation lab",
        "width": 854,
        "height": 1139
      }
    ],
    "overview": {
      "paragraphs": [
        "Renovation of existing offices, conference and simulation rooms, and a staff lounge into a hospital simulation lab for training student physicians and nurses."
      ],
      "image": {
        "src": "/images/projects/client/western-university-medical-school-gallery-3.webp",
        "alt": "Hospital training room with a bed at the Western University simulation lab",
        "width": 854,
        "height": 1139
      }
    },
    "contribution": {
      "outcome": "Savings of $128,000 on a $1.3 million project."
    }
  },
  {
    "id": "los-angeles-downtown-medical-center",
    "slug": "los-angeles-downtown-medical-center",
    "title": "Los Angeles Downtown Medical Center",
    "images": [
      {
        "src": "/images/projects/client/los-angeles-downtown-medical-center.webp",
        "alt": "Illuminated entrance and signage at Los Angeles Downtown Medical Center",
        "width": 1200,
        "height": 900
      }
    ],
    "gallery": [
      {
        "src": "/images/projects/client/los-angeles-downtown-medical-center-gallery-1.webp",
        "alt": "Nighttime exterior of Los Angeles Downtown Medical Center with a fire engine outside",
        "width": 1600,
        "height": 1200
      },
      {
        "src": "/images/projects/client/los-angeles-downtown-medical-center-gallery-2.webp",
        "alt": "Interior construction and exposed building services at Los Angeles Downtown Medical Center",
        "width": 1513,
        "height": 1135
      },
      {
        "src": "/images/projects/client/los-angeles-downtown-medical-center-gallery-3.webp",
        "alt": "Exterior tower at Los Angeles Downtown Medical Center",
        "width": 1600,
        "height": 1200
      }
    ],
    "overview": {
      "paragraphs": [
        "The program scope includes behavioral-health conversions across portions of three floors, five elevator replacements, generator upgrades, fire sprinklers and plumbing equipment and seismic work."
      ],
      "image": {
        "src": "/images/projects/client/los-angeles-downtown-medical-center-gallery-2.webp",
        "alt": "Interior construction and exposed building services at Los Angeles Downtown Medical Center",
        "width": 1513,
        "height": 1135
      }
    }
  },
  {
    "id": "kpc-global-chapman",
    "slug": "kpc-global-chapman",
    "title": "KPC Global Chapman",
    "images": [
      {
        "src": "/images/projects/client/kpc-global-chapman.webp",
        "alt": "Chapman Global Medical Center exterior and entrance signage, the KPC Global Chapman project",
        "width": 978,
        "height": 652
      }
    ],
    "area": "2,684 sq ft",
    "gallery": [
      {
        "src": "/images/projects/client/kpc-global-chapman-gallery-1.webp",
        "alt": "Glass-fronted entrance to Chapman Global Medical Center",
        "width": 439,
        "height": 331
      },
      {
        "src": "/images/projects/client/kpc-global-chapman-gallery-2.webp",
        "alt": "Operating room with surgical lighting at Chapman Global Medical Center",
        "width": 1166,
        "height": 778
      },
      {
        "src": "/images/projects/client/kpc-global-chapman-gallery-3.webp",
        "alt": "Aerial view of Chapman Global Medical Center",
        "width": 1219,
        "height": 650
      }
    ],
    "overview": {
      "paragraphs": [
        "Surgical lighting and HVAC remodeling across three operating rooms under HCAI (OSHPD) 1 jurisdiction."
      ],
      "image": {
        "src": "/images/projects/client/kpc-global-chapman-gallery-2.webp",
        "alt": "Operating room with surgical lighting at Chapman Global Medical Center",
        "width": 1166,
        "height": 778
      }
    },
    "contribution": {
      "outcome": "Savings of $68,300 on a $310,200 project."
    }
  }
];
