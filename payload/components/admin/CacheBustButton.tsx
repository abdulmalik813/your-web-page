'use client';

import React, { useState } from 'react';
import { NavGroup, RefreshIcon, toast } from '@payloadcms/ui';

/**
 * Admin sidebar navigation component — busts every Next.js cache tag in one click.
 * Registered in payload.config.ts as an `afterNavLinks` component.
 * Uses native Payload UI NavGroup and styling with proper padding to align with the sidebar items.
 */
export const CacheBustButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleBust = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/revalidate-all', {
        method: 'POST',
        credentials: 'include',
      });

      const json = (await res.json()) as { ok?: boolean; message?: string; error?: string };

      if (!res.ok || !json.ok) {
        toast.error(json.error ?? 'Cache bust failed.');
      } else {
        toast.success(json.message ?? 'All cache tags cleared successfully!');
      }
    } catch (err) {
      toast.error('Network error — could not reach /api/revalidate-all');
      console.error('[CacheBustButton]', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <NavGroup label="System">
      <div className="nav__link-wrapper" style={{ paddingInline: 'var(--spacer-1, 4px)' }}>
        <button
          type="button"
          onClick={handleBust}
          disabled={loading}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="nav__link"
          id="nav-cache-bust"
          style={{
            width: '100%',
            textAlign: 'left',
            background: isHovered ? 'var(--color-bg-secondary, rgba(255, 255, 255, 0.06))' : 'transparent',
            borderRadius: 'var(--button-radius, 4px)',
            border: 'none',
            cursor: loading ? 'wait' : 'pointer',
            paddingTop: 'var(--spacer-2, 8px)',
            paddingBottom: 'var(--spacer-2, 8px)',
            paddingLeft: 'var(--spacer-3, 12px)',
            paddingRight: 'var(--spacer-3, 12px)',
            font: 'inherit',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
            transition: 'background-color 0.15s ease',
          }}
        >
          <span
            className="nav__link-label"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
            }}
          >
            <RefreshIcon
              style={{
                width: '14px',
                height: '14px',
                flexShrink: 0,
                opacity: 0.85,
                animation: loading ? 'spin 1s linear infinite' : undefined,
              }}
            />
            {loading ? 'Clearing cache…' : 'Bust All Cache'}
          </span>
        </button>
      </div>
    </NavGroup>
  );
};
