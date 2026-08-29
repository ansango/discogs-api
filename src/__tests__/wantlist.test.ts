import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import { DiscogsClient } from '../client.js'
import { type FetchMock, installFetchMock } from './helpers/fetch-mock.js'

describe('Wantlist Service', () => {
	let mock: FetchMock
	let client: DiscogsClient

	beforeEach(() => {
		mock = installFetchMock()
		client = new DiscogsClient({
			userAgent: 'TestApp/1.0.0',
			userToken: 'test-token',
		})
	})

	afterEach(() => {
		mock.restore()
	})

	test('getWantlist', async () => {
		mock.respondWithJson({
			pagination: { page: 1, pages: 1, per_page: 50, items: 1 },
			wants: [
				{
					id: 249504,
					rating: 5,
					notes: 'Looking for 1st press',
					basic_information: { id: 249504, title: 'Nevermind' },
				},
			],
		})

		const wantlist = await client.wantlist.getWantlist('ansango')
		expect(wantlist.wants).toHaveLength(1)
		expect(wantlist.wants[0].notes).toBe('Looking for 1st press')
	})

	test('addRelease, updateRelease, deleteRelease', async () => {
		mock.respondWithJson({
			id: 249504,
			rating: 5,
			basic_information: { id: 249504, title: 'Nevermind' },
		})

		const added = await client.wantlist.addRelease('ansango', 249504, { rating: 5 })
		expect(added.id).toBe(249504)
		expect(mock.lastCall().method).toBe('PUT')

		mock.respondWithJson({
			id: 249504,
			rating: 4,
			notes: 'Updated note',
			basic_information: { id: 249504, title: 'Nevermind' },
		})
		const updated = await client.wantlist.updateRelease('ansango', 249504, { rating: 4, notes: 'Updated note' })
		expect(updated.notes).toBe('Updated note')
		expect(mock.lastCall().method).toBe('POST')

		mock.respondWith('', { status: 204 })
		const deleted = await client.wantlist.deleteRelease('ansango', 249504)
		expect(deleted).toBeNull()
		expect(mock.lastCall().method).toBe('DELETE')
	})
})
