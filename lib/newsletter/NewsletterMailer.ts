import type { Payload } from 'payload';
import type { Newsletter } from '@/payload-types';
import { NewsletterEmail } from './NewsletterEmail';

export interface NewsletterDelivery {
  failed: number;
  sent: number;
}

export class NewsletterMailer {
  constructor(
    private readonly payload: Payload,
    private readonly base: string,
  ) {}

  async send(newsletter: Newsletter): Promise<NewsletterDelivery> {
    const settings = await this.payload.findGlobal({
      slug: 'settings',
      depth: 0,
      overrideAccess: false,
    });
    const email = await NewsletterEmail.create({
      base: this.base,
      newsletter,
      payload: this.payload,
      settings,
    });

    let sent = 0;
    let failed = 0;
    let lastId: string | undefined;
    let hasNextPage = true;

    while (hasNextPage) {
      const subscribers = await this.payload.find({
        collection: 'subscribers',
        where: {
          and: [
            { status: { equals: 'subscribed' } },
            ...(lastId ? [{ id: { greater_than: lastId } }] : []),
          ],
        },
        limit: 100,
        sort: 'id',
        overrideAccess: true,
        showHiddenFields: true,
      });

      for (const subscriber of subscribers.docs) {
        const current = await this.payload.findByID({
          collection: 'subscribers',
          id: subscriber.id,
          overrideAccess: true,
          showHiddenFields: true,
        });
        if (current.status !== 'subscribed') continue;

        const unsubscribeUrl = `${this.base}/unsubscribe?token=${encodeURIComponent(current.unsubscribeToken)}`;
        const oneClickUrl = `${this.base}/api/newsletter/unsubscribe?token=${encodeURIComponent(current.unsubscribeToken)}`;

        try {
          await this.payload.sendEmail({
            to: current.email,
            subject: newsletter.title,
            html: email.render(unsubscribeUrl),
            headers: {
              'List-Unsubscribe': `<${oneClickUrl}>`,
              'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
            },
          });
          sent += 1;
        } catch (error) {
          failed += 1;
          this.payload.logger.error({ err: error, msg: 'Newsletter email delivery failed.' });
        }

        if (process.env.RESEND_API_KEY) {
          await new Promise((resolve) => setTimeout(resolve, 550));
        }
      }

      hasNextPage = subscribers.hasNextPage;
      lastId = subscribers.docs.at(-1)?.id;
    }

    return { failed, sent };
  }
}
