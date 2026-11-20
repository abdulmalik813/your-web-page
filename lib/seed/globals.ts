import type { Payload } from 'payload';
import { COMPANY } from '@/data/company';
import { SERVICES } from '@/data/services';

export async function seedSettings(payload: Payload): Promise<void> {
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
}

export async function seedNavigationAndFooter(payload: Payload): Promise<void> {
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
}
