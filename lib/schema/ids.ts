import { getBaseUrl } from '../seo';

export function organizationId(): string {
  return `${getBaseUrl()}/#organization`;
}

export function websiteId(): string {
  return `${getBaseUrl()}/#website`;
}
