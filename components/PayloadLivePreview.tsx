'use client';

import { RefreshRouteOnSave } from '@payloadcms/live-preview-react';
import { useRouter } from 'next/navigation';
import { getClientSideURL } from '@/lib/get-url';

export function PayloadLivePreview({ serverURL }: { serverURL?: string }) {
  const router = useRouter();
  const url = serverURL || getClientSideURL();

  return <RefreshRouteOnSave serverURL={url} refresh={router.refresh} depth={2} />;
}
