export interface InquiryOption {
  readonly value: string;
  readonly label: string;
}
export type ProjectSelection =
  'projectType' | 'estimatedValue' | 'projectStage' | 'targetStart' | 'state';
export interface ProjectSelectField {
  readonly key: ProjectSelection;
  readonly label: string;
  readonly placeholder: string;
  readonly options: readonly InquiryOption[];
}

// Dropdown values for the Project Information step (Step 02).
// Curated for a healthcare-focused owner-representation / construction firm.
export const PROJECT_SELECT_FIELDS: readonly ProjectSelectField[] = [
  {
    key: 'projectType',
    label: 'Project type',
    placeholder: 'Select project type',
    options: [
      { value: 'New Construction', label: 'New Construction' },
      { value: 'Renovation / Remodel', label: 'Renovation / Remodel' },
      { value: 'Expansion / Addition', label: 'Expansion / Addition' },
      { value: 'Tenant Improvement', label: 'Tenant Improvement' },
      { value: 'Seismic Retrofit / Compliance', label: 'Seismic Retrofit / Compliance' },
      { value: 'Infrastructure / Utilities', label: 'Infrastructure / Utilities' },
      { value: 'Master Planning', label: 'Master Planning' },
      { value: 'Other', label: 'Other' },
    ],
  },
  {
    key: 'estimatedValue',
    label: 'Project estimated value',
    placeholder: 'Select estimated value',
    options: [
      { value: 'Under $1M', label: 'Under $1M' },
      { value: '$1M – $5M', label: '$1M – $5M' },
      { value: '$5M – $10M', label: '$5M – $10M' },
      { value: '$10M – $25M', label: '$10M – $25M' },
      { value: '$25M – $50M', label: '$25M – $50M' },
      { value: '$50M – $100M', label: '$50M – $100M' },
      { value: 'Over $100M', label: 'Over $100M' },
    ],
  },
  {
    key: 'projectStage',
    label: 'Project stage',
    placeholder: 'Select project stage',
    options: [
      { value: 'Concept / Early Planning', label: 'Concept / Early Planning' },
      { value: 'Design Development', label: 'Design Development' },
      { value: 'Construction Documents', label: 'Construction Documents' },
      { value: 'Bidding / Procurement', label: 'Bidding / Procurement' },
      { value: 'Under Construction', label: 'Under Construction' },
      { value: 'Closeout', label: 'Closeout' },
    ],
  },
  {
    key: 'targetStart',
    label: 'Target start',
    placeholder: 'Select target start',
    options: [
      { value: 'Immediately', label: 'Immediately' },
      { value: 'Within 3 months', label: 'Within 3 months' },
      { value: '3 – 6 months', label: '3 – 6 months' },
      { value: '6 – 12 months', label: '6 – 12 months' },
      { value: 'Over 12 months', label: 'Over 12 months' },
      { value: 'To be determined', label: 'To be determined' },
    ],
  },
  {
    key: 'state',
    label: 'State',
    placeholder: 'Select project state',
    options: [
      { value: 'Alabama', label: 'Alabama' },
      { value: 'Alaska', label: 'Alaska' },
      { value: 'Arizona', label: 'Arizona' },
      { value: 'Arkansas', label: 'Arkansas' },
      { value: 'California', label: 'California' },
      { value: 'Colorado', label: 'Colorado' },
      { value: 'Connecticut', label: 'Connecticut' },
      { value: 'Delaware', label: 'Delaware' },
      { value: 'District of Columbia', label: 'District of Columbia' },
      { value: 'Florida', label: 'Florida' },
      { value: 'Georgia', label: 'Georgia' },
      { value: 'Hawaii', label: 'Hawaii' },
      { value: 'Idaho', label: 'Idaho' },
      { value: 'Illinois', label: 'Illinois' },
      { value: 'Indiana', label: 'Indiana' },
      { value: 'Iowa', label: 'Iowa' },
      { value: 'Kansas', label: 'Kansas' },
      { value: 'Kentucky', label: 'Kentucky' },
      { value: 'Louisiana', label: 'Louisiana' },
      { value: 'Maine', label: 'Maine' },
      { value: 'Maryland', label: 'Maryland' },
      { value: 'Massachusetts', label: 'Massachusetts' },
      { value: 'Michigan', label: 'Michigan' },
      { value: 'Minnesota', label: 'Minnesota' },
      { value: 'Mississippi', label: 'Mississippi' },
      { value: 'Missouri', label: 'Missouri' },
      { value: 'Montana', label: 'Montana' },
      { value: 'Nebraska', label: 'Nebraska' },
      { value: 'Nevada', label: 'Nevada' },
      { value: 'New Hampshire', label: 'New Hampshire' },
      { value: 'New Jersey', label: 'New Jersey' },
      { value: 'New Mexico', label: 'New Mexico' },
      { value: 'New York', label: 'New York' },
      { value: 'North Carolina', label: 'North Carolina' },
      { value: 'North Dakota', label: 'North Dakota' },
      { value: 'Ohio', label: 'Ohio' },
      { value: 'Oklahoma', label: 'Oklahoma' },
      { value: 'Oregon', label: 'Oregon' },
      { value: 'Pennsylvania', label: 'Pennsylvania' },
      { value: 'Rhode Island', label: 'Rhode Island' },
      { value: 'South Carolina', label: 'South Carolina' },
      { value: 'South Dakota', label: 'South Dakota' },
      { value: 'Tennessee', label: 'Tennessee' },
      { value: 'Texas', label: 'Texas' },
      { value: 'Utah', label: 'Utah' },
      { value: 'Vermont', label: 'Vermont' },
      { value: 'Virginia', label: 'Virginia' },
      { value: 'Washington', label: 'Washington' },
      { value: 'West Virginia', label: 'West Virginia' },
      { value: 'Wisconsin', label: 'Wisconsin' },
      { value: 'Wyoming', label: 'Wyoming' },
    ],
  },
];
export const INQUIRY_ROLES = [
  'Owner',
  'Developer',
  'Architect',
  'Designer',
  'Other',
] as const;
export const INQUIRY_STEPS = [
  'Personal Information',
  'Project Information',
  "Let's Talk",
] as const;

