export type PageTab = 'home' | 'work' | 'services' | 'about' | 'contact' | 'privacy' | 'terms';

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Strategy' | 'Design' | 'Development' | 'Full-Stack';
  year: string;
  imageUrl: string;
  altText: string;
  description: string;
  techStack: string[];
  metrics: {
    label: string;
    value: string;
  }[];
  client: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  icon: string;
  tagline: string;
  badge: string;
  description: string;
  features: string[];
}

export interface ProjectInquiry {
  fullName: string;
  email: string;
  budget: string;
  timeline: string;
  details: string;
  servicesSelected: string[];
}
