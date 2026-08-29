// Client
export { DiscogsClient, createClient } from './client.js'

// Configuration & Errors
export {
	type DiscogsConfig,
	createConfig,
	getGlobalConfig,
	setGlobalConfig,
	resetGlobalConfig,
} from './config.js'
export {
	DiscogsApiError,
	DiscogsAuthError,
	DiscogsRateLimitError,
	parseDiscogsResponse,
} from './errors.js'

// Transport & Canonical Methods
export { RateLimiter, type RateLimiterOptions } from './transport/limiter.js'
export { buildOAuthHeader, rfc3986Encode, type OAuthSignParams } from './transport/oauth.js'
export { discogsFetcher, resolveAuthHeader, buildQueryString, type RequestOptions } from './transport/fetcher.js'
export { CANONICAL_METHODS, type MethodDefinition } from './canonical-methods.js'

// Base Schemas
export * from './core/schemas/base.schemas.js'

// Domains & Services
export * from './database/index.js'
export * from './collection/index.js'
export * from './wantlist/index.js'
export * from './user/index.js'
export * from './marketplace/index.js'
export * from './lists/index.js'
export * from './auth/index.js'
