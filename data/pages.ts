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
    description: 'We learn your business, your customers and your goals.',
  },
  {
    number: '02',
    title: 'Design',
    description: 'Structure and layouts you can inspect and approve.',
  },
  {
    number: '03',
    title: 'Build',
    description: 'Clean, fast, mobile-first code on a private preview.',
  },
  {
    number: '04',
    title: 'Launch & support',
    description: 'We go live carefully, then stay available to help.',
  },
];

export const PROCESS_STAGES: ProcessStage[] = [
  {
    number: '01',
    title: 'Discover',
    whatHappens:
      'We start with a straightforward conversation about your business, who your customers are and what the website or software needs to accomplish. We review your current site if you have one, look at comparable businesses and take stock of existing copy, photos and tools.',
    whatWeNeed:
      'Your practical goals, a few websites you like (and why), plus any existing logos, photography or draft text.',
    whatYouGet:
      'A clear written summary covering scope, page structure, key features, responsibilities and expected timeline.',
  },
  {
    number: '02',
    title: 'Design',
    whatHappens:
      'We organize the navigation and page structure first, then design the key screens for both desktop and mobile phones. You review real, clickable layouts early so we can refine hierarchy and visual tone together.',
    whatWeNeed:
      'Honest feedback on layout drafts and one designated decision-maker on your side to keep approvals crisp.',
    whatYouGet:
      'Approved layouts for your core pages along with a consistent typography, colour and component system.',
  },
  {
    number: '03',
    title: 'Build',
    whatHappens:
      'We write clean, fast, accessible code in steady stages. You receive access to a private preview URL where you can test pages on your own phone and computer as the site takes shape.',
    whatWeNeed:
      'Final text and imagery, or agreement on an editing schedule if we are helping structure the content.',
    whatYouGet:
      'A working, responsive website or application running on a private preview link before anything goes public.',
  },
  {
    number: '04',
    title: 'Launch',
    whatHappens:
      'We work through a comprehensive pre-launch check: forms, email delivery, redirects from old URLs, search metadata, SSL security and cross-device testing. Once you sign off, we handle the DNS switch and verify everything live.',
    whatWeNeed:
      'Your final sign-off and registrar access if you already manage your domain name.',
    whatYouGet:
      'A fast, live website or application, a practical walkthrough for your team and a completed launch checklist.',
  },
  {
    number: '05',
    title: 'Support',
    whatHappens:
      'Websites and software keep working best when someone minds the details. Our optional Website Care & Support covers managed hosting, routine software updates, tested backups, security monitoring and direct help whenever you need a change.',
    whatWeNeed:
      'Nothing day to day—just reach out by email or phone whenever you want to update content or add capabilities.',
    whatYouGet:
      'A dependable, secure site that stays current over time, backed by people who already know how it is built.',
  },
];

export const ABOUT_VALUES: ValueCard[] = [
  {
    number: '01',
    title: 'Plain language',
    description:
      'No jargon or technical smoke. We explain options, trade-offs and next steps clearly so you can make confident decisions.',
  },
  {
    number: '02',
    title: 'Built to last',
    description:
      'Clean code, modern standards and sensible dependencies, keeping your site fast today and straightforward to update next year.',
  },
  {
    number: '03',
    title: 'Accessible by default',
    description:
      'High-contrast typography, logical headings, keyboard navigation and semantic HTML built into every page from the ground up.',
  },
  {
    number: '04',
    title: 'Accountable',
    description:
      'Clear scope in writing, realistic schedules and real people in Charlottetown who answer emails and pick up the phone.',
  },
];

export const REGION_TIERS: RegionTier[] = [
  {
    number: '01',
    title: 'On the Island',
    subtitle: 'Charlottetown and across PEI',
    description:
      'We are based in Charlottetown and glad to meet in person across Prince Edward Island—over coffee, at your shop or office, or for a working session with your team.',
  },
  {
    number: '02',
    title: 'Across Canada',
    subtitle: 'Remote, with visits when helpful',
    description:
      'Clients from the Maritimes to British Columbia work with us over video calls, shared previews and concise written notes, with travel arranged when a project genuinely benefits.',
  },
  {
    number: '03',
    title: 'Worldwide',
    subtitle: 'Remote-first, any time zone',
    description:
      'We build for organizations outside Canada too. Meetings are booked around your working hours, and written documentation ensures decisions never wait on overlapping schedules.',
  },
];

export const SECTORS: SectorItem[] = [
  {
    number: '01',
    title: 'Tourism & hospitality',
    description:
      'Seasonal demand, travellers searching on their phones, and clear paths to booking enquiries.',
  },
  {
    number: '02',
    title: 'Trades & contractors',
    description:
      'Clear service areas, fast contact options on mobile, and clean galleries of completed work.',
  },
  {
    number: '03',
    title: 'Restaurants & cafés',
    description:
      'Readable menus, accurate seasonal hours and locations that work instantly on phones.',
  },
  {
    number: '04',
    title: 'Retail & makers',
    description:
      'Online storefronts with Canadian taxes, local pickup or global shipping, and clear product pages.',
  },
  {
    number: '05',
    title: 'Professional services',
    description:
      'Plain-language explanations of your practice and friction-free ways for prospective clients to reach out.',
  },
  {
    number: '06',
    title: 'Startups & non-profits',
    description:
      'Custom software, member portals, SaaS products and campaign sites built to grow steadily.',
  },
];

export const REMOTE_PRACTICES: ValueCard[] = [
  {
    number: '01',
    title: 'Video calls',
    description:
      'Focused check-ins via video or phone at each milestone, scheduled around your local working hours.',
  },
  {
    number: '02',
    title: 'Private previews',
    description:
      'Follow every stage on a private preview link from your phone, tablet or desktop whenever it suits you.',
  },
  {
    number: '03',
    title: 'Written updates',
    description:
      'Clear written recaps after every conversation and milestone so scope and decisions stay on record.',
  },
  {
    number: '04',
    title: 'Proper handover',
    description:
      'Domains, repositories, credentials and practical documentation handed over cleanly at launch.',
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
      'Information you provide directly: such as your name, business name, email address, telephone number, location, current website URL and project notes submitted through our Contact or Start a Project forms, or sent to us by email or phone.',
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
