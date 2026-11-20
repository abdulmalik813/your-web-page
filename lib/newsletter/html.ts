const entities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, (character) => entities[character] || character);
}

export function safeUrl(value: unknown, base: string): string {
  const raw = String(value || '');
  if (/^(mailto:|tel:)/i.test(raw)) return raw;

  try {
    const url = new URL(raw, base);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : base;
  } catch {
    return base;
  }
}
