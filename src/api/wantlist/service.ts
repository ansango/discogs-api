import type { DiscogsConfig } from '@/core/config.js'
import { discogsFetcher } from '@/core/http/index.js'
import type {
	DiscogsAddToWantlistRequest,
	DiscogsWantlistItem,
	DiscogsWantlistParams,
	DiscogsWantlistResponse,
} from './schemas.js'

export interface WantlistService {
	/**
	 * Returns a list of Releases in a user's Wantlist.
	 * https://www.discogs.com/developers#page:user-wantlist,header:user-wantlist-wantlist
	 */
	getWantlist: (
		username: string,
		params?: DiscogsWantlistParams,
		init?: RequestInit,
	) => Promise<DiscogsWantlistResponse>

	/**
	 * Add a release to a user's wantlist.
	 * https://www.discogs.com/developers#page:user-wantlist,header:user-wantlist-add-to-wantlist
	 */
	addRelease: (
		username: string,
		releaseId: number,
		options?: DiscogsAddToWantlistRequest,
		init?: RequestInit,
	) => Promise<DiscogsWantlistItem>

	/**
	 * Update notes or rating for a release in a user's wantlist.
	 * https://www.discogs.com/developers#page:user-wantlist,header:user-wantlist-edit-wantlist-item
	 */
	updateRelease: (
		username: string,
		releaseId: number,
		options: DiscogsAddToWantlistRequest,
		init?: RequestInit,
	) => Promise<DiscogsWantlistItem>

	/**
	 * Delete a release from a user's wantlist.
	 * https://www.discogs.com/developers#page:user-wantlist,header:user-wantlist-delete-from-wantlist
	 */
	deleteRelease: (username: string, releaseId: number, init?: RequestInit) => Promise<null>
}

export function createWantlistService(config: DiscogsConfig): WantlistService {
	return {
		getWantlist: (username, params, init) =>
			discogsFetcher<DiscogsWantlistResponse>(config, `/users/${username}/wants`, {
				params: params as Record<string, string | number | boolean | undefined>,
				init,
			}),

		addRelease: (username, releaseId, options, init) =>
			discogsFetcher<DiscogsWantlistItem>(config, `/users/${username}/wants/${releaseId}`, {
				method: 'PUT',
				body: options,
				init,
			}),

		updateRelease: (username, releaseId, options, init) =>
			discogsFetcher<DiscogsWantlistItem>(config, `/users/${username}/wants/${releaseId}`, {
				method: 'POST',
				body: options,
				init,
			}),

		deleteRelease: (username, releaseId, init) =>
			discogsFetcher<null>(config, `/users/${username}/wants/${releaseId}`, {
				method: 'DELETE',
				init,
			}),
	}
}
