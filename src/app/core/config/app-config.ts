import { environment } from '../../../environments/environment';

export const APP_CONFIG = {
  apiUrl: environment.apiUrl.replace(/\/$/, ''),
  siteUrl: environment.siteUrl,
  defaultTitle: 'The Howell Group',
  defaultDescription: 'The Howell Group — considered construction, architecture and management.'
} as const;
