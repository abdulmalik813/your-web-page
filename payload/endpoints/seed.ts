import { revalidatePath } from 'next/cache';
import type { Endpoint } from 'payload';
import { getPayloadSeedStatus, seedAllPayloadData } from '@/lib/seed';

export const seedEndpoints: Endpoint[] = [
  {
    path: '/seed',
    method: 'get',
    handler: async (req) => {
      if (!req.user) {
        return Response.json({ error: 'Authentication required.' }, { status: 401 });
      }
      return Response.json(await getPayloadSeedStatus(req.payload));
    },
  },
  {
    path: '/seed',
    method: 'post',
    handler: async (req) => {
      if (!req.user) {
        return Response.json({ error: 'Authentication required.' }, { status: 401 });
      }

      try {
        const report = await seedAllPayloadData(req.payload);
        revalidatePath('/', 'layout');
        return Response.json({
          ok: true,
          report,
          status: await getPayloadSeedStatus(req.payload),
        });
      } catch (error) {
        return Response.json(
          { ok: false, error: error instanceof Error ? error.message : 'Seed failed.' },
          { status: 500 },
        );
      }
    },
  },
];
