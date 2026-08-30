import { buildOAuthHeader } from '@/core/auth/index.js'
import type { DiscogsConfig } from '@/core/config.js'
import { parseDiscogsResponse } from '@/core/errors/index.js'
import { RateLimiter } from '@/core/rate-limiter/index.js'

export interface RequestOptions {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
	params?: Record<string, string | number | boolean | undefined>
	body?: unknown
	headers?: Record<string, string>
	init?: RequestInit
}

/**
 * Global or default rate limiter instance.
 */
const defaultRateLimiter = new RateLimiter()

/**
 * Builds the URL query string from parameters, dropping undefined/null values.
 */
export function buildQueryString(params?: Record<string, string | number | boolean | undefined>): string {
	if (!params) return ''
	const searchParams = new URLSearchParams()
	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined && value !== null) {
			searchParams.set(key, String(value))
		}
	}
	const str = searchParams.toString()
	return str ? `?${str}` : ''
}

/**
 * Resolves the Authorization header for Discogs API calls.
 */
export function resolveAuthHeader(
	config: DiscogsConfig,
	method: string,
	url: string,
	params?: Record<string, any>,
): string | undefined {
	// 1. OAuth 1.0a (full 3-legged)
	if (config.consumerKey && config.consumerSecret && (config.oauthToken || config.oauthTokenSecret)) {
		return buildOAuthHeader({
			method,
			url,
			consumerKey: config.consumerKey,
			consumerSecret: config.consumerSecret,
			token: config.oauthToken,
			tokenSecret: config.oauthTokenSecret,
			extraParams: params,
		})
	}

	// 2. Personal Access Token (Discogs token=...)
	if (config.userToken) {
		return `Discogs token=${config.userToken}`
	}

	// 3. Consumer Key & Secret pair (Discogs key=..., secret=...)
	if (config.consumerKey && config.consumerSecret) {
		return `Discogs key=${config.consumerKey}, secret=${config.consumerSecret}`
	}

	return undefined
}

/**
 * Main HTTP transport engine for Discogs API calls.
 */
export async function discogsFetcher<T = unknown>(
	config: DiscogsConfig,
	path: string,
	options: RequestOptions = {},
): Promise<T> {
	const method = options.method ?? 'GET'
	const baseUrl = config.baseUrl ?? 'https://api.discogs.com'
	const normalizedPath = path.startsWith('/') ? path : `/${path}`
	const queryString = buildQueryString(options.params)
	const fullUrl = `${baseUrl}${normalizedPath}${queryString}`

	// Rate Limiter
	const limiter = config.rateLimiter ?? (config.rateLimitEnabled !== false ? defaultRateLimiter : null)
	if (limiter) {
		await limiter.acquire()
	}

	// Headers
	const headers: Record<string, string> = {
		'User-Agent': config.userAgent,
		Accept: 'application/json',
		...(options.headers ?? {}),
	}

	const authHeader = resolveAuthHeader(config, method, fullUrl, options.params)
	if (authHeader) {
		headers.Authorization = authHeader
	}

	const init: RequestInit = {
		method,
		headers,
		...options.init,
	}

	if (options.body !== undefined && method !== 'GET') {
		if (typeof options.body === 'string') {
			init.body = options.body
		} else {
			headers['Content-Type'] = 'application/json'
			init.body = JSON.stringify(options.body)
		}
	}

	const response = await fetch(fullUrl, init)

	// Update rate limiter tokens dynamically
	const remaining = response.headers.get('X-Discogs-Ratelimit-Remaining')
	if (remaining && limiter) {
		limiter.updateFromHeaders(Number.parseInt(remaining, 10))
	}

	return (await parseDiscogsResponse(response)) as T
}
