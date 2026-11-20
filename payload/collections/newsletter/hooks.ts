import type { CollectionBeforeChangeHook } from 'payload';

const ATLANTIC_TIMEZONE = 'America/Halifax';

function atlanticDateParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    day: '2-digit',
    month: '2-digit',
    timeZone: ATLANTIC_TIMEZONE,
    year: 'numeric',
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? '';

  return {
    iso: `${part('year')}-${part('month')}-${part('day')}`,
    label: new Intl.DateTimeFormat('en-CA', {
      day: 'numeric',
      month: 'long',
      timeZone: ATLANTIC_TIMEZONE,
      year: 'numeric',
    }).format(date),
  };
}

export const stampPublishDate: CollectionBeforeChangeHook = ({
  data,
  operation,
  originalDoc,
}) => {
  const becomingPublished =
    operation === 'update' &&
    data?._status === 'published' &&
    originalDoc?._status !== 'published';
  const editorChangedDate =
    Boolean(data?.isoDate) && data.isoDate !== originalDoc?.isoDate;

  if (becomingPublished && !editorChangedDate) {
    const now = atlanticDateParts(new Date());
    data.isoDate = now.iso;
    data.publishDate = now.label;
  }

  return data;
};
