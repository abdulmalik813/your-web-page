import { JsonLd } from '@/components/JsonLd';
import { NewsletterBrowser } from '@/components/NewsletterBrowser';
import { NewsletterForm } from '@/components/NewsletterForm';
import { PageHeader } from '@/components/PageHeader';
import { getCmsNewsletters, getCmsPage, getCmsSettings } from '@/lib/cms';
import { breadcrumbNode, itemListNode, webPageNode } from '@/lib/schema';
import { buildPageMetadata } from '@/lib/seo';

export const revalidate = 300;

export async function generateMetadata() {
  const [page, settings] = await Promise.all([getCmsPage('newsletters'), getCmsSettings()]);
  const hero = page?.layout?.find((block: { blockType?: string }) => block.blockType === 'hero');
  return buildPageMetadata({
    title: page?.meta?.title || page?.title || 'Newsletters',
    description: page?.meta?.description || hero?.lead || 'Newsletters and practical reading from Your Web Page.',
    path: '/newsletters',
    image: page?.meta?.image,
    fallbackImage: settings?.meta?.image,
    keywords: [
      'website advice',
      'web design tips',
      'local SEO guide',
      'website launch checklist',
      'Prince Edward Island business',
      'Charlottetown web studio',
    ],
    rss: true,
  });
}

export default async function NewslettersPage() {
  const [newsletter, page, settings] = await Promise.all([
    getCmsNewsletters(),
    getCmsPage('newsletters'),
    getCmsSettings(),
  ]);
  const hero = Array.isArray(page?.layout)
    ? page.layout.find((block: { blockType?: string }) => block.blockType === 'hero')
    : undefined;
  const title = hero?.title || page?.title || 'Newsletters';
  const description =
    hero?.lead || 'Practical reading for anyone planning, building or looking after a website.';

  return (
    <>
      <JsonLd
        nodes={[
          webPageNode({ path: '/newsletters', title, description, type: 'CollectionPage' }),
          breadcrumbNode([{ label: 'Home', href: '/' }, { label: 'Newsletters' }], '/newsletters'),
          itemListNode({
            name: `${settings?.brand || 'Your Web Page'} newsletters`,
            items: newsletter.map((entry) => ({ title: entry.title, slug: entry.slug, date: entry.isoDate })),
            path: '/newsletters',
          }),
        ]}
      />
      <PageHeader label={hero?.eyebrow || 'Newsletters'} title={title} lead={hero?.lead || 'Read our latest updates and subscribe to receive them by email.'} />
      <section className="border-b border-border py-8 md:py-16">
        <div className="mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-11">
          <NewsletterForm />
          <NewsletterBrowser newsletter={newsletter} />
        </div>
      </section>
    </>
  );
}
