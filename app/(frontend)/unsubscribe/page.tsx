import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { UnsubscribeForm } from '@/components/UnsubscribeForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Unsubscribe',
  description: 'Unsubscribe from Your Web Page newsletter emails.',
  alternates: { canonical: '/unsubscribe' },
  robots: { index: false, follow: false },
  openGraph: { title: 'Unsubscribe', description: 'Unsubscribe from Your Web Page newsletter emails.', url: '/unsubscribe' },
  twitter: { title: 'Unsubscribe', description: 'Unsubscribe from Your Web Page newsletter emails.' },
};

export default async function UnsubscribePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return <><PageHeader label="Newsletter" title="Unsubscribe" lead="Confirm below to stop receiving newsletter emails." /><UnsubscribeForm token={typeof token === 'string' ? token : ''} /></>;
}
