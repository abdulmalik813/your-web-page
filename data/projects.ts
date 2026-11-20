export type ProjectType = 'Website' | 'Software' | 'SaaS';

export interface Project {
  slug: string;
  title: string;
  type: ProjectType;
  tags: string[];
  role: string;
  summary: string;
  challenge: string;
  approach: string;
  outcomes: string[];
}

export const PROJECTS: Project[] = [
  {
    slug: 'harbourside-tours',
    title: 'Harbourside Tours',
    type: 'Website',
    tags: ['Next.js', 'Payload CMS', 'Tailwind CSS'],
    role: 'Design, development, hosting setup',
    summary:
      'A 14-page tourism site rebuilt in five weeks around one job: getting a visitor from a search result to a booking enquiry on a phone.',
    challenge:
      'The old site ran to 22 pages with a 6 MB home page and a booking button that only appeared on desktop. Sixty per cent of visitors were on phones, often on hotel wifi or patchy mobile data.',
    approach:
      'We cut the site to a tour index, one page per tour with departure times, duration, price and what to bring, and a single enquiry form that goes to the inbox the owner checks every morning.',
    outcomes: [
      'Home page weight down from 6 MB to 480 KB',
      'Tour pages load in under two seconds on a throttled 4G connection',
      'Seasonal dates and prices updated in the CMS each spring without a developer',
    ],
  },
  {
    slug: 'island-trades-collective',
    title: 'Island Trades Collective',
    type: 'Website',
    tags: ['Next.js', 'Tailwind CSS', 'Payload CMS'],
    role: 'Design, development',
    summary:
      'A shared site for seven independent trades, with a page per trade and enquiries routed to the right business.',
    challenge:
      'Seven businesses shared one phone number and a Facebook page. Leads ended up with whoever answered first, and nobody could tell which trade a caller needed.',
    approach:
      'We built one visual system with a page per trade, a plain list of the areas each member covers, and an enquiry form that asks which trade the job is for before it sends the email.',
    outcomes: [
      'One place to update hours, service areas and contact details for all seven members',
      'Enquiry routing tested for every trade before launch',
      'Each member edits their own page without touching anyone else’s',
    ],
  },
  {
    slug: 'maritime-market',
    title: 'Maritime Market',
    type: 'Website',
    tags: ['E-commerce', 'Payments', 'Inventory'],
    role: 'Design, development, store configuration',
    summary:
      'An online store for a PEI maker, with one stock count covering the studio, the market stall and the website.',
    challenge:
      'Orders arrived through direct messages, email and in person. The same candle was sold twice in one weekend because the online shop and the market till kept separate counts.',
    approach:
      'We moved 180 products into one catalogue with variants and SKUs, connected the storefront to the till’s stock file, and set HST, local pickup and Canada Post rates before the first test order.',
    outcomes: [
      'Stock levels reconciled between the shop till and the website every 15 minutes',
      'Checkout supports local pickup in Charlottetown and flat-rate shipping across Canada',
      'Order and shipping emails sent automatically to buyer and seller',
    ],
  },
  {
    slug: 'shiftboard',
    title: 'ShiftBoard',
    type: 'SaaS',
    tags: ['Next.js', 'PostgreSQL', 'Authentication'],
    role: 'Product scoping, design, full-stack development',
    summary:
      'A scheduling app for a three-location café group: weekly rosters, staff availability and shift swaps in one place.',
    challenge:
      'Schedules lived in a spreadsheet and four group chats. When someone called in sick, managers rebuilt the week by hand and still missed shifts.',
    approach:
      'We scoped a first release to the work managers did every Thursday: build the week, publish it, collect availability, and approve swaps. Payroll exports and forecasting were left for phase two.',
    outcomes: [
      'Rosters built and published for 60 staff across three locations',
      'Staff submit availability and swap requests from their phones',
      'Every swap approval recorded with a timestamp and manager name',
    ],
  },
  {
    slug: 'inventory-sync',
    title: 'Inventory Sync',
    type: 'Software',
    tags: ['TypeScript', 'REST APIs', 'Background Jobs'],
    role: 'Software architecture and development',
    summary:
      'An internal service that keeps stock counts aligned between a point-of-sale system and an online storefront.',
    challenge:
      'Till sales and online orders wrote to separate stock tables. Staff reconciled the two by hand each morning, and popular items sold out online after they were already gone in the shop.',
    approach:
      'We built a background job that reads both systems every 15 minutes, applies the newest change, flags conflicts for a person to settle, and writes every update to an audit log.',
    outcomes: [
      'Daily manual reconciliation removed from the opening routine',
      'Oversold orders dropped to near zero on the ten fastest-moving products',
      'Conflict queue shows which system changed first, with a full audit trail',
    ],
  },
  {
    slug: 'clientdesk',
    title: 'Clientdesk',
    type: 'SaaS',
    tags: ['Next.js', 'PostgreSQL', 'Transactional Email'],
    role: 'Product scoping, UI design, development',
    summary:
      'A client portal for a 12-person accounting firm: documents, open requests and status updates in one shared view.',
    challenge:
      'Tax documents and approvals were scattered across email threads. Clients rang to ask whether a return had been filed, and staff searched three inboxes to answer.',
    approach:
      'We built role-based logins for staff and clients, a document area organised by tax year, request statuses, and a Monday digest email listing anything waiting on the client.',
    outcomes: [
      'Documents filed by client and tax year instead of by email thread',
      'Clients check status themselves rather than calling the office',
      'Staff handover notes travel with the client record',
    ],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getRelatedProjects(currentSlug: string, count = 3): Project[] {
  const index = PROJECTS.findIndex((p) => p.slug === currentSlug);
  if (index === -1) return PROJECTS.slice(0, count);
  const next: Project[] = [];
  for (let i = 1; i <= count; i++) {
    next.push(PROJECTS[(index + i) % PROJECTS.length]);
  }
  return next;
}
