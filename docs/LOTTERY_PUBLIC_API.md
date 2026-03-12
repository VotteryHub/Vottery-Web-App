# Lottery / Gamification Public API

This document describes the public Edge-function API for the integrated lottery (gamification) system: ticket verification, draw initiation, and audit logs. Webhooks for `draw_completed` and `vote_cast` are also supported.

## Base URL

```
https://YOUR_PROJECT_REF.supabase.co/functions/v1
```

Use the Supabase anon or service_role key in the `Authorization: Bearer` header.

---

## Endpoints

### 1. Verify ticket (Voter ID)

**GET/POST** `/tickets-verify`

Verifies a lottery ticket (Voter ID) for a given election.

- **Query/body:** `election_id`, `ticket_id` (or `voter_id`)
- **Response:** `{ valid: boolean, vote_id?, election_id?, ... }`

### 2. Initiate draw

**POST** `/draws-initiate`

Runs the gamified draw for an election (selects lucky winners). Typically invoked by cron at election end time or by admin.

- **Body:** `{ election_id: string }`
- **Response:** `{ ok: boolean, winners?: [...], ... }`
- **Side effect:** Dispatches `draw_completed` to all registered webhooks (see Webhooks below).

### 3. Audit logs

**GET** `/audit-logs`

Returns audit log entries for verification (hash chain, timestamps).

- **Query:** `election_id?`, `limit?`, `offset?`
- **Response:** `{ data: [...], ... }`

---

## Webhooks

Register webhook URLs in the **Webhook Management** panel (RESTful API Management Center). Supported events:

| Event           | Description |
|----------------|-------------|
| `draw_completed` | Fired when a gamified draw completes; payload includes election_id, winners, timestamp. |
| `vote_cast`      | Fired when a user casts a vote (ticket created); payload includes election_id, vote_id, user_id, timestamp. |

- **Dispatch:** The platform calls your URL with `POST` and a JSON body: `{ event, election_id, timestamp, ...payload }`.
- **Headers:** `X-Vottery-Event`, `X-Vottery-Timestamp`, `X-Vottery-Attempt` (for retries).
- **Retries:** Exponential backoff (e.g. 1s, 2s, 4s, 8s, 16s) on 5xx or network failure.

---

## Webhook dispatcher (internal)

**POST** `/webhook-dispatcher`

Used internally to fan-out events to registered webhooks. Body:

```json
{
  "event": "draw_completed" | "vote_cast",
  "election_id": "uuid",
  "payload": { ... }
}
```

Only registered webhooks that subscribe to the given `event` (in `webhook_config.events`) receive the request.

---

## Related

- **Vote cast:** When a user votes, the client calls `webhook-dispatcher` with `event: 'vote_cast'` so partners receive the event.
- **Draw:** `draws-initiate` Edge function runs the RNG-based winner selection and then calls `webhook-dispatcher` with `event: 'draw_completed'`.
- **Tables:** `webhook_config`, `webhook_delivery_logs` (see migrations).
