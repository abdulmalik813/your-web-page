# syntax=docker/dockerfile:1.7


# =============================================================
# BASE
# =============================================================

FROM node:22-alpine AS base

WORKDIR /app

RUN corepack enable


# =============================================================
# DEPENDENCIES
# =============================================================

FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

# The package postinstall uses scripts/export-css.js.
# Source files are not copied yet, so skip lifecycle scripts.
RUN pnpm install \
    --frozen-lockfile \
    --ignore-scripts


# =============================================================
# BUILDER
# =============================================================

FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules

COPY . .


# =============================================================
# POSTINSTALL-EQUIVALENT
# =============================================================

RUN pnpm run export-css


# =============================================================
# CACHE BUSTER
#
# Secret contents themselves do not participate in Docker's
# cache key. Git SHA changes on every committed build, ensuring
# this RUN is executed again for the new deployment.
# =============================================================

ARG CACHEBUST=1


# =============================================================
# APPLICATION BUILD
#
# BUILD_ENV is one JSON document containing every environment
# variable from the GitHub ENV secret.
#
# Node reads that JSON and starts:
#
#     pnpm build
#
# with all JSON entries merged into process.env.
#
# This means NEW environment variables automatically become
# available during future builds without Dockerfile changes.
# =============================================================

RUN --mount=type=secret,id=BUILD_ENV,required=true \
    node -e ' \
      const fs = require("fs"); \
      const { spawnSync } = require("child_process"); \
      \
      const path = "/run/secrets/BUILD_ENV"; \
      const raw = fs.readFileSync(path, "utf8"); \
      const parsed = JSON.parse(raw); \
      \
      if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") { \
        console.error("ERROR: BUILD_ENV must contain a JSON object."); \
        process.exit(1); \
      } \
      \
      const buildEnv = {}; \
      \
      for (const [key, value] of Object.entries(parsed)) { \
        if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) { \
          console.error(`ERROR: Invalid environment variable name: ${key}`); \
          process.exit(1); \
        } \
        \
        if (value === null || value === undefined) { \
          buildEnv[key] = ""; \
        } else if (typeof value === "string") { \
          buildEnv[key] = value; \
        } else { \
          buildEnv[key] = String(value); \
        } \
      } \
      \
      if (!buildEnv.DATABASE_URI) { \
        console.error("ERROR: DATABASE_URI is required for the build."); \
        process.exit(1); \
      } \
      \
      const result = spawnSync( \
        "pnpm", \
        ["build"], \
        { \
          stdio: "inherit", \
          env: { \
            ...process.env, \
            ...buildEnv, \
          }, \
        } \
      ); \
      \
      if (result.error) { \
        console.error("ERROR: Failed to start pnpm build."); \
        console.error(result.error.message); \
        process.exit(1); \
      } \
      \
      process.exit(result.status ?? 1); \
    '


# =============================================================
# PRODUCTION
# =============================================================

FROM node:22-alpine AS runner

WORKDIR /app

RUN corepack enable

ENV NODE_ENV=production

COPY --from=builder /app ./

EXPOSE 3000

CMD ["pnpm", "start"]