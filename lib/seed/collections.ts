import type { Payload } from 'payload';
import { FAQ_GROUPS } from '@/data/faqs';
import { NEWSLETTERS } from '@/data/newsletters';
import { PROJECTS } from '@/data/projects';
import { SERVICES } from '@/data/services';
import { TESTIMONIALS } from '@/data/testimonials';
import { sectionsToLexical } from './lexical';

export async function seedServices(payload: Payload): Promise<number> {
  for (const [index, service] of SERVICES.entries()) {
    await payload.create({
      collection: 'services',
      data: {
        slug: service.slug,
        sortOrder: index + 1,
        title: service.title,
        short: service.short,
        metaDescription: service.metaDescription,
        intro: service.intro,
        overview: service.overview.map((text) => ({ text })),
        included: service.included.map((text) => ({ text })),
        forWho: service.forWho.map((text) => ({ text })),
        steps: service.steps.map((step) => ({
          title: step.title,
          description: step.description,
        })),
      },
      overrideAccess: true,
    });
  }

  return SERVICES.length;
}

export async function seedProjects(payload: Payload): Promise<number> {
  for (const [index, project] of PROJECTS.entries()) {
    await payload.create({
      collection: 'projects',
      data: {
        slug: project.slug,
        sortOrder: index + 1,
        title: project.title,
        type: project.type,
        tags: project.tags.map((tag) => ({ tag })),
        role: project.role,
        summary: project.summary,
        challenge: project.challenge,
        approach: project.approach,
        outcomes: project.outcomes.map((text) => ({ text })),
      },
      overrideAccess: true,
    });
  }

  return PROJECTS.length;
}

export async function seedNewsletters(payload: Payload): Promise<number> {
  for (const [index, newsletter] of NEWSLETTERS.entries()) {
    await payload.create({
      collection: 'newsletter',
      data: {
        slug: newsletter.slug,
        sortOrder: index + 1,
        title: newsletter.title,
        excerpt: newsletter.excerpt,
        category: newsletter.category,
        tags: newsletter.tags.map((tag) => ({ tag })),
        publishDate: newsletter.publishDate,
        isoDate: newsletter.isoDate,
        readTime: newsletter.readTime,
        content: sectionsToLexical(newsletter.sections),
        _status: 'published' as const,
      },
      overrideAccess: true,
    });
  }

  return NEWSLETTERS.length;
}

export async function seedFaqs(payload: Payload): Promise<number> {
  let sortOrder = 1;

  for (const group of FAQ_GROUPS) {
    for (const item of group.items) {
      await payload.create({
        collection: 'faqs',
        data: {
          keyId: item.id,
          sortOrder: sortOrder++,
          groupTitle: group.title as
            | 'Getting started'
            | 'Working with us from anywhere'
            | 'Building your site'
            | 'After launch',
          question: item.question,
          answer: item.answer,
          featuredOnHome: Boolean(item.featuredOnHome),
        },
        overrideAccess: true,
      });
    }
  }

  return FAQ_GROUPS.reduce((total, group) => total + group.items.length, 0);
}

export async function seedTestimonials(payload: Payload): Promise<number> {
  for (const testimonial of TESTIMONIALS) {
    await payload.create({
      collection: 'testimonials',
      data: {
        keyId: testimonial.id,
        quote: testimonial.quote,
        authorName: testimonial.authorName,
        roleAndCompany: testimonial.roleAndCompany,
        location: testimonial.location,
        approved: testimonial.approved,
      },
      overrideAccess: true,
    });
  }

  return TESTIMONIALS.length;
}
