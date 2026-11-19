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
    tags: ['Next.js', 'Tailwind CSS', 'Headless CMS'],
    role: 'Design, development, hosting setup',
    summary:
      'A tourism website built around one job: getting a visitor from the home page to a booking enquiry in as few steps as possible.',
    challenge:
      'Seasonal visitors often browse on their phones over variable mobile connections and decide within a minute whether to enquire or move on.',
    approach:
      'We structured a lightweight, mobile-first website with concise tour pages, clear departure details, a persistent enquiry path and editable seasonal schedules.',
    outcomes: [
      'Tour details and seasonal dates editable without developer involvement',
      'Enquiry form reachable cleanly from every tour page',
      'Fast page loads on mobile connections',
    ],
  },
  {
    slug: 'island-trades-collective',
    title: 'Island Trades Collective',
    type: 'Website',
    tags: ['Next.js', 'Tailwind CSS', 'Service Areas'],
    role: 'Design, development',
    summary:
      'A directory-style site for a group of local trades businesses, with individual service pages, coverage areas and a shared enquiry flow.',
    challenge:
      'Several independent trades needed a single cohesive web presence without losing their own service descriptions or routing leads to the wrong contact.',
    approach:
      'We built a shared visual system with dedicated pages per trade, plain-language service area notes and an enquiry form that routes messages by trade.',
    outcomes: [
      'Consistent, readable layout across every member profile page',
      'Clear geographic coverage shown for each trade',
      'Enquiries routed directly to the right contact',
    ],
  },
  {
    slug: 'maritime-market',
    title: 'Maritime Market',
    type: 'Website',
    tags: ['E-commerce', 'Payments', 'Inventory'],
    role: 'Design, development, store configuration',
    summary:
      'An online store for an independent maker, with an organized product catalogue, Canadian tax and shipping rules, and automated order emails.',
    challenge:
      'Orders were arriving across direct messages, email threads and in-person markets, making stock tracking and fulfilment tedious.',
    approach:
      'We unified the product catalogue into one responsive store with live inventory counts, secure checkout and automatic confirmation emails for both buyer and seller.',
    outcomes: [
      'Online and market stock tracked from a single catalogue',
      'Clear checkout supporting local pickup and parcel shipping',
      'Automatic order and dispatch notifications',
    ],
  },
  {
    slug: 'shiftboard',
    title: 'ShiftBoard',
    type: 'SaaS',
    tags: ['Next.js', 'PostgreSQL', 'Authentication'],
    role: 'Product scoping, design, full-stack development',
    summary:
      'A scheduling web application for small shops and hospitality teams to build weekly rosters, publish shifts and handle swap requests.',
    challenge:
      'Weekly schedules kept in spreadsheets and group chat threads created confusion whenever staff availability changed mid-week.',
    approach:
      'We scoped a focused first release featuring manager roster building, individual staff logins, shift swap requests and email notifications.',
    outcomes: [
      'Single shared source of truth for weekly schedules',
      'Staff able to submit availability and swap requests directly',
      'Manager approval logged cleanly without long message threads',
    ],
  },
  {
    slug: 'inventory-sync',
    title: 'Inventory Sync',
    type: 'Software',
    tags: ['TypeScript', 'REST APIs', 'Background Jobs'],
    role: 'Software architecture and development',
    summary:
      'An internal synchronization service that keeps stock counts aligned between an in-store point-of-sale system and an online storefront.',
    challenge:
      'Stock numbers drifted out of sync between till sales and online orders, forcing manual daily reconciliations.',
    approach:
      'We built a resilient background integration that reconciles stock changes in both directions, flags discrepancies and keeps an audit trail.',
    outcomes: [
      'Fewer oversold items when stock runs low',
      'Eliminated repetitive manual stock adjustments',
      'Clear audit log for every inventory update',
    ],
  },
  {
    slug: 'clientdesk',
    title: 'Clientdesk',
    type: 'SaaS',
    tags: ['Next.js', 'PostgreSQL', 'Transactional Email'],
    role: 'Product scoping, UI design, development',
    summary:
      'A lightweight client portal where small service firms share project documents, track open requests and send clear status updates.',
    challenge:
      'Client files, approvals and follow-up questions were buried across long email threads with no central status view.',
    approach:
      'We designed and built a role-based portal with client logins, request statuses, file sharing and automated update digests.',
    outcomes: [
      'Shared documents and open requests organized in one workspace',
      'Clients able to check progress without sending status-check emails',
      'Simpler handover and record-keeping for the service team',
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
