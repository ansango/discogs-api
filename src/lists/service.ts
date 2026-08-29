import type { DiscogsConfig } from '../config.js'
import type { PaginationParams } from '../core/schemas/base.schemas.js'
import { discogsFetcher } from '../transport/fetcher.js'
import type { DiscogsListDetails, DiscogsUserListsResponse } from './schemas.js'

export interface ListsService {
	/**
	 * Retrieve lists created by a user.
	 * https://www.discogs.com/developers#page:user-lists,header:user-lists-user-lists
	 */
	getUserLists: (username: string, params?: PaginationParams, init?: RequestInit) => Promise<DiscogsUserListsResponse>

	/**
	 * Retrieve full details of a specific user list.
	 * https://www.discogs.com/developers#page:user-lists,header:user-lists-user-list-items
	 */
	getList: (listId: number, init?: RequestInit) => Promise<DiscogsListDetails>
}

export function createListsService(config: DiscogsConfig): ListsService {
	return {
		getUserLists: (username, params, init) =>
			discogsFetcher<DiscogsUserListsResponse>(config, `/users/${username}/lists`, {
				params: params as Record<string, string | number | boolean | undefined>,
				init,
			}),

		getList: (listId, init) => discogsFetcher<DiscogsListDetails>(config, `/lists/${listId}`, { init }),
	}
}
