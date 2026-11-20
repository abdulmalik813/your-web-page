export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  featuredOnHome?: boolean;
}

export interface FaqGroup {
  title: string;
  items: FaqItem[];
}

export const FAQ_GROUPS: FaqGroup[] = [
  {
    title: 'Getting started',
    items: [
      {
        id: 'who-we-work-with',
        question: 'Who do you work with?',
        answer:
          'Small and mid-sized businesses, non-profits and founders, mostly on Prince Edward Island and across Canada. Recent work includes a bike rental shop in Brackley Beach, a plumbing company in Summerside, a candle maker on Queen Street and a three-location café group in Halifax.',
        featuredOnHome: true,
      },
      {
        id: 'what-to-prepare',
        question: 'What do I need before we start?',
        answer:
          'A rough idea of what the site should do and who it is for. Links to two or three sites you like, and a note on what works about each, are more useful than a written brief. We will ask for the rest during the first call.',
      },
      {
        id: 'how-projects-are-scoped',
        question: 'How long does a project take, and how is it priced?',
        answer:
          'A five-page marketing site usually takes four to six weeks from kickoff. A store with a hundred or more products takes six to ten. Custom software ships a first usable version in six to eight weeks and continues in two-week milestones. Every project gets a fixed written quote for a defined scope, with the payment schedule set out in that quote.',
        featuredOnHome: true,
      },
      {
        id: 'how-to-get-in-touch',
        question: 'How do I get in touch?',
        answer:
          'Use the contact form, email hello@yourwebpage.ca, or call (902) 629-9691. Messages sent during the week get a reply within one business day.',
      },
    ],
  },
  {
    title: 'Working with us from anywhere',
    items: [
      {
        id: 'clients-outside-pei',
        question: 'Do you work with clients outside PEI?',
        answer:
          'Yes. About half our work is outside the Island, including Ontario, BC and the United States. Calls happen over video, and in-person meetings are easy if you are in or visiting Charlottetown.',
        featuredOnHome: true,
      },
      {
        id: 'how-remote-work-runs',
        question: 'How does remote work run day to day?',
        answer:
          'Each stage gets a short call, a private preview link and a written summary of what changed and what we need from you. You can open the preview on your own phone at any time; you do not need a staging login or a developer to look at it.',
      },
      {
        id: 'time-zones',
        question: 'What about time zones?',
        answer:
          'We keep at least four hours of overlap with your working day. Written updates carry the detail, so a decision never waits for the next live call.',
      },
      {
        id: 'multilingual-sites',
        question: 'Can you build a site in more than one language?',
        answer:
          'Yes. We have built English and French sites with separate URLs and language switching. You supply or commission the translation; we structure the routing so both versions stay in sync when content changes.',
      },
    ],
  },
  {
    title: 'Building your site',
    items: [
      {
        id: 'website-ownership',
        question: 'Do I own my website?',
        answer:
          'Yes. Domains are registered in your name, hosting sits in your account, and the code repository transfers to you at handover. Ownership terms are written into the project agreement so there is no ambiguity later.',
        featuredOnHome: true,
      },
      {
        id: 'self-editing',
        question: 'Can I edit the site myself?',
        answer:
          'Yes. Pages, services, projects, newsletters and the navigation menu are edited in the CMS. You get a walkthrough recording and a short written guide. If you would rather not touch it, we handle changes as part of Care & Support.',
      },
      {
        id: 'mobile-compatibility',
        question: 'Will it work on phones?',
        answer:
          'Every layout is designed at 360 px first, then checked on a phone, tablet and desktop before launch. We also test on a throttled connection, which is closer to a real phone on the road than office wifi.',
      },
      {
        id: 'redesign-existing-site',
        question: 'Can you redesign or take over an existing site?',
        answer:
          'Yes. We start with an audit of the code, hosting, domain records and content, then tell you honestly whether an update or a rebuild costs less over the next two years. We have taken over sites from three different agencies and two absent developers.',
      },
    ],
  },
  {
    title: 'After launch',
    items: [
      {
        id: 'after-launch-support',
        question: 'What happens after launch?',
        answer:
          'You get a walkthrough of the CMS, a copy of the launch checklist and the repository. For the first 30 days we fix anything that breaks at no charge. After that, Care & Support covers hosting, updates, backups and small changes.',
        featuredOnHome: true,
      },
      {
        id: 'who-hosts',
        question: 'Who hosts the site?',
        answer:
          'Usually us, on Cloudflare or a comparable host, billed through your Care & Support plan. If your organization already has a host and a reason to stay, we deploy there instead and document the setup.',
      },
      {
        id: 'adding-features-later',
        question: 'Can you add features later?',
        answer:
          'Yes. Because the code is ours from the start, adding a booking flow, a store or a client portal later does not mean rebuilding the site. We quote it as a separate piece of work with its own scope.',
      },
      {
        id: 'international-support',
        question: 'Do you support clients outside Canada after launch?',
        answer:
          'Yes. Support runs over email and scheduled calls, and the CMS works from any browser. Time zone differences have not been a problem for clients in the UK or on the US west coast.',
      },
    ],
  },
];

export function getFeaturedFaqs(): FaqItem[] {
  const featured: FaqItem[] = [];
  for (const group of FAQ_GROUPS) {
    for (const item of group.items) {
      if (item.featuredOnHome) {
        featured.push(item);
      }
    }
  }
  return featured;
}
