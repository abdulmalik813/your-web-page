# syntax=docker/dockerfile:1.7


FROM node:22-alpine AS base

WORKDIR /app

RUN corepack enable


# =============================================================
# DEPENDENCIES
# =============================================================

FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

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
# ENSURE LOCAL ENV FILES WERE NOT COPIED
# =============================================================

RUN if find . \
      -maxdepth 1 \
      -type f \
      -name '.env*' \
      ! -name '.env.example' \
      | grep -q .; then \
        echo "ERROR: Runtime environment file found in Docker build."; \
        exit 1; \
    fi


# =============================================================
# GENERATED PROJECT FILES
# =============================================================

RUN pnpm run export-css


# =============================================================
# CACHE BUSTER
# =============================================================

ARG CACHEBUST=1


# =============================================================
# APPLICATION BUILD
#
# BUILD_ENV exists only during this RUN.
#
# Nothing from BUILD_ENV is intentionally printed.
# Nothing from BUILD_ENV is stored via ENV or ARG.
# =============================================================

RUN --mount=type=secret,id=BUILD_ENV,required=true \
    node <<'NODE'
const fs = require("fs");
const { spawnSync } = require("child_process");

let parsed;

try {
  parsed = JSON.parse(
    fs.readFileSync(
      "/run/secrets/BUILD_ENV",
      "utf8"
    )
  );
} catch {
  console.error(
    "ERROR: Invalid build environment."
  );

  process.exit(1);
}

if (
  !parsed ||
  Array.isArray(parsed) ||
  typeof parsed !== "object"
) {
  console.error(
    "ERROR: Invalid build environment."
  );

  process.exit(1);
}

const buildEnv = {};

for (const [key, value] of Object.entries(parsed)) {

  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
    console.error(
      "ERROR: Invalid environment variable."
    );

    process.exit(1);
  }

  if (value === null || value === undefined) {
    buildEnv[key] = "";
  } else if (typeof value === "string") {
    buildEnv[key] = value;
  } else {
    buildEnv[key] = String(value);
  }

}

if (!buildEnv.DATABASE_URI) {
  console.error(
    "ERROR: Required build configuration is missing."
  );

  process.exit(1);
}

const result = spawnSync(
  "pnpm",
  ["build"],
  {
    stdio: "inherit",

    env: {
      ...process.env,
      ...buildEnv,
    },
  }
);

if (result.error) {
  console.error(
    "ERROR: Application build failed to start."
  );

  process.exit(1);
}

process.exit(
  result.status ?? 1
);
NODE


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