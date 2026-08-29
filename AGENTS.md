# Developer Guide for OpenCode & Agents

## Tech Stack & Tooling

- **Runtime & Package Manager:** Bun (Node.js >= 20 supported for published package).
- **Linter & Formatter:** Biome (`biome.json`: tabs, single quotes, `semicolons: "asNeeded"`).
- **Subpackage:** `tool/api-scalar` has its own `package.json` and `bun.lock`.

## Essential Commands

```bash
# Verification flow
bun run typecheck                     # Typecheck root + tests + tool + scripts
bun run lint                          # Biome check across all files
bun run lint:fix                      # Auto-fix formatting and lint issues
bun test                              # Run deterministic unit tests
bun test src/__tests__/database.test.ts # Run a single test file
bun run build                         # rimraf dist && tsc -p tsconfig.build.json

# Dev tool (Hono + Scalar OpenAPI explorer on localhost:3000)
bun run tool:typecheck                # Typecheck tool/api-scalar
bun run tool:test                     # Test tool/api-scalar
bun run tool:dev                      # Run docs explorer locally
```

## Architecture & Conventions

- **Canonical Method Inventory:** `src/canonical-methods.ts` contains the canonical 47 Discogs API methods (`CANONICAL_METHODS`).
  - Single source of truth for method inventory.
  - Asserted by `src/__tests__/inventory.test.ts` (all 47 must exist on `DiscogsClient`).
  - Mirrored in `docs/api-coverage.md`.
- **Entrypoints & Exports:**
  - Modular subpath exports configured in `package.json` (`./database`, `./collection`, etc.) map to `src/entrypoints/`.
  - Root `src/index.ts` re-exports all services, schemas, and client utilities.
- **Transport & Authentication:**
  - `User-Agent` is mandatory per Discogs policy.
  - Auth header is resolved dynamically (OAuth 1.0a HMAC-SHA1, Personal Access Token `Discogs token=...`, or Key/Secret `Discogs key=..., secret=...`).
  - Token Bucket `RateLimiter` observes Discogs rate limit headers.
  - API errors throw typed `DiscogsApiError`, `DiscogsAuthError`, or `DiscogsRateLimitError`.
- **Unit Testing Rules:**
  - Unit tests MUST be deterministic with 0 network egress.
  - Use `installFetchMock()` from `src/__tests__/helpers/fetch-mock.ts` with `beforeEach` and `afterEach(() => mock.restore())`.
