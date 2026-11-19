<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/20def3c1-8af7-47c9-bd81-53477d76e1e6

# Your Web Page

A Next.js 16 website and Payload 4 CMS for Your Web Page.

## CMS data and preview

The public site reads its content and branding from Payload. The `data/` and company
configuration files are used only by the seed routine; they are not runtime content
fallbacks. Published Payload reads use tagged Next.js caching, and Payload writes
invalidate the related cache tags and routes.

Live preview requires `APP_URL` to point to this site and an authenticated Payload
session on the same origin. Preview links enable Next.js Draft Mode through
`/api/draft/enable`; use `/api/draft/disable` to leave preview. Pages, services,
projects, resources, FAQs, and testimonials support draft versions, so apply the
corresponding Payload database schema changes before deploying.
Authenticated editors see a site toolbar with links to Payload Admin and controls
to enable or exit preview mode.

## Run locally

**Prerequisites:** Node.js 20.9 or newer, pnpm, and Docker Compose.

1. Copy `.env.example` to `.env.local` and configure the required values.
2. Start the local MongoDB replica set:
   `docker compose -f docker-compose.dev.yml up -d mongodb`
3. Install dependencies:
   `pnpm install`
4. Start the development server:
   `pnpm dev`
5. Open `http://localhost:3000`.

## Database

MongoDB is the only supported Payload database. Local development uses the
single-node replica set in `docker-compose.dev.yml`; production uses the
MongoDB connection string configured in `DATABASE_URI`.

## Docker and CI

GitHub Actions runs lint and tests on pushes and pull requests. Pushes to
`main` also build and publish the Docker image to GitHub Container Registry,
then trigger Dokploy. The image build connects to MongoDB through the configured
SSH tunnel; the connection URI and server-side build environment are passed to
BuildKit as a secret rather than Docker build arguments or image environment
variables.

Configure a `prod` GitHub environment with an `ENV` secret containing a JSON
object of the production environment variables. It must include `APP_URL`,
`PAYLOAD_SECRET`, `EMAIL_FROM`, `EMAIL_FROM_NAME`, `DATABASE_URI`,
`SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY`, `CF_ACCESS_CLIENT_ID`,
`CF_ACCESS_CLIENT_SECRET`, `TUNNEL_TARGET_PORT_NETWORK`, and
`DOKPLOY_DEPLOY_URL`. Set `DATABASE_URI` to the MongoDB URI with `[DB_HOST]`
and `[DB_PORT]` placeholders, and set `TUNNEL_TARGET_PORT_NETWORK` to
`container,port,docker-network`. In Dokploy, configure the actual internal
MongoDB URI (without placeholders).

## Build

`pnpm build`
