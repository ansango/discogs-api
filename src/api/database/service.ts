import type { DiscogsConfig } from '@/core/config.js'
import { discogsFetcher } from '@/core/http/index.js'
import type { PaginationParams } from '@/core/schemas/base.schemas.js'
import type {
	DiscogsArtist,
	DiscogsArtistReleasesResponse,
	DiscogsCommunityRatingResponse,
	DiscogsLabel,
	DiscogsLabelReleasesResponse,
	DiscogsMaster,
	DiscogsMasterVersionsResponse,
	DiscogsRelease,
	DiscogsReleaseRatingResponse,
	DiscogsSearchRequest,
	DiscogsSearchResponse,
} from './schemas.js'

export interface MasterVersionsParams extends PaginationParams {
	format?: string
	label?: string
	released?: string
	country?: string
	sort?: 'released' | 'title' | 'format'
	sort_order?: 'asc' | 'desc'
}

export interface ArtistReleasesParams extends PaginationParams {
	sort?: 'year' | 'title' | 'format'
	sort_order?: 'asc' | 'desc'
}

export interface DatabaseService {
	/**
	 * Get a release from the database.
	 * https://www.discogs.com/developers#page:database,header:database-release
	 */
	getRelease: (releaseId: number, curr_abbr?: string, init?: RequestInit) => Promise<DiscogsRelease>

	/**
	 * Get the rating of a release by a given user.
	 * https://www.discogs.com/developers#page:database,header:database-release-rating-by-user
	 */
	getReleaseRating: (releaseId: number, username: string, init?: RequestInit) => Promise<DiscogsReleaseRatingResponse>

	/**
	 * Update or set a user's rating for a release (Rating: 0-5).
	 * https://www.discogs.com/developers#page:database,header:database-release-rating-by-user-put
	 */
	setReleaseRating: (
		releaseId: number,
		username: string,
		rating: number,
		init?: RequestInit,
	) => Promise<DiscogsReleaseRatingResponse>

	/**
	 * Delete a user's rating for a release.
	 * https://www.discogs.com/developers#page:database,header:database-release-rating-by-user-delete
	 */
	deleteReleaseRating: (releaseId: number, username: string, init?: RequestInit) => Promise<null>

	/**
	 * Get the community rating for a release.
	 * https://www.discogs.com/developers#page:database,header:database-community-release-rating
	 */
	getReleaseCommunityRating: (releaseId: number, init?: RequestInit) => Promise<DiscogsCommunityRatingResponse>

	/**
	 * Get a master release from the database.
	 * https://www.discogs.com/developers#page:database,header:database-master-release
	 */
	getMaster: (masterId: number, init?: RequestInit) => Promise<DiscogsMaster>

	/**
	 * Retrieves a list of all Releases that are versions of this master.
	 * https://www.discogs.com/developers#page:database,header:database-master-release-versions
	 */
	getMasterVersions: (
		masterId: number,
		params?: MasterVersionsParams,
		init?: RequestInit,
	) => Promise<DiscogsMasterVersionsResponse>

	/**
	 * Get an artist profile from the database.
	 * https://www.discogs.com/developers#page:database,header:database-artist
	 */
	getArtist: (artistId: number, init?: RequestInit) => Promise<DiscogsArtist>

	/**
	 * Get a list of Releases and Masters by an artist.
	 * https://www.discogs.com/developers#page:database,header:database-artist-releases
	 */
	getArtistReleases: (
		artistId: number,
		params?: ArtistReleasesParams,
		init?: RequestInit,
	) => Promise<DiscogsArtistReleasesResponse>

	/**
	 * Get a label from the database.
	 * https://www.discogs.com/developers#page:database,header:database-label
	 */
	getLabel: (labelId: number, init?: RequestInit) => Promise<DiscogsLabel>

	/**
	 * Get a list of Releases associated with the label.
	 * https://www.discogs.com/developers#page:database,header:database-all-label-releases
	 */
	getLabelReleases: (
		labelId: number,
		params?: PaginationParams,
		init?: RequestInit,
	) => Promise<DiscogsLabelReleasesResponse>

	/**
	 * Issue a search query to the Discogs database.
	 * https://www.discogs.com/developers#page:database,header:database-search
	 */
	search: (params: DiscogsSearchRequest, init?: RequestInit) => Promise<DiscogsSearchResponse>
}

export function createDatabaseService(config: DiscogsConfig): DatabaseService {
	return {
		getRelease: (releaseId, curr_abbr, init) =>
			discogsFetcher<DiscogsRelease>(config, `/releases/${releaseId}`, {
				params: curr_abbr ? { curr_abbr } : undefined,
				init,
			}),

		getReleaseRating: (releaseId, username, init) =>
			discogsFetcher<DiscogsReleaseRatingResponse>(config, `/releases/${releaseId}/rating/${username}`, { init }),

		setReleaseRating: (releaseId, username, rating, init) =>
			discogsFetcher<DiscogsReleaseRatingResponse>(config, `/releases/${releaseId}/rating/${username}`, {
				method: 'PUT',
				body: { rating },
				init,
			}),

		deleteReleaseRating: (releaseId, username, init) =>
			discogsFetcher<null>(config, `/releases/${releaseId}/rating/${username}`, {
				method: 'DELETE',
				init,
			}),

		getReleaseCommunityRating: (releaseId, init) =>
			discogsFetcher<DiscogsCommunityRatingResponse>(config, `/releases/${releaseId}/rating`, { init }),

		getMaster: (masterId, init) => discogsFetcher<DiscogsMaster>(config, `/masters/${masterId}`, { init }),

		getMasterVersions: (masterId, params, init) =>
			discogsFetcher<DiscogsMasterVersionsResponse>(config, `/masters/${masterId}/versions`, {
				params: params as Record<string, string | number | boolean | undefined>,
				init,
			}),

		getArtist: (artistId, init) => discogsFetcher<DiscogsArtist>(config, `/artists/${artistId}`, { init }),

		getArtistReleases: (artistId, params, init) =>
			discogsFetcher<DiscogsArtistReleasesResponse>(config, `/artists/${artistId}/releases`, {
				params: params as Record<string, string | number | boolean | undefined>,
				init,
			}),

		getLabel: (labelId, init) => discogsFetcher<DiscogsLabel>(config, `/labels/${labelId}`, { init }),

		getLabelReleases: (labelId, params, init) =>
			discogsFetcher<DiscogsLabelReleasesResponse>(config, `/labels/${labelId}/releases`, {
				params: params as Record<string, string | number | boolean | undefined>,
				init,
			}),

		search: (params, init) =>
			discogsFetcher<DiscogsSearchResponse>(config, '/database/search', {
				params: params as Record<string, string | number | boolean | undefined>,
				init,
			}),
	}
}
