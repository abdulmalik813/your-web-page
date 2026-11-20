'use client';

import { RefreshRouteOnSave } from '@payloadcms/live-preview-react';
import { useRouter } from 'next/navigation';
import { getServerSideURL } from '@/lib/get-url';

export function PayloadLivePreview({ serverURL }: { serverURL?: string }) {
  const router = useRouter();
  const url = serverURL || getServerSideURL();

  return <RefreshRouteOnSave serverURL={url} refresh={router.refresh} depth={2} />;
}
