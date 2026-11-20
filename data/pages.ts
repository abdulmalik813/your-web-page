export interface ProcessStage {
  number: string;
  title: string;
  whatHappens: string;
  whatWeNeed: string;
  whatYouGet: string;
}

export interface ValueCard {
  number: string;
  title: string;
  description: string;
}

export interface SectorItem {
  number: string;
  title: string;
  description: string;
}

export interface RegionTier {
  number: string;
  title: string;
  subtitle: string;
  description: string;
}

export interface LegalSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

export const HOME_PROCESS_STEPS = [
  {
    number: '01',
    title: 'Discover',
    description: 'A call, your numbers and a written scope with a fixed price.',
  },
  {
    number: '02',
    title: 'Design',
    description: 'Page structure first, then layouts you review on your own phone.',
  },
  {
    number: '03',
    title: 'Build',
    description: 'Clean code on a private preview, updated in weekly stages.',
  },
  {
    number: '04',
    title: 'Launch & support',
    description: 'Tested launch, a CMS walkthrough, then help when you need it.',
  },
];

export const PROCESS_STAGES: ProcessStage[] = [
  {
    number: '01',
    title: 'Discover',
    whatHappens:
      'A 45-minute call about your business, your customers and what the site has to achieve. Before it, we read your current site, your Google listing and two or three competitors. Within two working days you get a written summary of the scope, page list, features, timeline and price.',
    whatWeNeed:
      'Your goals in plain terms, links to sites you like and why, plus any logo files, photography or existing copy you already have.',
    whatYouGet:
      'A written scope with a fixed price, a page map and a start date. No deposit until you have read it and said yes.',
  },
  {
    number: '02',
    title: 'Design',
    whatHappens:
      'We settle navigation and page structure in text before opening a design tool. Then we design the key templates at phone, tablet and desktop widths, and you review a clickable prototype rather than flat images. Two rounds of revisions are included; most projects use both.',
    whatWeNeed:
      'One decision-maker who can gather internal opinions into a single set of comments, and feedback within about three working days.',
    whatYouGet:
      'Approved templates, a documented type and colour system, and content lengths you can write to.',
  },
  {
    number: '03',
    title: 'Build',
    whatHappens:
      'Development runs in weekly stages. Each Friday the preview link shows what changed, and you can test it on your own devices. Content goes into the CMS as we build, so the site is never waiting on a last-minute data entry marathon.',
    whatWeNeed:
      'Final text and images by the dates in the scope, or a decision to have us write and source them.',
    whatYouGet:
      'A complete, responsive site on a private preview URL, plus a list of what is finished and what is still open.',
  },
  {
    number: '04',
    title: 'Launch',
    whatHappens:
      'A pre-launch pass covers every form, redirect, page title, sitemap entry, SSL certificate and screen size. We lower DNS TTL a day ahead, switch the domain during a quiet window, then test the live site from a phone on mobile data rather than the office network.',
    whatWeNeed:
      'Final sign-off and registrar access if you manage the domain yourself.',
    whatYouGet:
      'A live site, a tested 301 map from old URLs, a CMS walkthrough recording and the completed launch checklist.',
  },
  {
    number: '05',
    title: 'Support',
    whatHappens:
      'The first 30 days cover fixes at no charge. After that, Care & Support handles hosting oversight, dependency updates on a copy of the site, off-site backups with a restore check, uptime monitoring and small content changes. Larger additions are quoted separately.',
    whatWeNeed:
      'Nothing routine. Email or call when something needs changing, and tell us early if a seasonal deadline is coming.',
    whatYouGet:
      'A site that stays patched and backed up, with a short monthly note on anything that needed attention.',
  },
];

export const ABOUT_VALUES: ValueCard[] = [
  {
    number: '01',
    title: 'Plain answers',
    description:
      'If a cheaper approach will do the job, we say so. If a feature you asked for will not earn its keep, we say that too, before it is built.',
  },
  {
    number: '02',
    title: 'Built to be handed over',
    description:
      'Domains in your name, hosting in your account, code in a repository you control. Nothing about your site depends on us being reachable forever.',
  },
  {
    number: '03',
    title: 'Accessibility is not an extra',
    description:
      'Semantic headings, visible focus states, 4.5:1 body contrast and forms that work with a keyboard. These are checked before launch, not after a complaint.',
  },
  {
    number: '04',
    title: 'Small, local, accountable',
    description:
      'You deal with the people doing the work. No account manager relay, no offshore handoff, and a phone number that reaches someone in Charlottetown.',
  },
];

