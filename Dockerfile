# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS base

WORKDIR /app

RUN corepack enable

FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

RUN pnpm install \
    --frozen-lockfile \
    --ignore-scripts

FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN pnpm run export-css

# Cache-buster: forces the secret-mounted RUN below to always
# re-execute instead of reusing a cached layer from a previous
# build with different secret values. Pass a fresh value (e.g.
# github.sha) via --build-arg from the workflow.
ARG CACHEBUST=1

RUN --mount=type=secret,id=NODE_ENV \
    --mount=type=secret,id=DATABASE_URI \
    --mount=type=secret,id=CRON_SECRET \
    --mount=type=secret,id=NEXT_PUBLIC_SERVER_URL \
    --mount=type=secret,id=PAYLOAD_SECRET \
    --mount=type=secret,id=PREVIEW_SECRET \
    --mount=type=secret,id=RESEND_API_KEY \
    --mount=type=secret,id=S3_ACCESS_KEY_ID \
    --mount=type=secret,id=S3_SECRET_ACCESS_KEY \
    --mount=type=secret,id=S3_BUCKET \
    --mount=type=secret,id=S3_ENDPOINT \
    --mount=type=secret,id=S3_REGION \
    --mount=type=secret,id=TAILWIND_GENERATOR \
    --mount=type=secret,id=USE_RESEND \
    --mount=type=secret,id=IMAGE_HOSTS \
    --mount=type=secret,id=EMAIL_FROM_ADDRESS \
    --mount=type=secret,id=EMAIL_FROM_NAME \
    --mount=type=secret,id=SMTP_HOST \
    --mount=type=secret,id=SMTP_PORT \
    --mount=type=secret,id=SMTP_USER \
    --mount=type=secret,id=SMTP_PASS \
    --mount=type=secret,id=SMTP_SECURE \
    set -eu; \
    \
    read_secret() { \
      if [ -f "/run/secrets/$1" ]; then \
        cat "/run/secrets/$1"; \
      fi; \
    }; \
    \
    export NODE_ENV="$(read_secret NODE_ENV)"; \
    export DATABASE_URI="$(read_secret DATABASE_URI)"; \
    export CRON_SECRET="$(read_secret CRON_SECRET)"; \
    export NEXT_PUBLIC_SERVER_URL="$(read_secret NEXT_PUBLIC_SERVER_URL)"; \
    export PAYLOAD_SECRET="$(read_secret PAYLOAD_SECRET)"; \
    export PREVIEW_SECRET="$(read_secret PREVIEW_SECRET)"; \
    export RESEND_API_KEY="$(read_secret RESEND_API_KEY)"; \
    export S3_ACCESS_KEY_ID="$(read_secret S3_ACCESS_KEY_ID)"; \
    export S3_SECRET_ACCESS_KEY="$(read_secret S3_SECRET_ACCESS_KEY)"; \
    export S3_BUCKET="$(read_secret S3_BUCKET)"; \
    export S3_ENDPOINT="$(read_secret S3_ENDPOINT)"; \
    export S3_REGION="$(read_secret S3_REGION)"; \
    export TAILWIND_GENERATOR="$(read_secret TAILWIND_GENERATOR)"; \
    export USE_RESEND="$(read_secret USE_RESEND)"; \
    export IMAGE_HOSTS="$(read_secret IMAGE_HOSTS)"; \
    export EMAIL_FROM_ADDRESS="$(read_secret EMAIL_FROM_ADDRESS)"; \
    export EMAIL_FROM_NAME="$(read_secret EMAIL_FROM_NAME)"; \
    export SMTP_HOST="$(read_secret SMTP_HOST)"; \
    export SMTP_PORT="$(read_secret SMTP_PORT)"; \
    export SMTP_USER="$(read_secret SMTP_USER)"; \
    export SMTP_PASS="$(read_secret SMTP_PASS)"; \
    export SMTP_SECURE="$(read_secret SMTP_SECURE)"; \
    \
    if [ -z "$DATABASE_URI" ]; then \
      echo "ERROR: DATABASE_URI build secret is required."; \
      exit 1; \
    fi; \
    \
    echo "DB_HOST_CHECK: $(echo "$DATABASE_URI" | sed -E 's#.*@([^:/]+):.*#\1#')"; \
    \
    pnpm build

FROM node:22-alpine AS runner

WORKDIR /app

RUN corepack enable

ENV NODE_ENV=production

COPY --from=builder /app ./

EXPOSE 3000

CMD ["pnpm", "start"]