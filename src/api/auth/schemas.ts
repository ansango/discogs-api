import { z } from 'zod'

export const requestTokenResponseSchema = z.object({
	oauth_token: z.string(),
	oauth_token_secret: z.string(),
	oauth_callback_confirmed: z.string().or(z.boolean()).optional(),
	authorize_url: z.string().url(),
})

export const accessTokenResponseSchema = z.object({
	oauth_token: z.string(),
	oauth_token_secret: z.string(),
})

// Inferred types
export type DiscogsRequestTokenResponse = z.infer<typeof requestTokenResponseSchema>
export type DiscogsAccessTokenResponse = z.infer<typeof accessTokenResponseSchema>
