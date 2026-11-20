import { s3Storage } from '@payloadcms/storage-s3';
import type { Config, Plugin } from 'payload';
import { requireEnv } from '@/lib/env';

export function createMediaStoragePlugin(): Plugin {
  const storageAdapter = s3Storage({
    bucket: requireEnv('S3_BUCKET'),
    collections: {
      media: { prefix: 'media' },
    },
    config: {
      credentials: {
        accessKeyId: requireEnv('S3_ACCESS_KEY_ID'),
        secretAccessKey: requireEnv('S3_SECRET_ACCESS_KEY'),
      },
      endpoint: requireEnv('S3_ENDPOINT'),
      forcePathStyle: true,
      region: requireEnv('S3_REGION'),
    },
  }) as unknown as { init: (config: Config) => Config };

  return (config) => storageAdapter.init(config);
}
