import Link from 'next/link';

interface SiteFooterProps {
  settings: any;
  footer: any;
}

const footerLink = 'w-fit text-muted-foreground underline decoration-transparent underline-offset-4 transition-colors hover:text-primary hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring';

export function SiteFooter({ settings, footer }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-border bg-background/90 backdrop-blur-md text-foreground">
      <div className="mx-auto w-full max-w-[1360px] px-4 py-12 sm:px-6 md:py-16 lg:px-11">
        <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))]">
          <div className="flex min-w-0 flex-col items-start gap-4 py-6 sm:pr-6 lg:py-8 lg:pr-10">
            <Link className="flex items-center gap-3 border border-border/70 bg-background px-2 py-2 text-foreground no-underline transition-colors hover:border-primary/50" href="/">
              <span className="grid gap-0.5">
                <span className="text-sm font-black uppercase tracking-wide">{settings.shortMark}</span>
              </span>
            </Link>
            <p className="max-w-[34ch] break-words text-sm leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">{footer.tagline}</p>
            <address className="grid gap-1 not-italic font-mono text-xs font-medium uppercase leading-5 tracking-[0.1em]">
              <a className={footerLink} href={`mailto:${settings.email}`}>{settings.email}</a>
              <a className={footerLink} href={settings.phoneHref}>{settings.phone}</a>
            </address>
          </div>
          {(footer.columns || []).map((column: any) => (
            <div className="min-w-0 border-t border-border/60 py-6 sm:py-7 lg:border-l lg:border-t-0 lg:pl-6" key={column.id || column.label}>
              <h2 className="mb-4 font-mono text-xs font-bold uppercase leading-5 tracking-[0.12em] text-primary">{column.label}</h2>
              <ul className="m-0 grid list-none gap-2 p-0">
                {(column.items || []).map((item: any) => (
                  <li key={item.id || item.href}>
                    <Link className={footerLink} href={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap justify-between gap-x-7 gap-y-2 border-t border-border/60 pt-6 font-mono text-xs font-medium leading-relaxed tracking-[0.04em] text-muted-foreground">
          <p>© {year} {settings.legal?.copyrightHolder} All rights reserved.</p>
          <p>{settings.legal?.tradeNameStatement}</p>
          <p>{settings.location?.summary}</p>
        </div>
      </div>
    </footer>
  );
}
