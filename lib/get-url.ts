import canUseDOM from './can-use-dom';

/**
 * Returns the base application URL on the server.
 * Uses NEXT_PUBLIC_APP_URL, trimming any trailing slashes.
 */
export const getServerSideURL = (): string => {
  const url = process.env.NEXT_PUBLIC_APP_URL?.trim() || '';
  return url.replace(/\/+$/, '');
};

/**
 * Returns the browser's current origin (protocol + host + port) on the client side,
 * or falls back to getServerSideURL() when running in Node.js/server contexts.
 * This guarantees the client always resolves to the active browser domain.
 */
export const getClientSideURL = (): string => {
  if (canUseDOM) {
    const protocol = window.location.protocol;
    const domain = window.location.hostname;
    const port = window.location.port;

    return `${protocol}//${domain}${port ? `:${port}` : ''}`;
  }

  return getServerSideURL();
};
