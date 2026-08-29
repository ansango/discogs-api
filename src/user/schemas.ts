import { z } from 'zod'
import { paginationParamsSchema, paginationSchema } from '../core/schemas/base.schemas.js'

export const userIdentitySchema = z.object({
	id: z.number().int().positive(),
	username: z.string(),
	resource_url: z.string(),
	consumer_name: z.string().optional(),
})

export const userProfileSchema = z.object({
	id: z.number().int().positive(),
	username: z.string(),
	name: z.string().optional(),
	email: z.string().email().optional(),
	avatar_url: z.string().optional(),
	banner_url: z.string().optional(),
	profile: z.string().optional(),
	location: z.string().optional(),
	home_page: z.string().optional(),
	registered: z.string().optional(),
	num_collection: z.number().int().nonnegative().optional(),
	num_wantlist: z.number().int().nonnegative().optional(),
	num_pending: z.number().int().nonnegative().optional(),
	num_for_sale: z.number().int().nonnegative().optional(),
	releases_contributed: z.number().int().nonnegative().optional(),
	releases_rated: z.number().int().nonnegative().optional(),
	rating_avg: z.number().nonnegative().optional(),
	inventory_url: z.string().optional(),
	collection_folders_url: z.string().optional(),
	wantlist_url: z.string().optional(),
	uri: z.string().optional(),
	resource_url: z.string().optional(),
})

export const updateUserProfileRequestSchema = z.object({
	name: z.string().optional(),
	home_page: z.string().optional(),
	location: z.string().optional(),
	profile: z.string().optional(),
	curr_abbr: z.string().optional(),
})

export const userSubmissionItemSchema = z.object({
	id: z.number().int().positive(),
	title: z.string(),
	status: z.string().optional(),
	format: z.string().optional(),
	artist: z.string().optional(),
	year: z.number().int().optional(),
	thumb: z.string().optional(),
	resource_url: z.string().optional(),
})

export const userSubmissionsResponseSchema = z.object({
	pagination: paginationSchema,
	submissions: z.array(userSubmissionItemSchema),
})

export const userContributionsResponseSchema = z.object({
	pagination: paginationSchema,
	contributions: z.array(userSubmissionItemSchema),
})

export const userSubmissionsParamsSchema = paginationParamsSchema.extend({
	sort: z.enum(['year', 'title', 'format']).optional(),
	sort_order: z.enum(['asc', 'desc']).optional(),
})

// Inferred types
export type DiscogsUserIdentity = z.infer<typeof userIdentitySchema>
export type DiscogsUserProfile = z.infer<typeof userProfileSchema>
export type DiscogsUpdateUserProfileRequest = z.infer<typeof updateUserProfileRequestSchema>
export type DiscogsUserSubmissionsResponse = z.infer<typeof userSubmissionsResponseSchema>
export type DiscogsUserContributionsResponse = z.infer<typeof userContributionsResponseSchema>
export type DiscogsUserSubmissionsParams = z.infer<typeof userSubmissionsParamsSchema>
