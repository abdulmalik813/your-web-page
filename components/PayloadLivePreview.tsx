'use client';

import { RefreshRouteOnSave } from '@payloadcms/live-preview-react';
import { useRouter } from 'next/navigation';
import { useSyncExternalStore } from 'react';

const subscribeToOrigin = () => () => {};
const getBrowserOrigin = () => window.location.origin;
const getServerOrigin = () => '';

export function PayloadLivePreview({ serverURL }: { serverURL?: string }) {
  const router = useRouter();
  const browserOrigin = useSyncExternalStore(subscribeToOrigin, getBrowserOrigin, getServerOrigin);
  const url = serverURL || browserOrigin;

  if (!url) return null;

  return <RefreshRouteOnSave serverURL={url} refresh={router.refresh} depth={2} />;
}
