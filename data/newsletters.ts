export type NewsletterCategory =
  | 'Guide'
  | 'Checklist'
  | 'Tutorial'
  | 'Case Study'
  | 'Notes';

export interface NewsletterSection {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface NewsletterEntry {
  slug: string;
  title: string;
  excerpt: string;
  category: NewsletterCategory;
  tags: string[];
  publishDate: string;
  isoDate: string;
  readTime: number;
  sections: NewsletterSection[];
}

export const NEWSLETTER_CATEGORIES: readonly ('All' | NewsletterCategory)[] = [
  'All',
  'Guide',
  'Checklist',
  'Tutorial',
  'Case Study',
  'Notes',
] as const;

export const NEWSLETTERS: NewsletterEntry[] = [
  {
    slug: 'what-a-business-website-needs',
    title: 'What a business website actually needs',
    excerpt:
      'The five pages that earn enquiries, the details customers check before calling, and the features you can skip for now.',
    category: 'Guide',
    tags: ['Planning', 'Small Business', 'Content'],
    publishDate: 'November 12, 2026',
    isoDate: '2026-11-12',
    readTime: 4,
    sections: [
      {
        paragraphs: [
          'A customer who finds you through search gives the site about five seconds. In that time they are trying to answer three questions: what do you sell, do you serve my area, and what happens if I get in touch. Everything else is secondary.',
          'We have rebuilt enough small business sites to know which pages earn enquiries and which ones sit unread. Here is the short version.',
        ],
      },
      {
        heading: 'The five pages that do the work',
        bullets: [
          'Home: a headline that names the service and the place. "Bike rentals in Brackley Beach" beats "Welcome to our website" every time.',
          'Services: one page per service, each with who it is for, what is included and a starting price or range. If you will not publish a price, say what affects it.',
          'Proof: six to ten photos of finished work, or three short case notes with the problem and the result.',
          'About: a real name, a face, a street address and how long you have been doing this.',
          'Contact: a form, a phone number that dials on a tap, your hours and a map link that opens the right app.',
        ],
      },
      {
        heading: 'Answer the four questions people ask before they call',
        paragraphs: [
          'Most industries have the same four: how much, how long, what area do you cover, and what do I need to have ready. Put those answers on the service pages rather than in a brochure PDF nobody opens on a phone.',
          'A short price range does more than a "contact us for a quote" button. It filters out the enquiries you did not want and gives the serious ones confidence to call.',
        ],
      },
      {
        heading: 'What can wait',
        paragraphs: [
          'Booking engines, chat widgets, a blog and a newsletter signup are all reasonable additions once the core site is live and someone is responsible for keeping them current. Added on day one, they mostly add maintenance and page weight.',
          'The same goes for animations. A page that fades in on scroll is not why anyone hires you, and it makes the site slower and harder to test.',
        ],
      },
      {
        heading: 'Photos matter more than the copy',
        paragraphs: [
          'A phone photo in daylight of your actual shop, team or finished job outperforms a stock image of a smiling stranger in a hard hat. If you have nothing usable, block out an hour and shoot twenty photos; we can crop and colour-correct them.',
          'If you have existing print photos, find the originals rather than scanning the brochure. A 300 dpi print file is usually enough for a web hero image; a screenshot from Facebook is not.',
        ],
      },
    ],
  },
  {
    slug: 'choosing-a-website-platform',
    title: 'Choosing a platform for your website',
    excerpt:
      'Builders, WordPress and custom Next.js builds compared by what you edit, what you pay monthly and how easily you can leave.',
    category: 'Guide',
    tags: ['Architecture', 'CMS', 'Planning'],
    publishDate: 'November 5, 2026',
    isoDate: '2026-11-05',
    readTime: 5,
    sections: [
      {
        paragraphs: [
          'Every project hits the same question early: hosted builder, WordPress, or a custom build? The honest answer depends on how often you change the site, who does the editing and how much of your business runs through it.',
          'Ignore feature checklists. Ask what happens in two years when the person who built it is gone.',
        ],
      },
      {
        heading: 'Start with how often you edit',
        paragraphs: [
          'If the site changes four times a year and holds ten pages, a hosted builder is defensible. You will outgrow the template eventually, but the cost of entry is low and you can launch this month.',
          'If someone updates hours, menus, products or posts weekly, pay for a proper content model now. Retyping content into rigid template fields gets old fast, and it is how sites end up out of date.',
        ],
      },
      {
        heading: 'The three realistic options',
        bullets: [
          'Hosted builders (Squarespace, Wix): quickest to launch, no server to manage. Limited layout control, heavier pages, and moving later usually means rebuilding.',
          'WordPress: enormous plugin ecosystem and plenty of local help. Also the most common source of slow, compromised sites we are asked to fix. It needs disciplined updates and a short plugin list.',
          'Custom Next.js with a headless CMS: fastest pages, layout designed for your content, and clean code you own. Higher upfront cost, and you need someone to maintain it.',
        ],
      },
      {
        heading: 'Four questions before you commit',
        bullets: [
          'Can I export my content and redirects if I leave? Ask for a sample export, not a promise.',
          'Who owns the domain and hosting account, and whose email is the billing contact?',
          'How many plugins or third-party scripts ship on the home page? Every one is a future update and a performance cost.',
          'Can a staff member publish a page without calling a developer, and is there a preview before it goes live?',
        ],
      },
      {
        heading: 'What we choose, and why',
        paragraphs: [
          'For most client sites we build with Next.js, TypeScript and Payload as the CMS. Pages load fast, the editing screens match the content, and the repository belongs to the client at handover. For a store-first business, Shopify is often the better call; we would rather say that than rebuild what Shopify already does well.',
          'Whichever route you take, keep the domain, DNS, analytics and content in accounts you control. That single decision protects you more than any platform choice.',
        ],
      },
    ],
  },
  {
    slug: 'website-launch-checklist',
    title: 'A website launch checklist',
    excerpt:
      'Twelve checks to run before pointing DNS at a new site, from form delivery and redirects to SPF records and a 404 page.',
    category: 'Checklist',
    tags: ['Launch', 'QA', 'Operations'],
    publishDate: 'October 28, 2026',
    isoDate: '2026-10-28',
    readTime: 5,
    sections: [
      {
        paragraphs: [
          'Launch mistakes are almost always the same ones: a form still pointed at a test inbox, a redirect missing for the old pricing page, or an SSL warning on the www version. An hour of checks prevents all of it.',
          'This is the list we work through on a staging copy before touching DNS.',
        ],
      },
      {
        heading: 'Content and links',
        bullets: [
          'Proofread on a phone, not just a laptop. Check the phone number, address, hours and business name on every template.',
          'Click every navigation item, footer link, card and button. Watch for 404s and links that open in the same tab when they should not.',
          'Check the 404 page itself. It should offer the menu and a way back, not a default server error.',
          'Confirm the favicon and social share image are the new ones, not last year’s logo.',
        ],
      },
      {
        heading: 'Forms and email',
        bullets: [
          'Submit every form and confirm the email arrives in the real inbox, not spam. Check the reply-to address too.',
          'Test validation: empty required fields, a malformed email, and the success message.',
          'Verify SPF and DKIM records before launch. Missing records are the usual reason enquiry emails land in spam.',
          'If the form sends an auto-reply, read it as a customer would.',
        ],
      },
      {
        heading: 'Technical checks',
        bullets: [
          'Test at 360 px, 768 px and 1440 px. Look for sideways scrolling and clipped headings.',
          'Tab through the menu, forms and accordions. Focus should stay visible and Escape should close any open menu.',
          'Check page titles, meta descriptions, canonical URLs and the sitemap. Every page should have a unique title.',
          'Map 301 redirects from every old URL that still gets traffic, including printed QR codes and old campaign links.',
          'Confirm HTTPS on both the apex domain and www, with no mixed-content warnings.',
        ],
      },
      {
        heading: 'The switch itself',
        paragraphs: [
          'Lower DNS TTL to 300 seconds a day before the switch so changes propagate quickly. Make the change in the morning, mid-week, when you can watch it. Then test the live site from a phone on mobile data, outside your office network.',
          'Keep the old site archived for 30 days and leave the redirects in place permanently. Submit the sitemap in Search Console and check for crawl errors a week later.',
        ],
      },
    ],
  },
  {
    slug: 'local-seo-basics-pei',
    title: 'Local SEO basics for PEI businesses',
    excerpt:
      'What actually moves the needle for Island businesses: a complete Google profile, consistent details and pages built around real services.',
    category: 'Guide',
    tags: ['SEO', 'Charlottetown', 'Local Search'],
    publishDate: 'October 20, 2026',
    isoDate: '2026-10-20',
    readTime: 4,
    sections: [
      {
        paragraphs: [
          'Local search is less mysterious than the industry makes it sound. Google is trying to confirm three things: who you are, what you do and where you serve. Most of the work is making those facts easy to verify and keeping them current.',
          'On PEI the calendar matters too. Summer searches come from phones already on the road; winter searches are more deliberate. Both need the same accurate hours and service area.',
        ],
      },
      {
        heading: 'Fix your Google Business Profile first',
        bullets: [
          'Pick the most specific primary category, then add two or three secondary ones that genuinely apply.',
          'Set your service area to the places you actually travel to, not the whole province.',
          'Add real photos: storefront, interior, team, finished work. Update them seasonally.',
          'Keep hours accurate, including holiday exceptions. Wrong winter hours generate more angry calls than a dated website.',
          'Answer questions and reviews from the same account, in your own voice.',
        ],
      },
      {
        heading: 'Keep your details identical everywhere',
        paragraphs: [
          'Use the same business name, phone number and address on your site, your Google profile, Facebook, your chamber listing and any trade directory. An old trading name or a disconnected second number makes it harder for search engines to connect the mentions to one business.',
          'If you have moved or changed numbers, update the old listings rather than leaving them to rot. Duplicate listings split your reviews and your ranking.',
        ],
      },
      {
        heading: 'Build pages around services, not keywords',
        bullets: [
          'One page per service, with the service in the heading and the places you serve mentioned where it reads naturally.',
          'Add LocalBusiness structured data with your legal name, phone, email and area served.',
          'Publish prices or ranges where you can. Pages with concrete detail get more clicks from search results.',
          'Keep menus, schedules and service lists as HTML text, not images or PDFs that search engines cannot read.',
        ],
      },
      {
        heading: 'Reviews and measurement',
        paragraphs: [
          'Ask for a review the day you finish a job, with a direct link. Reply to every one, including the bad ones, within a couple of days. Volume and recency both matter, and a calm reply to criticism does more for trust than ten five-star ratings.',
          'Track calls and form submissions rather than keyword rankings. If the phone rings more and the enquiries are the right kind, the search work is doing its job.',
        ],
      },
    ],
  },
  {
    slug: 'prepare-for-a-design-project',
    title: 'What to prepare before a design project',
    excerpt:
      'Eight things worth gathering before kickoff, and what to do if you have almost none of them.',
    category: 'Checklist',
    tags: ['Design', 'Preparation', 'Discovery'],
    publishDate: 'October 9, 2026',
    isoDate: '2026-10-09',
    readTime: 4,
    sections: [
      {
        paragraphs: [
          'You do not need finished copy, a brand manual or wireframes to start. But half an hour of gathering makes the first call sharper and saves a week later.',
          'Here is what we actually use during discovery, in rough order of importance.',
        ],
      },
      {
        heading: 'Gather these eight things',
        bullets: [
          'One sentence on what the site must achieve in the next six months. "More booked consultations" is enough; "increase brand awareness" is not.',
          'Two or three sites you like, each with one line on what works. Industry does not matter; structure and tone do.',
          'Your logo in the best format you have. Vector (SVG, AI, EPS) is ideal, a large PNG will do.',
          'Ten to twenty photos of your premises, team, products or finished work. Originals from a camera or phone, not files saved down from social media.',
          'The ten questions customers ask you on the phone most often. That list becomes your FAQ and half your service copy.',
          'Any print material with wording you want to keep: brochures, menus, price sheets, tender documents.',
          'Logins or account notes for your domain registrar and current hosting, so launch does not stall.',
          'The name of the one person who signs off, and how quickly they can turn around feedback.',
        ],
      },
      {
        heading: 'What to do if you have none of it',
        paragraphs: [
          'Most clients arrive with three or four of those. That is normal. For copy, record a five-minute voice note answering the ten customer questions and we will shape it into pages. For photos, we can plan a shot list you capture in an afternoon with a phone.',
          'For the logo, a clean redraw of a low-resolution file is usually a few hours of work. It is rarely worth designing a new identity mid-project unless the old one is actively causing confusion.',
        ],
      },
      {
        heading: 'Decisions that save the most time',
        paragraphs: [
          'Settle two things before design starts: who your main customer is, and what you want them to do. Every layout argument gets easier once those are written down.',
          'Also flag fixed dates early. A tourism season, a trade show or a printed sign with the new address all constrain the schedule more than any design preference.',
        ],
      },
    ],
  },
  {
    slug: 'how-long-does-a-website-take',
    title: 'How long does a website take?',
    excerpt:
      'Realistic timelines for a marketing site, a store and a first software release, and the one delay that affects almost every project.',
    category: 'Notes',
    tags: ['Timeline', 'Process', 'Planning'],
    publishDate: 'September 30, 2026',
    isoDate: '2026-09-30',
    readTime: 4,
    sections: [
      {
        paragraphs: [
          '"How soon can we launch?" is usually the second question on a first call. Code is rarely the bottleneck. Content, feedback and third-party approvals are.',
          'These ranges come from our own projects, not a sales deck.',
        ],
      },
      {
        heading: 'Typical timelines',
        bullets: [
          'Five-page marketing site: four to six weeks from kickoff, assuming copy and photos arrive on schedule.',
          'Ten to fifteen pages with a CMS: six to eight weeks.',
          'Online store with 100 to 300 products: eight to twelve weeks, including product data and test orders.',
          'Custom software or SaaS first release: six to eight weeks to something usable, then two-week milestones.',
        ],
      },
      {
        heading: 'The delay that affects almost every project',
        paragraphs: [
          'Waiting on final text and photography costs more launch days than design and development combined. Writing plainly about your own business is hard when you are also running it, and it is easy to keep postponing.',
          'The fix is unglamorous: assign each page to one person, set a date for a rough draft, and review real copy inside the layout rather than in a document. Rough copy in place beats perfect copy in a drawer.',
        ],
      },
      {
        heading: 'Where integrations add time',
        paragraphs: [
          'Payment provider verification, POS exports, booking systems and accounting software all involve another company’s process. Merchant accounts can take a week to approve; a POS vendor may take three days to answer an email. Build that into the plan rather than discovering it in week six.',
          'Bilingual launches add a translation round, and translation usually needs approved English copy first. Sequence it rather than running both at once.',
        ],
      },
      {
        heading: 'Phasing a fixed date',
        paragraphs: [
          'If you have a hard date, split the work. Launch the essential pages, mobile layout and enquiry path first; add the blog, secondary services or deeper integrations a month later. A smaller site that is live and correct beats a complete site that misses the season.',
          'Whatever the plan, keep a week for testing at the end. The last-minute rush is how broken forms and mistyped phone numbers get published.',
        ],
      },
    ],
  },
  {
    slug: 'accessibility-basics-for-business-sites',
    title: 'Accessibility basics every website should cover',
    excerpt:
      'Five practical fixes: heading structure, contrast ratios, keyboard focus, form labels and reduced motion.',
    category: 'Tutorial',
    tags: ['Accessibility', 'WCAG', 'HTML'],
    publishDate: 'September 18, 2026',
    isoDate: '2026-09-18',
    readTime: 5,
    sections: [
      {
        paragraphs: [
          'Accessibility is often treated as a compliance task for the end of a project. In practice it makes the site clearer for everyone: someone reading outdoors on a phone, someone with a temporary hand injury, someone using a screen reader.',
          'These five checks cover most of what goes wrong on a business site.',
        ],
      },
      {
        heading: '1. Use real headings and landmarks',
        paragraphs: [
          'Wrap the page in `<header>`, `<nav>`, `<main>` and `<footer>`, and use one `<h1>` for the page topic, then `<h2>` and `<h3>` in order. Do not pick a heading level because of its size; style it with CSS instead.',
          'Use `<button>` for actions and `<a href>` for navigation. A clickable `<div>` is invisible to a keyboard and to assistive technology.',
        ],
      },
      {
        heading: '2. Check contrast, not just colour',
        paragraphs: [
          'Body text needs 4.5:1 against its background; large headings need 3:1. Pale grey captions on white and brand-coloured text on white are the usual failures.',
          'An orange button with black text passes easily. Orange text on white does not, even if it looks fine on your monitor. Check the actual hex values rather than trusting your eye.',
        ],
      },
      {
        heading: '3. Make the keyboard path work',
        bullets: [
          'Add a "Skip to content" link as the first focusable element.',
          'Never remove the focus ring without replacing it with something equally visible.',
          'Menus should open with Enter or Space and close with Escape.',
          'Tab through the whole page once before launch. If you lose track of where you are, so will a keyboard user.',
        ],
      },
      {
        heading: '4. Label every form field',
        paragraphs: [
          'A placeholder disappears as soon as someone types and is not a label. Use a visible `<label>` tied to each input, group related choices in a `<fieldset>` with a `<legend>`, and mark errors with `aria-invalid` plus text that explains what to fix.',
          'On a failed submit, move focus to the first field with an error. Do not rely on a red border alone.',
        ],
      },
      {
        heading: '5. Respect motion and zoom',
        paragraphs: [
          'Wrap large transitions in `@media (prefers-reduced-motion: reduce)`. Then zoom the browser to 200 percent and check nothing overlaps or disappears.',
          'Two habits catch most real problems in ten minutes: navigate with only Tab, Shift+Tab, Enter and Escape, then zoom to 200 percent. Automated tools help, but they miss both.',
        ],
      },
    ],
  },
  {
    slug: 'getting-an-online-store-ready',
    title: 'Getting an online store ready to sell',
    excerpt:
      'Product data, five test orders, HST, shipping zones and the policies customers look for before they pay.',
    category: 'Checklist',
    tags: ['E-commerce', 'Retail', 'Canadian Tax'],
    publishDate: 'September 4, 2026',
    isoDate: '2026-09-04',
    readTime: 5,
    sections: [
      {
        paragraphs: [
          'An online store carries more operational weight than a brochure site: live stock, tax, payments and parcels that have to physically arrive. The setup work is mostly boring data entry, and skipping it shows up as refunds and support emails.',
          'Work through this before design starts.',
        ],
      },
      {
        heading: 'Product data people need',
        bullets: [
          'A name a customer would search for, plus a short description with dimensions, materials, care instructions and what is in the box.',
          'Variants and SKUs, even if you only have a few. You will need them when stock syncs with the shop till.',
          'Weight and box dimensions for every product. Guessed weights lead to carrier surcharges after the first week.',
          'A rule for sold-out items: hide, show "Sold out", or allow backorders with a real dispatch date.',
          'Five photos per product where possible: front, detail, scale, packaging, in use.',
        ],
      },
      {
        heading: 'Tax and shipping decisions',
        paragraphs: [
          'In PEI the HST is 15 per cent. Confirm your registration and whether you charge tax on shipping before test orders, not after. If you sell into other provinces, decide whether to register there or keep it simple at launch.',
          'For shipping, start with what you can actually fulfil: local pickup, a flat rate across Canada, and tracked parcel rates for heavier orders. Add international shipping only if you can handle customs paperwork and returns.',
        ],
      },
      {
        heading: 'Five test orders before opening',
        bullets: [
          'One item, paid by card, shipped to an Ontario address.',
          'Two different variants in one cart, with the correct stock decrement.',
          'Local pickup, with the confirmation email explaining where and when.',
          'A discount code, if you use them, including an expired one.',
          'A refund, processed end to end, with the customer email checked.',
        ],
      },
      {
        heading: 'Policies customers look for',
        paragraphs: [
          'Publish processing time, shipping estimates, the return window, what to do with a damaged item and a phone number or email that reaches a person. Put them in the footer and link them at checkout.',
          'Then watch the first twenty real orders. Packaging that seemed fine in theory often needs adjusting once you are taping boxes at 9 pm.',
        ],
      },
    ],
  },
  {
    slug: 'scoping-a-software-project',
    title: 'How to scope a custom software project',
    excerpt:
      'Turn a messy workflow into a first release: describe the loop, list the roles, cut the extras and ship in two-week stages.',
    category: 'Tutorial',
    tags: ['SaaS', 'Software', 'Scoping'],
    publishDate: 'August 22, 2026',
    isoDate: '2026-08-22',
    readTime: 5,
    sections: [
      {
        paragraphs: [
          'Custom software rarely fails because the framework was wrong. It fails because version one tried to cover every edge case at once and took a year to arrive.',
          'Good scoping is mostly subtraction. Here is the process we use with clients.',
        ],
      },
      {
        heading: 'Step 1: Write the core loop in five sentences',
        paragraphs: [
          'Describe the work as it happens now, without features. For example: "A manager builds next week’s schedule on Thursday, publishes it, staff check their shifts on their phones, and swap requests get approved or declined by the manager."',
          'Every screen in version one should serve that loop. If a screen does not, it belongs on the later list.',
        ],
      },
      {
        heading: 'Step 2: List the roles before the screens',
        paragraphs: [
          'Write down every type of person who signs in — owner, manager, staff, client — and what each can see, create, edit and approve. Permissions decided late cause data model rewrites, which are the most expensive kind.',
          'Include the awkward cases: a manager who is also staff, a client with two companies, someone who leaves and must lose access the same day.',
        ],
      },
      {
        heading: 'Step 3: Separate day one from phase two',
        bullets: [
          'Day one: login, the core workflow screens, input validation, email notifications, an audit trail of who changed what, and a CSV export.',
          'Phase two: custom report builders, theming options, multi-currency billing, mobile apps, and anything that depends on data you do not have yet.',
          'Never on day one: an AI feature, a redesign of the whole workflow, or a second user type "just in case".',
        ],
      },
      {
        heading: 'Step 4: Test with the person who does the job',
        paragraphs: [
          'A clickable prototype reviewed by the staff who will use the tool daily will surface missing fields and wrong wording faster than any specification. They will also tell you which step is genuinely annoying, which is usually the one worth automating first.',
        ],
      },
      {
        heading: 'Step 5: Ship in two-week stages',
        paragraphs: [
          'Deploy to staging every two weeks, demo it, and adjust priorities with what you learn. Real software in front of real users beats a status report every time.',
          'Before launch, agree on support: error monitoring, automated backups, who answers user questions and how fixes get prioritised. Software people depend on daily needs an owner, not just a release date.',
        ],
      },
    ],
  },
  {
    slug: 'keeping-a-website-secure-and-dependable',
    title: 'Keeping a website secure and dependable',
    excerpt:
      'What a maintenance audit usually finds, the fixes that matter, and the monthly routine that prevents most outages.',
    category: 'Case Study',
    tags: ['Security', 'Maintenance', 'Hosting'],
    publishDate: 'August 10, 2026',
    isoDate: '2026-08-10',
    readTime: 5,
    sections: [
      {
        paragraphs: [
          'This piece combines findings from three audits we ran on Island business sites over the past year. The details differ; the pattern does not.',
          'None of these sites had been attacked. They had simply been left alone, and the things that keep a site working had quietly expired or never been set up.',
        ],
      },
      {
        heading: 'What the audits found',
        bullets: [
          'The domain was registered to a contractor’s personal email, with renewal charged to a card that had since expired.',
          'A plugin stack of 24 extensions, several unpatched for two years, and two that had been abandoned by their authors.',
          'Contact forms sending mail from a server with no SPF or DKIM record, so half the enquiries went to spam. Nobody had noticed because the form still said "thanks".',
          'Backups written to the same disk as the live site, and no record of a restore ever being tested.',
        ],
      },
      {
        heading: 'The first week of fixes',
        paragraphs: [
          'Ownership came first: registrar and DNS moved to the business owner’s account with two-factor authentication, and recovery contacts verified. Then we removed unused plugins and staging copies, updated what remained, and replaced the form handling with authenticated email plus server-side validation and a honeypot.',
          'Finally, backups moved off the production server, and we restored one to a test environment to prove the process worked. That restore took 40 minutes and found a missing uploads folder — exactly the kind of thing you want to discover before an outage.',
        ],
      },
      {
        heading: 'The monthly routine',
        bullets: [
          'Apply dependency updates on a copy of the site, test the key pages and forms, then deploy.',
          'Check that backups ran and restore one file to confirm the archive is readable.',
          'Review uptime and form delivery alerts, including anything that recovered on its own.',
          'Renew certificates and review domain and hosting expiry dates a month ahead.',
          'Read the error log once. Patterns show up there before customers complain.',
        ],
      },
      {
        heading: 'Why this is cheaper than an emergency',
        paragraphs: [
          'A monthly routine is a few hours of work. Recovering a compromised site without clean backups is days of lost enquiries, a possible re-build and an awkward conversation with customers whose data was exposed.',
          'The goal is boring: a site that quietly does its job, with records clear enough that anyone competent could take over tomorrow.',
        ],
      },
    ],
  },
];

export function getNewsletterBySlug(slug: string): NewsletterEntry | undefined {
  return NEWSLETTERS.find((r) => r.slug === slug);
}

export function getRelatedNewsletters(currentSlug: string, count = 3): NewsletterEntry[] {
  const index = NEWSLETTERS.findIndex((r) => r.slug === currentSlug);
  if (index === -1) return NEWSLETTERS.slice(0, count);
  const next: NewsletterEntry[] = [];
  for (let i = 1; i <= count; i++) {
    next.push(NEWSLETTERS[(index + i) % NEWSLETTERS.length]);
  }
  return next;
}
