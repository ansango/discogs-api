import { paginationParamsSchema, paginationSchema } from '@/core/schemas/base.schemas.js'
import { z } from 'zod'

export const userListSummarySchema = z.object({
	id: z.number().int().positive(),
	name: z.string(),
	description: z.string().optional(),
	public: z.boolean().optional(),
	uri: z.string().optional(),
	resource_url: z.string().optional(),
	image_url: z.string().optional(),
	date_added: z.string().optional(),
	date_changed: z.string().optional(),
})

export const userListsResponseSchema = z.object({
	pagination: paginationSchema,
	lists: z.array(userListSummarySchema),
})

export const listItemDetailSchema = z.object({
	id: z.number().int().positive(),
	type: z.enum(['release', 'master', 'artist', 'label']).or(z.string()),
	display_title: z.string(),
	comment: z.string().optional(),
	image_url: z.string().optional(),
	uri: z.string().optional(),
	resource_url: z.string().optional(),
})

export const listDetailsSchema = z.object({
	id: z.number().int().positive(),
	name: z.string(),
	description: z.string().optional(),
	public: z.boolean().optional(),
	uri: z.string().optional(),
	resource_url: z.string().optional(),
	items: z.array(listItemDetailSchema),
})

// Inferred types
export type DiscogsUserListSummary = z.infer<typeof userListSummarySchema>
export type DiscogsUserListsResponse = z.infer<typeof userListsResponseSchema>
export type DiscogsListItemDetail = z.infer<typeof listItemDetailSchema>
export type DiscogsListDetails = z.infer<typeof listDetailsSchema>
