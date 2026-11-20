'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }),
      });
      const result = await response.json();
      setMessage(result.message || 'Something went wrong. Please try again.');
      if (response.ok) setEmail('');
    } catch {
      setMessage('Unable to subscribe right now. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={subscribe} className="mb-12 max-w-xl border border-border bg-card p-6 sm:p-8">
      <h2 className="font-heading text-2xl font-medium">Subscribe to our newsletter</h2>
      <p className="mt-2 text-sm text-muted-foreground">Get our latest updates in your inbox. Unsubscribe at any time.</p>
      <Label htmlFor="newsletter-email" className="mt-5 block">Email address</Label>
      <div className="mt-2 flex flex-wrap gap-3">
        <Input id="newsletter-email" type="email" required maxLength={254} autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-11 min-w-0 flex-1" />
        <Button type="submit" disabled={loading}>{loading ? 'Subscribing…' : 'Subscribe'}</Button>
      </div>
      <p aria-live="polite" className="mt-3 text-sm">{message}</p>
    </form>
  );
}
