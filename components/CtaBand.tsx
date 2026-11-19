import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { siteCardClass } from '@/components/siteStyles';
import { getCmsSettings } from '@/lib/cms';
import { Reveal } from './Reveal';

interface CtaBandProps {
  title?: string;
  text?: string;
}

export async function CtaBand({
  title = 'Have a project in mind?',
  text = 'Tell us what you are building. We will come back with questions, ideas and a clear plan.',
}: CtaBandProps) {
  const settings = await getCmsSettings();

  return (
    <section className="relative overflow-hidden bg-muted/20 text-foreground">
      <div className="mx-auto w-full max-w-[1360px] px-4 py-8 sm:px-6 md:py-10 lg:py-14 lg:px-11">
        <Reveal direction="scale" interactive>
          <div className={`relative isolate grid gap-8 overflow-hidden ${siteCardClass} p-6 sm:p-9 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:p-12`}>
            <Reveal className="relative min-w-0" direction="left">
              <p className="mb-4 font-mono text-xs font-semibold uppercase leading-5 tracking-[0.12em] text-primary">Start a conversation</p>
              <h2 className="mb-5 max-w-[18ch] break-words font-heading text-[clamp(2rem,4.6vw,4rem)] font-medium leading-[0.98] tracking-[-0.045em] [overflow-wrap:anywhere]">{title}</h2>
              <p className="max-w-[62ch] break-words leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">{text}</p>
            </Reveal>
            <Reveal className="relative flex min-w-0 flex-col items-start gap-3 lg:items-end" direction="right" delay={0.08}>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="group h-12 gap-3 rounded-sm bg-primary px-6 font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                  <Link href="/start-a-project"><span>Start a project</span><ArrowRight className="transition-transform group-hover:translate-x-1" size={15} strokeWidth={2.5} aria-hidden="true" /></Link>
                </Button>
                <Button asChild variant="outline" className="h-12 rounded-sm border-border bg-background px-6 font-semibold text-foreground hover:bg-muted">
                  <Link href="/contact">Contact us</Link>
                </Button>
              </div>
              <p className="break-words font-mono text-xs font-medium uppercase leading-5 tracking-[0.08em] text-muted-foreground [overflow-wrap:anywhere]">
                {settings.email} · {settings.phone}
              </p>
            </Reveal>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
