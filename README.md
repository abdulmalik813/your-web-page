# HeartCulture Catalyst

A powerful web application by [NightTech Services](https://github.com/NightTech-Services), built with [Next.js](https://nextjs.org/) and [Payload CMS](https://payloadcms.com/).

🌐 **Website:** [www.heartculturecatalyst.com](https://www.heartculturecatalyst.com)

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Development](#development)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Modern Stack**: Built with Next.js 15, React 19, and Payload CMS 3.61
- **Headless CMS**: Powerful content management with Payload CMS
- **Rich Content Blocks**: 18+ pre-built content blocks for flexible page building
- **Advanced UI**: Shadcn UI components with Radix UI primitives
- **Smooth Animations**: GSAP, Framer Motion, and Lenis scroll effects
- **Media Management**: S3-compatible storage with image optimization via Sharp
- **SEO Optimized**: Built-in SEO plugin with automatic sitemap generation
- **Form Builder**: Integrated form builder plugin with email notifications
- **User Management**: Role-based access control and authentication
- **Dark Mode**: Built-in theme switcher
- **Live Preview**: Real-time content preview across multiple devices
- **Type-Safe**: Full TypeScript support with auto-generated types

### Content Blocks

- Accordion
- Call to Action
- Card
- Contact Card
- Content Block
- Divider
- FAQ
- Form
- Gallery
- Heading
- Icon
- Last Modified
- Media
- Navigation
- Recent Posts
- Tab
- Table
- Testimonial

### Collections

- **Pages**: Dynamic page builder with flexible layouts
- **Posts**: Blog posts with categories and author support
- **Categories**: Organize content by category
- **Media**: Image and file management with S3 storage
- **Thumbnails**: Optimized thumbnail generation
- **Users**: User authentication and role management
- **Styles**: Custom CSS/style management
- **Icons**: SVG icon library
- **Testimonials**: Customer testimonials
- **FAQs**: Frequently asked questions
- **Fonts**: Custom font file management

## Technology Stack

### Core

- **Framework**: Next.js 15.5.6 with App Router
- **React**: 19.2.0
- **CMS**: Payload CMS 3.61.1
- **Language**: TypeScript 5.9

### Database & Storage

- **Database**: PostgreSQL with Drizzle ORM
- **Storage**: AWS S3 / S3-compatible (MinIO for development)

### Styling & UI

- **CSS Framework**: Tailwind CSS 4.x
- **Components**: Shadcn UI + Radix UI primitives
- **Fonts**: Geist (Inter alternative)

### Animations & Interactions

- **Animation Library**: GSAP 3.13, Framer Motion 12
- **Smooth Scroll**: Lenis 1.3
- **Carousel**: Embla Carousel

### Plugins & Integrations

- **Email**: Nodemailer adapter
- **SEO**: Payload SEO plugin
- **Forms**: Form Builder plugin
- **Search**: Full-text search plugin
- **Redirects**: Automatic redirect management
- **Nested Docs**: Hierarchical content structure

## Getting Started

### Prerequisites

- **Node.js**: 22.x
- **pnpm**: >=8.15.0
- **PostgreSQL**: 15+ (or use Docker)
- **S3 Storage**: AWS S3 or S3-compatible service

### Quick Start with Docker (Recommended for Development)

1. **Clone the repository**

   ```bash
   git clone https://github.com/NightTech-Services/heartculture-catalyst.git
   cd heartculture-catalyst
   ```

2. **Start PostgreSQL and MinIO (S3)**

   ```bash
   docker-compose up -d
   ```

   This starts:
   - PostgreSQL on `localhost:5432`
   - MinIO (S3) on `localhost:9000`
   - MinIO Console on `localhost:9001`

3. **Install dependencies**

   ```bash
   pnpm install
   ```

4. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   The default values work with docker-compose setup. Update secrets for production.

5. **Run the development server**

   ```bash
   pnpm dev
   ```

   Your site will be available at:
   - Frontend: `http://localhost:3000`
   - Admin Panel: `http://localhost:3000/admin`
   - MinIO Console: `http://localhost:9001` (minioadmin/minioadmin)

## Development

### Available Scripts

```bash
# Development server with hot reload
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint

# Fix linting issues
pnpm lint:fix

# Generate TypeScript types
pnpm generate:types

# Generate import map
pnpm generate:importmap

# Generate both types and import map
pnpm generate

# Export Tailwind CSS
pnpm export-css
```

### Development Workflow

1. Make changes to your code
2. Run `pnpm generate` if you modify Payload collections/globals
3. Test changes in development mode
4. Run `pnpm lint` before committing
5. Build and test production bundle before deploying

## Project Structure

```
heartculture-catalyst/
├── public/                 # Static assets
├── scripts/               # Build and utility scripts
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── (frontend)/  # Public-facing pages
│   │   └── (payload)/   # Payload CMS admin
│   ├── blocks/           # Content blocks (18 types)
│   ├── collections/      # Payload collections
│   ├── components/       # React components
│   │   ├── admin/       # Admin-specific components
│   │   └── ui/          # Shadcn UI components
│   ├── constants/        # App constants
│   ├── fields/          # Payload field configurations
│   ├── globals/         # Payload global configs
│   ├── hooks/           # React hooks
│   ├── jobs/            # Background jobs
│   ├── lib/             # Utility functions
│   ├── types/           # TypeScript type definitions
│   ├── payload.config.ts # Payload configuration
│   └── plugins.ts       # Payload plugins
├── .env.example         # Environment variables template
├── docker-compose.yml   # Development services (PostgreSQL + MinIO)
├── Dockerfile           # Production container
├── next.config.ts       # Next.js configuration
├── tailwind.config.ts   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

### Security Notes

- Never commit `.env` to version control
- Use strong, unique secrets for production (min 32 characters)
- Rotate secrets regularly
- Use environment-specific values for different deployments

## Contributing

This is a proprietary project by NightTech Services. If you would like to contribute or use any part of this code, please contact us first to obtain permission.

## License

**All Rights Reserved.** This code is proprietary and confidential. Unauthorized copying, modification, distribution, or use of this code, via any medium, is strictly prohibited without explicit written permission from NightTech Services.

See [LICENSE](./LICENSE) for full license terms.

---

**Developed by [NightTech Services](https://github.com/NightTech-Services)**

For server access or technical support, contact NightTech Services.
