import type { RateLimiter } from '@/core/rate-limiter/index.js'

export interface DiscogsConfig {
	/**
	 * User-Agent identifying the client application (REQUIRED by Discogs API policy).
	 * Example: 'MyDiscogsApp/1.0.0 +https://github.com/myorg/myapp'
	 */
	userAgent: string

	/**
	 * Discogs Personal Access Token (simplest authentication method).
	 * Generable at: https://www.discogs.com/settings/developers
	 */
	userToken?: string

	/**
	 * OAuth 1.0a Consumer Key.
	 */
	consumerKey?: string

	/**
	 * OAuth 1.0a Consumer Secret.
	 */
	consumerSecret?: string

	/**
	 * OAuth 1.0a Access Token (after completing the 3-legged authorization).
	 */
	oauthToken?: string

	/**
	 * OAuth 1.0a Access Token Secret (after completing the 3-legged authorization).
	 */
	oauthTokenSecret?: string

	/**
	 * Custom base API URL. Defaults to 'https://api.discogs.com/'.
	 */
	baseUrl?: string

	/**
	 * Optional custom Rate Limiter instance.
	 */
	rateLimiter?: RateLimiter

	/**
	 * Disable rate limiting if set to false (default: true).
	 */
	rateLimitEnabled?: boolean
}

let globalConfig: DiscogsConfig | null = null

/**
 * Load configuration from environment variables (Node / Bun).
 */
function loadEnvConfig(): Partial<DiscogsConfig> {
	if (typeof process !== 'undefined' && process.env) {
		return {
			userAgent: process.env.DISCOGS_USER_AGENT,
			userToken: process.env.DISCOGS_USER_TOKEN ?? process.env.DISCOGS_TOKEN,
			consumerKey: process.env.DISCOGS_CONSUMER_KEY ?? process.env.DISCOGS_KEY,
			consumerSecret: process.env.DISCOGS_CONSUMER_SECRET ?? process.env.DISCOGS_SECRET,
			oauthToken: process.env.DISCOGS_OAUTH_TOKEN,
			oauthTokenSecret: process.env.DISCOGS_OAUTH_TOKEN_SECRET,
			baseUrl: process.env.DISCOGS_BASE_URL,
		}
	}
	return {}
}

/**
 * Validates that the configuration complies with Discogs requirements.
 */
function validateConfig(config: Partial<DiscogsConfig>): config is DiscogsConfig {
	if (!config.userAgent || config.userAgent.trim() === '') {
		throw new Error(
			'Discogs API policy requires a descriptive `userAgent` in config (e.g. "MyApp/1.0.0 +https://example.com") or DISCOGS_USER_AGENT environment variable.',
		)
	}
	return true
}

/**
 * Creates and validates a DiscogsConfig.
 */
export function createConfig(options: Partial<DiscogsConfig> = {}): DiscogsConfig {
	const envConfig = loadEnvConfig()
	const config: DiscogsConfig = {
		baseUrl: 'https://api.discogs.com',
		rateLimitEnabled: true,
		...envConfig,
		...options,
	} as DiscogsConfig

	validateConfig(config)
	return config
}

/**
 * Sets global configuration for the application runtime.
 */
export function setGlobalConfig(config: Partial<DiscogsConfig>): void {
	globalConfig = createConfig(config)
}

/**
 * Retrieves the global configuration or initializes from environment.
 */
export function getGlobalConfig(): DiscogsConfig {
	if (!globalConfig) {
		globalConfig = createConfig()
	}
	return globalConfig
}

/**
 * Resets global configuration (primarily for testing).
 */
export function resetGlobalConfig(): void {
	globalConfig = null
}
