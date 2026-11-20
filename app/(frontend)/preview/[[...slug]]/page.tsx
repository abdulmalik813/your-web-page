import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { PreviewLivePreview } from '@/components/PreviewLivePreview';
import { getCmsPage } from '@/lib/cms';
import { CmsPageLayout } from '../../[[...slug]]/CmsPageLayout';
import { DetailPage } from '../../[[...slug]]/DetailPage';

/**
 * Draft preview has to read cookies on every request, so it lives on its own
 * route. The public pages stay fully static and cacheable.
 */
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const { slug = [] } = await params;
  const page = await getCmsPage(slug.join('/'), true);
  return {
    title: page?.title || 'Preview',
    robots: { index: false, follow: false },
  };
}

export default async function PreviewPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  const publicPath = slug.length ? `/${slug.join('/')}` : '/';
  const { isEnabled: draft } = await draftMode();

  if (!draft) redirect(publicPath);

  const page = await getCmsPage(slug.join('/'), true);

  return (
    <>
      {page ? (
        <CmsPageLayout page={page} isHome={slug.length === 0} draft />
      ) : (
        <DetailPage slug={slug} draft />
      )}
      <PreviewLivePreview />
    </>
  );
}
