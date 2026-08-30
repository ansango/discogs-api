// Core (Transport, Auth, Errors, Rate Limiting, Base Schemas, Config)
export * from '@/core/index.js'

// Canonical Discogs API Namespaces
export * from '@/api/index.js'

// Client Facade
export { DiscogsClient, createClient } from '@/client.js'

// Canonical Methods
export { CANONICAL_METHODS, type MethodDefinition } from '@/canonical-methods.js'
