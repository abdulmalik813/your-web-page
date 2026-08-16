'use client'

import * as React from 'react'
import { NavigationBar } from '@/payload-types'
import { PageContext } from '@/types/page-context'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { NavigationBlockUI } from '@/blocks/navigation'

export function MobileMenu({
  navBarData,
  pageContext,
}: {
  navBarData: NavigationBar
  pageContext: PageContext
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-9 w-9 rounded-md hover:bg-accent transition-colors duration-200"
          aria-label="Open menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          <span className="sr-only">Toggle menu</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={12}
        className="w-[calc(100vw-2rem)] max-w-sm max-h-[75vh] overflow-y-auto p-4 border border-border shadow-2xl rounded-lg bg-background/95 backdrop-blur-md"
      >
        <nav className="flex flex-col gap-1">
          {navBarData.navigation?.map((item, index) => {
            const appearance = item.nav?.appearance

            if (appearance === 'link' || appearance === 'button') {
              return (
                <div key={item.id || index} onClick={() => setOpen(false)}>
                  <NavigationBlockUI
                    {...item}
                    pageContext={pageContext}
                    className="flex items-center px-3 py-2.5 text-base font-medium rounded-md hover:bg-accent transition-colors duration-200 w-full justify-start"
                  />
                </div>
              )
            }

            if (appearance === 'dropdown') {
              return (
                <Accordion
                  key={item.id || index}
                  type="single"
                  collapsible
                  className="border-none"
                >
                  <AccordionItem value={`item-${index}`} className="border-none">
                    <AccordionTrigger className="px-3 py-2.5 text-base font-medium hover:bg-accent rounded-md hover:no-underline transition-colors duration-200">
                      {item.nav?.label}
                    </AccordionTrigger>
                    <AccordionContent className="pb-1 pt-1">
                      <ul className="space-y-1 ml-3 border-l pl-2 border-border/60">
                        {item.nav?.items?.map((dropdownItem, i) => (
                          <li key={dropdownItem.id || i} onClick={() => setOpen(false)}>
                            <NavigationBlockUI
                              dropdownItem={dropdownItem}
                              pageContext={pageContext}
                              className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors duration-200"
                            />
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )
            }

            return null
          })}

          {navBarData?.cta && navBarData.cta.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border flex flex-col gap-2">
              {navBarData.cta.map((ctaItem, index) => (
                <div key={ctaItem.id || index} onClick={() => setOpen(false)}>
                  <NavigationBlockUI
                    {...ctaItem}
                    pageContext={pageContext}
                    className="w-full justify-center text-sm font-medium h-10 rounded-md"
                  />
                </div>
              ))}
            </div>
          )}
        </nav>
      </PopoverContent>
    </Popover>
  )
}
