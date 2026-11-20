export type ProjectType = 'Website' | 'Software' | 'SaaS';
export type NewsletterCategory = 'Guide' | 'Checklist' | 'Tutorial' | 'Case Study' | 'Notes';

export interface MediaAsset {
  url: string;
  alt: string;
}

export interface Service {
  slug: string;
  title: string;
  image: MediaAsset | null;
  short: string;
  metaDescription: string;
  intro: string;
  overview: string[];
  included: string[];
  forWho: string[];
  steps: { title: string; description: string }[];
  meta?: { title?: string | null; description?: string | null };
  updatedAt?: string;
}

export interface Project {
  slug: string;
  title: string;
  type: ProjectType;
  tags: string[];
  image: MediaAsset | null;
  role: string;
  summary: string;
  challenge: string;
  approach: string;
  outcomes: string[];
  meta?: { title?: string | null; description?: string | null };
  updatedAt?: string;
}

export interface NewsletterSection {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface NewsletterEntry {
  slug: string;
  title: string;
  image: MediaAsset | null;
  excerpt: string;
  category: NewsletterCategory;
  tags: string[];
  sections?: NewsletterSection[];
  publishDate: string;
  isoDate: string;
  readTime: number;
  content?: unknown;
  meta?: { title?: string | null; description?: string | null };
  updatedAt?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  featuredOnHome?: boolean;
}

export interface FaqGroup {
  title: string;
  items: FaqItem[];
}

export interface Testimonial {
  id: string;
  quote: string;
  authorName: string;
  roleAndCompany: string;
  location: string;
  approved: boolean;
}
