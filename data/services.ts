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
      'Page structure, layout and a visual system for sites that need to look credible and answer questions fast.',
    metaDescription:
      'Web design for Charlottetown and PEI businesses: page structure, responsive layouts, accessible typography and a design system you can extend.',
    intro:
      'Most visitors decide whether to trust a business within the first screen. We design that screen, and the four or five after it, around what a customer needs to know: what you do, who it is for, roughly what it costs, and how to get in touch.',
    overview: [
      'We start with a page-by-page outline in plain text. If a page has no job, it does not get designed. That usually means a home page, one page per service, a work or menu page, an about page, and contact details that are easy to find on a phone.',
      'Layouts are built for three widths from the start: a 360 px phone, a tablet and a desktop screen. Type sizes, contrast and tap targets are checked before the first review, so what you approve is what gets built. If you have a logo, we redraw it cleanly for screens; if not, we set a simple wordmark that will still look right in two years.',
    ],
    included: [
      'A written page map with the job of each page',
      'Desktop, tablet and phone layouts for every template',
      'Type, colour, spacing and button styles documented for reuse',
      'Logo clean-up and favicon exports',
      'Clickable prototype reviewed page by page before build',
      'Contrast and keyboard checks on navigation, forms and cards',
    ],
    forWho: [
      'A business launching a first site that needs to look established from day one',
      'A site that works on a laptop but is awkward to use on a phone',
      'A team whose pages have grown apart and no longer look related',
    ],
    steps: [
      {
        title: 'Review',
        description:
          'About a week. We read your current site, two or three competitors and the questions customers actually email you.',
      },
      {
        title: 'Sketch',
        description:
          'We write the page map and sketch layouts in greyscale, so structure is settled before colour or photography.',
      },
      {
        title: 'Refine',
        description:
          'We apply type, colour and imagery to the key templates, then work through two rounds of review with you.',
      },
    ],
  },
  {
    slug: 'web-development',
    title: 'Web Development',
    short:
      'Fast, accessible builds in Next.js and TypeScript, with a CMS your team can use without calling a developer.',
    metaDescription:
      'Web development in Charlottetown, PEI: Next.js and TypeScript builds, Payload CMS, Core Web Vitals, accessibility and a clean handover.',
    intro:
      'We build with Next.js and TypeScript, and use Payload as the content layer when a team needs to edit pages. No drag-and-drop page builder, no stack of twenty plugins, and no dependency added unless it earns its place.',
    overview: [
      'Performance is part of the spec, not a cleanup task at the end. We size images at build time, serve modern formats, keep client-side JavaScript small and test on a throttled connection rather than office wifi. A typical marketing page ships under 200 KB of JavaScript.',
      'Editing is planned alongside the build. You get fields for the things you change — hours, menus, service copy, staff, seasonal notices — and not much else. We record a short walkthrough for your team and leave setup notes in the repository, so the next developer is not starting from scratch.',
    ],
    included: [
      'Next.js and TypeScript build with a reusable component set',
      'Payload collections and globals for the content you actually edit',
      'Image sizing, lazy loading and Core Web Vitals checks',
      'Page titles, meta descriptions, canonical URLs, sitemap and LocalBusiness schema',
      'Forms with server-side validation, spam filtering and delivery tests',
      'DNS, SSL, redirects and a launch checklist signed off before go-live',
    ],
    forWho: [
      'A business that wants to change its own hours and copy without a monthly invoice',
      'A site built on a plugin stack that breaks every time it updates',
      'A team adding booking, map, CRM or payment integrations to an existing site',
    ],
    steps: [
      {
        title: 'Plan',
        description:
          'We agree the page map, data model, integrations and who supplies what before any code is written.',
      },
      {
        title: 'Build',
        description:
          'Work ships in stages to a private preview URL you can open on your own phone and laptop at any point.',
      },
      {
        title: 'Test and launch',
        description:
          'Forms, redirects, keyboard paths and screen sizes are checked, then we switch DNS and verify the live site.',
      },
    ],
  },
  {
    slug: 'ecommerce',
    title: 'E-commerce Websites',
    short:
      'Online stores with one stock count, Canadian tax handled properly and a checkout that works on a phone.',
    metaDescription:
      'E-commerce design and development for Canadian retailers and makers: catalogues, variants, HST, local pickup, shipping and tested checkout.',
    intro:
      'An online store has to survive real conditions: a customer buying two sizes, a product selling out while it sits in a cart, and HST that has to be right on the receipt. We set those details up before the store opens.',
    overview: [
      'Catalogue work comes first. Product names, variants, SKUs, weights and box sizes are cleaned up so shipping rates and stock counts behave. Products that are out of stock are hidden or clearly marked, not left to fail at checkout.',
      'For PEI and Canadian sellers, the operational details matter most. We set up HST and provincial rules, local pickup, Canada Post or courier rates, and international shipping only where it makes sense. Then we run test orders covering a single item, a mixed cart, pickup and a refund before anyone pays real money.',
    ],
    included: [
      'Product catalogue with categories, variants, SKUs and search',
      'Payment setup with card and wallet support',
      'HST and provincial tax rules, local pickup and shipping zones',
      'Inventory counts and low-stock behaviour',
      'Order confirmation, shipping and refund emails',
      'Test orders across phone and desktop before launch',
    ],
    forWho: [
      'Makers and retailers moving from market stalls and DMs to a real storefront',
      'An existing store with a checkout that loses customers on mobile',
      'A shop that has outgrown a template and needs its own product structure',
    ],
    steps: [
      {
        title: 'Map',
        description:
          'We review the product range, variants, tax registration, pickup rules and how an order gets packed and shipped.',
      },
      {
        title: 'Build',
        description:
          'We set up the storefront, payment provider, shipping rates and the emails that go out after checkout.',
      },
      {
        title: 'Test',
        description:
          'Sandbox orders cover tax, shipping, pickup and refunds. Only then does the store take a real payment.',
      },
    ],
  },
  {
    slug: 'saas-software',
    title: 'SaaS & Custom Software',
    short:
      'Web applications, internal tools and subscription products scoped around the work your team does every day.',
    metaDescription:
      'Custom web applications, internal tools and SaaS software built in Charlottetown, PEI for teams across Canada and worldwide.',
    intro:
      'Some problems do not fit an off-the-shelf tool. We build the web application that replaces the spreadsheet, the shared inbox and the manual copy-paste between two systems that were never meant to talk.',
    overview: [
      'The first job is deciding what version one is not. We map the workflow as it happens now, find the three or four steps that cost the most time, and build those. Reports, permissions edge cases and nice-to-have dashboards go on a list for later.',
      'From there the work runs in two-week milestones against a staging environment. You click through real screens, test with the people who will use the software daily, and reprioritise based on what you see. Authentication, roles, backups and error monitoring are set up before launch rather than bolted on afterwards.',
    ],
    included: [
      'Workflow mapping and a written scope for the first release',
      'Authentication, user accounts and role-based permissions',
      'Database design, server-side validation and a documented API',
      'Integrations with payments, email, accounting or existing internal systems',
      'Staging environment, error monitoring and automated backups',
      'A handover session and written notes for your team',
    ],
    forWho: [
      'A team running critical work through spreadsheets and group chats',
      'A founder who needs a first release real customers can use and pay for',
      'An organization that needs a portal no off-the-shelf product covers',
    ],
    steps: [
      {
        title: 'Scope',
        description:
          'We define the smallest version that solves the real problem, and write down what is deliberately left out.',
      },
      {
        title: 'Build in stages',
        description:
          'Features ship every two weeks to staging, with a short demo and a chance to change priorities.',
      },
      {
        title: 'Launch and iterate',
        description:
          'We deploy, watch how the first users work, and fix the friction that only shows up in real use.',
      },
    ],
  },
  {
    slug: 'care-support',
    title: 'Website Care & Support',
    short:
      'Hosting, updates, tested backups and a person to email when something needs changing.',
    metaDescription:
      'Website care in Charlottetown, PEI: managed hosting, dependency updates, verified backups, uptime monitoring and direct support.',
    intro:
      'A website is not finished on launch day. Certificates expire, dependencies age and forms quietly stop delivering email. Care & Support is a monthly arrangement that keeps those things from becoming an emergency.',
    overview: [
      'Most site failures are boring and preventable: a domain registered to someone who has left, a form sending to a mailbox nobody reads, or a backup that has never been restored. We start with an audit of the domain, hosting, code and email setup, then fix what is fragile.',
      'After that, upkeep runs on a schedule. Updates are applied on a copy of the site first, backups are stored off the production server, and a restore is tested rather than assumed. When you need a price changed, a staff member added or a seasonal notice posted, you email the people who built the site.',
    ],
    included: [
      'Domain, DNS and SSL oversight, with records in your name',
      'Monthly dependency and security updates, tested on a copy first',
      'Off-site backups with a restore check, not just a green tick',
      'Uptime and form delivery monitoring with alerts to a real inbox',
      'Small content changes, seasonal notices and staff updates',
      'Email and phone support from the people who know the codebase',
    ],
    forWho: [
      'A business that does not want to think about servers, updates or certificates',
      'A site left behind by a developer who has moved on',
      'A team that needs occasional changes without a new project each time',
    ],
    steps: [
      {
        title: 'Audit',
        description:
          'We check the domain, hosting, code, email records and backups, and list anything that could fail soon.',
      },
      {
        title: 'Set up',
        description:
          'Backups, monitoring and an update routine go in place, with access documented in your own accounts.',
      },
      {
        title: 'Look after',
        description:
          'Updates, checks and small changes run monthly, with a short note on anything that needed attention.',
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
