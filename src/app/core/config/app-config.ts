import { environment } from '../../../environments/environment';

export const APP_CONFIG = {
  apiUrl: environment.apiUrl.replace(/\/$/, ''),
  siteUrl: environment.siteUrl,
  defaultTitle: 'Howell Group | Premium Construction & Development',
  defaultDescription: 'Howell Group delivers premium construction, development and project leadership for enduring places, from first concept through final detail and handover.',
  visualColors: { teal: 0x0d7774, red: 0xe43b32 }
} as const;
