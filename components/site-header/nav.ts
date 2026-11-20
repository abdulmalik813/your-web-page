import { resolveItemLink, type CmsLink, type ResolvedLink } from '@/lib/links';

export type NavChild = {
  id?: string;
  link: ResolvedLink;
};

export type NavDropdown = {
  ctaLabel?: string | null;
  eyebrow?: string | null;
  heading?: string | null;
};

export type NavItem = {
  children: NavChild[];
  dropdown: NavDropdown;
  id?: string;
  link: ResolvedLink;
};

type SourceNavItem = {
  children?: SourceNavItem[];
  dropdownCtaLabel?: string | null;
  dropdownEyebrow?: string | null;
  dropdownHeading?: string | null;
  id?: string;
  [key: string]: unknown;
};

export function buildNavItems(navigation: { items?: SourceNavItem[] | null }): NavItem[] {
  return (navigation.items ?? []).flatMap((item) => {
    const link = resolveItemLink(item as unknown as CmsLink);
    if (!link) return [];

    const children = (item.children ?? []).flatMap((child) => {
      const childLink = resolveItemLink(child as unknown as CmsLink);
      return childLink ? [{ id: child.id, link: childLink }] : [];
    });

    return [
      {
        id: item.id,
        link,
        children,
        dropdown: {
          ctaLabel: item.dropdownCtaLabel,
          eyebrow: item.dropdownEyebrow,
          heading: item.dropdownHeading,
        },
      },
    ];
  });
}

export function isSectionActive(pathname: string, prefix: string): boolean {
  return pathname === prefix || (prefix !== '/' && pathname.startsWith(`${prefix}/`));
}
