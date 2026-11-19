import type { Payload } from 'payload';
import { COMPANY } from '@/data/company';
import { FAQ_GROUPS } from '@/data/faqs';
import {
  ABOUT_VALUES,
  HOME_PROCESS_STEPS,
  PRIVACY_SECTIONS,
  PROCESS_STAGES,
  REGION_TIERS,
  REMOTE_PRACTICES,
  SECTORS,
  TERMS_SECTIONS,
} from '@/data/pages';
import { PROJECTS } from '@/data/projects';
import { RESOURCES } from '@/data/resources';
import { SERVICES } from '@/data/services';
import { TESTIMONIALS } from '@/data/testimonials';

export interface SeedCollectionStats {
  created: number;
  updated: number;
}

export interface SeedReport {
  services: SeedCollectionStats;
  projects: SeedCollectionStats;
  resources: SeedCollectionStats;
  faqs: SeedCollectionStats;
  testimonials: SeedCollectionStats;
  pages: SeedCollectionStats;
  forms: SeedCollectionStats;
  seededAt: string;
}

export interface SeedStatus {
  counts: {
    services: number;
    projects: number;
    resources: number;
    faqs: number;
    testimonials: number;
    pages: number;
    forms: number;
  };
  totals: {
    services: number;
    projects: number;
    resources: number;
    faqs: number;
    testimonials: number;
    pages: number;
    forms: number;
  };
  seededAt: string | null;
}

export async function getPayloadSeedStatus(payload: Payload): Promise<SeedStatus> {
  const [services, projects, resources, faqs, testimonials, pages, forms] =
    await Promise.all([
      payload.count({ collection: 'services', overrideAccess: true }),
      payload.count({ collection: 'projects', overrideAccess: true }),
      payload.count({ collection: 'resources', overrideAccess: true }),
      payload.count({ collection: 'faqs', overrideAccess: true }),
      payload.count({ collection: 'testimonials', overrideAccess: true }),
      payload.count({ collection: 'pages', overrideAccess: true }),
      payload.count({ collection: 'forms', overrideAccess: true }),
    ]);

  const faqCount = FAQ_GROUPS.reduce((sum, group) => sum + group.items.length, 0);
  return {
    counts: {
      services: services.totalDocs,
      projects: projects.totalDocs,
      resources: resources.totalDocs,
      faqs: faqs.totalDocs,
      testimonials: testimonials.totalDocs,
      pages: pages.totalDocs,
      forms: forms.totalDocs,
    },
    totals: {
      services: SERVICES.length,
      projects: PROJECTS.length,
      resources: RESOURCES.length,
      faqs: faqCount,
      testimonials: TESTIMONIALS.length,
      pages: 12,
      forms: 2,
    },
    seededAt: null,
  };
}