export const REGION_TIERS: RegionTier[] = [
  {
    number: '01',
    title: 'On the Island',
    subtitle: 'Charlottetown and across PEI',
    description:
      'We meet in person in Charlottetown, Summerside, Montague or wherever you work. For local projects that usually means a kickoff meeting, one design review and a launch walkthrough at your desk.',
  },
  {
    number: '02',
    title: 'Across Canada',
    subtitle: 'Remote, with visits when they help',
    description:
      'Clients from Halifax to Victoria work over video calls and a shared preview link. We keep at least four hours of overlap with your working day and put decisions in writing after each call.',
  },
  {
    number: '03',
    title: 'Worldwide',
    subtitle: 'Remote-first, any time zone',
    description:
      'We have built for teams in the United States and the UK. Calls are booked in your working hours, and written handover notes mean progress does not depend on overlapping calendars.',
  },
];

export const SECTORS: SectorItem[] = [
  {
    number: '01',
    title: 'Tourism & hospitality',
    description:
      'Seasonal dates, phone-first browsing and a booking enquiry that works on hotel wifi. We build for the July rush and the quiet January.',
  },
  {
    number: '02',
    title: 'Trades & contractors',
    description:
      'Service areas, licence details, an emergency phone number that is tappable, and photos of finished work rather than stock imagery.',
  },
  {
    number: '03',
    title: 'Restaurants & cafés',
    description:
      'Menus as real text instead of a PDF, hours that can be changed from a phone, and a map link that opens the right app.',
  },
  {
    number: '04',
    title: 'Retail & makers',
    description:
      'One stock count across shop and website, HST set up correctly, local pickup and shipping rates that match what the post office charges.',
  },
  {
    number: '05',
    title: 'Professional services',
    description:
      'Clear explanations of what you handle, who you serve and how a first meeting works, without a wall of legal jargon on the home page.',
  },
  {
    number: '06',
    title: 'Startups & non-profits',
    description:
      'A first release that real users can sign up for, member portals, donation flows and campaign pages that can be updated by volunteers.',
  },
];

export const REMOTE_PRACTICES: ValueCard[] = [
  {
    number: '01',
    title: 'Video calls that start on time',
    description:
      'A short agenda before each call and a written recap after, so nobody has to remember what was decided.',
  },
  {
    number: '02',
    title: 'Private previews',
    description:
      'A link you can open on your phone, tablet or laptop at any hour. No staging password to dig up.',
  },
  {
    number: '03',
    title: 'Written decisions',
    description:
      'Scope changes, prices and dates go in writing. If it is not in the recap, it is not agreed.',
  },
  {
    number: '04',
    title: 'A real handover',
    description:
      'Domains, hosting, repositories, analytics and CMS accounts transferred to you, with the credentials documented.',
  },
];

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    heading: '1. Who we are',
    paragraphs: [
      'This website is operated by NightTech Services Inc., doing business under the trade name Your Web Page ("we", "us", "our"), based in Charlottetown, Prince Edward Island, Canada.',
      'This Privacy Policy explains how we collect, use, disclose and safeguard personal information in accordance with Canada’s Personal Information Protection and Electronic Documents Act (PIPEDA) and applicable provincial privacy law.',
    ],
  },
  {
    heading: '2. Information we collect',
    bullets: [
      'Information you provide directly: such as your name, business name, email address, telephone number, location, current website URL and project notes submitted through our Contact form, or sent to us by email or phone.',
      'Technical and operational data: basic server logs (such as request timestamps, browser user-agent and requested paths) used strictly for security, reliability and spam prevention.',
      'Essential technical storage required for standard site security and form submission handling.',
    ],
  },
  {
    heading: '3. How we use personal information',
    paragraphs: [
      'We use the personal information we collect solely to respond to enquiries, scope and deliver requested website or software projects, maintain site security and reliability, and satisfy Canadian legal, tax and accounting obligations.',
      'We do not sell, rent or trade your personal information to third parties.',
    ],
  },
  {
    heading: '4. Sharing with service providers',
    paragraphs: [
      'We share personal information only with trusted infrastructure, hosting and email delivery providers acting on our behalf to operate this website and communicate with you, or where disclosure is required by Canadian law.',
    ],
  },
  {
    heading: '5. Cross-border processing',
    paragraphs: [
      'While we operate from Prince Edward Island, Canada, some third-party hosting, cloud infrastructure and email delivery providers we use may store or process information outside Canada (including in the United States or other jurisdictions). While outside Canada, information may be subject to the laws of those jurisdictions.',
    ],
  },
  {
    heading: '6. Retention and safeguards',
    paragraphs: [
      'We retain personal information only for as long as necessary to fulfill the purposes described in this policy or as required by applicable law. We maintain reasonable administrative, technical and physical safeguards against unauthorized access or disclosure, though no method of electronic transmission or storage is completely immune to risk.',
    ],
  },
  {
    heading: '7. Access, correction and consent',
    paragraphs: [
      'Under Canadian privacy law, you may request access to the personal information we hold about you, ask us to correct inaccuracies, or withdraw consent to further use subject to legal or contractual restrictions.',
    ],
  },
  {
    heading: '8. Privacy contact',
    paragraphs: [
      'To make a privacy request or ask a question about how NightTech Services Inc. (operating as Your Web Page) handles personal information, please email hello@yourwebpage.ca or call (902) 629-9691.',
    ],
  },
  {
    heading: '9. Updates to this policy',
    paragraphs: [
      'We may update this Privacy Policy from time to time to reflect operational or legal changes. When we do, we will post the updated version on this page with a revised date.',
    ],
  },
];

