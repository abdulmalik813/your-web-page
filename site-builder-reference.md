# Autonomous AI Site Builder & Complete Technical Architecture Manual
## `your-web-page` (Payload CMS 3.x + Next.js 15 App Router)

> **Purpose & Role for AI Agents**: This document is the definitive master specification for autonomously creating, configuring, populating, styling, and maintaining websites on this platform. An AI agent supplied with this document can construct any complete website (pages, blog, navigation, footer, themes, styles, media, forms, FAQs, testimonials) without requiring access to the underlying TypeScript source code.

---

## Table of Contents

1. [Architectural Overview & Core Engine](#1-architectural-overview--core-engine)
2. [Deep-Dive: Styling & Dynamic CSS Engine](#2-deep-dive-styling--dynamic-css-engine)
   - [CSS Variable Tokens & Theme Engine](#21-css-variable-tokens--theme-engine)
   - [Text Selection / Highlight Customization (Accent)](#22-text-selection--highlight-customization-accent)
   - [The `styles` Collection & Scoped Prefixing](#23-the-styles-collection--scoped-prefixing)
   - [The Dynamic Tailwind Generation Pipeline](#24-the-dynamic-tailwind-generation-pipeline)
   - [Runtime Stylesheet Compilation (`/api/stylesheet`)](#25-runtime-stylesheet-compilation-apistylesheet)
   - [Class Merging Mechanics (`joinStyles`)](#26-class-merging-mechanics-joinstyles)
   - [Font System & Google Fonts Integration](#27-font-system--google-fonts-integration)
3. [Global Configurations Schema](#3-global-configurations-schema)
   - [`settings` Global](#31-settings-global)
   - [`navigationBar` Global](#32-navigationbar-global)
   - [`footer` Global](#33-footer-global)
   - [`social` Global](#34-social-global)
4. [Collections Schema & Data Contracts](#4-collections-schema--data-contracts)
   - [`pages` Collection](#41-pages-collection)
   - [`posts` Collection (Feature-Gated)](#42-posts-collection-feature-gated)
   - [`categories` Collection](#43-categories-collection)
   - [`media` & `thumbnails` Collections](#44-media--thumbnails-collections)
   - [`icons` Collection](#45-icons-collection)
   - [`testimonials` Collection](#46-testimonials-collection)
   - [`faqs` Collection](#47-faqs-collection)
   - [`users` & `font-files` Collections](#48-users--font-files-collections)
5. [Complete Block Catalog & Field Specifications](#5-complete-block-catalog--field-specifications)
   - [1. `contentBlock`](#51-contentblock)
   - [2. `callToActionBlock`](#52-calltoactionblock)
   - [3. `cardBlock`](#53-cardblock)
   - [4. `tabBlock`](#54-tabblock)
   - [5. `accordionBlock`](#55-accordionblock)
   - [6. `dividerBlock`](#56-dividerblock)
   - [7. `formBlock`](#57-formblock)
   - [8. `tableBlock`](#58-tableblock)
   - [9. `lastModifiedBlock`](#59-lastmodifiedblock)
   - [10. `imageCarouselBlock`](#510-imagecarouselblock)
   - [11. `testimonialBlock`](#511-testimonialblock)
   - [12. `galleryBlock`](#512-galleryblock)
   - [13. `headingBlock`](#513-headingblock)
   - [14. `contactCardBlock`](#514-contactcardblock)
   - [15. `faqBlock`](#515-faqblock)
   - [16. `recentPostsBlock`](#516-recentpostsblock)
6. [Reusable Field Engines](#6-reusable-field-engines)
   - [`card()` Engine](#61-card-engine)
   - [`navigation()` Engine](#62-navigation-engine)
   - [`hero` Engine](#63-hero-engine)
   - [`grid()` Engine](#64-grid-engine)
   - [`icon()` Engine](#65-icon-engine)
   - [`navLocation()` Engine](#66-navlocation-engine)
7. [Lexical RichText Node & Block Embedding Mechanics](#7-lexical-richtext-node--block-embedding-mechanics)
8. [Page Layout Assembly & Grid Mathematics](#8-page-layout-assembly--grid-mathematics)
9. [Plugins, S3 Media & Storage Layer](#9-plugins-s3-media--storage-layer)
10. [Step-by-Step AI Execution Blueprint & Production Recipes](#10-step-by-step-ai-execution-blueprint--production-recipes)

---

## 1. Architectural Overview & Core Engine

```
                                  ┌─────────────────────────────┐
                                  │   Browser / Client Engine   │
                                  └──────────────┬──────────────┘
                                                 │
                                                 │ 1. Request HTML
                                                 ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Next.js 15 App Router Frontend ((frontend) layout)                                            │
│                                                                                                │
│  ├─ <link href="/api/stylesheet" rel="stylesheet" /> ──────────────┐                           │
│  ├─ <ThemeProvider attribute="class" defaultTheme="system" />      │                           │
│  ├─ LivePreviewListener (if Draft Mode)                            │                           │
│  └─ Page Component (/ [slug] / posts / [slug])                     │                           │
│      └─ Hero Component                                             │                           │
│      └─ Layout Section Rows (container + gapSize)                  │                           │
│          └─ Grid Columns (gridSize: full, half, 1/3, etc.)         │                           │
│              └─ BlockRenderer                                      │                           │
│                  └─ [BlockUI Components]                           │                           │
└────────────────────────────────────────────────┬───────────────────┼───────────────────────────┘
                                                 │                   │
                                                 │ 2. Query Data     │ 3. Fetch CSS
                                                 ▼                   ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Payload CMS 3.x Engine & Backend APIs                                                         │
│                                                                                                │
│  ├─ /api/stylesheet (Aggregates Theme CSS + Fontsource CSS + Font Classes + Styles Collection) │
│  ├─ MongoDB Database (via mongooseAdapter)                                                    │
│  │   ├── Globals: settings, navigationBar, footer, social                                      │
│  │   └── Collections: pages, posts, categories, styles, media, testimonials, faqs, icons...   │
│  ├─ AWS S3 Adapter (app/, thumbnails/, font-files/)                                            │
│  └─ External Tailwind Generation Microservice (TAILWIND_GENERATOR + "/generate")               │
└────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Deep-Dive: Styling & Dynamic CSS Engine

### 2.1 CSS Variable Tokens & Theme Engine

The frontend CSS engine is powered by Tailwind v4 `@theme inline` tokens configured in `theme.css`. Design tokens map to CSS custom variables in HSL, HEX, or OKLCH format.

#### Variable Token Reference Table

| Token Variable | Mapped Tailwind Class | Standard Usage | Light Value Example | Dark Value Example |
|---|---|---|---|---|
| `--background` | `bg-background` | Page canvas background | `#ffffff` | `#09090b` |
| `--foreground` | `text-foreground` | Primary text color | `#09090b` | `#fafafa` |
| `--card` | `bg-card` | Surface background for cards/panels | `#ffffff` | `#121214` |
| `--card-foreground` | `text-card-foreground` | Text color inside cards | `#09090b` | `#fafafa` |
| `--popover` | `bg-popover` | Dropdowns, menus, modals | `#ffffff` | `#121214` |
| `--popover-foreground`| `text-popover-foreground`| Text in dropdowns/menus | `#09090b` | `#fafafa` |
| `--primary` | `bg-primary`, `text-primary` | Main brand color & CTA buttons | `#18181b` / `#3b82f6` | `#fafafa` / `#60a5fa` |
| `--primary-foreground`| `text-primary-foreground`| Text on primary buttons | `#fafafa` | `#09090b` |
| `--secondary` | `bg-secondary` | Secondary badges & secondary buttons | `#f4f4f5` | `#27272a` |
| `--secondary-foreground`| `text-secondary-foreground`| Text on secondary elements | `#18181b` | `#fafafa` |
| `--muted` | `bg-muted` | Subdued backgrounds / table rows | `#f4f4f5` | `#1f1f23` |
| `--muted-foreground` | `text-muted-foreground` | Subtitles, hints, meta dates | `#71717a` | `#a1a1aa` |
| `--accent` | `bg-accent`, `text-accent` | Hover highlights, active tabs, pills | `#2563eb` / `#f0fdf4` | `#3b82f6` / `#1e293b` |
| `--accent-foreground` | `text-accent-foreground`| Text on accent surfaces | `#ffffff` / `#166534` | `#ffffff` / `#93c5fd` |
| `--destructive` | `bg-destructive` | Warning/danger actions | `#ef4444` | `#7f1d1d` |
| `--border` | `border-border` | Component and divider borders | `#e4e4e7` | `#27272a` |
| `--input` | `border-input` | Form field borders | `#e4e4e7` | `#27272a` |
| `--ring` | `ring-ring` | Focus state outlines | `#18181b` | `#d4d4d8` |
| `--radius` | `rounded-lg` / `rounded-md` | Base border radius | `0.5rem` | `0.5rem` |

---

### 2.2 Text Selection / Highlight Customization (Accent)

To style highlighted/selected text with your accent color, inject the following into **Settings → Theme** tab:

```css
::selection {
  background-color: var(--accent);
  color: var(--accent-foreground);
}

::-moz-selection {
  background-color: var(--accent);
  color: var(--accent-foreground);
}
```

---

### 2.3 The `styles` Collection & Scoped Prefixing

Instead of hardcoding inline CSS or arbitrary Tailwind class strings into every block, all visual styles are encapsulated as **`styles` collection documents**.

#### The `Styles` Collection Schema:
- **`alias`** (`string`, unique, required): The human-readable handle (e.g. `hero-gradient-text`, `card-hover-glass`).
- **`tailwind`** (`boolean`, default `true`): Controls whether the class string is processed by the Tailwind compiler.
- **`className`** (`string`, required): The Tailwind classes to compile.
- **`stylesheet`** (`string`, textarea): The resulting CSS output.

#### Scoped Class Sanitization & Prefixing Algorithm:
When classes are output by `joinStyles()`, the system prefixes utility class names using the sanitized `alias` to prevent class collisions across blocks:

$$\text{sanitizedAlias} = \text{alias.toLowerCase().replace(/[^a-z0-9-]/g, '')}$$

1. If the class starts with `font-` (e.g. `.font-66e01a`), it is left untouched.
2. If the sanitized alias starts with a number or hyphen, it is prefixed with `c`: `c{alias}-{className}`.
3. Otherwise, it generates: `{sanitizedAlias}-{className}`.

*Example*:
- Document Alias: `Feature Card`
- Input `className`: `p-8 rounded-2xl bg-card border`
- Output HTML classes: `feature-card-p-8 feature-card-rounded-2xl feature-card-bg-card feature-card-border`

---

### 2.4 The Dynamic Tailwind Generation Pipeline

When a `styles` document is saved in Payload:
1. The `beforeChange` hook (`generateStylesheet` in `src/collections/styles/hooks.ts`) triggers.
2. If `tailwind !== false`, it sends a `multipart/form-data` POST request to `TAILWIND_GENERATOR + "/generate"`.
3. Payloads sent:
   - `className`: The raw class string.
   - `file`: The full `globalCSS` bundle (containing `@import 'tailwindcss'`, `@theme inline`, and typography plugins).
   - `title`: The style `alias`.
4. The microservice returns standalone, compiled CSS targeting the prefixed class names.
5. The compiled CSS is written to `doc.stylesheet`.
6. The `afterChange` hook calls `revalidateTag('collection-styles', 'max')`.

---

### 2.5 Runtime Stylesheet Compilation (`/api/stylesheet`)

The Next.js frontend delivers all CSS dynamically through the route `src/app/(frontend)/api/stylesheet/route.ts`.

#### The Aggregation Order:
$$\text{Compiled CSS} = \text{Fontsource CSS} + \text{Font Class Declarations} + \text{Settings.theme} + \sum \text{Style.stylesheet}$$

1. **Fontsource CSS**: Injects the Google Fonts `@font-face` definitions stored in `settings.default.fontData` and `settings.additionalFonts[].fontData`.
2. **Font Classes**: Injects utility classes `.font-<fontId>` with `!important` declarations.
3. **Settings.theme**: Injects the raw custom CSS string from the `Settings` global.
4. **All Styles Documents**: Injects every compiled `stylesheet` string from the `styles` collection.

#### Cache & Live Preview Mechanics:
- **Production Requests**: Cached using Next.js `unstable_cache` with tag `compiled-stylesheet`. Emits `ETag` (SHA-256 hash) and supports HTTP `304 Not Modified`.
- **Draft Mode Requests**: `/api/stylesheet?draft=1&t=<updatedAt>` bypasses all caches with `Cache-Control: no-store, no-cache`, streaming new CSS to Live Preview iframes instantly upon saving.

---

### 2.6 Class Merging Mechanics (`joinStyles`)

The helper function `joinStyles(...items)` merges base classes and `Style` document relationships:

```typescript
joinStyles(
  'base-class-1 base-class-2',
  blockData.cardStyles // (Array of populated Style documents or Style IDs)
)
```

1. Accepts strings, `null`, `undefined`, single `Style` objects, or arrays of `Style` objects.
2. Formats all classes, executes alias prefixing on `Style` objects, and returns a sanitized, deduplicated class string.

---

### 2.7 Font System & Google Fonts Integration

Fonts are managed in **Settings → Fonts tab**:

#### 1. Default Font (`default`)
- Applied directly as the inline `fontFamily` on the root `<html>` element in `src/app/(frontend)/layout.tsx`.
- Automatically sets `--font-family` and loads the variable or static font files.

#### 2. Additional Fonts (`additionalFonts[]`)
- Array of custom font definitions (`title` + `family` + `fontData`).
- Generates a dedicated class:
```css
.font-<additionalFontId> {
  font-family: 'Outfit', sans-serif !important;
  font-weight: 700 !important;
  font-style: normal !important;
  font-display: swap;
}
```
- To use an additional font on any element, create a `styles` document with `className: "font-<additionalFontId>"` and attach it to that element's `*Styles` field.

---

## 3. Global Configurations Schema

Globals are singleton records accessible anywhere on the site.

### 3.1 `settings` Global

The master controller for site identity, SEO, contact data, posts, fonts, and theme tokens.

```typescript
interface SettingsGlobal {
  // Tab 1: App Data
  logo: MediaRelationship;           // Required (Light mode logo)
  logoDark?: MediaRelationship;       // Optional (Dark mode logo)
  appTitle: string;                  // Required (e.g. "Acme Corp")
  appDescription: string;            // Required (Meta description)
  fallbackImage: MediaRelationship;  // Required (PNG OG fallback image)
  favIcon: MediaRelationship;        // Required (ICO favicon)
  favIconSvg?: MediaRelationship;    // Optional (SVG favicon)
  favIconPng?: MediaRelationship;    // Optional (PNG favicon)
  locale: string;                    // Required (e.g. "en_US", "en_CA")

  // Tab 2: SEO
  googleVerification?: string;
  googleAnalyticsId?: string;        // (e.g. "G-XXXXXXXXXX")
  bingVerification?: string;
  microsoftClarityId?: string;
  yandexVerification?: string;

  // Tab 3: Location and Contact
  emails?: Array<{ email: string }>;
  phones?: Array<{ number: string }>;
  addressType: 'partial' | 'full';
  googleMapsId?: string;             // Google Maps Place ID
  locationText?: string;             // Used when addressType === 'partial'
  fullAddress?: {                    // Used when addressType === 'full'
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };

  // Tab 4: Post (Blog Toggle)
  enablePost: boolean;               // Master toggle for Posts/Categories
  postListingPageTitle?: string;     // Admin label & archive page title (e.g. "Blog")
  postSlug?: string;                 // URL prefix (e.g. "blog" -> /blog/[slug])
  postMetaTitle?: string;
  postMetaDescription?: string;
  postMetaImage?: MediaRelationship;

  // Tab 5: Fonts
  default: {
    family: string;                  // Google font family name
    fontData?: JSON;                 // Font metadata and CSS
  };
  additionalFonts?: Array<{
    title: string;                   // E.g. "Display Heading Font"
    family: string;
    fontData?: JSON;
  }>;

  // Tab 6: Theme
  theme: string;                     // Raw CSS variables (:root, .dark, ::selection)
}
```

---

### 3.2 `navigationBar` Global

```typescript
interface NavigationBarGlobal {
  stickyBar: boolean;                // Default: true
  
  // Tab 1: Navigation
  navigation?: NavigationField[];    // Main navigation items
  cta?: NavigationField[];           // Max 2 call-to-action buttons
  
  // Tab 2: Banner
  banner: {
    enableBanner: boolean;
    content?: LexicalRichText;
    bannerStyles?: StyleRelationship[];
    contentStyles?: StyleRelationship[];
  };
  
  // Tab 3: Styles
  logoStyles?: StyleRelationship[];
  useTitleWithLogo?: boolean;
  titleStyles?: StyleRelationship[];
  hideWhenIdle?: boolean;
  idleTimeout?: number;              // Default: 3000ms
}
```

---

### 3.3 `footer` Global

```typescript
interface FooterGlobal {
  // Tab 1: Content
  tagLine?: LexicalRichText;         // Can embed ContentBlock
  links?: NavigationField[];         // Footer link array
  
  // Tab 2: Styles
  logoStyles?: StyleRelationship[];
  tagLineStyles?: StyleRelationship[];
  linkStyles?: StyleRelationship[];
}
```

---

### 3.4 `social` Global

Key-value URLs for social platforms:
- `facebook?: string`
- `instagram?: string`
- `x?: string`
- `linkedin?: string`
- `youtube?: string`
- `tiktok?: string`

---

## 4. Collections Schema & Data Contracts

### 4.1 `pages` Collection (`slug: 'pages'`)

The fundamental document collection for every public route.

- **`title`** (`string`, required): Title of the page.
- **`slug`** (`string`, unique, indexed): URL path (e.g. `home`, `about`, `pricing`). Root page uses `home` or empty slug.
- **`author`** (`relationship → users`): Sidebar user reference.
- **`publishedAt`** (`date`): Timestamp of first publication.
- **`hero`** (`group`): Full hero configuration (see §6.3).
- **`layout`** (`array`): Array of Section Rows (see §8).
- **`meta`** (`tab`): SEO meta title, description, and preview image.

---

### 4.2 `posts` Collection (Feature-Gated, `slug: 'posts'`)

Enabled only when `settings.enablePost === true`.

- **`title`** (`string`, required): Blog post title.
- **`slug`** (`string`, unique): Post slug. URL format: `/{settings.postSlug}/{slug}`.
- **`author`** (`relationship → users`): Author reference.
- **`categories`** (`relationship → categories[]`): Category tags.
- **`readingTime`** (`number`, default `5`): Estimated reading time in minutes.
- **`hero`** (`group`): Full hero configuration.
- **`layout`** (`array`): Same layout system as Pages, with `recentPostsBlock` enabled (`dbPrefix: 'pst'`).
- **`publishedAt`** (`date`): Publication date.
- **`meta`** (`tab`): SEO meta fields.

---

### 4.3 `categories` Collection (`slug: 'categories'`)

- **`name`** (`string`, required, unique): Category name.
- **`slug`** (`string`, unique): Auto-generated slug.
- **`description`** (`string`, textarea): Category description.
- **`color`** (`select`): `default | secondary | destructive | outline`.

---

### 4.4 `media` & `thumbnails` Collections

#### `media` (`slug: 'media'`)
- Handled by `@payloadcms/storage-s3` under S3 prefix `app/`.
- Generated formats: `thumbnail (300w)`, `square (500x500)`, `small (600w)`, `medium (900w)`, `large (1400w)`, `xlarge (1920w)`, `og (1200x630)`.
- Metadata fields: `alt`, `caption`, `creditText`, `creator`, `license`, `copyrightNotice`, `acquireLicensePage`.
- Video support: `videoThumbnail` (`upload → thumbnails`).

#### `thumbnails` (`slug: 'thumbnails'`)
- Upload collection for video preview posters under S3 prefix `thumbnails/`.

---

### 4.5 `icons` Collection (`slug: 'icons'`)

Upload collection for raw SVG vector icons. Used in `icon()` fields and inline rich-text icons.

---

### 4.6 `testimonials` Collection (`slug: 'testimonials'`)

- **`type`** (`select`): `individual | company`.
- **`name`** (`string`, required): Reviewer name.
- **`position`** (`string`): Shown when `type === 'company'`.
- **`company`** (`string`): Shown when `type === 'company'`.
- **`avatar`** (`upload → media`): Reviewer photo.
- **`content`** (`string`, required, textarea): Testimonial body text.
- **`rating`** (`number`, min 1, max 5): Star rating.

---

### 4.7 `faqs` Collection (`slug: 'faqs'`)

- **`question`** (`string`, required): FAQ question string.
- **`answer`** (`string`, required, textarea): FAQ answer string.

---

### 4.8 `users` & `font-files` Collections

- **`users`**: Authentication collection for Payload Admin access.
- **`font-files`**: Upload collection for custom `.woff2` and `.ttf` font files stored under S3 prefix `font-files/`.

---

## 5. Complete Block Catalog & Field Specifications

### 5.1 `contentBlock`
Rich text content container supporting nested blocks and inline elements.
- **`contentStyles`**: `relationship → styles[]`
- **`content`**: Lexical richText editor
  - *Allowed Blocks*: `mediaBlock`, `navigationBlock`, `tabBlock`, `cardBlock`, `accordionBlock`, `dividerBlock`, `formBlock`, `tableBlock`
  - *Allowed Inline Blocks*: `navigationBlock`, `iconBlock`

### 5.2 `callToActionBlock`
High-conversion call-to-action hero or bottom banner.
- **`card`**: Full `card()` engine group
- **`backgroundStyles`**: `relationship → styles[]`
- **`media`**: `relationship → media`
- **`wrapperStyles`**: `relationship → styles[]`
- **`contentStyles`**: `relationship → styles[]`

### 5.3 `cardBlock`
Standalone card component.
- Uses full `card()` field engine (see §6.1).

### 5.4 `tabBlock`
Interactive multi-tab container.
- **`tabs[]`**: Array of tabs
  - `title`: `string` (required)
  - `content`: Lexical richText (embeds media, nav, accordion, testimonial, gallery, faq)
  - `titleStyles`: `relationship → styles[]`
  - `contentStyles`: `relationship → styles[]`
- **`tabStyles`**: `relationship → styles[]` (Wrapper container)
- **`tabListStyles`**: `relationship → styles[]` (Tab bar list container)

### 5.5 `accordionBlock`
Collapsible FAQ or accordion list.
- **`items[]`**: Array of items
  - `trigger`: `string` (Trigger header text, required)
  - `content`: Lexical richText (embeds media, nav)
  - `triggerStyles`: `relationship → styles[]`
  - `contentStyles`: `relationship → styles[]`
- **`accordionStyles`**: `relationship → styles[]` (Overall container)
- **`accordionItemStyles`**: `relationship → styles[]` (Item wrapper)

### 5.6 `dividerBlock`
Visual SVG or line divider.
- **`type`**: `line | dashed | dotted | double | gradient | wave | curve | angle | triangle | arrow | zigzag | spacer | fade`
- **`height`**: `small | medium | large | xlarge`
- **`color`**: `neutral | primary | secondary | accent` (Hidden if `type === 'spacer'`)
- **`flip`**: `boolean` (Flips SVG vertically for wave, curve, angle, triangle, arrow)
- **`dividerStyles`**: `relationship → styles[]`

### 5.7 `formBlock`
Dynamic form embedded via `@payloadcms/plugin-form-builder`.
- **`form`**: `relationship → forms` (required)
- **`enableDescription`**: `boolean`
- **`description`**: Lexical richText (conditional)
- **`cardStyles`**: `relationship → styles[]`
- **`titleStyles`**: `relationship → styles[]`
- **`descriptionStyles`**: `relationship → styles[]`

### 5.8 `tableBlock`
Data tables with Lexical-enabled cells.
- **`caption`**: `string`
- **`showHeader`**: `boolean` (default `true`)
- **`headers[]`**: Array of `{ header: LexicalRichText }`
- **`rows[]`**: Array of rows
  - `cells[]`: Array of `{ content: LexicalRichText, cellStyles: styles[] }`
  - `rowStyles`: `relationship → styles[]`
- **`tableStyles`**, **`headerStyles`**, **`bodyStyles`**, **`captionStyles`**: `relationship → styles[]`

### 5.9 `lastModifiedBlock`
Displays last-updated metadata for documentation or articles.
- **`cardStyles`**: `relationship → styles[]`
- **`cardContentStyles`**: `relationship → styles[]`

### 5.10 `imageCarouselBlock`
Full-width or embedded image carousel.
- **`medias`**: `relationship → media[]`

### 5.11 `testimonialBlock`
Renders customer reviews from the `testimonials` collection.
- **`type`**: `carousel | grid`
- **`title`**: `string` (conditional on carousel)
- **`titleStyles`**: `relationship → styles[]`
- **`testimonials`**: `relationship → testimonials[]` (required)
- **`nav`**: `navigation()` engine for prev/next controls

### 5.12 `galleryBlock`
Multi-layout image gallery.
- **`format`**: `grid | carousel | focus`
- **`title`**: `string` (carousel only)
- **`titleStyles`**: `relationship → styles[]`
- **`gallery[]`**: Array of `{ image: upload → media }`
- **`nav`**: `navigation()` controls (carousel only)

### 5.13 `headingBlock`
Standalone structured heading.
- **`headingTag`**: `h1 | h2 | h3 | h4 | h5 | h6` (default: `h2`)
- **`headingText`**: `string` (required)
- **`headingStyles`**: `relationship → styles[]`

### 5.14 `contactCardBlock`
Structured company contact card pulling from global contact settings.
- **`heading`**: `string` (required)
- **`description`**: `string`
- **`cardStyles`**, **`headingStyles`**, **`descriptionStyles`**, **`contentStyles`**, **`linkStyles`**: `relationship → styles[]`

### 5.15 `faqBlock`
Pulls and renders questions from the `faqs` collection as an accordion.
- **`faq`**: `relationship → faqs[]`
- **`accordionStyles`**, **`itemStyles`**, **`questionStyles`**, **`answerStyles`**: `relationship → styles[]`

### 5.16 `recentPostsBlock`
Renders recent blog posts (available only within the `posts` collection layout).
- **`enableTitle`**: `boolean` (default `true`)
- **`numberOfPosts`**: `number` (default `5`)
- **`title`**: `string`
- **`cardStyles`**, **`titleStyles`**, **`contentStyles`**, **`linkStyles`**: `relationship → styles[]`

---

## 6. Reusable Field Engines

### 6.1 `card()` Engine

```typescript
{
  // Tab 1: Configuration
  enableTitle: boolean;        // Default: true
  enableAction: boolean;       // Default: false
  enableDescription: boolean;  // Default: false
  enableContent: boolean;      // Default: false
  enableFooter: boolean;       // Default: false

  // Tab 2: Card
  title?: string;
  actionPlacement?: 'header' | 'footer';
  action?: Array<{ nav: NavigationField }>;
  description?: string;        // Textarea
  content?: LexicalRichText;   // Embeds media, nav, tabs, accordion, forms
  footer?: string;

  // Tab 3: Styles
  cardStyles?: StyleRelationship[];
  titleStyles?: StyleRelationship[];
  actionStyles?: StyleRelationship[];
  descriptionStyles?: StyleRelationship[];
  cardContentStyles?: StyleRelationship[];
  footerStyles?: StyleRelationship[];
}
```

---

### 6.2 `navigation()` Engine

```typescript
{
  label?: string;              // Text display
  appearance: 'link' | 'button' | 'dropdown';
  
  // Link Configuration (for 'link' or 'button')
  link: {
    type: 'internal' | 'external' | 'custom';
    reference?: PageRelationship;
    url?: string;              // Used when external
    custom?: string;           // Used when custom (e.g. "/#features")
    newTab?: boolean;
  };

  // Dropdown Items (for 'dropdown')
  items?: Array<{
    label: string;
    type: 'internal' | 'external' | 'custom';
    reference?: PageRelationship;
    url?: string;
    custom?: string;
    newTab?: boolean;
    icon?: IconField;
  }>;

  // Button Settings (for 'button' or 'dropdown')
  buttonType?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  buttonSize?: 'sm' | 'default' | 'lg' | 'icon';
  listStyle?: StyleRelationship[]; // Dropdown menu list styling
  styles?: StyleRelationship[];    // Button appearance styling
  icon?: IconField;                // Icon + axis (before/after) + iconStyles
}
```

---

### 6.3 `hero` Engine

The Hero section is 100% database-driven with zero hardcoded values in JSX.

```typescript
{
  layout: 'home-page' | 'with-image' | 'text-only';

  // ─── 1. Home Page Layout ('home-page') ─────────────────────────────────────
  // Headline & Intro:
  title: string;                               // Required (Main Left Headline)
  description?: string;                        // Subtitle text
  actions?: Array<{ nav: NavigationField }>;   // CTA button array (max 4)
  titleStyles?: StyleRelationship[];
  descriptionStyles?: StyleRelationship[];
  actionsStyles?: StyleRelationship[];

  // Services Card (homePageCard):
  homePageCard?: {
    badgeText?: string;                        // E.g. "HOW WE HELP"
    heading?: string;                          // E.g. "EVERYTHING YOUR SITE NEEDS"
    icon?: IconField;                          // Top header SVG icon (from icons collection)
    items?: Array<{
      title: string;                           // Feature row title (e.g. "WEBSITE DESIGN")
      description: string;                     // Feature row description
      icon?: IconField;                        // Row-level SVG icon
      itemStyles?: StyleRelationship[];        // Row-level style classes
    }>;
    cardStyles?: StyleRelationship[];
    badgeStyles?: StyleRelationship[];
    headingStyles?: StyleRelationship[];
  };

  // ─── 2. Hero with Image Layout ('with-image') ──────────────────────────────
  card?: CardFields;                           // Uses full card() engine
  media?: MediaRelationship;                   // Media image/video
  backgroundStyles?: StyleRelationship[];

  // ─── 3. Simple Hero Layout ('text-only') ───────────────────────────────────
  // Uses title, description, titleStyles, descriptionStyles

  // ─── Shared Layout Styles ──────────────────────────────────────────────────
  sectionStyles?: StyleRelationship[];         // Overall hero section container styling
}
```

---

### 6.4 `grid()` Engine

Controls the column width of any block row:
- **`gridSize`** (`select`, default `full`):
  - `full` (100% width)
  - `three-quarters` (75% width)
  - `two-thirds` (66.6% width)
  - `half` (50% width)
  - `one-third` (33.3% width)
  - `one-quarter` (25% width)
- **`gridStyles`**: `relationship → styles[]`

---

### 6.5 `icon()` Engine

- **`icon`**: `relationship → icons`
- **`axis`**: `before | after` (default `before`)
- **`iconStyles`**: `relationship → styles[]`

---

### 6.6 `navLocation()` Engine

Standard destination selector:
- **`type`**: `internal` (Page relationship) | `external` (URL text) | `custom` (custom path text)

---

## 7. Lexical RichText Node & Block Embedding Mechanics

The custom Lexical renderer in `src/components/renderer/lexical-renderer.tsx` maps AST nodes directly to typed React components:

```
Lexical AST Node               Frontend UI Component / Rendering Output
─────────────────────────────────────────────────────────────────────────────
heading (h1-h6)            ──> <Tag className="text-4xl font-bold mt-8 mb-4">
quote                      ──> <blockquote className="border-l-4 border-muted-foreground/30 pl-4">
list (ul/ol)               ──> <ul className="list-disc my-4 pl-8"> / <ol>
code                       ──> <code className="bg-muted px-1.5 py-0.5 rounded font-mono">
link                       ──> <NavigationBlockUI {...node.fields} />
inlineBlocks:
  navigationBlock          ──> <NavigationBlockUI />
  iconBlock                ──> <IconBlockUI />
blocks:
  mediaBlock               ──> <MediaBlockUI />
  tabBlock                 ──> <TabBlockUI />
  accordionBlock           ──> <AccordionBlockUI />
  cardBlock                ──> <CardBlockUI />
  dividerBlock             ──> <DividerBlockUI />
  formBlock                ──> <FormBlockUI />
  tableBlock               ──> <TableBlockUI />
  testimonialBlock         ──> <TestimonialBlockUI />
  galleryBlock             ──> <GalleryBlockUI />
  faqBlock                 ──> <FaqBlockUI />
  contactCardBlock         ──> <ContactCardBlockUI />
  contentBlock             ──> <ContentBlockUI />
```

---

## 8. Page Layout Assembly & Grid Mathematics

A Page or Post document structures its body through the `layout` array:

$$\text{Page} \longrightarrow \text{Layout Section Row} \longrightarrow \text{Grid Columns} \longrightarrow \text{Content Blocks}$$

```typescript
Page: {
  title: "Services",
  slug: "services",
  hero: { layout: "text-only", heroTitle: "Our Services" },
  layout: [
    {
      // SECTION ROW 1: 3-Column Feature Cards
      tabs: {
        styles: {
          container: true,            // Wrapped in max-w-7xl mx-auto px-4
          gapSize: "large",           // gap-8
          styles: [StyleRef_RowBg]    // Custom row styling
        },
        content: {
          grid: [
            {
              gridSize: "one-third",  // Column 1 (33.3%)
              gridStyles: [],
              blocks: [CardBlock_1]
            },
            {
              gridSize: "one-third",  // Column 2 (33.3%)
              gridStyles: [],
              blocks: [CardBlock_2]
            },
            {
              gridSize: "one-third",  // Column 3 (33.3%)
              gridStyles: [],
              blocks: [CardBlock_3]
            }
          ]
        }
      }
    }
  ]
}
```

---

## 9. Plugins, S3 Media & Storage Layer

1. **`@payloadcms/storage-s3`**:
   - `media` collection $\rightarrow$ S3 prefix `app/` $\rightarrow$ served at `/api/media/file/[filename]`
   - `thumbnails` collection $\rightarrow$ S3 prefix `thumbnails/` $\rightarrow$ served at `/api/thumbnails/file/[filename]`
   - `font-files` collection $\rightarrow$ S3 prefix `font-files/` $\rightarrow$ served at `/api/font-files/file/[filename]`
   - `.mp4` video downloads automatically generate signed URLs.
2. **`@payloadcms/plugin-seo`**:
   - Auto-generates `<title>` as `{doc.title} | {settings.appTitle}`.
   - Canonical URLs: `/{slug}` for pages, `/{settings.postSlug}/{slug}` for posts.
3. **`@payloadcms/plugin-form-builder`**:
   - Dynamic form generator with text, email, number, date, time (`TimeBlock`), select, checkbox, and confirmation richText.
4. **`@payloadcms/plugin-search`**:
   - Syncs and indexes Posts with search priorities (`posts: 10, pages: 20`).
5. **`@payloadcms/plugin-redirects`**:
   - URL redirection with support for `navLocation` internal/external/custom targets.

---

## 10. Step-by-Step AI Execution Blueprint & Production Recipes

When an AI agent is tasked with creating a website from scratch, follow this exact deterministic execution sequence:

### Phase 1: Initialize Global Settings & Theme
1. Populate **`settings`** global:
   - Upload light logo, dark logo, favicon ICO/PNG/SVG, and OG fallback image to `media`.
   - Set `appTitle`, `appDescription`, `locale`.
   - Configure **Theme Tab**:
     - Define `--background`, `--foreground`, `--primary`, `--secondary`, `--accent`, `--muted`, `--border`, `--radius` for `:root` and `.dark`.
     - Add `::selection` and `::-moz-selection` with `var(--accent)`.
   - Configure **Fonts Tab**: Set default font family (e.g. `Inter` or `Plus Jakarta Sans`).

### Phase 2: Create Core Styles in `styles` Collection
Create the required `styles` documents to make components look polished:
- `alias: "card-elevated"` $\rightarrow$ `className: "bg-card border border-border/80 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"`
- `alias: "gradient-heading"` $\rightarrow$ `className: "text-4xl md:text-5xl font-black tracking-tight text-foreground"`
- `alias: "section-py"` $\rightarrow$ `className: "py-20 md:py-28"`
- `alias: "btn-glow"` $\rightarrow$ `className: "bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform"`

### Phase 3: Setup Navigation Bar & Footer
1. Populate **`navigationBar`** global:
   - Add links for Home (`/`), Services (`/services`), Pricing (`/pricing`), Blog (`/blog`), Contact (`/contact`).
   - Add CTA button ("Get Started").
2. Populate **`footer`** global:
   - Add tagline richText and footer link array.
3. Populate **`social`** global with URLs.

### Phase 4: Create Pages & Content Layouts
1. **Home Page (`slug: "home"`)**:
   - `hero`:
       - `layout`: `"fullscreen"`
       - `card`:
           - `enableTitle`: `true`
           - `title`: `"WEBSITES BUILT TO MOVE YOUR BUSINESS FORWARD."`
           - `enableDescription`: `true`
           - `description`: `"We design, build, host, and maintain high-performing websites for businesses in PEI and around the world."`
           - `enableAction`: `true`
           - `action`:
               - Button 1: `{ nav: { appearance: "button", label: "START YOUR PROJECT", buttonType: "default", link: { type: "custom", custom: "/#contact" } } }`
               - Button 2: `{ nav: { appearance: "button", label: "VIEW OUR WORK", buttonType: "outline", link: { type: "custom", custom: "/#work" } } }`
   - `layout`:
       - Row 1: `grid: [full]` $\rightarrow$ `headingBlock` ("Featured Projects")
       - Row 2: `grid: [1/3, 1/3, 1/3]` $\rightarrow$ 3 × `cardBlock` (with `cardStyles: [card-elevated]`)
       - Row 3: `grid: [full]` $\rightarrow$ `testimonialBlock` (`type: "carousel"`)
       - Row 4: `grid: [full]` $\rightarrow$ `callToActionBlock`
2. **Contact Page (`slug: "contact"`)**:
   - `hero`: `layout: "text-only"`, `heroTitle: "Contact Us"`
   - `layout`:
     - Row 1: `grid: [2/3, 1/3]` $\rightarrow$ `formBlock` (left) + `contactCardBlock` (right)
3. **FAQ Page (`slug: "faq"`)**:
   - Add entries in `faqs` collection.
   - Add `faqBlock` inside page layout.

### Phase 5: Blog & Articles (If Needed)
1. Enable `settings.enablePost: true` and set `postSlug: "blog"`.
2. Create `categories` (e.g. "Announcements", "Engineering").
3. Create `posts` with categories, author, reading time, hero, and content blocks.
