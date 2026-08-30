import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import { DiscogsClient } from '@/client.js'
import { type FetchMock, installFetchMock } from './helpers/fetch-mock.js'

describe('Collection Service', () => {
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

	test('getFolders and getFolder', async () => {
		mock.respondWithJson({
			folders: [
				{ id: 0, name: 'All', count: 120, resource_url: 'https://api.discogs.com/users/ansango/collection/folders/0' },
				{
					id: 1,
					name: 'Uncategorized',
					count: 50,
					resource_url: 'https://api.discogs.com/users/ansango/collection/folders/1',
				},
			],
		})

		const folders = await client.collection.getFolders('ansango')
		expect(folders.folders).toHaveLength(2)

		mock.respondWithJson({ id: 1, name: 'Uncategorized', count: 50, resource_url: 'https://api.discogs.com/...' })
		const folder = await client.collection.getFolder('ansango', 1)
		expect(folder.name).toBe('Uncategorized')
	})

	test('createFolder, updateFolder, deleteFolder', async () => {
		mock.respondWithJson({ id: 2, name: 'Vinyl Grails', count: 0, resource_url: '...' })
		const created = await client.collection.createFolder('ansango', 'Vinyl Grails')
		expect(created.id).toBe(2)
		expect(mock.lastCall().method).toBe('POST')

		mock.respondWithJson({ id: 2, name: 'Grails', count: 0, resource_url: '...' })
		const updated = await client.collection.updateFolder('ansango', 2, 'Grails')
		expect(updated.name).toBe('Grails')

		mock.respondWith('', { status: 204 })
		const deleted = await client.collection.deleteFolder('ansango', 2)
		expect(deleted).toBeNull()
		expect(mock.lastCall().method).toBe('DELETE')
	})

	test('getCollectionValue', async () => {
		mock.respondWithJson({
			minimum: '$1,200.00',
			median: '$2,500.00',
			maximum: '$5,800.00',
		})

		const val = await client.collection.getCollectionValue('ansango')
		expect(val.median).toBe('$2,500.00')
	})

	test('addRelease, getReleases, editCustomField, and deleteRelease', async () => {
		mock.respondWithJson({ instance_id: 987654, resource_url: '...' })
		const addRes = await client.collection.addRelease('ansango', 1, 249504)
		expect(addRes.instance_id).toBe(987654)
		expect(mock.lastCall().method).toBe('POST')

		mock.respondWithJson({
			pagination: { page: 1, pages: 1, per_page: 10, items: 1 },
			releases: [
				{
					id: 249504,
					instance_id: 987654,
					basic_information: { id: 249504, title: 'Nevermind' },
				},
			],
		})
		const list = await client.collection.getReleases('ansango', 1)
		expect(list.releases).toHaveLength(1)

		mock.respondWith('', { status: 204 })
		const editRes = await client.collection.editCustomField('ansango', 1, 249504, 987654, 1, 'Near Mint')
		expect(editRes).toBeNull()
		expect(mock.lastCall().method).toBe('POST')

		mock.respondWith('', { status: 204 })
		const delRes = await client.collection.deleteRelease('ansango', 1, 249504, 987654)
		expect(delRes).toBeNull()
		expect(mock.lastCall().method).toBe('DELETE')
	})
})
