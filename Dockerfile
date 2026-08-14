# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS base

WORKDIR /app

RUN corepack enable


# =========================
# Dependencies
# =========================

FROM base AS deps

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile


# =========================
# Build
# =========================

FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NODE_ENV
ARG DATABASE_URI
ARG CRON_SECRET
ARG NEXT_PUBLIC_SERVER_URL
ARG PAYLOAD_SECRET
ARG PREVIEW_SECRET
ARG RESEND_API_KEY
ARG S3_ACCESS_KEY_ID
ARG S3_SECRET_ACCESS_KEY
ARG S3_BUCKET
ARG S3_ENDPOINT
ARG S3_REGION
ARG TAILWIND_GENERATOR
ARG USE_RESEND
ARG IMAGE_HOSTS
ARG EMAIL_FROM_ADDRESS
ARG EMAIL_FROM_NAME
ARG SMTP_HOST
ARG SMTP_PORT
ARG SMTP_USER
ARG SMTP_PASS
ARG SMTP_SECURE

ENV NODE_ENV=$NODE_ENV \
    DATABASE_URI=$DATABASE_URI \
    CRON_SECRET=$CRON_SECRET \
    NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL \
    PAYLOAD_SECRET=$PAYLOAD_SECRET \
    PREVIEW_SECRET=$PREVIEW_SECRET \
    RESEND_API_KEY=$RESEND_API_KEY \
    S3_ACCESS_KEY_ID=$S3_ACCESS_KEY_ID \
    S3_SECRET_ACCESS_KEY=$S3_SECRET_ACCESS_KEY \
    S3_BUCKET=$S3_BUCKET \
    S3_ENDPOINT=$S3_ENDPOINT \
    S3_REGION=$S3_REGION \
    TAILWIND_GENERATOR=$TAILWIND_GENERATOR \
    USE_RESEND=$USE_RESEND \
    IMAGE_HOSTS=$IMAGE_HOSTS \
    EMAIL_FROM_ADDRESS=$EMAIL_FROM_ADDRESS \
    EMAIL_FROM_NAME=$EMAIL_FROM_NAME \
    SMTP_HOST=$SMTP_HOST \
    SMTP_PORT=$SMTP_PORT \
    SMTP_USER=$SMTP_USER \
    SMTP_PASS=$SMTP_PASS \
    SMTP_SECURE=$SMTP_SECURE

RUN pnpm build


# =========================
# Production
# =========================

FROM base AS runner

ENV NODE_ENV=production

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

COPY --from=builder /app/src ./src
COPY --from=builder /app/next.config.* ./
COPY --from=builder /app/payload.config.* ./

EXPOSE 3000

CMD ["pnpm", "start"]