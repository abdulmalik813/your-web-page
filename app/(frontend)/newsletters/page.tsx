import { PageHeader } from '@/components/PageHeader';
import { NewsletterBrowser } from '@/components/NewsletterBrowser';
import { NewsletterForm } from '@/components/NewsletterForm';
import { getCmsNewsletters, getCmsPage, getCmsSettings } from '@/lib/cms';
import { buildPageMetadata } from '@/lib/seo';
import { draftMode } from 'next/headers';

export async function generateMetadata() {
  const { isEnabled: draft } = await draftMode();
  const [page, settings] = await Promise.all([getCmsPage('newsletters', draft), getCmsSettings(draft)]);
  const hero = page?.layout?.find((block: { blockType?: string }) => block.blockType === 'hero');
  return buildPageMetadata({ title: page?.meta?.title || page?.title || 'Newsletters', description: page?.meta?.description || hero?.lead || 'Newsletters and practical reading from Your Web Page.', path: '/newsletters', image: page?.meta?.image, fallbackImage: settings?.meta?.image });
}

export default async function NewslettersPage() {
  const { isEnabled: draft } = await draftMode();
  const [newsletter, page] = await Promise.all([getCmsNewsletters(draft), getCmsPage('newsletters', draft)]);
  const hero = Array.isArray(page?.layout) ? page.layout.find((block: { blockType?: string }) => block.blockType === 'hero') : undefined;
  return (
    <>
      <PageHeader label={hero?.eyebrow || 'Newsletters'} title={hero?.title || page?.title || 'Newsletters'} lead={hero?.lead || 'Read our latest updates and subscribe to receive them by email.'} />
      <section className="border-b border-border py-8 md:py-16">
        <div className="mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-11">
          <NewsletterForm />
          <NewsletterBrowser newsletter={newsletter} />
        </div>
      </section>
    </>
  );
}
