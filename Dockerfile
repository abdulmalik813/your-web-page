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

# postinstall calls scripts/export-css.js.
# Source is not copied yet, so skip lifecycle scripts here.

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
# BuildKit secrets are intentionally excluded from cache keys.
#
# The workflow passes github.sha here so this build RUN executes
# again for each commit.
# =============================================================

ARG CACHEBUST=1


# =============================================================
# APPLICATION BUILD
#
# BUILD_ENV contains all application environment variables.
#
# The workflow has already:
#
#   [DB_HOST] -> host.docker.internal
#   [DB_PORT] -> 27018
#
# CI-only secrets have been removed before BUILD_ENV reaches
# this stage.
# =============================================================

RUN --mount=type=secret,id=BUILD_ENV,required=true \
    node -e ' \
      const fs = require("fs"); \
      const { spawnSync } = require("child_process"); \
      \
      const secretPath = "/run/secrets/BUILD_ENV"; \
      \
      const raw = fs.readFileSync(secretPath, "utf8"); \
      const parsed = JSON.parse(raw); \
      \
      if ( \
        !parsed || \
        Array.isArray(parsed) || \
        typeof parsed !== "object" \
      ) { \
        console.error("ERROR: BUILD_ENV must contain a JSON object."); \
        process.exit(1); \
      } \
      \
      const buildEnv = {}; \
      \
      for (const [key, value] of Object.entries(parsed)) { \
        \
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
        console.error("ERROR: DATABASE_URI is required."); \
        process.exit(1); \
      } \
      \
      let dbUri; \
      \
      try { \
        dbUri = new URL(buildEnv.DATABASE_URI); \
      } catch { \
        console.error("ERROR: DATABASE_URI is not a valid URI."); \
        process.exit(1); \
      } \
      \
      if (dbUri.hostname !== "host.docker.internal") { \
        console.error("ERROR: Docker received the wrong DATABASE_URI hostname."); \
        process.exit(1); \
      } \
      \
      if (!dbUri.port) { \
        console.error("ERROR: DATABASE_URI does not contain a port."); \
        process.exit(1); \
      } \
      \
      console.log("Docker build database configuration verified."); \
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
        console.error("ERROR: Unable to start pnpm build."); \
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