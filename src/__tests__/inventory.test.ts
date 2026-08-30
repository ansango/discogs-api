import { describe, expect, test } from 'bun:test'
import { CANONICAL_METHODS } from '@/canonical-methods.js'
import { DiscogsClient } from '@/client.js'

describe('Canonical Method Inventory', () => {
	test('all canonical methods are implemented on DiscogsClient', () => {
		const client = new DiscogsClient({
			userAgent: 'TestApp/1.0.0',
			userToken: 'dummy-token',
		})

		for (const def of CANONICAL_METHODS) {
			const namespace = (client as any)[def.namespace]
			expect(namespace).toBeDefined()
			expect(typeof namespace[def.name]).toBe('function')
		}
	})

	test('canonical methods count matches 47 endpoints', () => {
		expect(CANONICAL_METHODS.length).toBe(47)
	})
})
