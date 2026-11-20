/**
 * Runs once when the Next.js server boots. This guarantees Payload is
 * initialized — and its jobs autoRun cron is started — even when the first
 * requests are served from prerendered caches and never touch the CMS.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  const [{ getPayload }, { default: config }] = await Promise.all([
    import('payload'),
    import('./payload.config'),
  ]);

  await getPayload({ config, cron: true });
}
