import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import { DiscogsClient } from '@/client.js'
import { type FetchMock, installFetchMock } from './helpers/fetch-mock.js'

describe('Lists Service', () => {
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

	test('getUserLists and getList', async () => {
		mock.respondWithJson({
			pagination: { page: 1, pages: 1, per_page: 25, items: 1 },
			lists: [{ id: 778899, name: '90s Grunge Essentials' }],
		})

		const userLists = await client.lists.getUserLists('ansango')
		expect(userLists.lists).toHaveLength(1)
		expect(userLists.lists[0].name).toBe('90s Grunge Essentials')

		mock.respondWithJson({
			id: 778899,
			name: '90s Grunge Essentials',
			items: [{ id: 249504, type: 'release', display_title: 'Nirvana - Nevermind' }],
		})

		const details = await client.lists.getList(778899)
		expect(details.items).toHaveLength(1)
		expect(details.items[0].display_title).toBe('Nirvana - Nevermind')
	})
})
