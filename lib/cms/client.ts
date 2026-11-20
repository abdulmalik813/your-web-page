import config from '@payload-config';
import { getPayload, type Payload } from 'payload';

export async function getPayloadClient(): Promise<Payload> {
  // `cron: true` initializes Payload's jobs autoRun so scheduled publishes run.
  return getPayload({ config, cron: true });
}
