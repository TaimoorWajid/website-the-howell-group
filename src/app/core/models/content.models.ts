export interface ProjectImage { src: string; alt: string; width?: number; height?: number; }
export interface ProjectCategory { id: string | number; name: string; slug: string; }
export interface Project { id: string | number; slug: string; title: string; excerpt?: string; description?: string; categories?: ProjectCategory[]; images?: ProjectImage[]; year?: number; location?: string; area?: string; status?: string; client?: string; value?: string; }
export interface Service { id: string | number; slug: string; title: string; excerpt?: string; description?: string; }
export interface TeamMember { id: string | number; name: string; role: string; bio?: string; image?: ProjectImage; }
export interface Testimonial { id: string | number; quote: string; author: string; role?: string; company?: string; }
export interface Insight { id: string | number; slug: string; title: string; excerpt?: string; content?: string; date?: string; image?: ProjectImage; }
export interface Career { id: string | number; slug: string; title: string; excerpt?: string; description?: string; location?: string; employmentType?: string; }
export interface ContactInquiry { name: string; email: string; phone?: string; company?: string; message: string; }
