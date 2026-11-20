import type { Payload } from 'payload';
import {
  seedFaqs,
  seedNewsletters,
  seedProjects,
  seedServices,
  seedTestimonials,
} from './collections';
import { seedForms } from './forms';
import { seedNavigationAndFooter, seedSettings } from './globals';
import { seedPages } from './pages';
import type { SeedReport } from './types';
import { wipeSearchIndex, wipeSeedCollections } from './wipe';

export class PayloadSeeder {
  private readonly report: SeedReport = {
    services: 0,
    projects: 0,
    newsletter: 0,
    faqs: 0,
    testimonials: 0,
    pages: 0,
    forms: 0,
    seededAt: new Date().toISOString(),
  };

  constructor(private readonly payload: Payload) {}

  async run(): Promise<SeedReport> {
    await wipeSeedCollections(this.payload);
    await wipeSearchIndex(this.payload);

    await seedSettings(this.payload);
    const forms = await seedForms(this.payload);
    this.report.forms = forms.count;

    this.report.pages = await seedPages(this.payload, forms.contactFormId);
    this.report.services = await seedServices(this.payload);
    this.report.projects = await seedProjects(this.payload);
    this.report.newsletter = await seedNewsletters(this.payload);
    this.report.faqs = await seedFaqs(this.payload);
    this.report.testimonials = await seedTestimonials(this.payload);

    await seedNavigationAndFooter(this.payload);

    return this.report;
  }
}

export function seedAllPayloadData(payload: Payload): Promise<SeedReport> {
  return new PayloadSeeder(payload).run();
}
