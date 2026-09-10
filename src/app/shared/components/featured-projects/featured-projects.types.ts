export interface FeaturedProject {
  id: string | number;
  title: string;
  location: string;
  category: string;
  area: string;
  year: string;
  status: string;
  value?: string;
  client?: string;
  description?: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
  placeholder?: boolean;
}
