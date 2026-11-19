'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { FaqItem } from '@/lib/cms';
import { Reveal } from './Reveal';
import { revealDirectionForIndex } from './revealDirections';
import { siteCardClass } from './siteStyles';

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <Accordion type="single" collapsible className={`${siteCardClass} w-full overflow-hidden`}>
      {items.map((item, index) => (
        <Reveal key={item.id} delay={(index % 4) * 0.03} direction={revealDirectionForIndex(index)}>
          <AccordionItem className="border-b border-border last:border-b-0" value={item.id}>
            <AccordionTrigger className="rounded-none border-0 px-5 py-5 text-left text-base font-semibold text-foreground transition-colors hover:bg-muted/70 hover:no-underline focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset sm:text-lg">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="max-w-[72ch] px-5 pb-6 text-base leading-relaxed text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        </Reveal>
      ))}
    </Accordion>
  );
}
