/**
 * Base error class for all Discogs API errors.
 */
export class DiscogsApiError extends Error {
	readonly httpStatus: number
	readonly code?: string
	readonly rateLimitLimit?: number
	readonly rateLimitRemaining?: number
	readonly rateLimitReset?: number

	constructor(
		message: string,
		httpStatus: number,
		options?: {
			code?: string
			rateLimitLimit?: number
			rateLimitRemaining?: number
			rateLimitReset?: number
		},
	) {
		super(message)
		this.name = 'DiscogsApiError'
		this.httpStatus = httpStatus
		this.code = options?.code
		this.rateLimitLimit = options?.rateLimitLimit
		this.rateLimitRemaining = options?.rateLimitRemaining
		this.rateLimitReset = options?.rateLimitReset
	}
}

/**
 * Thrown when Discogs rate limit (HTTP 429) is exceeded.
 */
export class DiscogsRateLimitError extends DiscogsApiError {
	constructor(
		message = 'Discogs API rate limit exceeded (HTTP 429).',
		options?: {
			rateLimitLimit?: number
			rateLimitRemaining?: number
			rateLimitReset?: number
		},
	) {
		super(message, 429, options)
		this.name = 'DiscogsRateLimitError'
	}
}

/**
 * Thrown when Discogs authentication fails (HTTP 401 / 403 / missing credentials).
 */
export class DiscogsAuthError extends DiscogsApiError {
	constructor(message: string, httpStatus = 401) {
		super(message, httpStatus)
		this.name = 'DiscogsAuthError'
	}
}

/**
 * Parses a standard Discogs API HTTP response.
 */
export async function parseDiscogsResponse(response: Response): Promise<unknown> {
	const httpStatus = response.status

	// Extract rate limit headers
	const rateLimitLimit = response.headers.get('X-Discogs-Ratelimit')
		? Number.parseInt(response.headers.get('X-Discogs-Ratelimit')!, 10)
		: undefined
	const rateLimitRemaining = response.headers.get('X-Discogs-Ratelimit-Remaining')
		? Number.parseInt(response.headers.get('X-Discogs-Ratelimit-Remaining')!, 10)
		: undefined

	// 204 No Content
	if (httpStatus === 204) {
		return null
	}

	let body: any = null
	const contentType = response.headers.get('content-type') || ''
	const isJson = contentType.includes('application/json')

	try {
		if (isJson) {
			body = await response.json()
		} else {
			body = await response.text()
		}
	} catch {
		// Non-parsable body
	}

	if (httpStatus === 429) {
		throw new DiscogsRateLimitError(
			typeof body === 'object' && body?.message ? body.message : 'Discogs API rate limit exceeded (HTTP 429).',
			{ rateLimitLimit, rateLimitRemaining },
		)
	}

	if (!response.ok) {
		const errorMsg =
			(typeof body === 'object' && (body?.message || body?.error)) ||
			(typeof body === 'string' && body) ||
			`HTTP Error ${httpStatus}: ${response.statusText}`

		if (httpStatus === 401 || httpStatus === 403) {
			throw new DiscogsAuthError(String(errorMsg), httpStatus)
		}

		throw new DiscogsApiError(String(errorMsg), httpStatus, {
			rateLimitLimit,
			rateLimitRemaining,
		})
	}

	return body
}
