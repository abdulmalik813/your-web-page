import { PageHeader } from '@/components/PageHeader';
import { ResourcesBrowser } from '@/components/ResourcesBrowser';
import { getCmsResources, getCmsPage } from '@/lib/cms';
import { buildPageMetadata } from '@/lib/seo';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';

export async function generateMetadata() {
  const page = await getCmsPage('resources');
  if (!page) return {};
  const meta = page?.meta as { title?: string; description?: string; image?: { url?: string | null; sizes?: { og?: { url?: string | null } } } | null } | undefined;
  const hero = Array.isArray(page.layout)
    ? page.layout.find((block: { blockType?: string }) => block.blockType === 'hero')
    : undefined;
  return buildPageMetadata({
    title: meta?.title || page.title,
    description: meta?.description || hero?.lead || '',
    path: '/resources',
    image: meta?.image,
  });
}

export default async function ResourcesPage() {
  const { isEnabled: draft } = await draftMode();
  const [resources, page] = await Promise.all([getCmsResources(draft), getCmsPage('resources', draft)]);
  if (!page) notFound();

  const hero = Array.isArray(page?.layout)
    ? page.layout.find((block: { blockType?: string }) => block.blockType === 'hero')
    : undefined;

  return (
    <>
      <PageHeader
        label={hero?.eyebrow || page.title}
        title={hero?.title || page.title}
        lead={hero?.lead || ''}
      />
      <section className="border-b border-border py-8 md:py-16">
        <div className="mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-11"><ResourcesBrowser resources={resources} /></div>
      </section>
    </>
  );
}
