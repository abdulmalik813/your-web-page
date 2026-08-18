import { ProjectItem, ServiceItem } from './types';

export const HERO_SHOWCASE_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuD7s3LzJkOoQd_uXty0j33vYmcpb2sOjEvxc0FFsQHac76V_Y9mc9Vv5yvWhzILGM6l_ZGQ3UwWV4U8-ejguJAns5n8-bXIGy0xy1cxnNElD9dmlzVGAbsRTlxcUGaBrvvLPtpwVUhnghj0rej1oG28hZzYYAuq8oIELiMjTAARWA5pRUTl4eliJwwJNC6Q8n8me0L38bPJqSvwqxzarDE4rvXnCoEzaboJZdKU5fNNHcx4vQRSQKuw";

export const BRUTALIST_BUILDING_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuBpQPLDK7gOl3JYuXUtoa3-kphVeuKhBX878-kqmWGXXIeZJ1LJkJ8r_A39WK1Inmp_sr_D57rt0wGzs81Fr2SfKr1Ns0SBu9q0Lc7gsYTPSn0vIALIPd1GaCdNn9SPC8_pujapthVPTK-8Xfsj_oi3MHtH35tYct1drnrpsW6rav2iK4n8Ms6lDYOJM1FKldOrBVpOyXPTlX6y5qOd6fxvywFcTprITk6Mby-B-aQoC6e5fgHPw4D9";

export const SERVICES: ServiceItem[] = [
  {
    id: 'web-design',
    title: 'Website Design',
    icon: 'web',
    tagline: 'Clear, custom designs for your business.',
    badge: 'UI/UX',
    description: 'We design a clear, custom website that reflects your business and works well on every screen.',
    features: [
      'Custom visual design',
      'User experience strategy',
      'Responsive layouts',
      'Editorial-style interfaces'
    ]
  },
  {
    id: 'development',
    title: 'Development',
    icon: 'code',
    tagline: 'Fast, reliable websites built to last.',
    badge: 'CODE',
    description: 'We turn the approved design into a fast, reliable website that is easy to maintain.',
    features: [
      'Clean code principles',
      'React / Next.js performance',
      'Custom CMS integration',
      'Room to grow'
    ]
  },
  {
    id: 'hosting',
    title: 'Hosting',
    icon: 'dns',
    tagline: 'Secure and dependable website hosting.',
    badge: 'INFRA',
    description: 'We host your website on secure, dependable infrastructure and keep it available to your customers.',
    features: [
      'Zero-downtime Cloud deployment',
      'Global Edge CDN integration',
      'DDoS mitigation & SSL protection',
      'Automated daily snapshot backups'
    ]
  },
  {
    id: 'maintenance',
    title: 'Maintenance',
    icon: 'build',
    tagline: 'Updates, fixes, and ongoing support.',
    badge: 'OPS',
    description: 'We handle updates, security checks, fixes, and regular improvements after launch.',
    features: [
      '24/7 uptime monitoring',
      'Quarterly core security audits',
      'Performance re-indexing',
      'Priority technical SLA response'
    ]
  },
  {
    id: 'seo',
    title: 'SEO',
    icon: 'search',
    tagline: 'Help customers find you online.',
    badge: 'GROWTH',
    description: 'We improve your site structure and content so search engines and customers can find you.',
    features: [
      'Market & competitor research',
      'Technical SEO auditing',
      'Clear content structure',
      'Conversion rate optimization (CRO)'
    ]
  },
  {
    id: 'business-email',
    title: 'Business Email',
    icon: 'mail',
    tagline: 'Professional communication channels.',
    badge: 'MAIL',
    description: 'We set up professional email addresses using your business domain.',
    features: [
      'Custom domain routing',
      'DKIM, SPF & DMARC verification',
      'Google Workspace migration',
      'Secure inbox setup'
    ]
  },
  {
    id: 'domains',
    title: 'Domains',
    icon: 'language',
    tagline: 'Domain registration and management.',
    badge: 'DNS',
    description: 'We help you choose, register, connect, and manage your website domain.',
    features: [
      'Namespace acquisition',
      'DNS records orchestration',
      'WHOIS privacy locking',
      'Multi-domain forwarding rules'
    ]
  },
  {
    id: 'custom-web-apps',
    title: 'Custom Web Apps',
    icon: 'apps',
    tagline: 'Custom tools built for the way you work.',
    badge: 'CUSTOM',
    description: 'We build custom web tools, dashboards, and features around your business needs.',
    features: [
      'React & TypeScript engines',
      'Complex workflow automation',
      'Custom API & Database integrations',
      'High-density dashboard interfaces'
    ]
  }
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'brutalist-precision',
    title: 'BRUTALIST // PRECISION',
    subtitle: 'Defining architecture through minimal design and structural clarity.',
    category: 'Design',
    year: '2024',
    imageUrl: HERO_SHOWCASE_IMAGE,
    altText: 'Monolithic digital display in brutalist concrete setting',
    description: 'A clear, interactive website for an architectural firm, designed to present its work and services.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    metrics: [
      { label: 'Lighthouse Score', value: '100 / 100' },
      { label: 'Page Load Speed', value: '0.4s' },
      { label: 'Bounce Rate', value: '-34%' }
    ],
    client: 'Studio Kawaguchi & Co.'
  },
  {
    id: 'project-kawaguchi',
    title: 'PROJECT KAWAGUCHI',
    subtitle: 'High-contrast editorial portal for monolithic concrete structures.',
    category: 'Full-Stack',
    year: '2023',
    imageUrl: BRUTALIST_BUILDING_IMAGE,
    altText: 'Brutalist concrete building angles and sharp shadows',
    description: 'An online exhibition showcasing concrete projects across Tokyo and Osaka.',
    techStack: ['React', 'TypeScript', 'Cloud Infra', 'Tailwind'],
    metrics: [
      { label: 'Organic Traffic', value: '+210%' },
      { label: 'Inquiry Volume', value: '3.4x' }
    ],
    client: 'Kawaguchi Block'
  },
  {
    id: 'residence-h',
    title: 'RESIDENCE H',
    subtitle: 'Minimalist residential portfolio with architectural blueprints.',
    category: 'Strategy',
    year: '2023',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    altText: 'Minimalist white concrete home exterior with sharp shadows',
    description: 'Brand positioning and immersive digital brochure for luxury residential developments in Kyoto.',
    techStack: ['React', 'Next.js', 'PostCSS'],
    metrics: [
      { label: 'Conversion Rate', value: '8.2%' },
      { label: 'Avg Time on Site', value: '4m 12s' }
    ],
    client: 'Residence H Capital'
  },
  {
    id: 'museum-of-light',
    title: 'MUSEUM OF LIGHT',
    subtitle: 'Void & illuminance interactive digital exhibition.',
    category: 'Development',
    year: '2022',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    altText: 'Stark light beam passing through dark concrete hall',
    description: 'An interactive experience that shows light and shadow in a virtual space.',
    techStack: ['Canvas API', 'TypeScript', 'Tailwind CSS'],
    metrics: [
      { label: 'Interactive Dwell Time', value: '6m 45s' },
      { label: 'A design award', value: 'Gold Winner' }
    ],
    client: 'Vold Foundation'
  }
];