export interface PhoneCountry {
  readonly code: string;
  readonly name: string;
  readonly dial: string;
  readonly trunk: boolean;
  readonly national: RegExp;
  readonly hint: string;
}
// National-format checks, not carrier/deliverability verification. Formatting
// punctuation and an explicitly matching international prefix are accepted.
export const PHONE_COUNTRIES: readonly PhoneCountry[] = [
  {
    code: 'US',
    name: 'United States',
    dial: '+1',
    trunk: false,
    national: /^[2-9]\d{2}[2-9]\d{6}$/,
    hint: 'Enter a 10-digit US number, including area code.',
  },
  {
    code: 'CA',
    name: 'Canada',
    dial: '+1',
    trunk: false,
    national: /^[2-9]\d{2}[2-9]\d{6}$/,
    hint: 'Enter a 10-digit Canadian number, including area code.',
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    dial: '+44',
    trunk: true,
    national: /^[1-9]\d{8,9}$/,
    hint: 'Enter a UK number with 9–10 digits after the leading zero.',
  },
  {
    code: 'AU',
    name: 'Australia',
    dial: '+61',
    trunk: true,
    national: /^[23478]\d{8}$/,
    hint: 'Enter a 9-digit Australian number after the leading zero.',
  },
  {
    code: 'IN',
    name: 'India',
    dial: '+91',
    trunk: true,
    national: /^[1-9]\d{9}$/,
    hint: 'Enter a 10-digit Indian number after any leading zero.',
  },
  {
    code: 'PK',
    name: 'Pakistan',
    dial: '+92',
    trunk: true,
    national: /^[1-9]\d{8,9}$/,
    hint: 'Enter a Pakistani number with 9–10 digits after the leading zero.',
  },
];

export function normalizedPhone(
  countryCode: string,
  input: string,
): string | null {
  const country = PHONE_COUNTRIES.find((item) => item.code === countryCode);
  const raw = input.trim();
  if (!country || !/^\+?[\d\s().-]+$/.test(raw)) return null;
  let digits = raw.replace(/\D/g, '');
  if (raw.startsWith('+')) {
    if (!digits.startsWith(country.dial.slice(1))) return null;
    digits = digits.slice(country.dial.length - 1);
  } else if (country.trunk && digits.startsWith('0')) digits = digits.slice(1);
  return country.national.test(digits) ? country.dial + digits : null;
}
