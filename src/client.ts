import {
	type AuthService,
	type CollectionService,
	type DatabaseService,
	type ListsService,
	type MarketplaceService,
	type UserService,
	type WantlistService,
	createAuthService,
	createCollectionService,
	createDatabaseService,
	createListsService,
	createMarketplaceService,
	createUserService,
	createWantlistService,
} from '@/api/index.js'
import { type DiscogsConfig, createConfig, getGlobalConfig } from '@/core/index.js'

/**
 * Main Discogs API Client.
 *
 * Universal client for interacting with Discogs API v2.
 * Supports Personal Access Tokens, Key/Secret, and 3-legged OAuth 1.0a.
 *
 * @example
 * ```typescript
 * import { DiscogsClient } from '@ansango/discogs-api'
 *
 * const client = new DiscogsClient({
 *   userAgent: 'MyDiscogsApp/1.0.0 (+https://mywebsite.com)',
 *   userToken: 'YOUR_PERSONAL_ACCESS_TOKEN',
 * })
 *
 * const release = await client.database.getRelease(249504)
 * console.log(release.title, release.artists?.[0]?.name)
 * ```
 */
export class DiscogsClient {
	public readonly database: DatabaseService
	public readonly collection: CollectionService
	public readonly wantlist: WantlistService
	public readonly user: UserService
	public readonly marketplace: MarketplaceService
	public readonly lists: ListsService
	public readonly auth: AuthService

	private readonly config: DiscogsConfig

	constructor(config?: Partial<DiscogsConfig>) {
		this.config = config ? createConfig(config) : getGlobalConfig()

		this.database = createDatabaseService(this.config)
		this.collection = createCollectionService(this.config)
		this.wantlist = createWantlistService(this.config)
		this.user = createUserService(this.config)
		this.marketplace = createMarketplaceService(this.config)
		this.lists = createListsService(this.config)
		this.auth = createAuthService(this.config)
	}

	/**
	 * Returns a copy of the active client configuration.
	 */
	public getConfig(): Readonly<DiscogsConfig> {
		return { ...this.config }
	}
}

/**
 * Helper factory function to instantiate a DiscogsClient.
 */
export function createClient(config?: Partial<DiscogsConfig>): DiscogsClient {
	return new DiscogsClient(config)
}
