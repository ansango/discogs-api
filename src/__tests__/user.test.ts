import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import { DiscogsClient } from '../client.js'
import { type FetchMock, installFetchMock } from './helpers/fetch-mock.js'

describe('User Service', () => {
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

	test('getIdentity returns authenticated user details', async () => {
		mock.respondWithJson({
			id: 12345,
			username: 'ansango',
			resource_url: 'https://api.discogs.com/users/ansango',
			consumer_name: 'MyTestApp',
		})

		const identity = await client.user.getIdentity()
		expect(identity.username).toBe('ansango')
		expect(identity.id).toBe(12345)
	})

	test('getProfile and updateProfile', async () => {
		mock.respondWithJson({
			id: 12345,
			username: 'ansango',
			name: 'Anibal Santos',
			num_collection: 150,
			num_wantlist: 40,
		})

		const profile = await client.user.getProfile('ansango')
		expect(profile.name).toBe('Anibal Santos')

		mock.respondWithJson({
			id: 12345,
			username: 'ansango',
			name: 'Anibal Santos G.',
			location: 'Madrid, Spain',
		})

		const updated = await client.user.updateProfile('ansango', {
			name: 'Anibal Santos G.',
			location: 'Madrid, Spain',
		})
		expect(updated.location).toBe('Madrid, Spain')
		expect(mock.lastCall().method).toBe('POST')
	})

	test('getSubmissions and getContributions', async () => {
		mock.respondWithJson({
			pagination: { page: 1, pages: 1, per_page: 50, items: 1 },
			submissions: [{ id: 249504, title: 'Nevermind', artist: 'Nirvana' }],
		})

		const subs = await client.user.getSubmissions('ansango')
		expect(subs.submissions).toHaveLength(1)

		mock.respondWithJson({
			pagination: { page: 1, pages: 1, per_page: 50, items: 1 },
			contributions: [{ id: 249504, title: 'Nevermind', artist: 'Nirvana' }],
		})

		const contribs = await client.user.getContributions('ansango')
		expect(contribs.contributions).toHaveLength(1)
	})
})
