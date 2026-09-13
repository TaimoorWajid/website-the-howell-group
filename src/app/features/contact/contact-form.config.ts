export interface InquiryOption { readonly value: string; readonly label: string; }
export type ProjectSelection = 'projectType' | 'estimatedValue' | 'projectStage' | 'targetStart' | 'state';
export interface ProjectSelectField { readonly key: ProjectSelection; readonly label: string; readonly placeholder: string; readonly options: readonly InquiryOption[]; }

// No authoritative lists exist in the current repository/API models. Populate
// these with approved backend values; empty required selections intentionally block submission.
export const PROJECT_SELECT_FIELDS: readonly ProjectSelectField[] = [
  { key: 'projectType', label: 'Project type', placeholder: 'Select project type', options: [] },
  { key: 'estimatedValue', label: 'Project estimated value', placeholder: 'Select estimated value', options: [] },
  { key: 'projectStage', label: 'Project stage', placeholder: 'Select project stage', options: [] },
  { key: 'targetStart', label: 'Target start', placeholder: 'Select target start', options: [] },
  { key: 'state', label: 'State', placeholder: 'Select project state', options: [] }
];
export const INQUIRY_ROLES = ['Owner', 'Developer', 'Architect', 'Designer', 'Other'] as const;
export const INQUIRY_STEPS = ['Personal Information', 'Project Information', "Let's Talk"] as const;

export interface PhoneCountry { readonly code: string; readonly name: string; readonly dial: string; readonly trunk: boolean; readonly national: RegExp; readonly hint: string; }
// National-format checks, not carrier/deliverability verification. Formatting
// punctuation and an explicitly matching international prefix are accepted.
export const PHONE_COUNTRIES: readonly PhoneCountry[] = [
  { code: 'US', name: 'United States', dial: '+1', trunk: false, national: /^[2-9]\d{2}[2-9]\d{6}$/, hint: 'Enter a 10-digit US number, including area code.' },
  { code: 'CA', name: 'Canada', dial: '+1', trunk: false, national: /^[2-9]\d{2}[2-9]\d{6}$/, hint: 'Enter a 10-digit Canadian number, including area code.' },
  { code: 'GB', name: 'United Kingdom', dial: '+44', trunk: true, national: /^[1-9]\d{8,9}$/, hint: 'Enter a UK number with 9–10 digits after the leading zero.' },
  { code: 'AU', name: 'Australia', dial: '+61', trunk: true, national: /^[23478]\d{8}$/, hint: 'Enter a 9-digit Australian number after the leading zero.' },
  { code: 'IN', name: 'India', dial: '+91', trunk: true, national: /^[1-9]\d{9}$/, hint: 'Enter a 10-digit Indian number after any leading zero.' },
  { code: 'PK', name: 'Pakistan', dial: '+92', trunk: true, national: /^[1-9]\d{8,9}$/, hint: 'Enter a Pakistani number with 9–10 digits after the leading zero.' }
];

export function normalizedPhone(countryCode: string, input: string): string | null {
  const country = PHONE_COUNTRIES.find(item => item.code === countryCode);
  const raw = input.trim();
  if (!country || !/^\+?[\d\s().-]+$/.test(raw)) return null;
  let digits = raw.replace(/\D/g, '');
  if (raw.startsWith('+')) {
    if (!digits.startsWith(country.dial.slice(1))) return null;
    digits = digits.slice(country.dial.length - 1);
  } else if (country.trunk && digits.startsWith('0')) digits = digits.slice(1);
  return country.national.test(digits) ? country.dial + digits : null;
}
