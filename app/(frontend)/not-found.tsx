import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Reveal } from '@/components/Reveal';

export default function NotFound() {
  return (
    <section className="border-b border-border/50 bg-muted/10">
      <div className="mx-auto w-full max-w-[1360px] px-4 py-[clamp(40px,7vw,96px)] sm:px-6 lg:px-11">
        <Reveal>
          <Card className="mx-auto flex w-full max-w-3xl flex-col items-start gap-5 rounded-sm border border-border bg-card p-6 text-card-foreground sm:p-10">
            <p className="m-0 font-mono text-xs font-semibold uppercase leading-5 tracking-[0.1em] text-primary">Error 404</p>
            <CardTitle className="font-heading text-[clamp(5rem,22vw,10rem)] font-medium leading-[0.9] tracking-tight">404</CardTitle>
            <CardDescription className="max-w-[62ch] text-base leading-relaxed text-muted-foreground">We could not find that page. It may have moved, or the address may be mistyped.</CardDescription>
            <div className="mt-2 flex flex-wrap gap-3">
              <Button asChild className="h-11 rounded-sm px-5 font-semibold">
                <Link href="/">Back to home</Link>
              </Button>
              <Button asChild variant="outline" className="h-11 rounded-sm px-5 font-semibold">
                <Link href="/contact">Contact us</Link>
              </Button>
            </div>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
