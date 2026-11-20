import type { Payload } from 'payload';
import { COMPANY } from '@/data/company';
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
import { sectionsToLexical } from './lexical';

type PageBlueprint = { slug: string; title: string; layout: any[] };

const PAGE_BLUEPRINTS: PageBlueprint[] = [
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

export const PAGE_COUNT = PAGE_BLUEPRINTS.length;

export async function seedPages(
  payload: Payload,
  contactFormId: string | number | null,
): Promise<number> {
  let count = 0;

  for (const page of PAGE_BLUEPRINTS) {
    const layout = page.layout.map((block: any) =>
      block.blockType === 'form' && contactFormId ? { ...block, form: contactFormId } : block,
    );
    await payload.create({ collection: 'pages', data: { ...page, layout, _status: 'published' }, overrideAccess: true });
    count += 1;
  }

  return count;
}
