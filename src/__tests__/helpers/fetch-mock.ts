export interface CapturedCall {
	url: string
	init: RequestInit | undefined
	method: string
	headers: Record<string, string>
	body: string | undefined
}

interface QueuedResponse {
	body: BodyInit | null
	init?: ResponseInit
}

export interface FetchMock {
	readonly calls: CapturedCall[]
	respondWith: (body: BodyInit | null, init?: ResponseInit) => void
	respondWithMany: (responses: QueuedResponse[]) => void
	respondWithJson: (data: unknown, init?: ResponseInit) => void
	respondWithHttpError: (status: number, statusText: string, body?: unknown) => void
	lastCall: () => CapturedCall
	nthCall: (n: number) => CapturedCall
	reset: () => void
	restore: () => void
}

export function installFetchMock(): FetchMock {
	const originalFetch = globalThis.fetch
	const calls: CapturedCall[] = []
	const queue: QueuedResponse[] = []

	const mockFetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
		const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
		const method = (init?.method ?? 'GET').toUpperCase()
		const headers = (init?.headers ?? {}) as Record<string, string>
		const body = typeof init?.body === 'string' ? init.body : undefined
		calls.push({ url, init, method, headers, body })

		if (queue.length === 0) {
			throw new Error(
				`fetch mock: no response queued for call to ${method} ${url}. Call mock.respondWith(...) or mock.respondWithJson(...) first.`,
			)
		}
		const next = queue.shift()!
		return new Response(next.body, next.init)
	}) as unknown as typeof globalThis.fetch

	globalThis.fetch = mockFetch

	return {
		calls,
		respondWith: (body, init) => queue.push({ body, init }),
		respondWithMany: (responses) => queue.push(...responses),
		respondWithJson: (data, init) =>
			queue.push({
				body: JSON.stringify(data),
				init: {
					...init,
					headers: {
						'Content-Type': 'application/json',
						...((init?.headers as Record<string, string> | undefined) ?? {}),
					},
				},
			}),
		respondWithHttpError: (status, statusText, body) => {
			const payload = body === undefined ? '' : typeof body === 'string' ? body : JSON.stringify(body)
			queue.push({
				body: payload,
				init: { status, statusText, headers: { 'Content-Type': 'application/json' } },
			})
		},
		lastCall: () => {
			if (calls.length === 0) throw new Error('fetch mock: no calls captured yet')
			return calls[calls.length - 1]
		},
		nthCall: (n) => {
			if (n < 0 || n >= calls.length) {
				throw new Error(`fetch mock: call index ${n} out of range (${calls.length} captured)`)
			}
			return calls[n]
		},
		reset: () => {
			calls.length = 0
			queue.length = 0
		},
		restore: () => {
			globalThis.fetch = originalFetch
		},
	}
}
