import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import { DiscogsClient } from '../client.js'
import { type FetchMock, installFetchMock } from './helpers/fetch-mock.js'

describe('Database Service', () => {
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

	test('getRelease fetches release by ID with currency', async () => {
		mock.respondWithJson({
			id: 249504,
			title: 'Nevermind',
			year: 1991,
			artists: [{ id: 125246, name: 'Nirvana' }],
		})

		const release = await client.database.getRelease(249504, 'EUR')

		expect(release.id).toBe(249504)
		expect(release.title).toBe('Nevermind')
		expect(mock.lastCall().url).toContain('/releases/249504?curr_abbr=EUR')
	})

	test('getMaster and getMasterVersions', async () => {
		mock.respondWithJson({ id: 13814, title: 'Nevermind', year: 1991 })
		const master = await client.database.getMaster(13814)
		expect(master.title).toBe('Nevermind')

		mock.respondWithJson({
			pagination: { page: 1, pages: 10, per_page: 50, items: 500 },
			versions: [{ id: 249504, title: 'Nevermind' }],
		})
		const versions = await client.database.getMasterVersions(13814, { page: 1, per_page: 50 })
		expect(versions.versions).toHaveLength(1)
	})

	test('getArtist and getArtistReleases', async () => {
		mock.respondWithJson({ id: 125246, name: 'Nirvana', realname: 'Nirvana band' })
		const artist = await client.database.getArtist(125246)
		expect(artist.name).toBe('Nirvana')

		mock.respondWithJson({
			pagination: { page: 1, pages: 2, per_page: 10, items: 20 },
			releases: [{ id: 13814, title: 'Nevermind', type: 'master' }],
		})
		const releases = await client.database.getArtistReleases(125246, { sort: 'year' })
		expect(releases.releases).toHaveLength(1)
	})

	test('getLabel and getLabelReleases', async () => {
		mock.respondWithJson({ id: 264254, name: 'DGC Records' })
		const label = await client.database.getLabel(264254)
		expect(label.name).toBe('DGC Records')

		mock.respondWithJson({
			pagination: { page: 1, pages: 1, per_page: 10, items: 1 },
			releases: [{ id: 249504, title: 'Nevermind' }],
		})
		const releases = await client.database.getLabelReleases(264254)
		expect(releases.releases).toHaveLength(1)
	})

	test('search queries database with multi-criteria filters', async () => {
		mock.respondWithJson({
			pagination: { page: 1, pages: 5, per_page: 20, items: 100 },
			results: [{ id: 249504, type: 'release', title: 'Nirvana - Nevermind' }],
		})

		const results = await client.database.search({
			q: 'Nevermind',
			type: 'release',
			year: 1991,
			artist: 'Nirvana',
		})

		expect(results.results).toHaveLength(1)
		expect(mock.lastCall().url).toContain('q=Nevermind')
		expect(mock.lastCall().url).toContain('type=release')
		expect(mock.lastCall().url).toContain('year=1991')
	})

	test('ratings workflow (get, set, delete, community)', async () => {
		mock.respondWithJson({ release_id: 249504, username: 'ansango', rating: 5 })
		const r1 = await client.database.getReleaseRating(249504, 'ansango')
		expect(r1.rating).toBe(5)

		mock.respondWithJson({ release_id: 249504, username: 'ansango', rating: 4 })
		const r2 = await client.database.setReleaseRating(249504, 'ansango', 4)
		expect(r2.rating).toBe(4)
		expect(mock.lastCall().method).toBe('PUT')

		mock.respondWith('', { status: 204 })
		const r3 = await client.database.deleteReleaseRating(249504, 'ansango')
		expect(r3).toBeNull()
		expect(mock.lastCall().method).toBe('DELETE')

		mock.respondWithJson({ release_id: 249504, rating: { count: 1200, average: 4.85 } })
		const comm = await client.database.getReleaseCommunityRating(249504)
		expect(comm.rating.average).toBe(4.85)
	})
})