export const TERMS_SECTIONS: LegalSection[] = [
  {
    heading: '1. Acceptance of terms',
    paragraphs: [
      'This website is operated by NightTech Services Inc., doing business as Your Web Page ("we", "us", "our"), in Charlottetown, Prince Edward Island, Canada. By accessing or using this website, you agree to these Terms of Service. If you do not agree, please discontinue use of the site.',
    ],
  },
  {
    heading: '2. Scope of services',
    paragraphs: [
      'Descriptions of services on this website are provided for general informational purposes. Every client engagement is scoped individually and governed by a separate written agreement outlining project deliverables, timelines, ownership and responsibilities.',
    ],
  },
  {
    heading: '3. Intellectual property',
    paragraphs: [
      'Unless stated otherwise, all copy, layout structure, graphics and source code published on this website belong to NightTech Services Inc. You may view and print pages for personal or prospective business evaluation, but you may not reproduce, republish or redistribute site materials for commercial use without prior written permission.',
    ],
  },
  {
    heading: '4. Project information',
    paragraphs: [
      'Information about services and project work is provided for general reference. Engagement details, deliverables and outcomes are defined in the applicable written agreement.',
    ],
  },
  {
    heading: '5. Disclaimer of warranties',
    paragraphs: [
      'This website is provided on an "as is" and "as available" basis. While we make every reasonable effort to keep information accurate and reliable, we make no warranty that the site will be uninterrupted, error-free or entirely up to date at all times.',
    ],
  },
  {
    heading: '6. Limitation of liability',
    paragraphs: [
      'To the fullest extent permitted by applicable law, NightTech Services Inc., its directors, officers and contractors are not liable for any indirect, incidental or consequential damages arising from your use of, or inability to use, this website or its contents.',
    ],
  },
  {
    heading: '7. External links',
    paragraphs: [
      'Any links to third-party websites are provided solely for convenience. We do not endorse and are not responsible for the content, availability or privacy practices of external sites.',
    ],
  },
  {
    heading: '8. Governing law',
    paragraphs: [
      'These Terms of Service and any dispute arising out of your use of this website are governed by the laws of Prince Edward Island and the applicable federal laws of Canada, without regard to conflict-of-law principles.',
    ],
  },
  {
    heading: '9. Contact',
    paragraphs: [
      'Questions regarding these Terms of Service may be sent to NightTech Services Inc. (operating as Your Web Page) at hello@yourwebpage.ca or by telephone at (902) 629-9691.',
    ],
  },
];
