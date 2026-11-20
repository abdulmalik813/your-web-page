const cleanUrl = (value?: string): string => value?.trim().replace(/\/+$/, '') || '';

export const getServerSideURL = (): string => {
  const configured = cleanUrl(process.env.NEXT_PUBLIC_SERVER_URL);

  if (configured) return configured;

  if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT?.trim();
    return `http://localhost:${port && port !== '0' ? port : '3000'}`;
  }

  return '';
};

export const getAllowedOrigins = (): string[] => {
  const origins = new Set<string>();
  const serverURL = getServerSideURL();

  if (serverURL) {
    origins.add(serverURL);
    try {
      origins.add(new URL(serverURL).origin);
    } catch {
      // Ignore a malformed URL so it cannot break the config.
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    origins.add('http://localhost:3000');
    origins.add('http://127.0.0.1:3000');
  }

  return [...origins];
};
