import canUseDOM from './can-use-dom';


export const getServerSideURL = (): string => {
  const raw = process.env.NEXT_PUBLIC_SERVER_URL?.trim() || '';
  return raw.replace(/\/+$/, '');
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
