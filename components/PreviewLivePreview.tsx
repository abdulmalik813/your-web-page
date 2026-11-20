'use client';

import dynamic from 'next/dynamic';

const PayloadLivePreview = dynamic(
  () => import('./PayloadLivePreview').then((module) => module.PayloadLivePreview),
  { ssr: false },
);

export function PreviewLivePreview() {
  return <PayloadLivePreview />;
}
