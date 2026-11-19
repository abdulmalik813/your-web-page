export interface ContactInput {
  name: string;
  email: string;
  phone?: string;
  type: string;
  message: string;
  company_website?: string;
}

export interface StartProjectInput {
  biz: string;
  yname: string;
  email: string;
  phone?: string;
  site?: string;
  where?: string;
  goals: string;
  pages?: string[];
  features?: string[];
  timeline?: string;
  heard?: string;
  company_website?: string;
}

export interface ValidationResult<T> {
  valid: boolean;
  honeypotTriggered: boolean;
  errors: Record<string, string>;
  sanitized: T;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

export function isValidOptionalUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function validateContactPayload(
  raw: Partial<ContactInput>
): ValidationResult<ContactInput> {
  const companyWebsite = String(raw.company_website ?? '').trim();
  const sanitized: ContactInput = {
    name: String(raw.name ?? '').trim(),
    email: String(raw.email ?? '').trim(),
    phone: String(raw.phone ?? '').trim(),
    type: String(raw.type ?? '').trim(),
    message: String(raw.message ?? '').trim(),
    company_website: companyWebsite,
  };

  if (companyWebsite.length > 0) {
    return {
      valid: true,
      honeypotTriggered: true,
      errors: {},
      sanitized,
    };
  }

  const errors: Record<string, string> = {};

  if (!sanitized.name) {
    errors.name = 'Please fill in this field.';
  }
  if (!sanitized.email) {
    errors.email = 'Please fill in this field.';
  } else if (!isValidEmail(sanitized.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!sanitized.type) {
    errors.type = 'Please fill in this field.';
  }
  if (!sanitized.message) {
    errors.message = 'Please fill in this field.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    honeypotTriggered: false,
    errors,
    sanitized,
  };
}

export function validateStartProjectPayload(
  raw: Partial<StartProjectInput>
): ValidationResult<StartProjectInput> {
  const companyWebsite = String(raw.company_website ?? '').trim();
  const sanitized: StartProjectInput = {
    biz: String(raw.biz ?? '').trim(),
    yname: String(raw.yname ?? '').trim(),
    email: String(raw.email ?? '').trim(),
    phone: String(raw.phone ?? '').trim(),
    site: String(raw.site ?? '').trim(),
    where: String(raw.where ?? '').trim(),
    goals: String(raw.goals ?? '').trim(),
    pages: Array.isArray(raw.pages) ? raw.pages.map((p) => String(p).trim()).filter(Boolean) : [],
    features: Array.isArray(raw.features)
      ? raw.features.map((f) => String(f).trim()).filter(Boolean)
      : [],
    timeline: String(raw.timeline ?? '').trim(),
    heard: String(raw.heard ?? '').trim(),
    company_website: companyWebsite,
  };

  if (companyWebsite.length > 0) {
    return {
      valid: true,
      honeypotTriggered: true,
      errors: {},
      sanitized,
    };
  }

  const errors: Record<string, string> = {};

  if (!sanitized.biz) {
    errors.biz = 'Please fill in this field.';
  }
  if (!sanitized.yname) {
    errors.yname = 'Please fill in this field.';
  }
  if (!sanitized.email) {
    errors.email = 'Please fill in this field.';
  } else if (!isValidEmail(sanitized.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (sanitized.site && !isValidOptionalUrl(sanitized.site)) {
    errors.site = 'Please include https:// or http:// for your website URL.';
  }
  if (!sanitized.goals) {
    errors.goals = 'Please fill in this field.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    honeypotTriggered: false,
    errors,
    sanitized,
  };
}
