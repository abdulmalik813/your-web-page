'use client';

import { useState } from 'react';
import { useDocumentInfo } from '@payloadcms/ui';

export function SendNewsletter() {
  const { id, hasPublishedDoc } = useDocumentInfo();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function send() {
    if (!id) {
      setMessage('Save and publish this newsletter before sending it.');
      return;
    }
    if (!hasPublishedDoc) {
      setMessage('This newsletter is still a draft. Publish it before sending.');
      return;
    }
    if (!window.confirm('Send the published version of this newsletter to all subscribed people?')) return;
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/newsletter/send', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }),
      });
      const result = await response.json();
      setMessage(result.message || 'Could not send the newsletter.');
    } catch {
      setMessage('The request failed. Check delivery before trying again to avoid duplicate emails.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginBlock: '1rem' }}>
      <button type="button" onClick={send} disabled={loading} className="btn btn--style-secondary btn--size-small">
        {loading ? 'Sending…' : 'Send to subscribers'}
      </button>
      <p>{!id ? 'Save and publish this newsletter before sending.' : !hasPublishedDoc ? 'This newsletter is a draft. Publish it before sending.' : 'This sends the published version to all subscribers.'}</p>
      <p role="status">{message}</p>
    </div>
  );
}
