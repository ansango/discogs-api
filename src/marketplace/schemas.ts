import { z } from 'zod'
import { paginationParamsSchema, paginationSchema } from '../core/schemas/base.schemas.js'

export const listingConditionEnum = z.enum([
	'Mint (M)',
	'Near Mint (NM or M-)',
	'Very Good Plus (VG+)',
	'Very Good (VG)',
	'Good Plus (G+)',
	'Good (G)',
	'Fair (F)',
	'Poor (P)',
])

export const listingSleeveConditionEnum = z.enum([
	'Mint (M)',
	'Near Mint (NM or M-)',
	'Very Good Plus (VG+)',
	'Very Good (VG)',
	'Good Plus (G+)',
	'Good (G)',
	'Fair (F)',
	'Poor (P)',
	'Generic',
	'No Cover',
])

export const listingPriceSchema = z.object({
	currency: z.string(),
	value: z.number().nonnegative(),
})

export const listingSellerSchema = z.object({
	id: z.number().int().positive().optional(),
	username: z.string(),
	avatar_url: z.string().optional(),
	rating: z.string().or(z.number()).optional(),
	resource_url: z.string().optional(),
})

export const listingReleaseSchema = z.object({
	id: z.number().int().positive(),
	description: z.string().optional(),
	year: z.number().int().optional(),
	artist: z.string().optional(),
	format: z.string().optional(),
	resource_url: z.string().optional(),
	thumbnail: z.string().optional(),
})

export const listingSchema = z.object({
	id: z.number().int().positive(),
	status: z.enum(['For Sale', 'Draft', 'Expired', 'Sold', 'Suspended', 'Pending']).or(z.string()),
	price: listingPriceSchema,
	condition: z.string(),
	sleeve_condition: z.string().optional(),
	comments: z.string().optional(),
	allow_offers: z.boolean().optional(),
	audio: z.boolean().optional(),
	posted: z.string().optional(),
	ships_from: z.string().optional(),
	uri: z.string().optional(),
	resource_url: z.string().optional(),
	seller: listingSellerSchema.optional(),
	release: listingReleaseSchema.optional(),
})

export const createListingRequestSchema = z.object({
	release_id: z.number().int().positive(),
	condition: listingConditionEnum.or(z.string()),
	price: z.number().positive(),
	status: z.enum(['For Sale', 'Draft']).optional(),
	sleeve_condition: listingSleeveConditionEnum.or(z.string()).optional(),
	comments: z.string().optional(),
	allow_offers: z.boolean().optional(),
	external_id: z.string().optional(),
	location: z.string().optional(),
	weight: z.number().optional(),
	format_quantity: z.number().int().optional(),
})

export const updateListingRequestSchema = createListingRequestSchema.partial().extend({
	status: z.enum(['For Sale', 'Draft', 'Expired', 'Sold', 'Suspended', 'Pending']).optional(),
})

export const inventoryParamsSchema = paginationParamsSchema.extend({
	status: z.enum(['For Sale', 'Draft', 'Expired', 'Sold', 'Suspended', 'Pending']).optional(),
	sort: z.enum(['listed', 'price', 'item', 'artist', 'label', 'catno', 'audio', 'status']).optional(),
	sort_order: z.enum(['asc', 'desc']).optional(),
})

export const inventoryResponseSchema = z.object({
	pagination: paginationSchema,
	listings: z.array(listingSchema),
})

export const orderItemSchema = z.object({
	id: z.number().int().positive(),
	release: listingReleaseSchema.optional(),
	price: listingPriceSchema,
	media_condition: z.string().optional(),
	sleeve_condition: z.string().optional(),
})

export const orderSchema = z.object({
	id: z.string(),
	status: z.string(),
	next_status: z.array(z.string()).optional(),
	fee: listingPriceSchema.optional(),
	created: z.string().optional(),
	items: z.array(orderItemSchema).optional(),
	shipping_address: z.string().optional(),
	additional_instructions: z.string().optional(),
	seller: listingSellerSchema.optional(),
	buyer: listingSellerSchema.optional(),
	total: listingPriceSchema.optional(),
	tracking_number: z.string().optional(),
	resource_url: z.string().optional(),
})

export const ordersResponseSchema = z.object({
	pagination: paginationSchema,
	orders: z.array(orderSchema),
})

export const priceSuggestionItemSchema = z.object({
	currency: z.string(),
	value: z.number().nonnegative(),
})

export const priceSuggestionsResponseSchema = z.record(z.string(), priceSuggestionItemSchema.optional())

export const feeResponseSchema = z.object({
	currency: z.string(),
	value: z.number().nonnegative(),
})

// Inferred types
export type DiscogsListing = z.infer<typeof listingSchema>
export type DiscogsCreateListingRequest = z.infer<typeof createListingRequestSchema>
export type DiscogsUpdateListingRequest = z.infer<typeof updateListingRequestSchema>
export type DiscogsInventoryParams = z.infer<typeof inventoryParamsSchema>
export type DiscogsInventoryResponse = z.infer<typeof inventoryResponseSchema>
export type DiscogsOrder = z.infer<typeof orderSchema>
export type DiscogsOrdersResponse = z.infer<typeof ordersResponseSchema>
export type DiscogsPriceSuggestionsResponse = z.infer<typeof priceSuggestionsResponseSchema>
export type DiscogsFeeResponse = z.infer<typeof feeResponseSchema>
