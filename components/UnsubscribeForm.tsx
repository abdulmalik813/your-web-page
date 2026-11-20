'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function UnsubscribeForm({ token }: { token: string }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function unsubscribe() {
    setLoading(true);
    try {
      const response = await fetch('/api/newsletter/unsubscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token }) });
      const result = await response.json();
      setMessage(result.message || 'Unable to unsubscribe. Please try again.');
      setDone(response.ok);
    } catch {
      setMessage('Unable to unsubscribe. Please try again.');
    } finally { setLoading(false); }
  }

  return (
    <div className="mx-auto max-w-[1360px] px-4 py-10 sm:px-6 lg:px-11">
      {token && !done ? <Button onClick={unsubscribe} disabled={loading}>{loading ? 'Unsubscribing…' : 'Confirm unsubscribe'}</Button> : null}
      <p role="status" className="mt-4">{message || (!token ? 'This unsubscribe link is invalid.' : '')}</p>
    </div>
  );
}
