'use client';

import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Reveal } from './Reveal';
import type { RevealDirection } from './revealDirections';
import { siteCardClass } from './siteStyles';

interface PayloadFormProps {
  form: any;
  direction?: RevealDirection;
}

const labelClass = 'break-words font-mono text-xs font-semibold uppercase tracking-[0.12em] text-foreground [overflow-wrap:anywhere]';
const controlClass = 'h-12 w-full rounded-sm border border-input bg-background px-4 text-base text-foreground placeholder:text-muted-foreground transition-colors hover:border-primary/60 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20';

export function PayloadForm({ form, direction = 'right' }: PayloadFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const fields = Array.isArray(form.fields) ? form.fields : [];
  const inputFields = fields.filter((field: any) => field.blockType !== 'message');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    const data = new FormData(event.currentTarget);
    const submissionData = inputFields.map((field: any) => ({
      field: field.name,
      value: field.blockType === 'checkbox'
        ? data.getAll(field.name).length > 0
        : String(data.get(field.name) || ''),
    }));

    try {
      const response = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form: form.id, submissionData }),
      });
      if (!response.ok) throw new Error('Submission failed');
      setSubmitted(true);
    } catch {
      setError('We could not send your message right now. Please try again or contact us directly.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <Reveal className="h-full" direction={direction}>
        <Card className={`${siteCardClass} h-full p-0`} role="status">
          <CardHeader className="gap-4 p-6 md:p-8">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-primary-strong">Message received</p>
            <CardTitle className="break-words font-heading text-3xl font-medium tracking-tight [overflow-wrap:anywhere]">
              Thank you
            </CardTitle>
            <CardDescription className="max-w-[62ch] text-base leading-relaxed text-muted-foreground">
              We aim to reply within one business day.
            </CardDescription>
          </CardHeader>
        </Card>
      </Reveal>
    );
  }

  return (
    <Reveal className="h-full" direction={direction}>
      <Card className={`${siteCardClass} h-full p-0`}>
        <form className="grid grid-cols-1 gap-6 p-5 md:grid-cols-2 md:p-8" onSubmit={handleSubmit}>
          <FieldGroup className="col-span-full grid grid-cols-1 gap-5 md:grid-cols-2">
          {inputFields.map((field: any) => {
            const label = field.label || field.name;
            const fieldClass = Number(field.width || 100) > 50 ? 'md:col-span-2' : 'md:col-span-1';
            const id = `form-${field.id || field.name}`;

            if (field.blockType === 'select') {
              return (
                <Field className={`min-w-0 ${fieldClass}`} key={field.id || field.name}>
                  <FieldLabel className={labelClass} htmlFor={id}>{label}</FieldLabel>
                  <Select name={field.name} required={field.required} defaultValue={field.defaultValue || ''}>
                    <SelectTrigger
                      id={id}
                      className="h-12 w-full rounded-sm border border-input bg-background px-4 text-base text-foreground transition-colors hover:border-primary/60 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 data-[state=open]:border-primary"
                    >
                      <SelectValue placeholder={field.placeholder || 'Choose an option'} />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      align="start"
                      sideOffset={8}
                      className="max-h-72 min-w-[var(--radix-select-trigger-width)] rounded-sm border border-border bg-popover p-2 text-popover-foreground"
                    >
                      {(field.options || []).map((option: any) => (
                        <SelectItem className="min-h-10 rounded-sm px-3 py-2" key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              );
            }

            if (field.blockType === 'checkbox') {
              return (
                <Field
                  className={`min-w-0 flex-row items-center gap-3 rounded-sm border border-border p-4 ${fieldClass}`}
                  key={field.id || field.name}
                  orientation="horizontal"
                >
                  <Checkbox
                    id={id}
                    name={field.name}
                    required={field.required}
                    defaultChecked={field.defaultValue}
                    className="size-5 rounded-sm border-input data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground"
                  />
                  <FieldContent>
                    <FieldLabel className={`${labelClass} cursor-pointer leading-relaxed`} htmlFor={id}>
                      {label}
                    </FieldLabel>
                  </FieldContent>
                </Field>
              );
            }

            if (field.blockType === 'textarea') {
              return (
                <Field className={`min-w-0 ${fieldClass}`} key={field.id || field.name}>
                  <FieldLabel className={labelClass} htmlFor={id}>{label}</FieldLabel>
                  <Textarea
                    id={id}
                    name={field.name}
                    required={field.required}
                    defaultValue={field.defaultValue || ''}
                    className="min-h-36 w-full resize-y rounded-sm border border-input bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20"
                  />
                </Field>
              );
            }

            const inputType: React.HTMLInputTypeAttribute = field.blockType === 'email'
              ? 'email'
              : field.blockType === 'number'
                ? 'number'
                : field.blockType === 'date'
                  ? 'date'
                  : field.blockType === 'time'
                    ? 'time'
                    : 'text';

            return (
              <Field className={`min-w-0 ${fieldClass}`} key={field.id || field.name}>
                <FieldLabel className={labelClass} htmlFor={id}>{label}</FieldLabel>
                <Input
                  id={id}
                  name={field.name}
                  type={inputType}
                  defaultValue={field.defaultValue || ''}
                  required={field.required}
                  className={controlClass}
                />
              </Field>
            );
          })}
          </FieldGroup>
          {error ? (
            <Alert className="col-span-full rounded-sm border border-destructive/30 bg-destructive/5 text-destructive" variant="destructive">
              <AlertDescription className="text-sm text-destructive">{error}</AlertDescription>
            </Alert>
          ) : null}
          <Button
            className="col-span-full h-12 w-full rounded-sm bg-primary px-6 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:w-fit"
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Sending…' : form.submitButtonLabel || 'Submit'}
          </Button>
        </form>
      </Card>
    </Reveal>
  );
}
