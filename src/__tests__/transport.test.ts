import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import { createConfig } from '../config.js'
import { DiscogsApiError, DiscogsAuthError, DiscogsRateLimitError } from '../errors.js'
import { discogsFetcher } from '../transport/fetcher.js'
import { RateLimiter } from '../transport/limiter.js'
import { buildOAuthHeader } from '../transport/oauth.js'
import { type FetchMock, installFetchMock } from './helpers/fetch-mock.js'

describe('Transport Layer', () => {
	let mock: FetchMock

	beforeEach(() => {
		mock = installFetchMock()
	})

	afterEach(() => {
		mock.restore()
	})

	test('enforces User-Agent header and injects Discogs Token', async () => {
		const config = createConfig({
			userAgent: 'TestApp/1.0.0',
			userToken: 'my-secret-token',
		})

		mock.respondWithJson({ id: 1, username: 'testuser' })

		await discogsFetcher(config, '/oauth/identity')

		const call = mock.lastCall()
		expect(call.headers['User-Agent']).toBe('TestApp/1.0.0')
		expect(call.headers.Authorization).toBe('Discogs token=my-secret-token')
	})

	test('injects Key & Secret pair when provided', async () => {
		const config = createConfig({
			userAgent: 'TestApp/1.0.0',
			consumerKey: 'my-key',
			consumerSecret: 'my-secret',
		})

		mock.respondWithJson({ id: 1, title: 'Test Release' })

		await discogsFetcher(config, '/releases/1')

		const call = mock.lastCall()
		expect(call.headers.Authorization).toBe('Discogs key=my-key, secret=my-secret')
	})

	test('generates valid OAuth 1.0a header when full credentials are provided', async () => {
		const config = createConfig({
			userAgent: 'TestApp/1.0.0',
			consumerKey: 'consumer-key',
			consumerSecret: 'consumer-secret',
			oauthToken: 'oauth-token',
			oauthTokenSecret: 'oauth-secret',
		})

		mock.respondWithJson({ id: 1 })

		await discogsFetcher(config, '/oauth/identity')

		const call = mock.lastCall()
		expect(call.headers.Authorization).toMatch(/^OAuth /)
		expect(call.headers.Authorization).toContain('oauth_consumer_key="consumer-key"')
		expect(call.headers.Authorization).toContain('oauth_token="oauth-token"')
		expect(call.headers.Authorization).toContain('oauth_signature="')
	})

	test('throws DiscogsAuthError on 401 Unauthorized', async () => {
		const config = createConfig({ userAgent: 'TestApp/1.0.0' })
		mock.respondWithHttpError(401, 'Unauthorized', { message: 'You must authenticate to access this resource.' })

		expect(discogsFetcher(config, '/oauth/identity')).rejects.toBeInstanceOf(DiscogsAuthError)
	})

	test('throws DiscogsRateLimitError on 429 Too Many Requests with headers', async () => {
		const config = createConfig({ userAgent: 'TestApp/1.0.0' })
		mock.respondWith(JSON.stringify({ message: 'Rate limit exceeded.' }), {
			status: 429,
			statusText: 'Too Many Requests',
			headers: {
				'Content-Type': 'application/json',
				'X-Discogs-Ratelimit': '60',
				'X-Discogs-Ratelimit-Remaining': '0',
			},
		})

		let caught: any
		try {
			await discogsFetcher(config, '/releases/1')
		} catch (e) {
			caught = e
		}

		expect(caught).toBeInstanceOf(DiscogsRateLimitError)
		expect(caught.httpStatus).toBe(429)
		expect(caught.rateLimitRemaining).toBe(0)
		expect(caught.rateLimitLimit).toBe(60)
	})

	test('throws generic DiscogsApiError on 404 Not Found', async () => {
		const config = createConfig({ userAgent: 'TestApp/1.0.0' })
		mock.respondWithHttpError(404, 'Not Found', { message: 'Release not found.' })

		expect(discogsFetcher(config, '/releases/99999999')).rejects.toBeInstanceOf(DiscogsApiError)
	})

	test('RateLimiter manages token bucket and refill', async () => {
		const limiter = new RateLimiter({ maxRequests: 2, windowMs: 100 })
		await limiter.acquire()
		await limiter.acquire()
		limiter.updateFromHeaders(5)
	})
})
