export const getServerSideURL = (): string => {
  const raw = process.env.NEXT_PUBLIC_SERVER_URL?.trim() || '';
  return raw.replace(/\/+$/, '');
};
