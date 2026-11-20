export interface SeedReport {
  services: number;
  projects: number;
  newsletter: number;
  faqs: number;
  testimonials: number;
  pages: number;
  forms: number;
  seededAt: string;
}

export interface SeedStatus {
  counts: {
    services: number;
    projects: number;
    newsletter: number;
    faqs: number;
    testimonials: number;
    pages: number;
    forms: number;
  };
  totals: {
    services: number;
    projects: number;
    newsletter: number;
    faqs: number;
    testimonials: number;
    pages: number;
    forms: number;
  };
}
