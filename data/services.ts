export interface ServiceStep {
  title: string;
  description: string;
}

export interface Service {
  slug: string;
  title: string;
  short: string;
  metaDescription: string;
  intro: string;
  overview: string[];
  included: string[];
  forWho: string[];
  steps: ServiceStep[];
}

export const SERVICES: Service[] = [
  {
    slug: 'web-design',
    title: 'Web Design',
    short:
      'Layouts and visual identity for websites that look sharp, read clearly and turn visitors into enquiries.',
    metaDescription:
      'Custom web design in Charlottetown, PEI and across Canada: clear page hierarchy, responsive layouts and accessible typography.',
    intro:
      'Good design is mostly decisions: what goes first, what gets left out, and what a visitor should do next. We design around your business, your customers and the one or two things a visitor needs to accomplish on your site.',
    overview: [
      'A business website rarely fails because it lacked visual decoration. It fails when a visitor lands on the home page, cannot tell what the business actually does within five seconds, or cannot find a phone number or enquiry button on their phone. Our design work starts with structure and plain-language hierarchy before touching colours or typography.',
      'We design desktop, tablet and mobile layouts together rather than treating phones as an afterthought. Every heading size, contrast pair, navigation menu and form control is checked for legibility and keyboard accessibility. Whether you already have a brand guide or only an older logo that needs tidying up, we put together a cohesive visual system you can use across the entire site.',
      'Instead of handing you static pictures and disappearing, we walk through interactive prototypes with you page by page. You see how menus behave, how long real copy looks inside cards, and how visitors move from reading about a service to getting in touch. Once the design is signed off, it moves straight into build with zero guesswork.',
    ],
    included: [
      'Page layouts designed specifically for desktop, tablet and mobile screens',
      'A typography, colour and spacing system tailored to your business',
      'Logo clean-up and consistent brand graphics for web use',
      'Content structure, page hierarchy and clear calls to action',
      'Interactive clickable prototypes to review and refine before development',
      'Accessibility-minded contrast ratios, readable text sizing and focus states',
    ],
    forWho: [
      'New businesses launching their first professional web presence',
      'Established organizations whose current website looks dated or hard to use on phones',
      'Teams that need one consistent visual standard across marketing pages and web apps',
    ],
    steps: [
      {
        title: 'Review',
        description:
          'We look closely at your business, your customers, your existing site if you have one, and the websites you respect.',
      },
      {
        title: 'Sketch',
        description:
          'We map page structure and wireframes first, so layout and content decisions are settled before visual polish.',
      },
      {
        title: 'Refine',
        description:
          'We build out full designs for key pages and walk through them with you until every detail feels right.',
      },
    ],
  },
  {
    slug: 'web-development',
    title: 'Web Development',
    short:
      'Fast, secure, maintainable websites built with modern tools and clean code.',
    metaDescription:
      'Modern web development in Charlottetown, PEI: fast, mobile-first, accessible and easy-to-manage websites built cleanly.',
    intro:
      'A website should load quickly, work reliably on every device and remain easy to keep up to date. We build with modern tools and tidy code, so your site is dependable on launch day and still straightforward to change a year later.',
    overview: [
      'Too many small business sites are held together with dozens of overlapping plugins that slow pages down and break whenever an update runs. We take the opposite approach: clean semantic HTML, disciplined styling, well-structured components and only the dependencies the site genuinely needs.',
      'Performance matters in practical ways. Visitors on Prince Edward Island, rural highways or mobile data connections do not wait ten seconds for heavy scripts and oversized photographs to load. We optimize images, minimize client-side JavaScript, configure clean metadata and build mobile-first layouts that feel immediate on real phones and laptops.',
      'You stay in control of your site after launch. Where your team edits pages, announcements or resources regularly, we connect a straightforward content workflow and show you how everything works. Where a site connects to booking tools, maps, CRMs or email systems, we wire those integrations cleanly and test every edge case before going live.',
    ],
    included: [
      'Mobile-first, responsive engineering tested across real browsers and screen sizes',
      'Content management setup so your team can edit copy and entries independently',
      'Fast page loads, properly sized assets and clean Core Web Vitals',
      'Search-friendly semantic markup, canonical tags, sitemaps and structured data',
      'Contact forms, booking embeds, interactive maps and third-party API integrations',
      'Secure HTTPS hosting configuration, domain routing and automated backups',
    ],
    forWho: [
      'Businesses that want a dependable site they can update without calling a developer for every typo',
      'Organizations migrating away from a sluggish, fragile or hard-to-maintain website',
      'Teams that need custom integrations between their public site and existing business tools',
    ],
    steps: [
      {
        title: 'Plan',
        description:
          'We agree on the full page map, technical architecture, integrations and content responsibilities before writing code.',
      },
      {
        title: 'Build',
        description:
          'Development happens in clear stages on a private preview URL you can open and test on your own devices at any time.',
      },
      {
        title: 'Test',
        description:
          'Every form, redirect, link, responsive breakpoint and keyboard interaction is verified before launch day.',
      },
    ],
  },
  {
    slug: 'ecommerce',
    title: 'E-commerce Websites',
    short:
      'Online stores that are straightforward to manage and easy for customers to buy from.',
    metaDescription:
      'E-commerce website design and development for Canadian retailers and makers: clear catalogues, smooth checkout, taxes and shipping.',
    intro:
      'A good online store makes buying feel obvious. We build stores that are simple to run day to day, with clear product pages, a quick checkout and the Canadian tax, currency and shipping details set up properly from the start.',
    overview: [
      'Selling online involves much more than putting a buy button beneath a photograph. Customers need accurate stock availability, clear shipping expectations, straightforward variant selection and a checkout that works effortlessly on a phone without forcing unnecessary account creation.',
      'For Canadian businesses, getting the operational details right saves hours every week. We configure HST, GST and provincial tax rules, local pickup options around Charlottetown or your storefront, domestic Canada Post or courier shipping zones, and international shipping rules if you sell outside the country.',
      'Behind the storefront, your staff need an organized way to add products, adjust stock counts, print packing slips and refund orders when needed. We build and test end-to-end test orders covering payment capture, confirmation emails and inventory updates before a single real customer places an order.',
    ],
    included: [
      'Organized product catalogues with categories, variants, filters and search',
      'Secure payment gateway setup with card and digital wallet support',
      'Canadian tax rules, local pickup options and domestic or international shipping zones',
      'Inventory tracking, order management workflows and customer account options',
      'Automated transactional emails for order confirmations and shipping updates',
      'Thorough mobile checkout testing across common devices and payment flows',
    ],
    forWho: [
      'Retailers, makers and food producers selling across PEI, Canada or internationally',
      'Businesses expanding from in-person markets or social media orders to a proper storefront',
      'Existing online stores that have outgrown rigid templates or clunky checkout flows',
    ],
    steps: [
      {
        title: 'Map',
        description:
          'We review your product range, variants, tax requirements, pickup rules and how orders move from purchase to fulfilment.',
      },
      {
        title: 'Build',
        description:
          'We assemble the storefront, product pages, payment integration, shipping rates and order notification emails.',
      },
      {
        title: 'Test',
        description:
          'We run full sandbox orders—including shipping calculations, taxes and refunds—before opening the store to customers.',
      },
    ],
  },
  {
    slug: 'saas-software',
    title: 'SaaS & Custom Software',
    short:
      'Web applications, internal tools and subscription products built around how your business actually works.',
    metaDescription:
      'Custom web applications, internal business tools and SaaS software built in Charlottetown, PEI for teams across Canada and worldwide.',
    intro:
      'Some problems do not fit an off-the-shelf tool. We build web applications, internal operational systems and subscription SaaS products, starting with a clear scope and growing in stages so you see working software early and often.',
    overview: [
      'Many growing teams hit a ceiling where critical work lives inside fragile spreadsheets, long email threads and copy-pasted data between disconnected apps. Custom software replaces that manual friction with a single web application built around your actual workflow, permissions and terminology.',
      'If you are building a commercial SaaS product, discipline at the beginning determines whether the product ever launches. We help you narrow down the first release to the core workflow that proves value for real users, then design clean data models, authentication, role-based access control, billing and APIs that can grow smoothly without a rewrite.',
      'Software projects fail when teams disappear into months of silent coding. We work in short, predictable milestones with regular demos against a live staging environment. You click through real screens, test real workflows with your team and refine priorities based on working software rather than abstract diagrams.',
    ],
    included: [
      'Product scoping, workflow mapping and pragmatic technical architecture planning',
      'Web applications with secure authentication, user accounts and role permissions',
      'Operational dashboards, reporting views, intake portals and admin tooling',
      'Relational database design, clean APIs and automated validation',
      'Integrations with payment providers, transactional email, accounting and external APIs',
      'Production deployment, error monitoring, backups and ongoing iteration',
    ],
    forWho: [
      'Founders turning a validated business idea into a dependable first SaaS release',
      'Businesses replacing error-prone spreadsheets and manual admin processes',
      'Organizations that need specialized portals or internal tools no off-the-shelf software covers',
    ],
    steps: [
      {
        title: 'Scope',
        description:
          'We define the smallest version that solves the real problem well, separating day-one essentials from future enhancements.',
      },
      {
        title: 'Build in stages',
        description:
          'We ship working features in short cycles with regular live demos so your feedback guides each stage.',
      },
      {
        title: 'Launch and iterate',
        description:
          'We deploy cleanly to production, observe how real users work with the software and plan improvements from evidence.',
      },
    ],
  },
  {
    slug: 'care-support',
    title: 'Website Care & Support',
    short:
      'Hosting, updates, backups, security and real help when you need it.',
    metaDescription:
      'Ongoing website care, managed hosting, updates, tested backups, security monitoring and responsive support from Charlottetown, PEI.',
    intro:
      'A website is not finished on launch day. Dependencies age, browsers evolve, SSL certificates renew and businesses change what they offer. Website Care & Support keeps your site healthy and gives you a real person to contact instead of an anonymous ticket queue.',
    overview: [
      'Most website emergencies are preventable. Expired domains, neglected dependency updates, unmonitored forms that stop delivering leads, or backups that were never tested until something broke can quietly cost a business weeks of enquiries. Ongoing care treats your website as a living part of your operations rather than a static brochure left on a server.',
      'We look after managed hosting setup, DNS and SSL hygiene, routine software and security updates, uptime checks and automated backups that are periodically verified for clean restoration. When you need text updated, a seasonal schedule swapped, a new team member added or a fresh landing section built, you email or call someone who already knows your codebase.',
      'Care & Support is delivered remotely and works the exact same way whether your business is two blocks away in Charlottetown or operating in another time zone. Every engagement is tailored to what your site actually runs—from straightforward static marketing sites to full e-commerce stores and custom web applications.',
    ],
    included: [
      'Managed hosting oversight, DNS administration and automatic SSL certificate renewals',
      'Scheduled software, framework and dependency updates tested before deployment',
      'Automated off-site backups with periodic restore verification',
      'Security monitoring, uptime checks and form delivery verification',
      'Ongoing content updates, seasonal adjustments and small layout refinements',
      'Direct support by email or phone from the people who understand your site',
    ],
    forWho: [
      'Business owners who want peace of mind without managing servers or software updates themselves',
      'Organizations left with an unmaintained website built by a previous developer who moved on',
      'Teams that want a reliable technical partner on call when content changes or issues come up',
    ],
    steps: [
      {
        title: 'Audit',
        description:
          'We review your current hosting, domain settings, codebase, backups and security posture to spot any immediate risks.',
      },
      {
        title: 'Set up',
        description:
          'We put automated backups, uptime monitoring, clean update routines and clear access documentation in place.',
      },
      {
        title: 'Look after',
        description:
          'We handle ongoing upkeep quietly in the background and respond promptly whenever you need updates or advice.',
      },
    ],
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export function getRelatedServices(currentSlug: string, count = 3): Service[] {
  const index = SERVICES.findIndex((s) => s.slug === currentSlug);
  if (index === -1) return SERVICES.slice(0, count);
  const related: Service[] = [];
  for (let i = 1; i <= count; i++) {
    related.push(SERVICES[(index + i) % SERVICES.length]);
  }
  return related;
}
