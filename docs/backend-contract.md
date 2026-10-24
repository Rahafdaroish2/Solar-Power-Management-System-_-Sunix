# Proposed backend contract

This document describes an integration boundary, not a deployed backend.
Base URL includes any API version prefix. All private requests use Bearer authentication.
Responses are direct JSON (no `data` wrapper); empty responses use HTTP 204.

| Domain        | Endpoints / payload                                                                                                                  |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Auth          | POST `/auth/login` {email,password}; POST `/auth/register` {name,email,password}; POST `/auth/logout`                                |
| Session       | Login/register return {accessToken, expiresAt: epoch milliseconds, user:{id,name,email}}                                             |
| Profile       | GET/PATCH `/me`                                                                                                                      |
| Chats         | GET/POST `/chats`; GET/DELETE/PATCH `/chats/:id` (PATCH {pinned})                                                                    |
| Messages      | GET/POST `/chats/:id/messages`; POST {text,attachmentIds}; response includes persisted user/assistant messages                       |
| Answers       | PATCH `/chats/:id/messages/:messageId` {text}; POST `/chats/:id/continue` {optionId}                                                 |
| Projects      | GET `/projects`, `/projects/:id`; PUT `/projects/:id/package` {packageId}; GET `/estimate`, `/inspection`, `/stages` under a project |
| Products      | GET `/products` with search/category/filter/cursor query; GET `/products/:id`; GET `/products/categories`                            |
| Maintenance   | GET/POST `/maintenance`; GET `/maintenance/:id`, `/maintenance/:id/history`                                                          |
| Notifications | GET `/notifications`; GET `/notifications/:id`; PUT `/notifications/:id/read`                                                        |
| Uploads       | POST `/uploads`, multipart field `file`; returns {id}                                                                                |

List endpoints should return `{items: [], nextCursor: null}`; services keep the complete response for future pagination hooks. IDs are opaque strings. Prices include currency. All timestamps except session expiry are ISO 8601. Maintenance create takes `{type:'sunix',projectId,description,attachmentIds}` or `{type:'external',system:{location,description},description,attachmentIds}`.

Server must enforce ownership, allowed file types and sizes, authorization, pagination limits, AI rate limits and cleanup of orphaned uploads. Client route guards are only a UI boundary. HTTP 401 clears the matching active session; 422 exposes field details to the form hook; cancellation/network/timeout/upload errors have stable codes. Automatic mutation retries are disabled to avoid duplicate submissions. Streaming, token refresh and push registration require an explicit backend contract before implementation.
