# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS base

WORKDIR /app

RUN corepack enable


# ---------------------------------------------------------
# Dependencies
# ---------------------------------------------------------

FROM base AS deps

COPY package.json pnpm-lock.yaml ./

# Copy pnpm config files if they exist in your repo
COPY pnpm-workspace.yaml .npmrc* ./

RUN pnpm install --frozen-lockfile


# ---------------------------------------------------------
# Build
# ---------------------------------------------------------

FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

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
    export NODE_ENV="$(cat /run/secrets/NODE_ENV)" && \
    export DATABASE_URI="$(cat /run/secrets/DATABASE_URI)" && \
    export CRON_SECRET="$(cat /run/secrets/CRON_SECRET)" && \
    export NEXT_PUBLIC_SERVER_URL="$(cat /run/secrets/NEXT_PUBLIC_SERVER_URL)" && \
    export PAYLOAD_SECRET="$(cat /run/secrets/PAYLOAD_SECRET)" && \
    export PREVIEW_SECRET="$(cat /run/secrets/PREVIEW_SECRET)" && \
    export RESEND_API_KEY="$(cat /run/secrets/RESEND_API_KEY)" && \
    export S3_ACCESS_KEY_ID="$(cat /run/secrets/S3_ACCESS_KEY_ID)" && \
    export S3_SECRET_ACCESS_KEY="$(cat /run/secrets/S3_SECRET_ACCESS_KEY)" && \
    export S3_BUCKET="$(cat /run/secrets/S3_BUCKET)" && \
    export S3_ENDPOINT="$(cat /run/secrets/S3_ENDPOINT)" && \
    export S3_REGION="$(cat /run/secrets/S3_REGION)" && \
    export TAILWIND_GENERATOR="$(cat /run/secrets/TAILWIND_GENERATOR)" && \
    export USE_RESEND="$(cat /run/secrets/USE_RESEND)" && \
    export IMAGE_HOSTS="$(cat /run/secrets/IMAGE_HOSTS)" && \
    export EMAIL_FROM_ADDRESS="$(cat /run/secrets/EMAIL_FROM_ADDRESS)" && \
    export EMAIL_FROM_NAME="$(cat /run/secrets/EMAIL_FROM_NAME)" && \
    export SMTP_HOST="$(cat /run/secrets/SMTP_HOST)" && \
    export SMTP_PORT="$(cat /run/secrets/SMTP_PORT)" && \
    export SMTP_USER="$(cat /run/secrets/SMTP_USER)" && \
    export SMTP_PASS="$(cat /run/secrets/SMTP_PASS)" && \
    export SMTP_SECURE="$(cat /run/secrets/SMTP_SECURE)" && \
    pnpm build


# ---------------------------------------------------------
# Production
# ---------------------------------------------------------

FROM node:22-alpine AS runner

WORKDIR /app

RUN corepack enable

ENV NODE_ENV=production

COPY --from=builder /app ./

EXPOSE 3000

CMD ["pnpm", "start"]