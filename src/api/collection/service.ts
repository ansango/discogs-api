import type { DiscogsConfig } from '@/core/config.js'
import { discogsFetcher } from '@/core/http/index.js'
import type {
	DiscogsAddReleaseToFolderResponse,
	DiscogsCollectionFieldsResponse,
	DiscogsCollectionFolder,
	DiscogsCollectionFoldersResponse,
	DiscogsCollectionReleasesParams,
	DiscogsCollectionReleasesResponse,
	DiscogsCollectionValueResponse,
} from './schemas.js'

export interface CollectionService {
	/**
	 * Retrieve a list of folders in a user's collection.
	 * Folder 0 is always "All".
	 * https://www.discogs.com/developers#page:user-collection,header:user-collection-collection-folders
	 */
	getFolders: (username: string, init?: RequestInit) => Promise<DiscogsCollectionFoldersResponse>

	/**
	 * Retrieve metadata about a specific folder in a user's collection.
	 * https://www.discogs.com/developers#page:user-collection,header:user-collection-collection-folder
	 */
	getFolder: (username: string, folderId: number, init?: RequestInit) => Promise<DiscogsCollectionFolder>

	/**
	 * Create a new folder in a user's collection.
	 * https://www.discogs.com/developers#page:user-collection,header:user-collection-create-folder
	 */
	createFolder: (username: string, name: string, init?: RequestInit) => Promise<DiscogsCollectionFolder>

	/**
	 * Edit a folder's name in a user's collection.
	 * https://www.discogs.com/developers#page:user-collection,header:user-collection-edit-folder
	 */
	updateFolder: (
		username: string,
		folderId: number,
		name: string,
		init?: RequestInit,
	) => Promise<DiscogsCollectionFolder>

	/**
	 * Delete a folder from a user's collection.
	 * https://www.discogs.com/developers#page:user-collection,header:user-collection-delete-folder
	 */
	deleteFolder: (username: string, folderId: number, init?: RequestInit) => Promise<null>

	/**
	 * Returns total estimated value (minimum, median, maximum) of a user's collection.
	 * https://www.discogs.com/developers#page:user-collection,header:user-collection-collection-value
	 */
	getCollectionValue: (username: string, init?: RequestInit) => Promise<DiscogsCollectionValueResponse>

	/**
	 * Retrieve custom fields available on a user's collection.
	 * https://www.discogs.com/developers#page:user-collection,header:user-collection-collection-custom-fields
	 */
	getFields: (username: string, init?: RequestInit) => Promise<DiscogsCollectionFieldsResponse>

	/**
	 * View the items in a user's collection folder (0 = all items).
	 * https://www.discogs.com/developers#page:user-collection,header:user-collection-collection-items-by-folder
	 */
	getReleases: (
		username: string,
		folderId?: number,
		params?: DiscogsCollectionReleasesParams,
		init?: RequestInit,
	) => Promise<DiscogsCollectionReleasesResponse>

	/**
	 * Add a release to a user's collection folder (folder 1 is the default "Uncategorized").
	 * https://www.discogs.com/developers#page:user-collection,header:user-collection-add-to-folder
	 */
	addRelease: (
		username: string,
		folderId: number,
		releaseId: number,
		init?: RequestInit,
	) => Promise<DiscogsAddReleaseToFolderResponse>

	/**
	 * Delete an instance of a release from a user's collection folder.
	 * https://www.discogs.com/developers#page:user-collection,header:user-collection-delete-instance-from-folder
	 */
	deleteRelease: (
		username: string,
		folderId: number,
		releaseId: number,
		instanceId: number,
		init?: RequestInit,
	) => Promise<null>

	/**
	 * Change the rating, notes, or custom field values of a release instance in a collection folder.
	 * https://www.discogs.com/developers#page:user-collection,header:user-collection-edit-fields-instance
	 */
	editCustomField: (
		username: string,
		folderId: number,
		releaseId: number,
		instanceId: number,
		fieldId: number,
		value: string,
		init?: RequestInit,
	) => Promise<null>
}

export function createCollectionService(config: DiscogsConfig): CollectionService {
	return {
		getFolders: (username, init) =>
			discogsFetcher<DiscogsCollectionFoldersResponse>(config, `/users/${username}/collection/folders`, { init }),

		getFolder: (username, folderId, init) =>
			discogsFetcher<DiscogsCollectionFolder>(config, `/users/${username}/collection/folders/${folderId}`, { init }),

		createFolder: (username, name, init) =>
			discogsFetcher<DiscogsCollectionFolder>(config, `/users/${username}/collection/folders`, {
				method: 'POST',
				body: { name },
				init,
			}),

		updateFolder: (username, folderId, name, init) =>
			discogsFetcher<DiscogsCollectionFolder>(config, `/users/${username}/collection/folders/${folderId}`, {
				method: 'POST',
				body: { name },
				init,
			}),

		deleteFolder: (username, folderId, init) =>
			discogsFetcher<null>(config, `/users/${username}/collection/folders/${folderId}`, {
				method: 'DELETE',
				init,
			}),

		getCollectionValue: (username, init) =>
			discogsFetcher<DiscogsCollectionValueResponse>(config, `/users/${username}/collection/value`, { init }),

		getFields: (username, init) =>
			discogsFetcher<DiscogsCollectionFieldsResponse>(config, `/users/${username}/collection/fields`, { init }),

		getReleases: (username, folderId, params, init) => {
			const fid = folderId ?? 0
			return discogsFetcher<DiscogsCollectionReleasesResponse>(
				config,
				`/users/${username}/collection/folders/${fid}/releases`,
				{
					params: params as Record<string, string | number | boolean | undefined>,
					init,
				},
			)
		},

		addRelease: (username, folderId, releaseId, init) =>
			discogsFetcher<DiscogsAddReleaseToFolderResponse>(
				config,
				`/users/${username}/collection/folders/${folderId}/releases/${releaseId}`,
				{
					method: 'POST',
					init,
				},
			),

		deleteRelease: (username, folderId, releaseId, instanceId, init) =>
			discogsFetcher<null>(
				config,
				`/users/${username}/collection/folders/${folderId}/releases/${releaseId}/instances/${instanceId}`,
				{
					method: 'DELETE',
					init,
				},
			),

		editCustomField: (username, folderId, releaseId, instanceId, fieldId, value, init) =>
			discogsFetcher<null>(
				config,
				`/users/${username}/collection/folders/${folderId}/releases/${releaseId}/instances/${instanceId}/fields/${fieldId}`,
				{
					method: 'POST',
					body: { value },
					init,
				},
			),
	}
}
