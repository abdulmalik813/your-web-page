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
import { NEWSLETTERS } from '@/data/newsletters';
import { SERVICES } from '@/data/services';
import { TESTIMONIALS } from '@/data/testimonials';
import type { Newsletter } from '@/payload-types';

// ─── Lexical helpers ──────────────────────────────────────────────────────────
interface NewsletterSection {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
}

type LexicalNode = Newsletter['content']['root']['children'][number];
type LexicalTextNode = Extract<LexicalNode, { type: 'text' }>;
type LexicalParagraphNode = Extract<LexicalNode, { type: 'paragraph' }>;
type LexicalHeadingNode = Extract<LexicalNode, { type: 'heading' }>;
type LexicalListNode = Extract<LexicalNode, { type: 'list' }>;
type LexicalListItemNode = Extract<LexicalNode, { type: 'listitem' }>;

function lexicalText(text: string): LexicalTextNode {
  return { type: 'text', text, format: 0, style: '', mode: 'normal', detail: 0, version: 1 };
}

function lexicalParagraph(...children: LexicalNode[]): LexicalParagraphNode {
  return { type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textStyle: '', textFormat: 0, children };
}

function lexicalHeading(tag: 'h2' | 'h3' | 'h4', text: string): LexicalHeadingNode {
  return { type: 'heading', tag, format: '', indent: 0, version: 1, direction: 'ltr', children: [lexicalText(text)] };
}

function lexicalBulletList(items: string[]): LexicalListNode {
  return {
    type: 'list',
    listType: 'bullet',
    tag: 'ul',
    format: '',
    indent: 0,
    version: 1,
    start: 1,
    direction: 'ltr',
    children: items.map((text, i): LexicalListItemNode => ({
      type: 'listitem',
      value: i + 1,
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: [lexicalText(text)],
    })),
  };
}

function sectionsToLexical(sections: NewsletterSection[]): Newsletter['content'] {
  const children: LexicalNode[] = sections.flatMap((section) => {
    const nodes: LexicalNode[] = [];
    if (section.heading) nodes.push(lexicalHeading('h2', section.heading));
    for (const para of section.paragraphs ?? []) nodes.push(lexicalParagraph(lexicalText(para)));
    if (section.bullets?.length) nodes.push(lexicalBulletList(section.bullets));
    return nodes;
  });
  // Always have at least one paragraph so Lexical doesn't reject an empty root
  if (!children.length) children.push(lexicalParagraph(lexicalText('')));
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children,
    },
  };
}

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

export async function getPayloadSeedStatus(payload: Payload): Promise<SeedStatus> {
  const [services, projects, newsletter, faqs, testimonials, pages, forms] =
    await Promise.all([
      payload.count({ collection: 'services', overrideAccess: true }),
      payload.count({ collection: 'projects', overrideAccess: true }),
      payload.count({ collection: 'newsletter', overrideAccess: true }),
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
      newsletter: newsletter.totalDocs,
      faqs: faqs.totalDocs,
      testimonials: testimonials.totalDocs,
      pages: pages.totalDocs,
      forms: forms.totalDocs,
    },
    totals: {
      services: SERVICES.length,
      projects: PROJECTS.length,
      newsletter: NEWSLETTERS.length,
      faqs: faqCount,
      testimonials: TESTIMONIALS.length,
      pages: 12,
      forms: 1,
    },
  };
}

type SeedableCollection =
  | 'form-submissions'
  | 'forms'
  | 'pages'
  | 'services'
  | 'projects'
  | 'newsletter'
  | 'faqs'
  | 'testimonials';

/** Delete every document in a seeded collection so the seed always rebuilds clean. */
async function wipeCollection(payload: Payload, collection: SeedableCollection): Promise<number> {
  const existing = await payload.find({
    collection,
    limit: 1000,
    pagination: false,
    depth: 0,
    overrideAccess: true,
  });
  for (const doc of existing.docs as { id: string | number }[]) {
    await payload.delete({ collection, id: doc.id, overrideAccess: true });
  }
  return existing.docs.length;
}


