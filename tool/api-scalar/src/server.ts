import { CANONICAL_METHODS } from '@/canonical-methods.js'
import { DiscogsClient } from '@/client.js'
import { apiReference } from '@scalar/hono-api-reference'
import { Hono } from 'hono'

export interface ServerOptions {
	userAgent?: string
	userToken?: string
	consumerKey?: string
	consumerSecret?: string
}

export function createOpenApiSpec() {
	const paths: Record<string, any> = {}

	for (const item of CANONICAL_METHODS) {
		const routePath = `/api/${item.namespace}/${item.name}`
		paths[routePath] = {
			[item.httpMethod.toLowerCase()]: {
				summary: `${item.namespace}.${item.name}`,
				description: item.description,
				tags: [item.namespace],
				responses: {
					'200': {
						description: 'Successful Discogs API response',
						content: {
							'application/json': {
								schema: {
									type: 'object',
								},
							},
						},
					},
				},
			},
		}
	}

	return {
		openapi: '3.1.0',
		info: {
			title: 'Discogs API v2 Explorer',
			version: '1.0.0',
			description: 'Interactive API explorer for @ansango/discogs-api SDK.',
		},
		servers: [{ url: 'http://localhost:3000' }],
		paths,
	}
}

export function createServer(opts: ServerOptions = {}) {
	const app = new Hono()
	const userAgent = opts.userAgent ?? process.env.DISCOGS_USER_AGENT ?? 'DiscogsApiScalarExplorer/1.0.0'
	const userToken = opts.userToken ?? process.env.DISCOGS_USER_TOKEN ?? process.env.DISCOGS_TOKEN

	const client = new DiscogsClient({
		userAgent,
		userToken,
		consumerKey: opts.consumerKey ?? process.env.DISCOGS_CONSUMER_KEY,
		consumerSecret: opts.consumerSecret ?? process.env.DISCOGS_CONSUMER_SECRET,
	})

	// OpenAPI JSON spec endpoint
	app.get('/openapi.json', (c) => c.json(createOpenApiSpec()))

	// Scalar UI reference
	app.get(
		'/',
		apiReference({
			url: '/openapi.json',
			theme: 'purple',
			pageTitle: 'Discogs API v2 Reference — @ansango/discogs-api',
		}),
	)

	// Status check
	app.get('/health', (c) =>
		c.json({
			status: 'ok',
			clientConfig: {
				userAgent: client.getConfig().userAgent,
				hasToken: !!client.getConfig().userToken,
				methodsCount: CANONICAL_METHODS.length,
			},
		}),
	)

	return app
}
