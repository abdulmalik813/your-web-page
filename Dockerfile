# syntax=docker/dockerfile:1.7

FROM node:22-bookworm-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@11.21.0 --activate

FROM base AS dependencies
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN --mount=type=secret,id=BUILD_ENV,required=true \
    --mount=type=cache,id=next-cache,target=/app/.next/cache \
    node <<'NODE'
const fs = require('node:fs');
const { spawnSync } = require('node:child_process');

let parsed;

try {
  parsed = JSON.parse(fs.readFileSync('/run/secrets/BUILD_ENV', 'utf8'));
} catch {
  console.error('ERROR: Invalid build environment.');
  process.exit(1);
}

if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') {
  console.error('ERROR: Invalid build environment.');
  process.exit(1);
}

const buildEnv = {};

for (const [key, value] of Object.entries(parsed)) {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
    console.error('ERROR: Invalid environment variable name.');
    process.exit(1);
  }

  if (value === null || value === undefined) {
    buildEnv[key] = '';
  } else if (typeof value === 'string') {
    buildEnv[key] = value;
  } else {
    buildEnv[key] = String(value);
  }
}

if (
  !/^mongodb(?:\+srv)?:\/\//i.test(buildEnv.DATABASE_URI || '') ||
  !buildEnv.APP_URL ||
  !buildEnv.PAYLOAD_SECRET ||
  !buildEnv.EMAIL_FROM ||
  !buildEnv.EMAIL_FROM_NAME
) {
  console.error('ERROR: Required MongoDB build configuration is missing or invalid.');
  process.exit(1);
}

const result = spawnSync('pnpm', ['build'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    ...buildEnv,
  },
});

if (result.error) {
  console.error('ERROR: Application build failed to start.');
  process.exit(1);
}

process.exit(result.status ?? 1);
NODE

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

RUN mkdir -p .next/cache && chown -R node:node /app
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node
EXPOSE 3000
CMD ["node", "server.js"]
