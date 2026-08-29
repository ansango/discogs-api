import { createHmac, randomBytes } from 'node:crypto'

export interface OAuthSignParams {
	method: string
	url: string
	consumerKey: string
	consumerSecret: string
	token?: string
	tokenSecret?: string
	verifier?: string
	callbackUrl?: string
	extraParams?: Record<string, string | number | boolean | undefined>
}

/**
 * Percent-encodes a string according to RFC 3986 (OAuth 1.0a spec).
 */
export function rfc3986Encode(str: string): string {
	return encodeURIComponent(str).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)
}

/**
 * Generates OAuth 1.0a Authorization header.
 */
export function buildOAuthHeader(params: OAuthSignParams): string {
	const nonce = randomBytes(16).toString('hex')
	const timestamp = Math.floor(Date.now() / 1000).toString()

	const oauthParams: Record<string, string> = {
		oauth_consumer_key: params.consumerKey,
		oauth_nonce: nonce,
		oauth_signature_method: 'HMAC-SHA1',
		oauth_timestamp: timestamp,
		oauth_version: '1.0',
	}

	if (params.token) {
		oauthParams.oauth_token = params.token
	}
	if (params.verifier) {
		oauthParams.oauth_verifier = params.verifier
	}
	if (params.callbackUrl) {
		oauthParams.oauth_callback = params.callbackUrl
	}

	// Collect all parameters for signature base string
	const allParams: Record<string, string> = { ...oauthParams }

	// Include query params from URL if present
	try {
		const parsedUrl = new URL(params.url)
		for (const [k, v] of parsedUrl.searchParams.entries()) {
			allParams[k] = v
		}
	} catch {
		// ignore
	}

	// Include extra functional params
	if (params.extraParams) {
		for (const [k, v] of Object.entries(params.extraParams)) {
			if (v !== undefined) {
				allParams[k] = String(v)
			}
		}
	}

	// Sort parameters alphabetically by encoded key and value
	const sortedKeys = Object.keys(allParams).sort()
	const paramString = sortedKeys.map((k) => `${rfc3986Encode(k)}=${rfc3986Encode(allParams[k])}`).join('&')

	// Normalized Base URL (without query params)
	const baseUrl = params.url.split('?')[0]

	// Signature Base String
	const baseString = [params.method.toUpperCase(), rfc3986Encode(baseUrl), rfc3986Encode(paramString)].join('&')

	// Signing Key: consumerSecret&tokenSecret
	const signingKey = [rfc3986Encode(params.consumerSecret), rfc3986Encode(params.tokenSecret ?? '')].join('&')

	// Calculate HMAC-SHA1
	const signature = createHmac('sha1', signingKey).update(baseString).digest('base64')

	oauthParams.oauth_signature = signature

	// Build Authorization header string
	const headerParts = Object.keys(oauthParams)
		.sort()
		.map((k) => `${rfc3986Encode(k)}="${rfc3986Encode(oauthParams[k])}"`)
		.join(', ')

	return `OAuth ${headerParts}`
}
