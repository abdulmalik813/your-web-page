'use client';

import { Button } from '@payloadcms/ui';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface SeedStatusResponse {
  counts: {
    services: number;
    projects: number;
    resources: number;
    faqs: number;
    testimonials: number;
    pages: number;
    forms: number;
  };
  totals: {
    services: number;
    projects: number;
    resources: number;
    faqs: number;
    testimonials: number;
    pages: number;
    forms: number;
  };
  seededAt: string | null;
}

interface SeedPostResponse {
  ok: boolean;
  report?: {
    services: { created: number; updated: number };
    projects: { created: number; updated: number };
    resources: { created: number; updated: number };
    faqs: { created: number; updated: number };
    testimonials: { created: number; updated: number };
    pages: { created: number; updated: number };
    forms: { created: number; updated: number };
    seededAt: string;
  };
  status?: SeedStatusResponse;
  error?: string;
}

export const SeedBanner: React.FC = () => {
  const router = useRouter();
  const [status, setStatus] = useState<SeedStatusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingStatus, setFetchingStatus] = useState(true);
  const [feedback, setFeedback] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    async function fetchInitialStatus() {
      try {
        const response = await fetch('/api/seed', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        });
        if (!cancelled && response.ok) {
          const data = (await response.json()) as SeedStatusResponse;
          setStatus(data);
        }
      } catch {
        // Ignore transient status fetch failure; button remains usable.
      } finally {
        if (!cancelled) {
          setFetchingStatus(false);
        }
      }
    }
    void fetchInitialStatus();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSeed() {
    setLoading(true);
    setFeedback('');
    setError('');
    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = (await response.json()) as SeedPostResponse;

      if (!response.ok || !data.ok || !data.report) {
        setError(data.error || 'Could not seed Payload CMS data.');
        return;
      }

      if (data.status) {
        setStatus(data.status);
      } else {
        const refreshRes = await fetch('/api/seed', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        });
        if (refreshRes.ok) {
          setStatus((await refreshRes.json()) as SeedStatusResponse);
        }
      }

      const r = data.report;
      setFeedback(
        `Seed complete: Services (${r.services.created} created, ${r.services.updated} updated), Projects (${r.projects.created} created, ${r.projects.updated} updated), Resources (${r.resources.created} created, ${r.resources.updated} updated), FAQs (${r.faqs.created} created, ${r.faqs.updated} updated), Pages (${r.pages.created} created, ${r.pages.updated} updated), Forms (${r.forms.created} created, ${r.forms.updated} updated), Testimonials (${r.testimonials.created} created, ${r.testimonials.updated} updated).`
      );
      router.refresh();
    } catch {
      setError('Network error while running seed.');
    } finally {
      setLoading(false);
    }
  }

  const allSeeded = Boolean(
    status &&
      status.counts.services >= status.totals.services &&
      status.counts.projects >= status.totals.projects &&
      status.counts.resources >= status.totals.resources &&
      status.counts.faqs >= status.totals.faqs &&
      status.counts.pages >= status.totals.pages
  );

  return (
    <div
      style={{
        border: '2px solid var(--theme-elevation-800)',
        padding: '20px 24px',
        marginBottom: '28px',
        background: 'var(--theme-elevation-50)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div style={{ maxWidth: '680px' }}>
          <div
            style={{
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 700,
              marginBottom: '6px',
              color: 'var(--theme-elevation-700)',
            }}
          >
            Your Web Page — Content Seeding
          </div>
          <h2 style={{ margin: '0 0 8px', fontSize: '20px', lineHeight: 1.2 }}>
            {allSeeded ? 'Payload CMS is seeded with current site data' : 'Seed current website data into Payload CMS'}
          </h2>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--theme-elevation-700)' }}>
            Imports Pages, Forms, Services, Projects, Resources, FAQs, and Testimonials from the seed source without creating duplicates.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Button
            onClick={handleSeed}
            disabled={loading}
            buttonStyle="primary"
            size="medium"
          >
            {loading
              ? 'Seeding CMS...'
              : allSeeded
                ? 'Re-seed / Sync All Data'
                : 'Seed All Site Data'}
          </Button>
        </div>
      </div>

      {!fetchingStatus && status ? (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            marginTop: '16px',
            paddingTop: '14px',
            borderTop: '1px solid var(--theme-elevation-200)',
            fontSize: '13px',
          }}
        >
          <span>
            <strong>Services:</strong> {status.counts.services} / {status.totals.services}
          </span>
          <span>
            <strong>Projects:</strong> {status.counts.projects} / {status.totals.projects}
          </span>
          <span>
            <strong>Resources:</strong> {status.counts.resources} / {status.totals.resources}
          </span>
          <span>
            <strong>FAQs:</strong> {status.counts.faqs} / {status.totals.faqs}
          </span>
          <span>
            <strong>Pages:</strong> {status.counts.pages} / {status.totals.pages}
          </span>
          <span>
            <strong>Forms:</strong> {status.counts.forms} / {status.totals.forms}
          </span>
          <span>
            <strong>Testimonials:</strong> {status.counts.testimonials} / {status.totals.testimonials}
          </span>
        </div>
      ) : null}

      {feedback ? (
        <p
          role="status"
          style={{
            marginTop: '12px',
            marginBottom: 0,
            padding: '10px 12px',
            borderLeft: '4px solid #ff6a00',
            background: 'var(--theme-elevation-100)',
            fontSize: '13px',
          }}
        >
          {feedback}
        </p>
      ) : null}

      {error ? (
        <p
          role="alert"
          style={{
            marginTop: '12px',
            marginBottom: 0,
            padding: '10px 12px',
            borderLeft: '4px solid #cc0000',
            background: 'var(--theme-elevation-100)',
            fontSize: '13px',
          }}
        >
          {error}
        </p>
      ) : null}
    </div>
  );
};
