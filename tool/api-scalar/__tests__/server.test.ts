import { describe, expect, test } from 'bun:test'
import { createOpenApiSpec, createServer } from '../src/server.js'

describe('Scalar Docs Server', () => {
	test('createOpenApiSpec generates valid OpenAPI 3.1.0 document for all 47 methods', () => {
		const spec = createOpenApiSpec()
		expect(spec.openapi).toBe('3.1.0')
		expect(spec.info.title).toBe('Discogs API v2 Explorer')
		expect(Object.keys(spec.paths).length).toBe(47)
	})

	test('GET /health returns status ok', async () => {
		const app = createServer({ userAgent: 'TestExplorer/1.0.0' })
		const res = await app.request('/health')
		expect(res.status).toBe(200)

		const json = (await res.json()) as any
		expect(json.status).toBe('ok')
		expect(json.clientConfig.methodsCount).toBe(47)
	})

	test('GET /openapi.json returns openapi schema', async () => {
		const app = createServer({ userAgent: 'TestExplorer/1.0.0' })
		const res = await app.request('/openapi.json')
		expect(res.status).toBe(200)

		const json = (await res.json()) as any
		expect(json.openapi).toBe('3.1.0')
	})
})
