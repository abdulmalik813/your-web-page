import { randomBytes } from 'node:crypto';
import type { CollectionConfig } from 'payload';

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  labels: { singular: 'Subscriber', plural: 'Subscribers' },
  admin: { useAsTitle: 'email', defaultColumns: ['email', 'status', 'createdAt'] },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'email', type: 'email', required: true, unique: true, index: true },
    { name: 'status', type: 'select', required: true, defaultValue: 'subscribed', options: ['subscribed', 'unsubscribed'] },
    {
      name: 'unsubscribeToken', type: 'text', required: true, unique: true, index: true,
      defaultValue: () => randomBytes(32).toString('hex'),
      admin: { hidden: true },
      access: { read: () => false },
    },
  ],
};