async function wipeSearchIndex(payload: Payload): Promise<void> {
  const results = await payload.find({ collection: 'search', limit: 1000, pagination: false, overrideAccess: true });
  for (const doc of results.docs) {
    await payload.delete({ collection: 'search', id: doc.id, overrideAccess: true });
  }
}

export async function seedAllPayloadData(payload: Payload): Promise<SeedReport> {
  // The seed is the source of truth. Clear the seeded collections first so
  // re-seeding never leaves stale pages, drafts or duplicate slugs behind.
  for (const collection of [
    'form-submissions',
    'pages',
    'services',
    'projects',
    'newsletter',
    'faqs',
    'testimonials',
    'forms',
  ] as const) {
    await wipeCollection(payload, collection);
  }
  await wipeSearchIndex(payload);

  const report: SeedReport = {
    services: 0,
    projects: 0,
    newsletter: 0,
    faqs: 0,
    testimonials: 0,
    pages: 0,
    forms: 0,
    seededAt: new Date().toISOString(),
  };

  await payload.updateGlobal({
    slug: 'settings',
    data: {
      brand: COMPANY.brand,
      shortMark: COMPANY.shortMark,
      domain: COMPANY.domain,
      meta: {
        title: 'Web design, development and care in Charlottetown, PEI',
        description:
          'Your Web Page designs and builds fast websites, online stores and custom software from Charlottetown, Prince Edward Island. Fixed scope, clean code and direct support from the people doing the work.',
      },
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

  const contactFieldRow = (label: string, value: string) =>
    `<tr><td style="padding:10px 14px;border-top:1px solid #e5e5e5;background:#fafafa;width:140px;font-family:'Courier New',monospace;font-size:11px;font-weight:bold;letter-spacing:0.08em;text-transform:uppercase;color:#525252;vertical-align:top;">${label}</td><td style="padding:10px 14px;border-top:1px solid #e5e5e5;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#111111;">${value}</td></tr>`;

  const contactAdminHtml = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>New website enquiry</title></head>
<body style="margin:0;padding:0;background:#f4f4f4;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f4f4f4;"><tr><td align="center" style="padding:24px 12px;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:640px;background:#ffffff;border:1px solid #000000;">
      <tr><td style="padding:20px 30px;border-bottom:1px solid #000000;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;letter-spacing:0.08em;text-transform:uppercase;">${COMPANY.brand}</td></tr>
      <tr><td style="padding:30px;background:#fff7ed;border-bottom:1px solid #000000;">
        <p style="margin:0 0 10px;color:#9a3412;font-family:'Courier New',monospace;font-size:12px;font-weight:bold;letter-spacing:0.1em;text-transform:uppercase;">New website enquiry</p>
        <h1 style="margin:0;font-family:Georgia,serif;font-size:30px;font-weight:normal;line-height:1.15;letter-spacing:-0.02em;color:#000000;">{{name}}</h1>
        <p style="margin:10px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#525252;">Submitted {{now}}</p>
      </td></tr>
      <tr><td style="padding:26px 30px 30px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border:1px solid #e5e5e5;border-collapse:collapse;">
          ${contactFieldRow('Name', '{{name}}')}
          ${contactFieldRow('Email', '<a href="mailto:{{email}}" style="color:#9a3412;">{{email}}</a>')}
          {{#if phone}}${contactFieldRow('Phone', '{{phone}}')}{{/if}}
          ${contactFieldRow('Project type', '{{type}}')}
        </table>
        <h2 style="margin:26px 0 10px;font-family:Georgia,serif;font-size:20px;font-weight:normal;color:#000000;">Message</h2>
        <div style="border-left:4px solid #f97316;padding:4px 0 4px 16px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.7;color:#262626;white-space:pre-wrap;">{{message}}</div>
        <p style="margin:26px 0 0;"><a href="mailto:{{email}}" style="display:inline-block;background:#f97316;color:#000000;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;text-decoration:none;padding:13px 20px;">Reply to {{name}}</a></p>
      </td></tr>
      <tr><td style="padding:20px 30px;border-top:1px solid #000000;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#525252;">Sent from the contact form at <a href="${COMPANY.url}" style="color:#262626;">${COMPANY.domain}</a>.</td></tr>
    </table>
  </td></tr></table>
</body></html>`;

  const contactCustomerHtml = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Thanks for getting in touch</title></head>
<body style="margin:0;padding:0;background:#f4f4f4;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f4f4f4;"><tr><td align="center" style="padding:24px 12px;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:640px;background:#ffffff;border:1px solid #000000;">
      <tr><td style="padding:20px 30px;border-bottom:1px solid #000000;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;letter-spacing:0.08em;text-transform:uppercase;">${COMPANY.brand}</td></tr>
      <tr><td style="padding:30px;background:#fff7ed;border-bottom:1px solid #000000;">
        <p style="margin:0 0 10px;color:#9a3412;font-family:'Courier New',monospace;font-size:12px;font-weight:bold;letter-spacing:0.1em;text-transform:uppercase;">Message received</p>
        <h1 style="margin:0;font-family:Georgia,serif;font-size:30px;font-weight:normal;line-height:1.15;letter-spacing:-0.02em;color:#000000;">Thanks for getting in touch, {{name}}</h1>
      </td></tr>
      <tr><td style="padding:26px 30px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.7;color:#262626;">
        <p style="margin:0 0 16px;">We have your message and will reply within one business day. If anything changes in the meantime, just reply to this email and it will reach us directly.</p>
        <h2 style="margin:26px 0 10px;font-family:Georgia,serif;font-size:20px;font-weight:normal;color:#000000;">What you sent us</h2>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border:1px solid #e5e5e5;border-collapse:collapse;">
          ${contactFieldRow('Project type', '{{type}}')}
          {{#if phone}}${contactFieldRow('Phone', '{{phone}}')}{{/if}}
        </table>
        <div style="margin-top:18px;border-left:4px solid #f97316;padding:4px 0 4px 16px;white-space:pre-wrap;">{{message}}</div>
        <p style="margin:26px 0 0;">You can also call us on ${COMPANY.phone} or email <a href="mailto:${COMPANY.email}" style="color:#9a3412;">${COMPANY.email}</a>.</p>
        <p style="margin:22px 0 0;">— ${COMPANY.brand}, ${COMPANY.location.summary}</p>
      </td></tr>
      <tr><td style="padding:20px 30px;border-top:1px solid #000000;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#525252;">This is an automated confirmation of your message. Replies go to <a href="mailto:${COMPANY.email}" style="color:#262626;">${COMPANY.email}</a>.</td></tr>
    </table>
  </td></tr></table>
</body></html>`;

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
  ];

  let contactFormId: string | number | null = null;

  for (const form of formSeed) {
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
              text: 'Thanks. We will reply within one business day.',
              version: 1,
            }],
          }],
        },
      },
      fields: form.fields,
      emails: [
        {
          emailTo: COMPANY.email,
          // Replies go to the customer, even though the email is sent from the site's default address.
          replyTo: '{{email}}',
          emailFrom: '',
          subject: `New website enquiry — {{name}}`,
          messageType: 'html',
          htmlMessage: contactAdminHtml,
        },
        {
          emailTo: '{{email}}',
          // Replies go to the site inbox, even though the email is sent from the site's default address.
          replyTo: COMPANY.email,
          emailFrom: '',
          subject: `Thanks for getting in touch — ${COMPANY.brand}`,
          messageType: 'html',
          htmlMessage: contactCustomerHtml,
        },
      ],
    };
    const created = await payload.create({ collection: 'forms', data, overrideAccess: true });
    report.forms += 1;
    if (form.title === 'Contact') contactFormId = created.id;
  }

  const initialPages: any[] = [
    { slug: 'home', title: 'Home', layout: [
        { blockType: 'hero', eyebrow: 'Web studio · Based in Charlottetown, Canada', title: 'Websites, software & SaaS.', highlight: 'Built properly.', lead: 'Your Web Page designs and builds websites, online stores and custom software from Charlottetown. You work directly with the people doing the work: fixed scope in writing, clean code, and a phone number that reaches someone on the Island.', primaryLink: { type: 'external', url: '/contact', label: 'Start a project' }, secondaryLink: { type: 'external', url: '/our-work', label: 'See our work' }, facts: [{ text: 'Based in Charlottetown, PEI' }, { text: 'Clients across Canada & worldwide' }, { text: 'Remote-first, in person on the Island' }] },
        { blockType: 'cardGrid', eyebrow: '01 — Services', heading: 'What we build', source: 'services', limit: 6 },
        { blockType: 'cardGrid', eyebrow: '02 — Selected work', heading: 'Recent projects', source: 'projects', limit: 3 },
        { blockType: 'cardGrid', eyebrow: '03 — How we work', heading: 'Four steps, no surprises', source: 'custom', cards: HOME_PROCESS_STEPS.map((step) => ({ number: step.number, title: step.title, description: step.description })) },
        { blockType: 'content', eyebrow: '04 — Local roots, global reach', heading: 'Based in Charlottetown. Working worldwide.', content: { root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children: [{ type: 'paragraph', version: 1, children: [{ type: 'text', text: 'We know Island businesses inside out, from busy summers to quiet winters. We also work remote-first, with video calls, private previews and clear written updates, so clients anywhere get the same hands-on service.', version: 1 }] }] } }, columns: 'two' },
        { blockType: 'cardGrid', eyebrow: 'What clients say', heading: 'In their words', source: 'testimonials', limit: 3 },
        { blockType: 'cardGrid', eyebrow: '05 — Newsletters', heading: 'Useful reading', source: 'newsletter', limit: 3 },
        { blockType: 'cardGrid', eyebrow: 'FAQ', heading: 'Quick answers', source: 'faqs', limit: 4 },
        { blockType: 'cta', eyebrow: 'Start here', title: 'Have a project in mind?', text: 'Tell us what you are building. We will come back with questions, ideas and a clear plan.', primaryLink: { type: 'external', url: '/contact', label: 'Start a project' } },
      ] },
    { slug: 'about', title: 'About', layout: [{ blockType: 'hero', eyebrow: 'About', title: 'A Charlottetown web studio', lead: 'A small studio in Charlottetown, building websites, stores and custom software since 2019.' }, { blockType: 'content', eyebrow: 'The studio', heading: 'Small team, direct contact', content: sectionsToLexical([
          { paragraphs: [
            'Most of our work comes from referrals: a plumber who saw a competitor’s site, a retailer tired of reconciling stock by hand, a founder who needs a first version of an app built properly. We take on a handful of projects at a time so the person you meet is the person writing the code.',
            'We build with Next.js, TypeScript and Payload, and we keep a short list of tools we know well rather than chasing whatever shipped last month. Every project ends with the domain, hosting and repository in your name, whether or not you stay on a care plan.',
          ] },
        ]), columns: 'two' }, { blockType: 'cardGrid', source: 'custom', cards: ABOUT_VALUES.map((item) => ({ number: item.number, title: item.title, description: item.description })) }] },
    { slug: 'process', title: 'Process', layout: [{ blockType: 'hero', eyebrow: 'Process', title: 'How we work', lead: 'Five stages, plain language at every step, and no surprises.' }, { blockType: 'cardGrid', source: 'custom', cards: PROCESS_STAGES.map((item) => ({ number: item.number, title: item.title, description: item.whatHappens })) }] },
    { slug: 'where-we-work', title: 'Where We Work', layout: [{ blockType: 'hero', eyebrow: 'Where we work', title: 'Charlottetown-based. Working worldwide.', lead: 'Local roots, remote-first working.' }, { blockType: 'cardGrid', source: 'custom', cards: REGION_TIERS.map((item) => ({ number: item.number, title: item.title, description: `${item.subtitle} — ${item.description}` })) }, { blockType: 'cardGrid', eyebrow: 'Remote work', heading: 'How a remote project actually runs', source: 'custom', cards: REMOTE_PRACTICES.map((item) => ({ number: item.number, title: item.title, description: item.description })) }] },
    { slug: 'testimonials', title: 'Testimonials', layout: [
        { blockType: 'hero', eyebrow: 'Client Feedback', title: 'What our clients say about working with us', lead: 'Real feedback and honest words from founders, executives, and product leaders who trusted us with their websites and applications.', facts: [{ text: '100% verified client reviews' }, { text: 'Partnerships across North America' }, { text: 'Long-term ongoing care' }] },
        { blockType: 'testimonials', eyebrow: 'What clients say', heading: 'In their words', limit: 12 },
        { blockType: 'cta', eyebrow: 'Start here', title: 'Have a project in mind?', text: 'Tell us what you are building. We will come back with questions, ideas and a clear plan.', primaryLink: { type: 'external', url: '/contact', label: 'Start a project' } },
      ] },
    { slug: 'services', title: 'Services', layout: [{ blockType: 'hero', eyebrow: 'Services', title: 'Everything your website needs', lead: 'Design, development, online stores, custom software and ongoing care.' }, { blockType: 'cardGrid', source: 'services', limit: 50 }, { blockType: 'cardGrid', eyebrow: 'Who we build for', heading: 'Businesses we know well', source: 'custom', cards: SECTORS.map((item) => ({ number: item.number, title: item.title, description: item.description })) }] },
    { slug: 'our-work', title: 'Our Work', layout: [{ blockType: 'hero', eyebrow: 'Our work', title: 'Websites, software and products', lead: 'A selection of the kinds of projects we build.' }, { blockType: 'cardGrid', source: 'projects', limit: 50 }] },
    { slug: 'newsletters', title: 'Newsletters', layout: [{ blockType: 'hero', eyebrow: 'Newsletters', title: 'Newsletters', lead: 'Practical reading for anyone planning, building or looking after a website.' }] },
    { slug: 'faq', title: 'FAQ', layout: [{ blockType: 'hero', eyebrow: 'FAQ', title: 'Questions, answered', lead: 'Cannot find what you are looking for? Get in touch.' }, { blockType: 'cardGrid', source: 'faqs', limit: 100 }] },
    { slug: 'contact', title: 'Contact', layout: [
        { blockType: 'hero', eyebrow: 'Contact', title: "Let's talk", lead: 'Tell us a little about what you are working on.' },
        { blockType: 'cardGrid', eyebrow: 'Get in touch', heading: 'Contact us your way', source: 'custom', cards: [
          { title: 'Email', description: `Send your questions or project ideas to ${COMPANY.email}.`, link: { type: 'external', url: `mailto:${COMPANY.email}` } },
          { title: 'Phone', description: `Prefer to talk? Call us at ${COMPANY.phone}.`, link: { type: 'external', url: COMPANY.phoneHref } },
          { title: 'Where we work', description: `${COMPANY.reach.summary} ${COMPANY.reach.workingStyle}` },
        ] },
        { blockType: 'form', eyebrow: 'Contact form', heading: 'Send us a message' },
        { blockType: 'cardGrid', eyebrow: 'Getting started', heading: 'What to include in your message', source: 'custom', cards: [
          { title: 'Your goals', description: 'Tell us about your business or organization, what you are working on and what you would like to achieve.' },
          { title: 'Your project', description: 'Share a link to your current site, features you have in mind, or examples you like. It is fine if you are not sure yet.' },
          { title: 'Timing and budget', description: 'If you have a target date or a budget range, include them so we can discuss a suitable approach.' },
        ] },
        { blockType: 'content', eyebrow: 'Next steps', heading: 'What happens after you reach out', content: sectionsToLexical([
          { paragraphs: ['We will review your message and follow up with any questions needed to understand your goals. You do not need finished designs or copy to start the conversation.', 'Every project is scoped individually. Before work starts, we will provide a written plan covering the scope and next steps.'] },
        ]) },
      ] },
    { slug: 'privacy', title: 'Privacy Policy', layout: [{ blockType: 'hero', eyebrow: 'Legal', title: 'Privacy Policy', lead: 'How personal information is handled.' }, { blockType: 'legal', sections: PRIVACY_SECTIONS.map((section) => ({ heading: section.heading, paragraphs: (section.paragraphs || []).map((text) => ({ text })), bullets: (section.bullets || []).map((text) => ({ text })) })) }] },
    { slug: 'terms', title: 'Terms of Service', layout: [{ blockType: 'hero', eyebrow: 'Legal', title: 'Terms of Service', lead: 'Terms for using this website and services.' }, { blockType: 'legal', sections: TERMS_SECTIONS.map((section) => ({ heading: section.heading, paragraphs: (section.paragraphs || []).map((text) => ({ text })), bullets: (section.bullets || []).map((text) => ({ text })) })) }] },
  ];

  for (const page of initialPages) {
    const layout = page.layout.map((block: any) =>
      block.blockType === 'form' && contactFormId ? { ...block, form: contactFormId } : block,
    );
    await payload.create({ collection: 'pages', data: { ...page, layout, _status: 'published' }, overrideAccess: true });
    report.pages += 1;
  }

  for (const [index, service] of SERVICES.entries()) {
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

    await payload.create({
      collection: 'services',
      data,
      overrideAccess: true,
    });
    report.services += 1;
  }

  for (const [index, project] of PROJECTS.entries()) {
    const data = {
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
    };

    await payload.create({
      collection: 'projects',
      data,
      overrideAccess: true,
    });
    report.projects += 1;
  }

  for (const [index, newsletter] of NEWSLETTERS.entries()) {
    const data = {
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
    };

    await payload.create({
      collection: 'newsletter',
      data,
      overrideAccess: true,
    });
    report.newsletter += 1;
  }

  let faqSortOrder = 1;
  for (const group of FAQ_GROUPS) {
    for (const item of group.items) {
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

      await payload.create({
        collection: 'faqs',
        data,
        overrideAccess: true,
      });
      report.faqs += 1;
    }
  }

  for (const testimonial of TESTIMONIALS) {
    const data = {
      keyId: testimonial.id,
      quote: testimonial.quote,
      authorName: testimonial.authorName,
      roleAndCompany: testimonial.roleAndCompany,
      location: testimonial.location,
      approved: testimonial.approved,
    };

    await payload.create({
      collection: 'testimonials',
      data,
      overrideAccess: true,
    });
    report.testimonials += 1;
  }

  const [pageDocs, serviceDocs] = await Promise.all([
    payload.find({ collection: 'pages', limit: 1000, pagination: false, overrideAccess: true }),
    payload.find({ collection: 'services', limit: 1000, pagination: false, overrideAccess: true }),
  ]);

  const pageItem = (slug: string, label?: string) => {
    const doc = pageDocs.docs.find((candidate: any) => candidate.slug === slug);
    return doc
      ? { link: { type: 'internal' as const, internal: { relationTo: 'pages' as const, value: String(doc.id) }, label: label ?? doc.title } }
      : null;
  };

  const serviceItem = (slug: string, label?: string) => {
    const doc = serviceDocs.docs.find((candidate: any) => candidate.slug === slug);
    return doc
      ? { link: { type: 'internal' as const, internal: { relationTo: 'services' as const, value: String(doc.id) }, label: label ?? doc.title } }
      : null;
  };

  const present = <T,>(items: (T | null)[]): T[] => items.filter((item): item is T => Boolean(item));

  const servicesNavItem = pageItem('services', 'Services');
  const servicesDropdownItems = present(
    SERVICES.map((service) => serviceItem(service.slug, service.title)),
  );

  await payload.updateGlobal({
    slug: 'navigation',
    data: {
      items: present([
        servicesNavItem
          ? {
              ...servicesNavItem,
              dropdownEyebrow: 'Services',
              dropdownHeading: 'Websites, stores and software, built by the people you talk to.',
              dropdownCtaLabel: 'Explore all services',
              children: servicesDropdownItems,
            }
          : null,
        pageItem('our-work', 'Our Work'),
        pageItem('process', 'Process'),
        pageItem('testimonials', 'Testimonials'),
        pageItem('newsletters', 'Newsletters'),
        pageItem('about', 'About'),
      ]),
    },
    overrideAccess: true,
  });

  await payload.updateGlobal({
    slug: 'footer',
    data: {
      tagline: `Websites, software and SaaS, built in ${COMPANY.location.city}, ${COMPANY.location.province}, for clients worldwide.`,
      columns: [
        { label: 'Services', items: present(SERVICES.map((service) => serviceItem(service.slug, service.title))) },
        { label: 'Company', items: present(['about', 'our-work', 'process', 'where-we-work', 'testimonials', 'newsletters', 'faq'].map((slug) => pageItem(slug))) },
        { label: 'Get in touch', items: present(['contact', 'privacy', 'terms'].map((slug) => pageItem(slug))) },
      ],
    },
    overrideAccess: true,
  });

  return report;
}
