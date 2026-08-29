# Discogs API v2 Coverage Matrix

This matrix tracks coverage of the official [Discogs API v2](https://www.discogs.com/developers) endpoints within `@ansango/discogs-api`.

## Summary
- **Total Canonical Methods:** 47
- **Implemented:** 47 (100%)
- **Test Coverage:** 100% deterministic unit tests with 0 network egress

---

## 1. Database & Catalog

| Method Name | HTTP Method | Endpoint | Auth Required | Implemented |
| :--- | :--- | :--- | :---: | :---: |
| `database.getRelease` | `GET` | `/releases/{release_id}` | No | ✅ |
| `database.getReleaseRating` | `GET` | `/releases/{release_id}/rating/{username}` | Yes | ✅ |
| `database.setReleaseRating` | `PUT` | `/releases/{release_id}/rating/{username}` | Yes | ✅ |
| `database.deleteReleaseRating` | `DELETE` | `/releases/{release_id}/rating/{username}` | Yes | ✅ |
| `database.getReleaseCommunityRating` | `GET` | `/releases/{release_id}/rating` | No | ✅ |
| `database.getMaster` | `GET` | `/masters/{master_id}` | No | ✅ |
| `database.getMasterVersions` | `GET` | `/masters/{master_id}/versions` | No | ✅ |
| `database.getArtist` | `GET` | `/artists/{artist_id}` | No | ✅ |
| `database.getArtistReleases` | `GET` | `/artists/{artist_id}/releases` | No | ✅ |
| `database.getLabel` | `GET` | `/labels/{label_id}` | No | ✅ |
| `database.getLabelReleases` | `GET` | `/labels/{label_id}/releases` | No | ✅ |
| `database.search` | `GET` | `/database/search` | Yes | ✅ |

---

## 2. User Collection

| Method Name | HTTP Method | Endpoint | Auth Required | Implemented |
| :--- | :--- | :--- | :---: | :---: |
| `collection.getFolders` | `GET` | `/users/{username}/collection/folders` | No | ✅ |
| `collection.getFolder` | `GET` | `/users/{username}/collection/folders/{folder_id}` | No | ✅ |
| `collection.createFolder` | `POST` | `/users/{username}/collection/folders` | Yes | ✅ |
| `collection.updateFolder` | `POST` | `/users/{username}/collection/folders/{folder_id}` | Yes | ✅ |
| `collection.deleteFolder` | `DELETE` | `/users/{username}/collection/folders/{folder_id}` | Yes | ✅ |
| `collection.getCollectionValue` | `GET` | `/users/{username}/collection/value` | Yes | ✅ |
| `collection.getFields` | `GET` | `/users/{username}/collection/fields` | No | ✅ |
| `collection.getReleases` | `GET` | `/users/{username}/collection/folders/{folder_id}/releases` | No | ✅ |
| `collection.addRelease` | `POST` | `/users/{username}/collection/folders/{folder_id}/releases/{release_id}` | Yes | ✅ |
| `collection.deleteRelease` | `DELETE` | `/users/{username}/collection/folders/{folder_id}/releases/{release_id}/instances/{instance_id}` | Yes | ✅ |
| `collection.editCustomField` | `POST` | `/users/{username}/collection/folders/{folder_id}/releases/{release_id}/instances/{instance_id}/fields/{field_id}` | Yes | ✅ |

---

## 3. User Wantlist

| Method Name | HTTP Method | Endpoint | Auth Required | Implemented |
| :--- | :--- | :--- | :---: | :---: |
| `wantlist.getWantlist` | `GET` | `/users/{username}/wants` | No | ✅ |
| `wantlist.addRelease` | `PUT` | `/users/{username}/wants/{release_id}` | Yes | ✅ |
| `wantlist.updateRelease` | `POST` | `/users/{username}/wants/{release_id}` | Yes | ✅ |
| `wantlist.deleteRelease` | `DELETE` | `/users/{username}/wants/{release_id}` | Yes | ✅ |

---

## 4. User Identity & Profiles

| Method Name | HTTP Method | Endpoint | Auth Required | Implemented |
| :--- | :--- | :--- | :---: | :---: |
| `user.getIdentity` | `GET` | `/oauth/identity` | Yes | ✅ |
| `user.getProfile` | `GET` | `/users/{username}` | No | ✅ |
| `user.updateProfile` | `POST` | `/users/{username}` | Yes | ✅ |
| `user.getSubmissions` | `GET` | `/users/{username}/submissions` | No | ✅ |
| `user.getContributions` | `GET` | `/users/{username}/contributions` | No | ✅ |

---

## 5. Marketplace

| Method Name | HTTP Method | Endpoint | Auth Required | Implemented |
| :--- | :--- | :--- | :---: | :---: |
| `marketplace.getListing` | `GET` | `/marketplace/listings/{listing_id}` | No | ✅ |
| `marketplace.createListing` | `POST` | `/marketplace/listings` | Yes | ✅ |
| `marketplace.updateListing` | `POST` | `/marketplace/listings/{listing_id}` | Yes | ✅ |
| `marketplace.deleteListing` | `DELETE` | `/marketplace/listings/{listing_id}` | Yes | ✅ |
| `marketplace.getInventory` | `GET` | `/users/{username}/inventory` | No | ✅ |
| `marketplace.getOrder` | `GET` | `/marketplace/orders/{order_id}` | Yes | ✅ |
| `marketplace.updateOrder` | `POST` | `/marketplace/orders/{order_id}` | Yes | ✅ |
| `marketplace.listOrders` | `GET` | `/marketplace/orders` | Yes | ✅ |
| `marketplace.getPriceSuggestions` | `GET` | `/marketplace/price_suggestions/{release_id}` | Yes | ✅ |
| `marketplace.getFee` | `GET` | `/marketplace/fee/{price}` | No | ✅ |

---

## 6. Lists

| Method Name | HTTP Method | Endpoint | Auth Required | Implemented |
| :--- | :--- | :--- | :---: | :---: |
| `lists.getUserLists` | `GET` | `/users/{username}/lists` | No | ✅ |
| `lists.getList` | `GET` | `/lists/{list_id}` | No | ✅ |

---

## 7. Authentication Helpers

| Method Name | HTTP Method | Endpoint | Auth Required | Implemented |
| :--- | :--- | :--- | :---: | :---: |
| `auth.getRequestToken` | `POST` | `/oauth/request_token` | Yes (OAuth) | ✅ |
| `auth.getAuthorizeUrl` | Sync helper | `https://discogs.com/oauth/authorize` | No | ✅ |
| `auth.getAccessToken` | `POST` | `/oauth/access_token` | Yes (OAuth) | ✅ |