export async function seedAllPayloadData(payload: Payload): Promise<SeedReport> {
  const report: SeedReport = {
    services: { created: 0, updated: 0 },
    projects: { created: 0, updated: 0 },
    resources: { created: 0, updated: 0 },
    faqs: { created: 0, updated: 0 },
    testimonials: { created: 0, updated: 0 },
    pages: { created: 0, updated: 0 },
    forms: { created: 0, updated: 0 },
    seededAt: new Date().toISOString(),
  };

  await payload.updateGlobal({
    slug: 'settings',
    data: {
      brand: COMPANY.brand,
      shortMark: COMPANY.shortMark,
      domain: COMPANY.domain,
      email: COMPANY.email,
      phone: COMPANY.phone,
      phoneHref: COMPANY.phoneHref,
      schemaTelephone: COMPANY.schemaTelephone,
      location: {
        city: COMPANY.location.city,
        province: COMPANY.location.province,
        provinceCode: COMPANY.location.provinceCode,
        country: COMPANY.location.country,
        countryCode: COMPANY.location.countryCode,
        summary: COMPANY.location.summary,
      },
      legal: {
        entity: COMPANY.legal.entity,
        tradeNameStatement: COMPANY.legal.tradeNameStatement,
        copyrightHolder: COMPANY.legal.copyrightHolder,
      },
      areaServed: COMPANY.reach.areaServed.map((label) => ({ label })),
      social: COMPANY.social,
    },
    overrideAccess: true,
  });

  await payload.updateGlobal({
    slug: 'navigation',
    data: {
      homeLabel: 'Home',
      contactLabel: 'Contact',
      contactHref: '/contact',
      projectLabel: 'Start a project',
      projectHref: '/start-a-project',
      items: [
        { label: 'Services', href: '/services' },
        { label: 'Our Work', href: '/our-work' },
        { label: 'Process', href: '/process' },
        { label: 'Resources', href: '/resources' },
        { label: 'About', href: '/about' },
      ],
    },
    overrideAccess: true,
  });

  await payload.updateGlobal({
    slug: 'footer',
    data: {
      tagline: `Websites, software and SaaS, built in ${COMPANY.location.city}, ${COMPANY.location.province}, for clients worldwide.`,
      columns: [
        { label: 'Services', items: SERVICES.map((service) => ({ label: service.title, href: `/services/${service.slug}` })) },
        { label: 'Company', items: [
          { label: 'About', href: '/about' },
          { label: 'Our Work', href: '/our-work' },
          { label: 'Our Process', href: '/process' },
          { label: 'Where We Work', href: '/where-we-work' },
          { label: 'Resources', href: '/resources' },
          { label: 'FAQ', href: '/faq' },
        ] },
        { label: 'Get in touch', items: [
          { label: 'Contact', href: '/contact' },
          { label: 'Start a Project', href: '/start-a-project' },
          { label: 'Privacy Policy', href: '/privacy' },
          { label: 'Terms of Service', href: '/terms' },
        ] },
      ],
    },
    overrideAccess: true,
  });

  const formSeed = [
    {
      title: 'Contact',
      buttonLabel: 'Send message',
      fields: [
        { name: 'name', label: 'Your name', blockType: 'text', required: true, width: 50 },
        { name: 'email', label: 'Email', blockType: 'email', required: true, width: 50 },
        { name: 'phone', label: 'Phone (optional)', blockType: 'text', required: false, width: 50 },
        { name: 'type', label: 'Project type', blockType: 'select', required: true, width: 50, options: [{ label: 'Website', value: 'Website' }, { label: 'E-commerce', value: 'E-commerce' }, { label: 'SaaS or software', value: 'SaaS or software' }, { label: 'Care & Support', value: 'Care & Support' }, { label: 'Not sure yet', value: 'Not sure yet' }] },
        { name: 'message', label: 'Message', blockType: 'textarea', required: true, width: 100 },
      ],
    },
    {
      title: 'Start a Project',
      buttonLabel: 'Submit project details',
      fields: [
        { name: 'biz', label: 'Business name', blockType: 'text', required: true, width: 50 },
        { name: 'yname', label: 'Your name', blockType: 'text', required: true, width: 50 },
        { name: 'email', label: 'Email', blockType: 'email', required: true, width: 50 },
        { name: 'phone', label: 'Phone (optional)', blockType: 'text', required: false, width: 50 },
        { name: 'goals', label: 'Project goals', blockType: 'textarea', required: true, width: 100 },
      ],
    },
  ];

  for (const form of formSeed) {
    const existing = await payload.find({ collection: 'forms', where: { title: { equals: form.title } }, limit: 1, overrideAccess: true });
    const data: any = {
      title: form.title,
      submitButtonLabel: form.buttonLabel,
      confirmationType: 'message',
      confirmationMessage: {
        root: {
          type: 'root',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
          children: [{
            type: 'paragraph',
            version: 1,
            children: [{
              type: 'text',
              text: form.title === 'Contact'
                ? 'Thanks. We will reply within one business day.'
                : 'Thanks. We will review your project details and follow up shortly.',
              version: 1,
            }],
          }],
        },
      },
      fields: form.fields,
      emails: [{
        emailTo: COMPANY.email,
        replyTo: '{{email}}',
        emailFrom: COMPANY.email,
        subject: `${form.title} — {{name}}`,
        message: { root: { type: 'root', format: '', indent: 0, version: 1, children: [{ type: 'paragraph', version: 1, children: [{ type: 'text', text: '{{*:table}}', version: 1 }] }] } },
      }],
    };
    if (existing.docs.length) {
      await payload.update({ collection: 'forms', id: existing.docs[0].id, data, overrideAccess: true });
      report.forms.updated += 1;
    } else {
      await payload.create({ collection: 'forms', data, overrideAccess: true });
      report.forms.created += 1;
    }
  }

  const initialPages: any[] = [
    { slug: 'home', title: 'Home', layout: [
        { blockType: 'hero', eyebrow: 'Web studio · Based in Charlottetown, Canada', title: 'Websites, software & SaaS.', highlight: 'Built properly.', lead: 'Your Web Page is a Charlottetown-based company that designs and builds websites, software and SaaS products for businesses across Prince Edward Island, Canada and around the world. Clear scope, clean code and real people to talk to.', primaryLabel: 'Start a project', primaryHref: '/start-a-project', secondaryLabel: 'See our work', secondaryHref: '/our-work', facts: [{ text: 'Based in Charlottetown, PEI' }, { text: 'Clients across Canada & worldwide' }, { text: 'Remote-first, in person on the Island' }] },
        { blockType: 'cardGrid', eyebrow: '01 — Services', heading: 'What we build', source: 'services', limit: 6 },
        { blockType: 'cardGrid', eyebrow: '02 — Selected work', heading: 'Recent projects', source: 'projects', limit: 3 },
        { blockType: 'cardGrid', eyebrow: '03 — How we work', heading: 'Four steps, no surprises', source: 'custom', cards: HOME_PROCESS_STEPS.map((step) => ({ number: step.number, title: step.title, description: step.description })) },
        { blockType: 'content', eyebrow: '04 — Local roots, global reach', heading: 'Based in Charlottetown. Working worldwide.', content: { root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children: [{ type: 'paragraph', version: 1, children: [{ type: 'text', text: 'We know Island businesses inside out, from busy summers to quiet winters. We also work remote-first, with video calls, private previews and clear written updates, so clients anywhere get the same hands-on service.', version: 1 }] }] } }, columns: 'two' },
        { blockType: 'cardGrid', eyebrow: 'What clients say', heading: 'In their words', source: 'testimonials', limit: 3 },
        { blockType: 'cardGrid', eyebrow: '05 — Resources', heading: 'Useful reading', source: 'resources', limit: 3 },
        { blockType: 'cardGrid', eyebrow: 'FAQ', heading: 'Quick answers', source: 'faqs', limit: 4 },
        { blockType: 'cta', eyebrow: 'Start here', title: 'Have a project in mind?', text: 'Tell us what you are building. We will come back with questions, ideas and a clear plan.', primaryLabel: 'Start a project', primaryHref: '/start-a-project', secondaryLabel: 'Contact us', secondaryHref: '/contact' },
      ] },
    { slug: 'about', title: 'About', layout: [{ blockType: 'hero', eyebrow: 'About', title: 'A Charlottetown web studio', lead: 'We build dependable, fast websites, software and SaaS products.' }, { blockType: 'cardGrid', source: 'custom', cards: ABOUT_VALUES.map((item) => ({ number: item.number, title: item.title, description: item.description })) }] },
    { slug: 'process', title: 'Process', layout: [{ blockType: 'hero', eyebrow: 'Process', title: 'How we work', lead: 'Five stages, plain language at every step, and no surprises.' }, { blockType: 'cardGrid', source: 'custom', cards: PROCESS_STAGES.map((item) => ({ number: item.number, title: item.title, description: item.whatHappens })) }] },
    { slug: 'where-we-work', title: 'Where We Work', layout: [{ blockType: 'hero', eyebrow: 'Where we work', title: 'Charlottetown-based. Working worldwide.', lead: 'Local roots, remote-first working.' }, { blockType: 'cardGrid', source: 'custom', cards: REGION_TIERS.map((item) => ({ number: item.number, title: item.title, description: `${item.subtitle} — ${item.description}` })) }] },
    { slug: 'services', title: 'Services', layout: [{ blockType: 'hero', eyebrow: 'Services', title: 'Everything your website needs', lead: 'Design, development, online stores, custom software and ongoing care.' }, { blockType: 'cardGrid', source: 'services', limit: 50 }] },
    { slug: 'our-work', title: 'Our Work', layout: [{ blockType: 'hero', eyebrow: 'Our work', title: 'Websites, software and products', lead: 'A selection of the kinds of projects we build.' }, { blockType: 'cardGrid', source: 'projects', limit: 50 }] },
    { slug: 'resources', title: 'Resources', layout: [{ blockType: 'hero', eyebrow: 'Resources', title: 'Guides, checklists and notes', lead: 'Practical reading for anyone planning, building or looking after a website.' }] },
    { slug: 'faq', title: 'FAQ', layout: [{ blockType: 'hero', eyebrow: 'FAQ', title: 'Questions, answered', lead: 'Cannot find what you are looking for? Get in touch.' }, { blockType: 'cardGrid', source: 'faqs', limit: 100 }] },
    { slug: 'contact', title: 'Contact', layout: [{ blockType: 'hero', eyebrow: 'Contact', title: "Let's talk", lead: 'Tell us a little about what you are working on.' }, { blockType: 'form', eyebrow: 'Contact form', heading: 'Send us a message' }] },
    { slug: 'start-a-project', title: 'Start a Project', layout: [{ blockType: 'hero', eyebrow: 'Start a project', title: 'Tell us about your project', lead: 'The more we know, the better our first reply will be.' }, { blockType: 'form', eyebrow: 'Project form', heading: 'Project details' }] },
    { slug: 'privacy', title: 'Privacy Policy', layout: [{ blockType: 'hero', eyebrow: 'Legal', title: 'Privacy Policy', lead: 'How personal information is handled.' }, { blockType: 'legal', sections: PRIVACY_SECTIONS.map((section) => ({ heading: section.heading, paragraphs: (section.paragraphs || []).map((text) => ({ text })), bullets: (section.bullets || []).map((text) => ({ text })) })) }] },
    { slug: 'terms', title: 'Terms of Service', layout: [{ blockType: 'hero', eyebrow: 'Legal', title: 'Terms of Service', lead: 'Terms for using this website and services.' }, { blockType: 'legal', sections: TERMS_SECTIONS.map((section) => ({ heading: section.heading, paragraphs: (section.paragraphs || []).map((text) => ({ text })), bullets: (section.bullets || []).map((text) => ({ text })) })) }] },
  ];

  for (const page of initialPages) {
    const existing = await payload.find({ collection: 'pages', where: { slug: { equals: page.slug } }, limit: 1, overrideAccess: true });
    const formTitle = page.slug === 'contact' ? 'Contact' : page.slug === 'start-a-project' ? 'Start a Project' : null;
    const formDoc = formTitle ? await payload.find({ collection: 'forms', where: { title: { equals: formTitle } }, limit: 1, overrideAccess: true }) : null;
    const layout = page.layout.map((block: any) => block.blockType === 'form' && formDoc?.docs[0] ? { ...block, form: formDoc.docs[0].id } : block);
    const data: any = { ...page, layout, _status: 'published' };
    if (existing.docs.length) {
      await payload.update({ collection: 'pages', id: existing.docs[0].id, data, overrideAccess: true });
      report.pages.updated += 1;
    } else {
      await payload.create({ collection: 'pages', data, overrideAccess: true });
      report.pages.created += 1;
    }
  }

  for (const [index, service] of SERVICES.entries()) {
    const existing = await payload.find({
      collection: 'services',
      where: { slug: { equals: service.slug } },
      limit: 1,
      overrideAccess: true,
    });

    const data = {
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
    };

    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'services',
        id: existing.docs[0].id,
        data,
        overrideAccess: true,
      });
      report.services.updated += 1;
    } else {
      await payload.create({
        collection: 'services',
        data,
        overrideAccess: true,
      });
      report.services.created += 1;
    }
  }

  for (const [index, project] of PROJECTS.entries()) {
    const existing = await payload.find({
      collection: 'projects',
      where: { slug: { equals: project.slug } },
      limit: 1,
      overrideAccess: true,
    });

    const data = {
      slug: project.slug,
      sortOrder: index + 1,
      title: project.title,
      type: project.type,
      tags: project.tags.map((tag) => ({ tag })),
      initials: project.initials,
      pattern: project.pattern,
      role: project.role,
      summary: project.summary,
      challenge: project.challenge,
      approach: project.approach,
      outcomes: project.outcomes.map((text) => ({ text })),
    };

    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'projects',
        id: existing.docs[0].id,
        data,
        overrideAccess: true,
      });
      report.projects.updated += 1;
    } else {
      await payload.create({
        collection: 'projects',
        data,
        overrideAccess: true,
      });
      report.projects.created += 1;
    }
  }

  for (const [index, resource] of RESOURCES.entries()) {
    const existing = await payload.find({
      collection: 'resources',
      where: { slug: { equals: resource.slug } },
      limit: 1,
      overrideAccess: true,
    });

    const data = {
      slug: resource.slug,
      sortOrder: index + 1,
      title: resource.title,
      excerpt: resource.excerpt,
      category: resource.category,
      tags: resource.tags.map((tag) => ({ tag })),
      publishDate: resource.publishDate,
      isoDate: resource.isoDate,
      readTime: resource.readTime,
      sections: resource.sections.map((section) => ({
        heading: section.heading || '',
        paragraphs: (section.paragraphs || []).map((text) => ({ text })),
        bullets: (section.bullets || []).map((text) => ({ text })),
      })),
    };

    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'resources',
        id: existing.docs[0].id,
        data,
        overrideAccess: true,
      });
      report.resources.updated += 1;
    } else {
      await payload.create({
        collection: 'resources',
        data,
        overrideAccess: true,
      });
      report.resources.created += 1;
    }
  }

  let faqSortOrder = 1;
  for (const group of FAQ_GROUPS) {
    for (const item of group.items) {
      const existing = await payload.find({
        collection: 'faqs',
        where: { keyId: { equals: item.id } },
        limit: 1,
        overrideAccess: true,
      });

      const data = {
        keyId: item.id,
        sortOrder: faqSortOrder++,
        groupTitle: group.title as
          | 'Getting started'
          | 'Working with us from anywhere'
          | 'Building your site'
          | 'After launch',
        question: item.question,
        answer: item.answer,
        featuredOnHome: Boolean(item.featuredOnHome),
      };

      if (existing.docs.length > 0) {
        await payload.update({
          collection: 'faqs',
          id: existing.docs[0].id,
          data,
          overrideAccess: true,
        });
        report.faqs.updated += 1;
      } else {
        await payload.create({
          collection: 'faqs',
          data,
          overrideAccess: true,
        });
        report.faqs.created += 1;
      }
    }
  }

  for (const testimonial of TESTIMONIALS) {
    const existing = await payload.find({
      collection: 'testimonials',
      where: { keyId: { equals: testimonial.id } },
      limit: 1,
      overrideAccess: true,
    });

    const data = {
      keyId: testimonial.id,
      quote: testimonial.quote,
      authorName: testimonial.authorName,
      roleAndCompany: testimonial.roleAndCompany,
      location: testimonial.location,
      approved: testimonial.approved,
    };

    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'testimonials',
        id: existing.docs[0].id,
        data,
        overrideAccess: true,
      });
      report.testimonials.updated += 1;
    } else {
      await payload.create({
        collection: 'testimonials',
        data,
        overrideAccess: true,
      });
      report.testimonials.created += 1;
    }
  }

  const dedupe = async (collection: 'services' | 'projects' | 'resources' | 'faqs' | 'testimonials' | 'pages' | 'forms', key: 'slug' | 'keyId' | 'title') => {
    const result = await payload.find({ collection, limit: 1000, sort: 'createdAt', overrideAccess: true });
    const seen = new Set<string>();
    for (const doc of result.docs as any[]) {
      const value = String(doc[key] ?? '').trim();
      if (!value) continue;
      if (seen.has(value)) {
        await payload.delete({ collection, id: doc.id, overrideAccess: true });
      } else {
        seen.add(value);
      }
    }
  };

  await dedupe('services', 'slug');
  await dedupe('projects', 'slug');
  await dedupe('resources', 'slug');
  await dedupe('faqs', 'keyId');
  await dedupe('testimonials', 'keyId');
  await dedupe('pages', 'slug');
  await dedupe('forms', 'title');

  return report;
}
