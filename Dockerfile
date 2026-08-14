FROM node:24-slim AS base

# Install dependencies only when needed
FROM base AS deps
RUN apt-get update && \
    apt-get install -y --no-install-recommends libc6 && \
    rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@11.21.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY scripts ./scripts
COPY src/app/(frontend)/theme.css ./src/app/(frontend)/theme.css
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@11.21.0 --activate

# Declare build arguments
ARG NEXT_PUBLIC_SERVER_URL
ARG PAYLOAD_SECRET
ARG DATABASE_URI
ARG S3_ACCESS_KEY_ID
ARG S3_BUCKET
ARG S3_ENDPOINT
ARG S3_REGION
ARG S3_SECRET_ACCESS_KEY

# Set environment variables for build
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
ENV PAYLOAD_SECRET=$PAYLOAD_SECRET
ENV DATABASE_URI=$DATABASE_URI
ENV S3_ACCESS_KEY_ID=$S3_ACCESS_KEY_ID
ENV S3_BUCKET=$S3_BUCKET
ENV S3_ENDPOINT=$S3_ENDPOINT
ENV S3_REGION=$S3_REGION
ENV S3_SECRET_ACCESS_KEY=$S3_SECRET_ACCESS_KEY

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

# Install curl and CA certificates for HTTPS
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl ca-certificates && \
    rm -rf /var/lib/apt/lists/* && \
    update-ca-certificates

# Tell Node.js to use system CA certificates
ENV NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy environment variables to runtime
ARG NEXT_PUBLIC_SERVER_URL
ARG PAYLOAD_SECRET
ARG DATABASE_URI
ARG S3_ACCESS_KEY_ID
ARG S3_BUCKET
ARG S3_ENDPOINT
ARG S3_REGION
ARG S3_SECRET_ACCESS_KEY

ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
ENV PAYLOAD_SECRET=$PAYLOAD_SECRET
ENV DATABASE_URI=$DATABASE_URI
ENV S3_ACCESS_KEY_ID=$S3_ACCESS_KEY_ID
ENV S3_BUCKET=$S3_BUCKET
ENV S3_ENDPOINT=$S3_ENDPOINT
ENV S3_REGION=$S3_REGION
ENV S3_SECRET_ACCESS_KEY=$S3_SECRET_ACCESS_KEY

# Create user and group (Debian uses different commands than Alpine)
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs nextjs

# Copy public folder if it exists
COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next && \
    chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000

# server.js is created by next build from the standalone output
CMD ["node", "server.js"]
