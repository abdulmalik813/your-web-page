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
          'Businesses and organizations of every size, from sole proprietors and startups to established companies and non-profits. We are based in Charlottetown and work with clients across Prince Edward Island, throughout Canada and around the world.',
        featuredOnHome: true,
      },
      {
        id: 'what-to-prepare',
        question: 'What do I need before we start?',
        answer:
          'A general idea of what you want the website or software to accomplish. Examples of sites you like are helpful, too, though you do not need finished text or designs ready before reaching out. We will help you map out what to gather.',
      },
      {
        id: 'how-projects-are-scoped',
        question: 'How do you work out what a project involves?',
        answer:
          'Every project is scoped individually after a conversation with you—looking at the pages, features, content, integrations and timeline involved. Before any work starts, you receive a clear written plan covering scope and next steps. The best first step is to get in touch.',
        featuredOnHome: true,
      },
      {
        id: 'how-to-get-in-touch',
        question: 'How do I get in touch?',
        answer:
          'You can send a message through our Contact or Start a Project pages, email hello@yourwebpage.ca, or call (902) 629-9691.',
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
          'Yes. We work with clients across Canada and internationally. Most projects run smoothly online from first conversation to launch, and we are glad to meet in person around Charlottetown whenever that suits.',
        featuredOnHome: true,
      },
      {
        id: 'how-remote-work-runs',
        question: 'How does remote work run day to day?',
        answer:
          'We combine video or phone calls at key milestones with a private preview link you can open on any device at any time, backed up by concise written summaries after each step. Nothing depends on being in the same room.',
      },
      {
        id: 'time-zones',
        question: 'What about time zones?',
        answer:
          'We schedule calls around your normal working hours wherever possible, and keep written updates thorough so progress never stalls waiting on a live meeting.',
      },
      {
        id: 'multilingual-sites',
        question: 'Can you build a site in more than one language?',
        answer:
          'Yes. We can structure websites for English, French or additional languages. You provide the translated copy or work with a translator you trust, and we build the routing and layout to support every language cleanly.',
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
          'Ownership is set out clearly in writing within each project agreement, and we register or keep domain names in your name so you always remain in control of your web address.',
        featuredOnHome: true,
      },
      {
        id: 'self-editing',
        question: 'Can I edit the site myself?',
        answer:
          'Yes, wherever regular updates make sense. We pair your build with an appropriate content editing workflow and walk you through how to publish changes confidently.',
      },
      {
        id: 'mobile-compatibility',
        question: 'Will it work on phones?',
        answer:
          'Yes. Every website and application we build is designed mobile-first and tested across real phone, tablet and desktop screen sizes before launch.',
      },
      {
        id: 'redesign-existing-site',
        question: 'Can you redesign or take over an existing site?',
        answer:
          'Yes. We begin by reviewing what you currently have—code, hosting, domain setup and content—and give you an honest recommendation on whether to improve what is there or rebuild cleanly.',
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
          'We work through a full launch checklist, complete a guided handover with your team and stay available for questions. Ongoing Website Care & Support is available if you would like us to handle hosting, updates and day-to-day upkeep.',
        featuredOnHome: true,
      },
      {
        id: 'who-hosts',
        question: 'Who hosts the site?',
        answer:
          'We can set up and manage hosting on reliable infrastructure for you, or deploy cleanly to a hosting provider your organization already uses.',
      },
      {
        id: 'adding-features-later',
        question: 'Can you add features later?',
        answer:
          'Yes. Websites and custom software evolve as your business grows. Because we keep code clean and modular, adding new pages, online stores, portals or integrations later is straightforward.',
      },
      {
        id: 'international-support',
        question: 'Do you support clients outside Canada after launch?',
        answer:
          'Yes. Website Care & Support is delivered remotely, so hosting oversight, updates, backups and ongoing assistance work the exact same way regardless of where your business is located.',
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
