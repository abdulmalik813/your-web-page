export interface SocialLinks {
  linkedin: string;
  github: string;
  instagram: string;
  x: string;
}

export function getSocialLinks(social?: Partial<{ [K in keyof SocialLinks]: string | null }> | null) {
  const platforms: { key: keyof SocialLinks; label: string }[] = [
    { key: 'linkedin', label: 'LinkedIn' },
    { key: 'github', label: 'GitHub' },
    { key: 'instagram', label: 'Instagram' },
    { key: 'x', label: 'X' },
  ];

  return platforms.flatMap(({ key, label }) => {
    const value = social?.[key]?.trim();
    if (!value) return [];
    try {
      const url = new URL(value);
      return url.protocol === 'http:' || url.protocol === 'https:' ? [{ label, href: url.href }] : [];
    } catch {
      return [];
    }
  });
}

export const COMPANY = {
  brand: 'Your Web Page',
  shortMark: 'YOUR WEB PAGE',
  domain: 'yourwebpage.ca',
  url: 'https://yourwebpage.ca',
  email: 'hello@yourwebpage.ca',
  phone: '(902) 629-9691',
  phoneHref: 'tel:+19026299691',
  schemaTelephone: '+1-902-629-9691',
  location: {
    city: 'Charlottetown',
    province: 'Prince Edward Island',
    provinceCode: 'PE',
    country: 'Canada',
    countryCode: 'CA',
    summary: 'Charlottetown, Prince Edward Island, Canada',
    short: 'Charlottetown, PEI',
  },
  legal: {
    entity: 'NightTech Services Inc.',
    tradeNameStatement: 'Your Web Page is a trade name of NightTech Services Inc.',
    copyrightHolder: 'NightTech Services Inc.',
    jurisdiction:
      'the laws of Prince Edward Island and the federal laws of Canada that apply there',
  },
  reach: {
    summary:
      'Based in Charlottetown, serving Prince Edward Island, the rest of Canada and clients worldwide.',
    workingStyle: 'Remote-first, with in-person meetings available around Charlottetown.',
    areaServed: ['Prince Edward Island', 'Canada', 'Worldwide'] as const,
  },
  social: {
    linkedin: '',
    github: '',
    instagram: '',
    x: '',
  } satisfies SocialLinks,
} as const;
