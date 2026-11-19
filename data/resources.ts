export type ResourceCategory =
  | 'Guide'
  | 'Checklist'
  | 'Tutorial'
  | 'Case Study'
  | 'Notes';

export interface ResourceSection {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface ResourceEntry {
  slug: string;
  title: string;
  excerpt: string;
  category: ResourceCategory;
  tags: string[];
  publishDate: string;
  isoDate: string;
  readTime: number;
  sections: ResourceSection[];
}

export const RESOURCE_CATEGORIES: readonly ('All' | ResourceCategory)[] = [
  'All',
  'Guide',
  'Checklist',
  'Tutorial',
  'Case Study',
  'Notes',
] as const;

export const RESOURCES: ResourceEntry[] = [
  {
    slug: 'what-a-business-website-needs',
    title: 'What a business website actually needs',
    excerpt:
      'A practical look at what earns enquiries on day one, and what extra features can wait until later.',
    category: 'Guide',
    tags: ['Planning', 'Small Business', 'Content'],
    publishDate: 'November 12, 2026',
    isoDate: '2026-11-12',
    readTime: 5,
    sections: [
      {
        paragraphs: [
          'Most small business websites fall short for the exact same reason: they spend the opening screen talking about the company’s internal story instead of answering what the visitor arrived to find. When a customer opens your link from a search result or a referral, they want to know three things within a few seconds: what you offer, where you operate and how to take the next step.',
          'Getting those fundamentals right does more for real enquiries than decorative animations or sprawling multi-layered menus. Whether you run a trades business in Charlottetown, a retail storefront serving Prince Edward Island or a software team working across Canada, clarity beats volume every single time.',
        ],
      },
      {
        heading: 'The essentials on day one',
        bullets: [
          'A plain-language headline at the top of the home page stating what you do, who you serve and where you work.',
          'Dedicated pages or clear sections for each core service, written around the customer’s problem rather than internal jargon.',
          'Accurate contact details—email, telephone number and city or service region—placed consistently in the header and footer so nobody has to hunt.',
          'Mobile-first layouts tested on real phones, because travellers, local shoppers and busy buyers frequently browse on narrow screens over patchy mobile data.',
          'Authentic visuals or clean structural diagrams showing your real premises, finished work or product workflow rather than generic stock scenes.',
          'One unmistakable next step on every page, such as calling directly, requesting an appointment or filling in a short project enquiry form.',
        ],
      },
      {
        heading: 'Structuring pages for real visitors',
        paragraphs: [
          'Think about how two very different visitors read your site. Someone referred by a neighbour or colleague already trusts you and mainly wants to verify your hours, service area and how to reach you. Someone arriving cold from a search engine needs clear evidence that you understand their situation and routinely handle projects like theirs.',
          'A lean site map—Home, Services, Our Work or Examples, About, FAQ and Contact—covers both visitors cleanly without overwhelming your menu. Instead of burying schedules, menus or service specifications inside awkward downloadable PDFs that pinch-and-zoom poorly on phones, publish that information directly in readable HTML pages that load immediately.',
        ],
      },
      {
        heading: 'Answering hesitation before someone leaves',
        paragraphs: [
          'Every industry has four or five recurring questions people ask before picking up the phone: how long work typically takes, which areas you cover, what someone needs to prepare beforehand and what happens after launch. Addressing those questions directly in plain language builds immediate credibility and cuts down repetitive back-and-forth emails.',
          'Short, honest answers right beside your service descriptions help serious buyers decide to get in touch, while filtering out enquiries that are not a good fit before anyone wastes time on a mismatch.',
        ],
      },
      {
        heading: 'What can safely wait for later',
        paragraphs: [
          'Complex interactive calculators, elaborate scroll-jacking transitions, multi-author editorial hubs and automated chat pop-ups rarely help a new website launch faster or convert better. Worse, every unnecessary widget adds ongoing maintenance work, slows down mobile page loads and introduces potential accessibility barriers.',
          'Start with a tight, accurate site whose copy you can keep current through seasonal shifts and service updates. Once your core pages are live and generating real conversations, you can expand deliberately based on actual customer feedback rather than assumptions.',
        ],
      },
    ],
  },
  {
    slug: 'choosing-a-website-platform',
    title: 'Choosing a platform for your website',
    excerpt:
      'Website builders, content management systems and custom builds, and how to decide which fits your business.',
    category: 'Guide',
    tags: ['Architecture', 'CMS', 'Planning'],
    publishDate: 'November 5, 2026',
    isoDate: '2026-11-05',
    readTime: 6,
    sections: [
      {
        paragraphs: [
          'Every website project reaches the same early fork in the road: should you use an all-in-one website builder, a traditional content management system or a custom-built web application? None of these routes is universally right for every organization. Each trades layout flexibility, ongoing upkeep, speed and long-term portability differently depending on what your website actually has to do.',
          'Picking a tool simply because a colleague uses it often leaves businesses either boxed into a rigid template six months later or stuck maintaining heavy software and plugins they never needed in the first place.',
        ],
      },
      {
        heading: 'All-in-one website builders',
        paragraphs: [
          'Hosted site builders bundle templates, drag-and-drop editing and web hosting under one monthly roof. They work sensibly for straightforward brochure sites when a sole proprietor needs to publish basic information quickly with minimal technical requirements.',
          'The trade-off is long-term control and performance. Layout rules are constrained by the template engine, pages often carry heavy third-party scripts that slow mobile rendering, and moving your website to independent hosting later usually requires rebuilding from scratch because the platform owns the rendering layer.',
        ],
      },
      {
        heading: 'Content management systems',
        paragraphs: [
          'A dedicated content management system (CMS)—whether traditional or modern headless tooling—shines when your team updates pages, events, product catalogues or resource articles every week. Structured content fields, editorial drafts and role permissions keep regular publishing orderly for non-technical staff.',
          'Traditional plugin-heavy CMS setups require disciplined care, because unpatched extensions are a frequent source of sluggish performance and security vulnerabilities. A modern headless setup separates your editing interface from the fast public storefront, avoiding plugin sprawl while keeping editing simple.',
        ],
      },
      {
        heading: 'Custom builds and web applications',
        paragraphs: [
          'Custom engineering using modern frameworks such as Next.js and TypeScript is the strongest fit when fast load times, strict accessibility, bespoke layout design, multi-step intake forms, client portals or external API integrations matter. You receive clean, portable source code without paying for bloated features nobody on your team uses.',
          'Custom builds benefit from thoughtful scoping up front and a clear workflow for ongoing edits—either structured TypeScript content files, a lightweight headless CMS, or periodic updates handled through a care arrangement.',
        ],
      },
      {
        heading: 'Four questions to settle the choice',
        bullets: [
          'What must the site actually do on launch day, beyond displaying clear text, imagery and an enquiry form?',
          'Who on your team will edit pages each month, and how comfortable are they working inside software dashboards?',
          'Which external systems—such as online bookings, payment processors, inventory databases or email tools—need to stay synchronized?',
          'Where do you expect your website or digital product to grow over the next two to three years?',
        ],
      },
      {
        heading: 'Making a calm long-term call',
        paragraphs: [
          'If your answers point mostly to static informational pages that change four times a year, keep the stack lean and simple. If your business workflow revolves around customer accounts, tailored intake logic or recurring publishing, invest in clean architecture early so you never have to rebuild twice.',
          'Whichever route you choose, make sure you retain clear ownership of your domain name, your written copy, your photographs and any custom code created for your organization. Being able to move hosting or bring in another developer without losing your web address or content is the clearest sign you picked a healthy foundation.',
        ],
      },
    ],
  },
  {
    slug: 'website-launch-checklist',
    title: 'A website launch checklist',
    excerpt:
      'Ten practical checks to run before pointing any domain name at a new or redesigned website.',
    category: 'Checklist',
    tags: ['Launch', 'QA', 'Operations'],
    publishDate: 'October 28, 2026',
    isoDate: '2026-10-28',
    readTime: 5,
    sections: [
      {
        paragraphs: [
          'Launch week is when rushed mistakes happen: an enquiry form still pointed at a developer’s test inbox, a forgotten redirect breaking old search links, or an unverified SSL certificate triggering security warnings in a customer’s browser. Working calmly through a written checklist takes roughly an hour and prevents avoidable embarrassment on opening day.',
          'Before switching DNS records or announcing a new website publicly, we verify every single item below on a staging preview that matches production as closely as possible. Taking twenty extra minutes here saves hours of frantic debugging once real visitors start clicking links.',
        ],
      },
      {
        heading: 'Ten items to verify before DNS cutover',
        bullets: [
          'Proofread every page carefully on both desktop and phone: check business names, Canadian spellings, opening hours, street or city details, clickable phone links and email addresses.',
          'Submit every contact and intake form end to end, confirming client and server validation errors behave properly and confirmation emails arrive reliably in the intended inbox.',
          'Click every header link, dropdown item, footer link, card link and call-to-action button to ensure zero dead ends, broken anchors or accidental 404 responses.',
          'Inspect responsive layout across narrow phones (360px to 390px), tablets and wide desktop monitors to verify zero clipped headings, overlapping elements or horizontal page scrolling.',
          'Test full keyboard navigation by tabbing through menus, dropdown toggles, filter controls, accordions and form inputs so focus outlines stay visible and logical.',
          'Review unique page titles, meta descriptions, canonical URLs, OpenGraph social preview tags, robots directives and your XML sitemap so search engines index the exact structure intended.',
          'Map permanent 301 redirects from any retired URLs on your previous website so existing search listings, bookmarks and printed QR codes land cleanly on the nearest matching new pages.',
          'Confirm HTTPS encryption and automatic SSL certificate renewal work smoothly across both the apex domain and www subdomain without mixed-content warnings.',
          'Verify automated off-site backups are active and run a quick check on restoration procedures so recovery is proven before traffic arrives.',
          'Update your Google Business Profile, chamber listings and social bios so every public profile points directly to the new address.',
        ],
      },
      {
        heading: 'During and right after DNS cutover',
        paragraphs: [
          'Lower your DNS Time-to-Live (TTL) value a day or two before launch where possible so domain changes propagate briskly across internet service providers. Once the new records go live, open the site from an external mobile connection outside your office network to confirm HTTPS loads cleanly, submit one final live test enquiry through the real contact form and verify server logs look completely clean.',
          'Keep your previous site’s files and database archived safely for at least thirty days after launch as an extra safety net while search engines finish re-indexing your updated pages. Also double-check email records—such as MX, SPF and DKIM—so changing web hosting never interrupts your company inbox. Finally, keep a short written note of every domain registrar, hosting login and SSL renewal setting in one shared company file so nobody has to guess during future updates or team handovers. Taking an unhurried hour for these checks makes launch day quiet, predictable and stress-free.',
        ],
      },
    ],
  },
  {
    slug: 'local-seo-basics-pei',
    title: 'Local SEO basics for PEI businesses',
    excerpt:
      'How to make it straightforward for Islanders and seasonal visitors to find your business in search.',
    category: 'Guide',
    tags: ['SEO', 'Charlottetown', 'Local Search'],
    publishDate: 'October 20, 2026',
    isoDate: '2026-10-20',
    readTime: 5,
    sections: [
      {
        paragraphs: [
          'Local search visibility rarely requires complicated tricks or opaque monthly gimmicks. For businesses in Charlottetown, Summerside and communities across Prince Edward Island, showing up reliably in search comes down to making it effortless for both human visitors and search engines to verify three clear facts: who you are, what you do and where you serve.',
          'On Prince Edward Island, search behaviour also shifts noticeably across the calendar. Summer brings visitors searching on their phones while already travelling along the Island’s highways, whereas autumn and winter favour deliberate local enquiries, home maintenance and year-round service relationships. Strong technical and content foundations serve both seasons equally well.',
        ],
      },
      {
        heading: 'Keep your Google Business Profile complete and accurate',
        paragraphs: [
          'Before fine-tuning technical tags on your website, claim and thoroughly fill out your Google Business Profile. Choose accurate primary and secondary business categories, define your true service areas across PEI, upload crisp photographs of your storefront, workshop or finished work, and update seasonal hours promptly—especially ahead of Victoria Day weekend, Old Home Week and shoulder-season changes.',
          'A neglected profile with wrong winter hours frustrates local customers faster than almost any website flaw, and updating it takes less than five minutes.',
        ],
      },
      {
        heading: 'Stay strictly consistent everywhere',
        paragraphs: [
          'Use the exact same business name, telephone number and geographic details across your website, your Google Business Profile, social channels and local chamber or trade association directories. Old trading names, disconnected phone numbers or mismatched city labels create unnecessary doubt for search crawlers trying to verify that multiple mentions belong to the same business.',
        ],
      },
      {
        heading: 'Structure website pages around real services and places',
        bullets: [
          'Give each primary service its own dedicated page with clear headings rather than compressing six distinct offerings into a single vague paragraph.',
          'Reference Charlottetown, Prince Edward Island or the specific regions you serve naturally inside headings, body copy and page descriptions where genuinely helpful to a customer.',
          'Embed clean LocalBusiness structured data (JSON-LD) in your site layout so search engines read your legal entity, contact phone, email and service areas unambiguously.',
          'Keep pages fast over mobile connections and never lock crucial details—like seasonal hours, menus or service lists—inside heavy image flyers that search engines cannot read.',
        ],
      },
      {
        heading: 'Earn and respond to genuine reviews',
        paragraphs: [
          'Steady, authentic customer reviews carry real weight in local search results and human decision-making alike. Make a habit of sharing your direct review link with happy customers right after wrapping up a job, and take two minutes to write a polite, specific reply to every review—whether glowing or constructive.',
        ],
      },
      {
        heading: 'Measure what matters over the long run',
        paragraphs: [
          'Focus less on vanity keyword fluctuations week to week and more on real business outcomes: telephone calls, completed enquiry forms, booking requests and directional clicks from people actually located inside your service region. Plain-spoken pages paired with accurate profiles compound steadily over time.',
          'Remember too that on PEI, word of mouth and search work hand in hand. When someone hears your business recommended at a coffee shop in Charlottetown or a rink in Cornwall, the first thing they do is type your name into a phone. Making sure your website loads cleanly, shows clear services and confirms you are open turns that referral into a phone call.',
        ],
      },
    ],
  },
  {
    slug: 'prepare-for-a-design-project',
    title: 'What to prepare before a design project',
    excerpt:
      'A short preparation list that makes your first project conversation faster and sharper.',
    category: 'Checklist',
    tags: ['Design', 'Preparation', 'Discovery'],
    publishDate: 'October 9, 2026',
    isoDate: '2026-10-09',
    readTime: 5,
    sections: [
      {
        paragraphs: [
          'You do not need finished copywriting, formal brand manuals or polished wireframes before reaching out about a new website. Part of our job is helping organize rough ideas into a clear structure that works for your customers. Still, pulling together a handful of practical items beforehand makes the opening discovery call sharper and helps design move forward without guesswork.',
          'Think of this checklist as a quick gathering exercise rather than homework. Spend thirty minutes pulling what you already have into one shared folder before our first conversation, and note anything that still needs creating from scratch.',
        ],
      },
      {
        heading: 'Helpful items to gather before kick-off',
        bullets: [
          'Your main objective: define clearly what the website should achieve over the next six to twelve months—whether that means steadier phone enquiries, online store sales, consultation bookings or clearer explanations of a complex service.',
          'Two or three reference websites you genuinely respect (either inside your field or from completely different industries), paired with one short sentence on what works well on each one.',
          'Existing brand assets: original vector logo files (SVG, EPS, AI or clean PDF), established brand colour codes and any typography already used across signage or printed materials.',
          'Authentic photographs of your premises, team members, equipment or finished work—uncompressed originals straight from a camera or phone work far better than small files saved back down from social media.',
          'Rough notes, printed brochures or current website pages describing what you sell and the recurring questions customers ask every week.',
          'One designated decision-maker on your side who can collect internal opinions and provide consolidated, clear approvals at each milestone.',
          'Account notes or login access for your domain registrar and current web hosting provider so launch logistics are understood well ahead of deadline.',
        ],
      },
      {
        heading: 'What if several items are missing?',
        paragraphs: [
          'Most businesses are missing at least two or three things on that list, and that is completely normal. If you only have a low-resolution logo on an old letterhead, we can tidy and redraw it cleanly for crisp web display. If you have no photography yet, we can plan structured graphic layouts and help map a practical photo shot list you can capture in an afternoon.',
          'The same applies to written copy. Bring rough bullet points, voice memos or answers to customer questions, and we can help organize them into clean, scannable web pages that sound genuinely like your business.',
        ],
      },
      {
        heading: 'Why early clarity saves weeks later',
        paragraphs: [
          'Reviewing real goals, real constraints and real raw material during week one avoids dramatic late-stage changes when layouts are already built. Knowing which existing tools must stay connected—such as email newsletters, booking calendars or payment accounts—also prevents technical surprises halfway through development. Even half an hour spent gathering these notes pays back many times over once design begins.',
          'It also helps to note any upcoming seasonal deadlines, trade shows or printed materials that will carry the new website address, along with any legal notices, bilingual requirements or industry disclaimers your business must publish clearly on every page. Sharing those details right at kick-off ensures the whole site launches accurate and complete.',
        ],
      },
    ],
  },
  {
    slug: 'how-long-does-a-website-take',
    title: 'How long does a website take?',
    excerpt:
      'What genuinely shapes a project timeline, and the simplest ways to keep momentum steady.',
    category: 'Notes',
    tags: ['Timeline', 'Process', 'Planning'],
    publishDate: 'September 30, 2026',
    isoDate: '2026-09-30',
    readTime: 4,
    sections: [
      {
        paragraphs: [
          '“How soon can we launch?” is almost always one of the first questions raised on an opening call. The honest answer is that realistic timelines depend far less on how quickly code can be written and far more on four practical variables: scope, content readiness, decision speed and external integrations.',
          'Understanding how those four levers interact lets you plan sensibly around a real target date—such as the start of a tourist season, an upcoming conference or a product release—without rushing testing or cutting corners on accessibility.',
        ],
      },
      {
        heading: 'The four things that shape any schedule',
        bullets: [
          'Scope and complexity: a focused five-page service website with a clean enquiry form moves considerably faster than a full e-commerce store with tiered shipping rules or a multi-user SaaS web application.',
          'Content readiness: having clear service notes, product information and authentic photographs ready early keeps layout design anchored in real words rather than temporary filler.',
          'Feedback turnaround: timely, consolidated review from a single decision-maker keeps weekly build milestones moving steadily instead of stalling between conflicting internal opinions.',
          'External integrations and approvals: connecting point-of-sale software, legacy accounting tools, payment merchant verification or bilingual French translation introduces coordination steps outside either team’s direct control.',
        ],
      },
      {
        heading: 'The single biggest cause of delay',
        paragraphs: [
          'Across almost every web project, waiting on final text and photography delays launch day far more often than visual design or engineering combined. Writing plainly about your own business takes real concentration when you are already busy serving customers during the day.',
          'The simplest remedy is to agree during week one exactly who is drafting each page, set modest writing deadlines alongside design milestones, and review real copy inside preview layouts as early as possible rather than waiting for perfection.',
        ],
      },
      {
        heading: 'Why phased launches often work best',
        paragraphs: [
          'If you are working toward an immovable date—say, welcoming visitors ahead of the summer season or launching a new service line—consider breaking the build into two calm stages. Stage one puts your essential pages, clean mobile experience and enquiry path live on time. Stage two layers on secondary resources, expanded product lines or deeper integrations once the core site is already earning enquiries.',
        ],
      },
      {
        heading: 'Keeping momentum calm and predictable',
        paragraphs: [
          'When scope stays focused, one person consolidates feedback and content arrives in steady pieces, small business websites and focused software releases move smoothly from first sketch to launch. If a hard calendar date matters for your business, share that milestone on day one so we can plan scope, milestones and review windows realistically around it.',
          'Above all, leave room for calm testing before going live. Rushing final QA in the last hour before an announcement is how broken links, mistyped phone numbers and unconfigured forms slip through. Building a realistic schedule protects both launch quality and your team’s sanity, giving everyone confidence when you share the new link with customers across Prince Edward Island, Canada and around the world. Steady weekly check-ins keep everyone aligned from kickoff to handover and ensure no detail gets dropped along the way, even during your busiest seasonal weeks on the calendar.',
        ],
      },
    ],
  },
  {
    slug: 'accessibility-basics-for-business-sites',
    title: 'Accessibility basics every website should cover',
    excerpt:
      'A walkthrough of keyboard navigation, colour contrast, semantic headings and accessible forms.',
    category: 'Tutorial',
    tags: ['Accessibility', 'WCAG', 'HTML'],
    publishDate: 'September 18, 2026',
    isoDate: '2026-09-18',
    readTime: 6,
    sections: [
      {
        paragraphs: [
          'Web accessibility is sometimes treated like a late compliance check bolted onto a website right before launch. In practice, accessible websites are simply clearer, faster and easier for everyone to read and operate—whether someone uses a screen reader, navigates exclusively by keyboard, reads outdoors on a bright phone screen or deals with temporary hand fatigue.',
          'Building sound accessibility habits into the first layout takes minimal extra time compared to retrofitting an inaccessible template months after launch. Here are the five core practices we apply to every website and web application we build.',
        ],
      },
      {
        heading: '1. Use native HTML landmarks and sequential headings',
        paragraphs: [
          'Assistive technologies rely on semantic landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`) and clean heading hierarchy (`<h1>` through `<h4>`) to map out a page and jump directly to relevant sections. Always keep a single `<h1>` per page describing its main topic, never skip heading levels just to make text look larger, and use native `<button>` and `<a href>` elements for interactive controls instead of clickable `<div>` containers.',
          'Descriptive link text matters just as much: writing “Read the launch checklist” gives far better context than five links on a single page all labelled “Click here”.',
        ],
      },
      {
        heading: '2. Respect colour contrast on every surface',
        paragraphs: [
          'Body text needs strong luminance contrast against its background—at least 4.5:1 under WCAG AA standards, and 3:1 for large display headings. Watch carefully for pale grey metadata text on white backgrounds or bright brand accents placed directly as text on light surfaces. For example, high-visibility orange works cleanly as a solid button or highlight block paired with pure black text, whereas orange text directly on white fails readability checks.',
        ],
      },
      {
        heading: '3. Support full keyboard navigation and focus visibility',
        bullets: [
          'Include a “Skip to content” link as the very first focusable element so keyboard visitors can jump straight past repeated top navigation bars.',
          'Keep unmistakable `:focus-visible` outlines on every link, button, dropdown toggle, checkbox and form input—never hide focus rings without providing an equally clear alternative.',
          'Ensure dropdown menus and mobile navigation drawers open cleanly with Enter or Space and dismiss immediately when the user presses Escape.',
        ],
      },
      {
        heading: '4. Label, explain and validate forms properly',
        paragraphs: [
          'Placeholder hints inside inputs disappear the moment someone types and cannot replace a persistent `<label>`. Connect every control to an explicit label, group related checkboxes inside a `<fieldset>` with a `<legend>`, mark invalid inputs using `aria-invalid="true"`, associate error text via `aria-describedby` and announce errors in clear text rather than relying on border colour alone.',
          'When validation fails on submission, move keyboard focus straight to the first field that needs attention so the user does not have to hunt up and down the page.',
        ],
      },
      {
        heading: '5. Respect reduced-motion preferences',
        paragraphs: [
          'Some visitors experience motion sickness or distraction from sweeping transitions. Wrapping visual transitions with `@media (prefers-reduced-motion: reduce)` ensures your interface remains crisp, snappy and comfortable for everyone.',
          'Finally, test your pages yourself before launch using only the Tab, Shift+Tab, Enter and Escape keys, then zoom the browser to 200 percent. Those two quick habits catch more real-world usability issues in ten minutes than any automated checklist on its own.',
        ],
      },
    ],
  },
  {
    slug: 'getting-an-online-store-ready',
    title: 'Getting an online store ready to sell',
    excerpt:
      'What Canadian makers and retailers should prepare—from product photography and variants to taxes and shipping.',
    category: 'Checklist',
    tags: ['E-commerce', 'Retail', 'Canadian Tax'],
    publishDate: 'September 4, 2026',
    isoDate: '2026-09-04',
    readTime: 5,
    sections: [
      {
        paragraphs: [
          'Preparing an online store requires a bit more operational planning than launching an informational website, because live inventory counts, payment processing, Canadian sales tax and physical shipping parcels are all involved. Organizing your product data and fulfilment rules before store design starts keeps development calm and avoids last-minute checkout surprises.',
          'Whether you sell five signature items out of a Charlottetown studio or two hundred products shipped nationwide, working through these details beforehand ensures your store feels effortless on launch day.',
        ],
      },
      {
        heading: 'Product catalogue essentials',
        bullets: [
          'Clear, searchable product names paired with practical descriptions covering dimensions, materials, sizing guidance, care instructions and exactly what arrives in the box.',
          'Consistent product photographs shot in even natural or studio lighting against clean backgrounds, alongside close-up detail shots showing texture, fasteners or scale.',
          'A complete list of options and variants—such as size, colour, flavour or pack quantity—along with SKU codes if you also manage stock inside a physical shop or studio.',
          'Accurate starting inventory counts and a clear rule for out-of-stock products: hide temporarily, display “Sold out” clearly, or allow backorders with honest dispatch dates.',
        ],
      },
      {
        heading: 'Canadian taxes, shipping zones and local pickup',
        paragraphs: [
          'Decide ahead of build time where you intend to ship and how orders physically leave your door. Many PEI retailers start smoothly with three clear fulfilment options: free local pickup at a Charlottetown location or market stall, flat-rate or weight-based parcel shipping across Canada, and tracked international shipping where customs rules make sense.',
          'Confirm your GST/HST registration status and provincial sales tax rules early so every tax calculation—including shipping tax rules where applicable—can be verified inside test orders before opening to buyers. Double-check parcel weights and box dimensions too, as inaccurate weights lead to unexpected carrier surcharges after orders ship.',
        ],
      },
      {
        heading: 'Payment, confirmation emails and order workflow',
        paragraphs: [
          'Think through the moment right after a customer completes checkout. Who packs the order, which email inbox receives the alert, how packing slips are printed and how tracking numbers reach the buyer? Running five complete test orders—covering single items, multi-item carts, local pickup and refunds—proves the whole chain works cleanly.',
        ],
      },
      {
        heading: 'Clear store policies before checkout',
        paragraphs: [
          'Shoppers abandon carts quickly when return windows, handling times or shipping costs stay mysterious until the final payment screen. Publish straightforward shipping estimates, return and exchange policies, damaged-item instructions and a direct contact email or telephone number.',
          'When customers know exactly what happens after clicking “Pay”, checkout feels trustworthy and support enquiries drop sharply. Also take time to write friendly, plain-spoken confirmation emails that state processing windows, pickup instructions if applicable and how to reach a real person if a shipping address needs correcting.',
          'Having those policies, product details, tax settings and shipping rules organized ahead of development turns store launch week from a scramble into a calm, predictable milestone—letting you focus on fulfilling early orders smoothly for customers near Charlottetown and beyond instead of patching checkout settings. Once live, review your first dozen real orders carefully to refine packaging sizes, carrier rates and local pickup instructions for returning buyers across every season.',
        ],
      },
    ],
  },
  {
    slug: 'scoping-a-software-project',
    title: 'How to scope a custom software project',
    excerpt:
      'A practical tutorial on turning a rough business workflow or SaaS idea into a buildable first release.',
    category: 'Tutorial',
    tags: ['SaaS', 'Software', 'Scoping'],
    publishDate: 'August 22, 2026',
    isoDate: '2026-08-22',
    readTime: 6,
    sections: [
      {
        paragraphs: [
          'Custom software and subscription SaaS products rarely fail because a programming framework fell short. They stall when version one tries to solve every hypothetical edge case, automate every secondary report and serve every future user persona at once. Disciplined scoping draws a clear boundary around the smallest working system that genuinely improves how real people get their job done.',
          'Whether you are building an internal scheduling tool to replace messy spreadsheets or launching a subscription SaaS product for customers worldwide, walking through these five scoping steps keeps your first release focused and achievable.',
        ],
      },
      {
        heading: 'Step 1: Describe the core workflow in plain sentences',
        paragraphs: [
          'Before listing features or database tables, write down the daily problem your software replaces in everyday language. For example: “A shop manager publishes next week’s shift schedule on Thursday afternoon, staff check their shifts on their phones, and swap requests get approved in one click instead of thirty group text messages.” Every screen in version one should directly serve that core loop.',
          'If a proposed screen does not support that main loop or keep data accurate inside it, mark it for a later release.',
        ],
      },
      {
        heading: 'Step 2: Map user roles and permissions early',
        paragraphs: [
          'List every category of person who signs in—such as account owner, manager, staff member or external client—and specify clearly what each role can view, create, edit or approve. Settling permissions and organization boundaries at the start prevents painful data-model rewrites halfway through engineering.',
        ],
      },
      {
        heading: 'Step 3: Separate day-one essentials from phase two',
        bullets: [
          'Day-one essentials: reliable authentication, the primary workflow screens, strict input validation, transactional email alerts, audit logs for key actions and simple CSV or summary exports.',
          'Smart candidates for phase two: custom drag-and-drop report builders, elaborate theming preferences, multi-currency enterprise tiers and standalone native mobile apps before web workflows are proven.',
        ],
      },
      {
        heading: 'Step 4: Walk through clickable prototypes first',
        paragraphs: [
          'Reviewing rough interactive screens with the staff or customers who will actually operate the tool every day exposes missing fields, awkward terminology and unnecessary steps long before backend APIs and database migrations are finalized.',
        ],
      },
      {
        heading: 'Step 5: Ship in small verifiable stages',
        paragraphs: [
          'Break implementation into short weekly or bi-weekly milestones deployed to a private staging link. Testing real working software throughout the build keeps surprises out of launch week, lets early user feedback guide refinements and gives your team steady confidence in what is shipping.',
          'Just as important, plan how the software will be supported once real people depend on it daily. Agree on error monitoring, automated database backups, user support channels and a realistic cadence for small post-launch improvements based on what users actually click and request during their first month.',
          'Good software feels straightforward because every unnecessary complication was trimmed away during scoping rather than patched over after release. Keeping the first version lean lets you validate real adoption quickly, train staff smoothly and build version two on solid practical evidence. Start small, test with real users weekly and expand only where genuine daily bottlenecks appear across your team’s actual day-to-day operations and customer workflows, keeping every screen crisp, purposeful and easy to maintain.',
        ],
      },
    ],
  },
  {
    slug: 'keeping-a-website-secure-and-dependable',
    title: 'Keeping a website secure and dependable',
    excerpt:
      'An illustrative security and maintenance review showing how routine hygiene prevents sudden site outages.',
    category: 'Case Study',
    tags: ['Security', 'Maintenance', 'Hosting'],
    publishDate: 'August 10, 2026',
    isoDate: '2026-08-10',
    readTime: 5,
    sections: [
      {
        paragraphs: [
          'This illustrative walkthrough reflects the recurring maintenance gaps we uncover when stepping in to look after an existing small-business website. Most website emergencies do not stem from sophisticated targeted attacks; they build up quietly over time when ownership records, updates and backups fall between the cracks after initial launch.',
          'When a site stops delivering enquiry emails or goes offline mid-week, recovering without clear records or tested backups turns a minor glitch into days of avoidable stress.',
        ],
      },
      {
        heading: 'What an initial audit typically uncovers',
        bullets: [
          'Domain registration and DNS management left inside a former contractor’s personal email account rather than under the business’s own login and billing details.',
          'Two dozen unpatched third-party extensions accumulating known security holes across multiple years because nobody wanted to click update and risk breaking layout styles.',
          'Enquiry forms failing silently—not because the page crashed, but because outgoing email authentication (SPF and DKIM records) was never configured, causing customer leads to land in spam folders.',
          'Automated backups stored on the exact same server disk as the live website, with zero documented test restores ever performed.',
        ],
      },
      {
        heading: 'Step-by-step hardening and clean recovery',
        paragraphs: [
          'Recovery starts with ownership and visibility. First, domain registrar and DNS control move cleanly back to the business owner’s account with two-factor authentication enabled and recovery contacts verified. Second, unused extensions, forgotten staging copies and fragile inline scripts are stripped away, leaving a clean, minimal dependency tree where every remaining package is current and actively maintained.',
          'Third, form submissions are routed through authenticated email infrastructure paired with server-side validation and hidden honeypot filtering. Legitimate enquiries arrive reliably in the business inbox while automated bot spam is discarded quietly without cluttering staff email. SSL certificate renewal and strict security headers are verified across every route.',
        ],
      },
      {
        heading: 'Making ongoing maintenance boring—in the best sense',
        paragraphs: [
          'Once the foundation is clean, keeping a site dependable comes down to quiet consistency: automated off-site backups stored separately from production hosting, periodic restore drills to confirm backups actually work, staged dependency updates tested on a preview environment before going live, uptime monitoring that alerts immediately if a page slows or drops, and a direct phone number or email address when your team needs changes made safely.',
          'A dependable website should feel invisible in day-to-day operations—simply doing its job steadily all year round. Whether your site is a concise marketing presence or a custom web application serving customers across time zones, scheduling a short quarterly health check and keeping clear documentation ensures nobody ever inherits a fragile mystery.',
          'Treat website maintenance the same way you treat any core piece of business equipment: keep ownership clear, run routine checks before problems appear and fix small issues calmly while they are still small. That steady habit protects your reputation, keeps customer enquiries flowing smoothly and avoids costly emergency rebuilds. Over a year of normal business operations, quiet preventative care always costs far less time, effort and operational stress than emergency recovery when an unmaintained site suddenly stops working during peak business hours or busy tourist seasons across PEI and beyond.',
        ],
      },
    ],
  },
];

export function getResourceBySlug(slug: string): ResourceEntry | undefined {
  return RESOURCES.find((r) => r.slug === slug);
}

export function getRelatedResources(currentSlug: string, count = 3): ResourceEntry[] {
  const index = RESOURCES.findIndex((r) => r.slug === currentSlug);
  if (index === -1) return RESOURCES.slice(0, count);
  const next: ResourceEntry[] = [];
  for (let i = 1; i <= count; i++) {
    next.push(RESOURCES[(index + i) % RESOURCES.length]);
  }
  return next;
}
