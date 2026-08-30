export interface RateLimiterOptions {
	/**
	 * Maximum requests per window (default: 60 per minute).
	 */
	maxRequests?: number

	/**
	 * Time window in milliseconds (default: 60,000 ms = 1 minute).
	 */
	windowMs?: number

	/**
	 * Enable or disable the limiter.
	 */
	enabled?: boolean
}

/**
 * Token Bucket Rate Limiter complying with Discogs API rate limit policies.
 */
export class RateLimiter {
	private readonly maxRequests: number
	private readonly windowMs: number
	private readonly enabled: boolean

	private tokens: number
	private lastRefill: number
	private queue: Array<() => void> = []

	constructor(options: RateLimiterOptions = {}) {
		this.maxRequests = options.maxRequests ?? 60
		this.windowMs = options.windowMs ?? 60_000
		this.enabled = options.enabled ?? true

		this.tokens = this.maxRequests
		this.lastRefill = Date.now()
	}

	private refill(): void {
		const now = Date.now()
		const elapsed = now - this.lastRefill
		if (elapsed > 0) {
			const refillTokens = (elapsed / this.windowMs) * this.maxRequests
			this.tokens = Math.min(this.maxRequests, this.tokens + refillTokens)
			this.lastRefill = now
		}
	}

	/**
	 * Dynamically update rate limit from Discogs response headers.
	 */
	public updateFromHeaders(remaining?: number): void {
		if (remaining !== undefined && Number.isFinite(remaining)) {
			this.tokens = Math.max(0, remaining)
			this.lastRefill = Date.now()
		}
	}

	/**
	 * Acquire a token before making an HTTP request.
	 */
	public async acquire(): Promise<void> {
		if (!this.enabled) return

		this.refill()

		if (this.tokens >= 1) {
			this.tokens -= 1
			return
		}

		// Wait until next token is available
		return new Promise<void>((resolve) => {
			this.queue.push(resolve)
			this.scheduleNext()
		})
	}

	private scheduleNext(): void {
		if (this.queue.length === 0) return

		const timeUntilNextToken = Math.max(0, (1 - this.tokens) * (this.windowMs / this.maxRequests))

		setTimeout(() => {
			this.refill()
			while (this.queue.length > 0 && this.tokens >= 1) {
				this.tokens -= 1
				const next = this.queue.shift()
				next?.()
			}
			if (this.queue.length > 0) {
				this.scheduleNext()
			}
		}, timeUntilNextToken)
	}
}
