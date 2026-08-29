import { z } from 'zod'
import {
	artistCreditSchema,
	communityRatingSchema,
	companySchema,
	identifierSchema,
	imageSchema,
	paginationParamsSchema,
	paginationSchema,
	ratingValueSchema,
	releaseFormatSchema,
	releaseLabelSchema,
	trackItemSchema,
	videoSchema,
} from '../core/schemas/base.schemas.js'

export const releaseSchema = z.object({
	id: z.number().int().positive(),
	title: z.string(),
	artists: z.array(artistCreditSchema).optional(),
	artists_sort: z.string().optional(),
	extraartists: z.array(artistCreditSchema).optional(),
	labels: z.array(releaseLabelSchema).optional(),
	companies: z.array(companySchema).optional(),
	formats: z.array(releaseFormatSchema).optional(),
	genres: z.array(z.string()).optional(),
	styles: z.array(z.string()).optional(),
	tracklist: z.array(trackItemSchema).optional(),
	released: z.string().optional(),
	released_formatted: z.string().optional(),
	year: z.number().int().optional(),
	country: z.string().optional(),
	notes: z.string().optional(),
	identifiers: z.array(identifierSchema).optional(),
	videos: z.array(videoSchema).optional(),
	images: z.array(imageSchema).optional(),
	thumb: z.string().optional(),
	community: z
		.object({
			have: z.number().int().nonnegative().optional(),
			want: z.number().int().nonnegative().optional(),
			rating: communityRatingSchema.optional(),
			status: z.string().optional(),
		})
		.optional(),
	master_id: z.number().int().optional(),
	master_url: z.string().optional(),
	uri: z.string().optional(),
	resource_url: z.string().optional(),
	lowest_price: z.number().nullable().optional(),
	num_for_sale: z.number().int().nonnegative().optional(),
	data_quality: z.string().optional(),
	estimated_weight: z.number().optional(),
})

export const masterSchema = z.object({
	id: z.number().int().positive(),
	title: z.string(),
	main_release: z.number().int().optional(),
	main_release_url: z.string().optional(),
	uri: z.string().optional(),
	resource_url: z.string().optional(),
	versions_url: z.string().optional(),
	artists: z.array(artistCreditSchema).optional(),
	genres: z.array(z.string()).optional(),
	styles: z.array(z.string()).optional(),
	year: z.number().int().optional(),
	tracklist: z.array(trackItemSchema).optional(),
	videos: z.array(videoSchema).optional(),
	images: z.array(imageSchema).optional(),
	num_for_sale: z.number().int().nonnegative().optional(),
	lowest_price: z.number().nullable().optional(),
	data_quality: z.string().optional(),
})

export const masterVersionItemSchema = z.object({
	id: z.number().int().positive(),
	title: z.string().optional(),
	label: z.string().optional(),
	country: z.string().optional(),
	format: z.string().optional(),
	major_formats: z.array(z.string()).optional(),
	catno: z.string().optional(),
	released: z.string().optional(),
	status: z.string().optional(),
	thumb: z.string().optional(),
	stats: z
		.object({
			community: z
				.object({
					in_wantlist: z.number().int().nonnegative().optional(),
					in_collection: z.number().int().nonnegative().optional(),
				})
				.optional(),
			user: z
				.object({
					in_wantlist: z.number().int().optional(),
					in_collection: z.number().int().optional(),
				})
				.optional(),
		})
		.optional(),
})

export const masterVersionsResponseSchema = z.object({
	pagination: paginationSchema,
	versions: z.array(masterVersionItemSchema),
})

export const artistMemberSchema = z.object({
	id: z.number().int().positive(),
	name: z.string(),
	active: z.boolean().optional(),
	resource_url: z.string().optional(),
})

export const artistSchema = z.object({
	id: z.number().int().positive(),
	name: z.string(),
	realname: z.string().optional(),
	profile: z.string().optional(),
	uri: z.string().optional(),
	resource_url: z.string().optional(),
	releases_url: z.string().optional(),
	images: z.array(imageSchema).optional(),
	urls: z.array(z.string()).optional(),
	namevariations: z.array(z.string()).optional(),
	members: z.array(artistMemberSchema).optional(),
	aliases: z.array(artistMemberSchema).optional(),
	data_quality: z.string().optional(),
})

export const artistReleaseItemSchema = z.object({
	id: z.number().int().positive(),
	title: z.string(),
	type: z.enum(['release', 'master']).or(z.string()),
	main_release: z.number().int().optional(),
	artist: z.string().optional(),
	role: z.string().optional(),
	year: z.number().int().optional(),
	thumb: z.string().optional(),
	status: z.string().optional(),
	format: z.string().optional(),
	label: z.string().optional(),
	stats: z
		.object({
			community: z
				.object({
					in_wantlist: z.number().int().nonnegative().optional(),
					in_collection: z.number().int().nonnegative().optional(),
				})
				.optional(),
		})
		.optional(),
})

