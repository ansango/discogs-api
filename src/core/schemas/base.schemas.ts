import { z } from 'zod'

export const paginationParamsSchema = z.object({
	page: z.number().int().positive().optional(),
	per_page: z.number().int().min(1).max(100).optional(),
})

export const paginationUrlsSchema = z.object({
	first: z.string().optional(),
	prev: z.string().optional(),
	next: z.string().optional(),
	last: z.string().optional(),
})

export const paginationSchema = z.object({
	page: z.number().int().nonnegative(),
	pages: z.number().int().nonnegative(),
	per_page: z.number().int().nonnegative(),
	items: z.number().int().nonnegative(),
	urls: paginationUrlsSchema.optional(),
})

export const imageSchema = z.object({
	type: z.enum(['primary', 'secondary']).or(z.string()).optional(),
	uri: z.string().optional(),
	resource_url: z.string().optional(),
	uri150: z.string().optional(),
	width: z.number().int().optional(),
	height: z.number().int().optional(),
})

export const videoSchema = z.object({
	uri: z.string().optional(),
	title: z.string().optional(),
	description: z.string().optional(),
	duration: z.number().int().optional(),
	embed: z.boolean().optional(),
})

export const identifierSchema = z.object({
	type: z.string().optional(),
	value: z.string().optional(),
	description: z.string().optional(),
})

export const companySchema = z.object({
	id: z.number().int().optional(),
	name: z.string().optional(),
	catno: z.string().optional(),
	entity_type: z.string().optional(),
	entity_type_name: z.string().optional(),
	resource_url: z.string().optional(),
})

export const artistCreditSchema = z.object({
	id: z.number().int().optional(),
	name: z.string().optional(),
	join: z.string().optional(),
	anv: z.string().optional(),
	tracks: z.string().optional(),
	role: z.string().optional(),
	resource_url: z.string().optional(),
})

export const trackItemSchema = z.object({
	position: z.string().optional(),
	type_: z.string().optional(),
	title: z.string().optional(),
	duration: z.string().optional(),
	extraartists: z.array(artistCreditSchema).optional(),
	artists: z.array(artistCreditSchema).optional(),
})

export const communityRatingSchema = z.object({
	count: z.number().int().nonnegative().optional(),
	average: z.number().nonnegative().optional(),
})

export const releaseFormatSchema = z.object({
	name: z.string().optional(),
	qty: z.string().optional(),
	text: z.string().optional(),
	descriptions: z.array(z.string()).optional(),
})

export const releaseLabelSchema = z.object({
	id: z.number().int().optional(),
	name: z.string().optional(),
	catno: z.string().optional(),
	entity_type: z.string().optional(),
	resource_url: z.string().optional(),
})

export const ratingValueSchema = z.number().int().min(0).max(5)

// Inferred Types
export type PaginationParams = z.infer<typeof paginationParamsSchema>
export type Pagination = z.infer<typeof paginationSchema>
export type DiscogsImage = z.infer<typeof imageSchema>
export type DiscogsVideo = z.infer<typeof videoSchema>
export type DiscogsIdentifier = z.infer<typeof identifierSchema>
export type DiscogsCompany = z.infer<typeof companySchema>
export type DiscogsArtistCredit = z.infer<typeof artistCreditSchema>
export type DiscogsTrack = z.infer<typeof trackItemSchema>
export type DiscogsCommunityRating = z.infer<typeof communityRatingSchema>
export type DiscogsReleaseFormat = z.infer<typeof releaseFormatSchema>
export type DiscogsReleaseLabel = z.infer<typeof releaseLabelSchema>
