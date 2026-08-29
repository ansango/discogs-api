import type { DiscogsConfig } from '../config.js'
import { DiscogsAuthError } from '../errors.js'
import { buildOAuthHeader } from '../transport/oauth.js'
import type { DiscogsAccessTokenResponse, DiscogsRequestTokenResponse } from './schemas.js'

export interface AuthService {
	/**
	 * Request an unauthorized OAuth Request Token from Discogs.
	 * https://www.discogs.com/developers#page:authentication,header:authentication-oauth-flow
	 */
	getRequestToken: (callbackUrl: string, init?: RequestInit) => Promise<DiscogsRequestTokenResponse>

	/**
	 * Builds the User Authorization URL for a given OAuth Request Token.
	 */
	getAuthorizeUrl: (oauthToken: string) => string

	/**
	 * Exchange an authorized Request Token and Verifier for a permanent Access Token.
	 */
	getAccessToken: (
		oauthToken: string,
		oauthTokenSecret: string,
		verifier: string,
		init?: RequestInit,
	) => Promise<DiscogsAccessTokenResponse>
}

export function createAuthService(config: DiscogsConfig): AuthService {
	const baseUrl = config.baseUrl ?? 'https://api.discogs.com'

	return {
		getRequestToken: async (callbackUrl: string, init?: RequestInit) => {
			if (!config.consumerKey || !config.consumerSecret) {
				throw new DiscogsAuthError('consumerKey and consumerSecret are required for OAuth 1.0a request token.')
			}

			const url = `${baseUrl}/oauth/request_token`
			const authHeader = buildOAuthHeader({
				method: 'POST',
				url,
				consumerKey: config.consumerKey,
				consumerSecret: config.consumerSecret,
				callbackUrl,
			})

			const headers: Record<string, string> = {
				'User-Agent': config.userAgent,
				Authorization: authHeader,
				'Content-Type': 'application/x-www-form-urlencoded',
				...(init?.headers as Record<string, string>),
			}

			const res = await fetch(url, {
				method: 'POST',
				headers,
				...init,
			})

			if (!res.ok) {
				throw new DiscogsAuthError(`Failed to get OAuth request token: ${res.status} ${res.statusText}`, res.status)
			}

			const text = await res.text()
			const params = new URLSearchParams(text)
			const token = params.get('oauth_token')
			const tokenSecret = params.get('oauth_token_secret')
			const callbackConfirmed = params.get('oauth_callback_confirmed')

			if (!token || !tokenSecret) {
				throw new DiscogsAuthError(`Malformed OAuth request token response: "${text}"`)
			}

			return {
				oauth_token: token,
				oauth_token_secret: tokenSecret,
				oauth_callback_confirmed: callbackConfirmed ?? 'true',
				authorize_url: `https://discogs.com/oauth/authorize?oauth_token=${encodeURIComponent(token)}`,
			}
		},

		getAuthorizeUrl: (oauthToken: string) => {
			return `https://discogs.com/oauth/authorize?oauth_token=${encodeURIComponent(oauthToken)}`
		},

		getAccessToken: async (oauthToken: string, oauthTokenSecret: string, verifier: string, init?: RequestInit) => {
			if (!config.consumerKey || !config.consumerSecret) {
				throw new DiscogsAuthError('consumerKey and consumerSecret are required for OAuth 1.0a access token.')
			}

			const url = `${baseUrl}/oauth/access_token`
			const authHeader = buildOAuthHeader({
				method: 'POST',
				url,
				consumerKey: config.consumerKey,
				consumerSecret: config.consumerSecret,
				token: oauthToken,
				tokenSecret: oauthTokenSecret,
				verifier,
			})

			const headers: Record<string, string> = {
				'User-Agent': config.userAgent,
				Authorization: authHeader,
				'Content-Type': 'application/x-www-form-urlencoded',
				...(init?.headers as Record<string, string>),
			}

			const res = await fetch(url, {
				method: 'POST',
				headers,
				...init,
			})

			if (!res.ok) {
				throw new DiscogsAuthError(`Failed to get OAuth access token: ${res.status} ${res.statusText}`, res.status)
			}

			const text = await res.text()
			const params = new URLSearchParams(text)
			const token = params.get('oauth_token')
			const tokenSecret = params.get('oauth_token_secret')

			if (!token || !tokenSecret) {
				throw new DiscogsAuthError(`Malformed OAuth access token response: "${text}"`)
			}

			return {
				oauth_token: token,
				oauth_token_secret: tokenSecret,
			}
		},
	}
}
