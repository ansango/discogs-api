import { z } from 'zod'
import { collectionBasicInformationSchema } from '../collection/schemas.js'
import { paginationParamsSchema, paginationSchema, ratingValueSchema } from '../core/schemas/base.schemas.js'

export const wantlistItemSchema = z.object({
	id: z.number().int().positive(),
	rating: ratingValueSchema.optional(),
	notes: z.string().optional(),
	basic_information: collectionBasicInformationSchema,
	date_added: z.string().optional(),
	resource_url: z.string().optional(),
})

export const wantlistResponseSchema = z.object({
	pagination: paginationSchema,
	wants: z.array(wantlistItemSchema),
})

export const wantlistParamsSchema = paginationParamsSchema.extend({
	sort: z.enum(['label', 'artist', 'title', 'catno', 'format', 'rating', 'added', 'year']).optional(),
	sort_order: z.enum(['asc', 'desc']).optional(),
})

export const addToWantlistRequestSchema = z.object({
	notes: z.string().optional(),
	rating: ratingValueSchema.optional(),
})

// Inferred types
export type DiscogsWantlistItem = z.infer<typeof wantlistItemSchema>
export type DiscogsWantlistResponse = z.infer<typeof wantlistResponseSchema>
export type DiscogsWantlistParams = z.infer<typeof wantlistParamsSchema>
export type DiscogsAddToWantlistRequest = z.infer<typeof addToWantlistRequestSchema>
