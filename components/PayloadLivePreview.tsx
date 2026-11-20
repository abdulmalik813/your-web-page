'use client';

import { RefreshRouteOnSave } from '@payloadcms/live-preview-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function PayloadLivePreview({ serverURL }: { serverURL?: string }) {
  const router = useRouter();
  const [url, setUrl] = useState(serverURL || '');

  useEffect(() => {
    if (!serverURL) setUrl(window.location.origin);
  }, [serverURL]);

  if (!url) return null;

  return <RefreshRouteOnSave serverURL={url} refresh={router.refresh} depth={2} />;
}
