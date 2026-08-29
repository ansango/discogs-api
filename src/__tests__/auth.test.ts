import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import { DiscogsClient } from '../client.js'
import { type FetchMock, installFetchMock } from './helpers/fetch-mock.js'

describe('Auth Service (OAuth 1.0a)', () => {
	let mock: FetchMock
	let client: DiscogsClient

	beforeEach(() => {
		mock = installFetchMock()
		client = new DiscogsClient({
			userAgent: 'TestApp/1.0.0',
			consumerKey: 'my-consumer-key',
			consumerSecret: 'my-consumer-secret',
		})
	})

	afterEach(() => {
		mock.restore()
	})

	test('getRequestToken calls oauth/request_token and parses token', async () => {
		mock.respondWith(
			'oauth_token=request-token-123&oauth_token_secret=request-secret-456&oauth_callback_confirmed=true',
			{ status: 200, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
		)

		const reqToken = await client.auth.getRequestToken('https://myapp.com/callback')

		expect(reqToken.oauth_token).toBe('request-token-123')
		expect(reqToken.oauth_token_secret).toBe('request-secret-456')
		expect(reqToken.authorize_url).toContain('https://discogs.com/oauth/authorize?oauth_token=request-token-123')
		expect(mock.lastCall().headers.Authorization).toMatch(/^OAuth /)
	})

	test('getAuthorizeUrl builds valid Discogs authorize link', () => {
		const url = client.auth.getAuthorizeUrl('token-abc')
		expect(url).toBe('https://discogs.com/oauth/authorize?oauth_token=token-abc')
	})

	test('getAccessToken exchanges verifier for permanent token', async () => {
		mock.respondWith('oauth_token=permanent-access-token-789&oauth_token_secret=permanent-secret-012', {
			status: 200,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		})

		const token = await client.auth.getAccessToken('request-token-123', 'request-secret-456', 'verifier-999')

		expect(token.oauth_token).toBe('permanent-access-token-789')
		expect(token.oauth_token_secret).toBe('permanent-secret-012')
		expect(mock.lastCall().headers.Authorization).toContain('oauth_verifier="verifier-999"')
	})
})
