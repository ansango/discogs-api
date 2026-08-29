# @ansango/discogs-api

[![npm version](https://img.shields.io/npm/v/@ansango/discogs-api.svg)](https://www.npmjs.com/package/@ansango/discogs-api)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

> Modern, zero-dependency, type-safe TypeScript SDK for the **Discogs API v2**. Built with **Zod**, full **OAuth 1.0a** & **Personal Access Token** support, automatic **Rate Limiting** (Token Bucket), and modular subpath exports.

---

## ✨ Features

- 🎯 **100% API Coverage**: Complete implementation of all 47 canonical Discogs API v2 endpoints across Database, Collection, Wantlist, Marketplace, User, and Lists.
- 🔒 **Type-Safe Validation**: Every request and response schema is validated with [Zod](https://zod.dev) with full static TypeScript inference.
- ⚡ **Zero External Transport Dependencies**: Pure standard `fetch` — runs seamlessly in Node.js (>= 20), Bun, Deno, and Edge environments.
- 🔑 **Multiple Auth Strategies**:
  - Personal Access Token (`Authorization: Discogs token=...`).
  - Consumer Key & Secret (`Authorization: Discogs key=..., secret=...`).
  - 3-Legged OAuth 1.0a (Request Token → Authorization → Access Token with HMAC-SHA1 signature).
- ⏱️ **Transparent Rate Limiting**: Built-in Token Bucket rate limiter observing Discogs `X-Discogs-Ratelimit` and `X-Discogs-Ratelimit-Remaining` headers (60 req/min).
- 📦 **Modular Subpath Exports**: Import the full client or only the specific namespaces you need (`@ansango/discogs-api/database`, `@ansango/discogs-api/collection`, etc.).
- 🪐 **Interactive OpenAPI Explorer**: Run local Scalar docs with live mock/proxy on `localhost:3000`.

---

## 📦 Installation

```bash
# npm
npm install @ansango/discogs-api zod

# bun
bun add @ansango/discogs-api zod

# pnpm
pnpm add @ansango/discogs-api zod
```

---

## 🚀 Quick Start

### 1. Using Personal Access Token (Recommended)

Generate your token at [Discogs Developer Settings](https://www.discogs.com/settings/developers).

```typescript
import { DiscogsClient } from '@ansango/discogs-api'

const client = new DiscogsClient({
  userAgent: 'MyVinylTracker/1.0.0 (+https://mywebsite.com)',
  userToken: process.env.DISCOGS_USER_TOKEN,
})

// Search the database
const searchResults = await client.database.search({
  q: 'Radiohead In Rainbows',
  type: 'release',
})
console.log(`Found ${searchResults.pagination.items} releases!`)

// Fetch release details
const release = await client.database.getRelease(1174296)
console.log(`${release.title} (${release.year}) - Lowest Price: $${release.lowest_price}`)
```

### 2. Global Configuration via Environment Variables

Set environment variables:
```bash
DISCOGS_USER_AGENT="MyVinylTracker/1.0.0 (+https://mywebsite.com)"
DISCOGS_USER_TOKEN="your_personal_access_token"
```

```typescript
import { createClient } from '@ansango/discogs-api'

const client = createClient()
const identity = await client.user.getIdentity()
console.log(`Authenticated as: ${identity.username}`)
```

---

## 🔐 Authentication Strategies

### Strategy A: Personal Access Token
```typescript
const client = new DiscogsClient({
  userAgent: 'MyApp/1.0.0',
  userToken: 'YOUR_TOKEN',
})
```

### Strategy B: Consumer Key & Secret
```typescript
const client = new DiscogsClient({
  userAgent: 'MyApp/1.0.0',
  consumerKey: 'YOUR_KEY',
  consumerSecret: 'YOUR_SECRET',
})
```

### Strategy C: 3-Legged OAuth 1.0a

```typescript
const client = new DiscogsClient({
  userAgent: 'MyApp/1.0.0',
  consumerKey: 'YOUR_KEY',
  consumerSecret: 'YOUR_SECRET',
})

// Step 1: Obtain Request Token
const reqToken = await client.auth.getRequestToken('https://myapp.com/callback')
console.log('Redirect user to:', reqToken.authorize_url)

// Step 2: In callback endpoint (user authorized and provided verifier)
const accessToken = await client.auth.getAccessToken(
  reqToken.oauth_token,
  reqToken.oauth_token_secret,
  callbackVerifier,
)

// Step 3: Instantiate authenticated client with OAuth tokens
const userClient = new DiscogsClient({
  userAgent: 'MyApp/1.0.0',
  consumerKey: 'YOUR_KEY',
  consumerSecret: 'YOUR_SECRET',
  oauthToken: accessToken.oauth_token,
  oauthTokenSecret: accessToken.oauth_token_secret,
})

const user = await userClient.user.getIdentity()
console.log('Logged in as:', user.username)
```

---

## 📚 Service Reference

### 1. Database (`client.database`)
- `getRelease(releaseId, curr_abbr?)`
- `getReleaseRating(releaseId, username)` / `setReleaseRating()` / `deleteReleaseRating()`
- `getReleaseCommunityRating(releaseId)`
- `getMaster(masterId)` / `getMasterVersions(masterId, params?)`
- `getArtist(artistId)` / `getArtistReleases(artistId, params?)`
- `getLabel(labelId)` / `getLabelReleases(labelId, params?)`
- `search(params)`: Rich search supporting `q`, `type`, `artist`, `release_title`, `barcode`, `year`, `genre`, `style`, `country`, `format`, `catno`, etc.

### 2. Collection (`client.collection`)
- `getFolders(username)` / `getFolder(username, folderId)`
- `createFolder(username, name)` / `updateFolder()` / `deleteFolder()`
- `getCollectionValue(username)`: Valuation summary (minimum, median, maximum).
- `getFields(username)`: Custom collection fields.
- `getReleases(username, folderId?, params?)`: Items in folder.
- `addRelease(username, folderId, releaseId)`: Add release to folder.
- `deleteRelease(username, folderId, releaseId, instanceId)`: Remove release instance.
- `editCustomField(username, folderId, releaseId, instanceId, fieldId, value)`

### 3. Wantlist (`client.wantlist`)
- `getWantlist(username, params?)`
- `addRelease(username, releaseId, options?)`
- `updateRelease(username, releaseId, options)`
- `deleteRelease(username, releaseId)`

### 4. Marketplace (`client.marketplace`)
- `getListing(listingId, curr_abbr?)`
- `createListing(data)` / `updateListing()` / `deleteListing()`
- `getInventory(username, params?)`
- `getOrder(orderId)` / `updateOrder()` / `listOrders(params?)`
- `getPriceSuggestions(releaseId)`: Market price suggestions.
- `getFee(price, currency?)`: Calculate marketplace selling fee.

### 5. User Profiles (`client.user`)
- `getIdentity()`: Authenticated identity.
- `getProfile(username)` / `updateProfile(username, data)`
- `getSubmissions(username, params?)`
- `getContributions(username, params?)`

### 6. Lists (`client.lists`)
- `getUserLists(username, params?)`
- `getList(listId)`

---

## 📦 Modular Subpath Imports

```typescript
// Full Client
import { DiscogsClient } from '@ansango/discogs-api'

// Direct domain services
import { createDatabaseService } from '@ansango/discogs-api/database'
import { createCollectionService } from '@ansango/discogs-api/collection'
import { createMarketplaceService } from '@ansango/discogs-api/marketplace'

// Direct Zod schemas & TypeScript types
import { releaseSchema, type DiscogsRelease } from '@ansango/discogs-api/database/schemas'
import { collectionFolderSchema, type DiscogsCollectionFolder } from '@ansango/discogs-api/collection/schemas'
```

---

## 🛠️ Local Interactive Docs Explorer

Run the local OpenAPI + Scalar documentation tool:

```bash
bun run tool:dev
```
Open **http://localhost:3000** to interactively browse and test all endpoints.

---

## 🧪 Testing

```bash
bun test        # Deterministic unit tests (0 network egress)
bun run typecheck # Strict TypeScript check
bun run lint      # Biome linter check
```

---

## 📄 License

MIT © [ansango](https://github.com/ansango)
