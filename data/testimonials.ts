export interface Testimonial {
  id: string;
  quote: string;
  authorName: string;
  roleAndCompany: string;
  location: string;
  approved: boolean;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    quote:
      'Our old site took almost nine seconds to load on a phone. The new one opens straight onto the tour list, and the enquiry email lands in our inbox every time. July was our best month since we opened: 41 bookings, up from 26 the year before.',
    authorName: 'Marla Deighan',
    roleAndCompany: 'Owner, Brackley Beach Bike Rentals',
    location: 'Brackley Beach, PE',
    approved: true,
  },
  {
    id: '2',
    quote:
      'We only found out our domain was registered to a former developer when he stopped answering his phone. Getting the registrar and hosting back into our name was the first thing we fixed. Now I get a short note whenever something needs a decision, and nothing changes on the site without us knowing.',
    authorName: 'Corey MacAusland',
    roleAndCompany: 'General Manager, MacAusland Plumbing & Heating',
    location: 'Summerside, PE',
    approved: true,
  },
  {
    id: '3',
    quote:
      'I run the shop on my own, so I do not have time to fight with a website. Adding a product takes about two minutes, and the stock count matches between the online store and the market stall. That was the whole reason we moved.',
    authorName: 'Priya Raman',
    roleAndCompany: 'Founder, Rossignol Candle Co.',
    location: 'Charlottetown, PE',
    approved: true,
  },
  {
    id: '4',
    quote:
      'They asked us to cut two pages we were attached to. They were right. Six pages that answer real questions bring in more enquiries than the twenty-page site we had before.',
    authorName: 'Andrew Bell',
    roleAndCompany: 'Partner, Bell & Whitlock Law',
    location: 'Charlottetown, PE',
    approved: true,
  },
  {
    id: '5',
    quote:
      'The scheduling tool replaced a whiteboard and four group chats. Managers post the week on Thursday afternoon, staff check their phones, and swaps get approved in one place. We stopped double-booking shifts in the first month.',
    authorName: 'Dana Keough',
    roleAndCompany: 'Operations Manager, The Kettle & Creel',
    location: 'Halifax, NS',
    approved: false,
  },
];

export function getApprovedTestimonials(): Testimonial[] {
  return TESTIMONIALS.filter((item) => item.approved);
}
