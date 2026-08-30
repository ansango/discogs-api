import type { DiscogsConfig } from '@/core/config.js'
import { discogsFetcher } from '@/core/http/index.js'
import type {
	DiscogsUpdateUserProfileRequest,
	DiscogsUserContributionsResponse,
	DiscogsUserIdentity,
	DiscogsUserProfile,
	DiscogsUserSubmissionsParams,
	DiscogsUserSubmissionsResponse,
} from './schemas.js'

export interface UserService {
	/**
	 * Retrieve basic information about the authenticated user (Identity).
	 * https://www.discogs.com/developers#page:user-identity,header:user-identity-identity
	 */
	getIdentity: (init?: RequestInit) => Promise<DiscogsUserIdentity>

	/**
	 * Retrieve a user's public profile.
	 * https://www.discogs.com/developers#page:user-identity,header:user-identity-profile
	 */
	getProfile: (username: string, init?: RequestInit) => Promise<DiscogsUserProfile>

	/**
	 * Edit a user's profile metadata.
	 * https://www.discogs.com/developers#page:user-identity,header:user-identity-profile-post
	 */
	updateProfile: (
		username: string,
		data: DiscogsUpdateUserProfileRequest,
		init?: RequestInit,
	) => Promise<DiscogsUserProfile>

	/**
	 * Retrieve a user's submissions to the Discogs database.
	 * https://www.discogs.com/developers#page:user-identity,header:user-identity-user-submissions
	 */
	getSubmissions: (
		username: string,
		params?: DiscogsUserSubmissionsParams,
		init?: RequestInit,
	) => Promise<DiscogsUserSubmissionsResponse>

	/**
	 * Retrieve a user's contributions to the Discogs database.
	 * https://www.discogs.com/developers#page:user-identity,header:user-identity-user-contributions
	 */
	getContributions: (
		username: string,
		params?: DiscogsUserSubmissionsParams,
		init?: RequestInit,
	) => Promise<DiscogsUserContributionsResponse>
}

export function createUserService(config: DiscogsConfig): UserService {
	return {
		getIdentity: (init) => discogsFetcher<DiscogsUserIdentity>(config, '/oauth/identity', { init }),

		getProfile: (username, init) => discogsFetcher<DiscogsUserProfile>(config, `/users/${username}`, { init }),

		updateProfile: (username, data, init) =>
			discogsFetcher<DiscogsUserProfile>(config, `/users/${username}`, {
				method: 'POST',
				body: data,
				init,
			}),

		getSubmissions: (username, params, init) =>
			discogsFetcher<DiscogsUserSubmissionsResponse>(config, `/users/${username}/submissions`, {
				params: params as Record<string, string | number | boolean | undefined>,
				init,
			}),

		getContributions: (username, params, init) =>
			discogsFetcher<DiscogsUserContributionsResponse>(config, `/users/${username}/contributions`, {
				params: params as Record<string, string | number | boolean | undefined>,
				init,
			}),
	}
}
