import {
	artistCreditSchema,
	companySchema,
	paginationParamsSchema,
	paginationSchema,
	ratingValueSchema,
	releaseFormatSchema,
	releaseLabelSchema,
} from '@/core/schemas/base.schemas.js'
import { z } from 'zod'

export const collectionFolderSchema = z.object({
	id: z.number().int(),
	count: z.number().int().nonnegative(),
	name: z.string(),
	resource_url: z.string(),
})

export const collectionFoldersResponseSchema = z.object({
	folders: z.array(collectionFolderSchema),
})

export const collectionValueResponseSchema = z.object({
	minimum: z.string().optional(),
	median: z.string().optional(),
	maximum: z.string().optional(),
})

export const collectionCustomFieldSchema = z.object({
	id: z.number().int().positive(),
	name: z.string(),
	position: z.number().int().optional(),
	type: z.enum(['dropdown', 'textarea', 'text']).or(z.string()),
	public: z.boolean().optional(),
	lines: z.number().int().optional(),
	options: z.array(z.string()).optional(),
})

export const collectionFieldsResponseSchema = z.object({
	fields: z.array(collectionCustomFieldSchema),
})

export const collectionBasicInformationSchema = z.object({
	id: z.number().int().positive(),
	title: z.string(),
	year: z.number().int().optional(),
	resource_url: z.string().optional(),
	thumb: z.string().optional(),
	cover_image: z.string().optional(),
	formats: z.array(releaseFormatSchema).optional(),
	labels: z.array(releaseLabelSchema).optional(),
	artists: z.array(artistCreditSchema).optional(),
	genres: z.array(z.string()).optional(),
	styles: z.array(z.string()).optional(),
})

export const collectionReleaseItemSchema = z.object({
	id: z.number().int().positive(),
	instance_id: z.number().int().positive(),
	folder_id: z.number().int().nonnegative().optional(),
	rating: ratingValueSchema.optional(),
	basic_information: collectionBasicInformationSchema,
	notes: z
		.array(
			z.object({
				field_id: z.number().int(),
				value: z.string(),
			}),
		)
		.optional(),
	date_added: z.string().optional(),
})

export const collectionReleasesResponseSchema = z.object({
	pagination: paginationSchema,
	releases: z.array(collectionReleaseItemSchema),
})

export const addReleaseToFolderResponseSchema = z.object({
	instance_id: z.number().int().positive(),
	resource_url: z.string(),
})

export const collectionReleasesParamsSchema = paginationParamsSchema.extend({
	sort: z.enum(['label', 'artist', 'title', 'catno', 'format', 'rating', 'added', 'year']).optional(),
	sort_order: z.enum(['asc', 'desc']).optional(),
})

// Inferred types
export type DiscogsCollectionFolder = z.infer<typeof collectionFolderSchema>
export type DiscogsCollectionFoldersResponse = z.infer<typeof collectionFoldersResponseSchema>
export type DiscogsCollectionValueResponse = z.infer<typeof collectionValueResponseSchema>
export type DiscogsCollectionCustomField = z.infer<typeof collectionCustomFieldSchema>
export type DiscogsCollectionFieldsResponse = z.infer<typeof collectionFieldsResponseSchema>
export type DiscogsCollectionReleaseItem = z.infer<typeof collectionReleaseItemSchema>
export type DiscogsCollectionReleasesResponse = z.infer<typeof collectionReleasesResponseSchema>
export type DiscogsAddReleaseToFolderResponse = z.infer<typeof addReleaseToFolderResponseSchema>
export type DiscogsCollectionReleasesParams = z.infer<typeof collectionReleasesParamsSchema>
