import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import { DiscogsClient } from '../client.js'
import { type FetchMock, installFetchMock } from './helpers/fetch-mock.js'

describe('Marketplace Service', () => {
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

	test('getListing, createListing, updateListing, deleteListing', async () => {
		mock.respondWithJson({
			id: 112233,
			status: 'For Sale',
			price: { currency: 'EUR', value: 25.0 },
			condition: 'Near Mint (NM or M-)',
		})

		const listing = await client.marketplace.getListing(112233)
		expect(listing.id).toBe(112233)

		mock.respondWithJson({ listing_id: 112233 })
		const created = await client.marketplace.createListing({
			release_id: 249504,
			condition: 'Mint (M)',
			price: 30.0,
		})
		expect(created.listing_id).toBe(112233)
		expect(mock.lastCall().method).toBe('POST')

		mock.respondWith('', { status: 204 })
		const updated = await client.marketplace.updateListing(112233, { price: 28.0 })
		expect(updated).toBeNull()

		mock.respondWith('', { status: 204 })
		const deleted = await client.marketplace.deleteListing(112233)
		expect(deleted).toBeNull()
		expect(mock.lastCall().method).toBe('DELETE')
	})

	test('getInventory and listOrders', async () => {
		mock.respondWithJson({
			pagination: { page: 1, pages: 1, per_page: 25, items: 1 },
			listings: [{ id: 112233, status: 'For Sale', price: { currency: 'EUR', value: 25.0 }, condition: 'Mint (M)' }],
		})

		const inv = await client.marketplace.getInventory('ansango')
		expect(inv.listings).toHaveLength(1)

		mock.respondWithJson({
			pagination: { page: 1, pages: 1, per_page: 25, items: 1 },
			orders: [{ id: '1-1', status: 'Payment Received' }],
		})
		const orders = await client.marketplace.listOrders({ status: 'Payment Received' })
		expect(orders.orders).toHaveLength(1)
	})

	test('getPriceSuggestions and getFee', async () => {
		mock.respondWithJson({
			'Mint (M)': { currency: 'USD', value: 45.0 },
			'Near Mint (NM or M-)': { currency: 'USD', value: 35.0 },
		})

		const suggestions = await client.marketplace.getPriceSuggestions(249504)
		expect(suggestions['Mint (M)']?.value).toBe(45.0)

		mock.respondWithJson({ currency: 'EUR', value: 2.16 })
		const fee = await client.marketplace.getFee(24.0, 'EUR')
		expect(fee.value).toBe(2.16)
	})
})