export const artistReleasesResponseSchema = z.object({
	pagination: paginationSchema,
	releases: z.array(artistReleaseItemSchema),
})

export const sublabelSchema = z.object({
	id: z.number().int().positive(),
	name: z.string(),
	resource_url: z.string().optional(),
})

export const labelSchema = z.object({
	id: z.number().int().positive(),
	name: z.string(),
	profile: z.string().optional(),
	contact_info: z.string().optional(),
	uri: z.string().optional(),
	resource_url: z.string().optional(),
	releases_url: z.string().optional(),
	images: z.array(imageSchema).optional(),
	urls: z.array(z.string()).optional(),
	sublabels: z.array(sublabelSchema).optional(),
	parent_label: sublabelSchema.optional(),
	data_quality: z.string().optional(),
})

export const labelReleaseItemSchema = z.object({
	id: z.number().int().positive(),
	title: z.string(),
	catno: z.string().optional(),
	artist: z.string().optional(),
	format: z.string().optional(),
	year: z.number().int().optional(),
	resource_url: z.string().optional(),
	status: z.string().optional(),
	thumb: z.string().optional(),
})

export const labelReleasesResponseSchema = z.object({
	pagination: paginationSchema,
	releases: z.array(labelReleaseItemSchema),
})

export const searchRequestSchema = paginationParamsSchema.extend({
	q: z.string().optional(),
	type: z.enum(['release', 'master', 'artist', 'label']).optional(),
	title: z.string().optional(),
	release_title: z.string().optional(),
	credit: z.string().optional(),
	artist: z.string().optional(),
	anv: z.string().optional(),
	label: z.string().optional(),
	genre: z.string().optional(),
	style: z.string().optional(),
	country: z.string().optional(),
	year: z.number().int().or(z.string()).optional(),
	format: z.string().optional(),
	catno: z.string().optional(),
	barcode: z.string().optional(),
	track: z.string().optional(),
	submitter: z.string().optional(),
	contributor: z.string().optional(),
})

export const searchResultItemSchema = z.object({
	id: z.number().int().positive(),
	type: z.enum(['release', 'master', 'artist', 'label']).or(z.string()),
	title: z.string(),
	uri: z.string().optional(),
	resource_url: z.string().optional(),
	thumb: z.string().optional(),
	cover_image: z.string().optional(),
	user_data: z
		.object({
			in_wantlist: z.boolean().optional(),
			in_collection: z.boolean().optional(),
		})
		.optional(),
	master_id: z.number().int().optional(),
	master_url: z.string().optional(),
	year: z.string().or(z.number()).optional(),
	format: z.array(z.string()).optional(),
	label: z.array(z.string()).optional(),
	genre: z.array(z.string()).optional(),
	style: z.array(z.string()).optional(),
	country: z.string().optional(),
	catno: z.string().optional(),
	barcode: z.array(z.string()).optional(),
	community: z
		.object({
			want: z.number().int().optional(),
			have: z.number().int().optional(),
		})
		.optional(),
})

export const searchResponseSchema = z.object({
	pagination: paginationSchema,
	results: z.array(searchResultItemSchema),
})

export const releaseRatingResponseSchema = z.object({
	release_id: z.number().int().positive(),
	username: z.string(),
	rating: ratingValueSchema,
})

export const communityRatingResponseSchema = z.object({
	release_id: z.number().int().positive(),
	rating: communityRatingSchema,
})

// Inferred Types
export type DiscogsRelease = z.infer<typeof releaseSchema>
export type DiscogsMaster = z.infer<typeof masterSchema>
export type DiscogsMasterVersionsResponse = z.infer<typeof masterVersionsResponseSchema>
export type DiscogsArtist = z.infer<typeof artistSchema>
export type DiscogsArtistReleasesResponse = z.infer<typeof artistReleasesResponseSchema>
export type DiscogsLabel = z.infer<typeof labelSchema>
export type DiscogsLabelReleasesResponse = z.infer<typeof labelReleasesResponseSchema>
export type DiscogsSearchRequest = z.infer<typeof searchRequestSchema>
export type DiscogsSearchResultItem = z.infer<typeof searchResultItemSchema>
export type DiscogsSearchResponse = z.infer<typeof searchResponseSchema>
export type DiscogsReleaseRatingResponse = z.infer<typeof releaseRatingResponseSchema>
export type DiscogsCommunityRatingResponse = z.infer<typeof communityRatingResponseSchema>
