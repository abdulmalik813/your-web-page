import config from '@payload-config';
import { headers } from 'next/headers';
import { getPayload } from 'payload';
import { PayloadAdminBarClient } from '@/components/PayloadAdminBarClient';
import { getPreviewSecret } from '@/lib/live-preview';
import { getBaseUrl } from '@/lib/seo';

export async function PayloadAdminBar({ draftEnabled }: { draftEnabled: boolean }) {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await headers() });

  if (!user) return null;

  return (
    <PayloadAdminBarClient
      adminUrl={getBaseUrl()}
      draftEnabled={draftEnabled}
      previewSecret={getPreviewSecret()}
    />
  );
}
