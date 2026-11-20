'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useField, useFormFields, TextInput, FieldLabel } from '@payloadcms/ui';

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

type SlugFieldProps = {
  path: string;
  fieldType?: string;
  label?: string;
  watchField?: string;
  readOnly?: boolean;
  required?: boolean;
};

export const SlugField: React.FC<SlugFieldProps> = ({
  path,
  label = 'Slug',
  watchField = 'title',
  required,
}) => {
  const { value, setValue } = useField<string>({ path });
  // Start locked if a slug already exists, unlocked for new documents
  const [locked, setLocked] = useState(() => !!value);

  // Watch the source field (e.g. title)
  const sourceField = useFormFields(([fields]) => fields[watchField]);
  const sourceValue = (sourceField?.value as string) || '';

  const regenerate = useCallback(() => {
    if (sourceValue) {
      setValue(toSlug(sourceValue));
    }
  }, [sourceValue, setValue]);

  // Auto-generate only when unlocked and source changes
  useEffect(() => {
    if (!locked) {
      regenerate();
    }
  }, [locked, regenerate]);

  const handleLockToggle = () => {
    const next = !locked;
    setLocked(next);
    if (!next) regenerate();
  };

  return (
    <div className="field-type text">
      <FieldLabel htmlFor={`field-${path}`} label={label} required={required} />
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <TextInput
            path={path}
            name={path}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setValue(e.target.value);
              setLocked(true);
            }}
            value={value ?? ''}
            readOnly={false}
          />
        </div>
        <button
          type="button"
          title={locked ? 'Unlock to auto-generate from title' : 'Lock slug (manual edit)'}
          onClick={handleLockToggle}
          style={{
            flexShrink: 0,
            padding: '8px 10px',
            borderRadius: '4px',
            border: '1px solid var(--theme-elevation-150)',
            background: locked
              ? 'var(--theme-elevation-100)'
              : 'var(--theme-success-500, #22c55e)',
            color: locked ? 'var(--theme-text)' : '#fff',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600,
            lineHeight: 1,
            whiteSpace: 'nowrap',
          }}
        >
          {locked ? '🔒 Locked' : '✨ Auto'}
        </button>
      </div>
      {!locked && sourceValue && (
        <p style={{ marginTop: '4px', fontSize: '12px', color: 'var(--theme-elevation-500)' }}>
          Will generate: <code>{toSlug(sourceValue)}</code>
        </p>
      )}
    </div>
  );
};
