import type { DiscogsConfig } from '../config.js'
import type { PaginationParams } from '../core/schemas/base.schemas.js'
import { discogsFetcher } from '../transport/fetcher.js'
import type {
	DiscogsCreateListingRequest,
	DiscogsFeeResponse,
	DiscogsInventoryParams,
	DiscogsInventoryResponse,
	DiscogsListing,
	DiscogsOrder,
	DiscogsOrdersResponse,
	DiscogsPriceSuggestionsResponse,
	DiscogsUpdateListingRequest,
} from './schemas.js'

export interface ListOrdersParams extends PaginationParams {
	status?: string
	sort?: 'id' | 'buyer' | 'created' | 'status' | 'last_activity'
	sort_order?: 'asc' | 'desc'
}

export interface MarketplaceService {
	/**
	 * View the data associated with a marketplace listing.
	 * https://www.discogs.com/developers#page:marketplace,header:marketplace-listing
	 */
	getListing: (listingId: number, curr_abbr?: string, init?: RequestInit) => Promise<DiscogsListing>

	/**
	 * Create a marketplace listing.
	 * https://www.discogs.com/developers#page:marketplace,header:marketplace-create-a-listing
	 */
	createListing: (data: DiscogsCreateListingRequest, init?: RequestInit) => Promise<{ listing_id: number }>

	/**
	 * Edit data associated with a listing.
	 * https://www.discogs.com/developers#page:marketplace,header:marketplace-edit-a-listing
	 */
	updateListing: (listingId: number, data: DiscogsUpdateListingRequest, init?: RequestInit) => Promise<null>

	/**
	 * Permanently delete a listing.
	 * https://www.discogs.com/developers#page:marketplace,header:marketplace-delete-a-listing
	 */
	deleteListing: (listingId: number, init?: RequestInit) => Promise<null>

	/**
	 * View listings in a user's inventory.
	 * https://www.discogs.com/developers#page:marketplace,header:marketplace-inventory
	 */
	getInventory: (
		username: string,
		params?: DiscogsInventoryParams,
		init?: RequestInit,
	) => Promise<DiscogsInventoryResponse>

	/**
	 * View the data associated with an order.
	 * https://www.discogs.com/developers#page:marketplace,header:marketplace-order
	 */
	getOrder: (orderId: string, init?: RequestInit) => Promise<DiscogsOrder>

	/**
	 * Edit the status or shipping of an order.
	 * https://www.discogs.com/developers#page:marketplace,header:marketplace-edit-an-order
	 */
	updateOrder: (
		orderId: string,
		data: { status?: string; shipping?: number },
		init?: RequestInit,
	) => Promise<DiscogsOrder>

	/**
	 * Returns a list of the authenticated user's orders.
	 * https://www.discogs.com/developers#page:marketplace,header:marketplace-list-orders
	 */
	listOrders: (params?: ListOrdersParams, init?: RequestInit) => Promise<DiscogsOrdersResponse>

	/**
	 * Retrieve price suggestions for a release based on market history.
	 * https://www.discogs.com/developers#page:marketplace,header:marketplace-price-suggestions
	 */
	getPriceSuggestions: (releaseId: number, init?: RequestInit) => Promise<DiscogsPriceSuggestionsResponse>

	/**
	 * Calculate the fee Discogs will charge for selling an item at a given price.
	 * https://www.discogs.com/developers#page:marketplace,header:marketplace-fee
	 */
	getFee: (price: number, currency?: string, init?: RequestInit) => Promise<DiscogsFeeResponse>
}

export function createMarketplaceService(config: DiscogsConfig): MarketplaceService {
	return {
		getListing: (listingId, curr_abbr, init) =>
			discogsFetcher<DiscogsListing>(config, `/marketplace/listings/${listingId}`, {
				params: curr_abbr ? { curr_abbr } : undefined,
				init,
			}),

		createListing: (data, init) =>
			discogsFetcher<{ listing_id: number }>(config, '/marketplace/listings', {
				method: 'POST',
				body: data,
				init,
			}),

		updateListing: (listingId, data, init) =>
			discogsFetcher<null>(config, `/marketplace/listings/${listingId}`, {
				method: 'POST',
				body: data,
				init,
			}),

		deleteListing: (listingId, init) =>
			discogsFetcher<null>(config, `/marketplace/listings/${listingId}`, {
				method: 'DELETE',
				init,
			}),

		getInventory: (username, params, init) =>
			discogsFetcher<DiscogsInventoryResponse>(config, `/users/${username}/inventory`, {
				params: params as Record<string, string | number | boolean | undefined>,
				init,
			}),

		getOrder: (orderId, init) => discogsFetcher<DiscogsOrder>(config, `/marketplace/orders/${orderId}`, { init }),

		updateOrder: (orderId, data, init) =>
			discogsFetcher<DiscogsOrder>(config, `/marketplace/orders/${orderId}`, {
				method: 'POST',
				body: data,
				init,
			}),

		listOrders: (params, init) =>
			discogsFetcher<DiscogsOrdersResponse>(config, '/marketplace/orders', {
				params: params as Record<string, string | number | boolean | undefined>,
				init,
			}),

		getPriceSuggestions: (releaseId, init) =>
			discogsFetcher<DiscogsPriceSuggestionsResponse>(config, `/marketplace/price_suggestions/${releaseId}`, { init }),

		getFee: (price, currency, init) =>
			discogsFetcher<DiscogsFeeResponse>(config, `/marketplace/fee/${price}`, {
				params: currency ? { currency } : undefined,
				init,
			}),
	}
}
