export interface Job {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  workplace: string;
  employmentType: string;
  summary: string;
  responsibilities: string[];
  qualifications: string[];
  salary?: string;
  closingDate?: string;
}
export interface CareersCatalog {
  mode: 'preview' | 'live';
  jobs: Job[];
}
export interface ResumeUpload {
  name: string;
  data: string;
}
export interface JobApplication {
  requestId: string;
  jobId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  profile: string;
  introduction: string;
  consent: boolean;
  website: string;
  resume: ResumeUpload;
}
export interface ApplicationReceipt {
  reference: string;
  jobTitle: string;
  submittedAt: string;
  mode: 'preview' | 'live';
}
export const MAX_RESUME_BYTES = 5 * 1024 * 1024;
