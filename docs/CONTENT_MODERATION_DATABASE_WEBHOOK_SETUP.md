# Content Moderation: Auto-Moderation Setup

You can enable auto-moderation in either of two ways: **from the codebase** (recommended) or via **Supabase Dashboard** webhooks.

---

## Option A: From the codebase (triggers + config)

1. **Run the migration** that creates triggers and a config table:
   - `supabase/migrations/20260307160000_content_moderation_auto_webhooks.sql`
   - This creates `moderation_webhook_config` and triggers on `posts`, `comments`, and `elections` INSERT.

2. **Enable pg_net** (if not already): In Supabase Dashboard → Database → Extensions → enable **pg_net**.

3. **Turn on auto-moderation** by setting the config (one-time, e.g. in SQL Editor):
   ```sql
   UPDATE public.moderation_webhook_config
   SET base_url = 'https://YOUR_PROJECT_REF.supabase.co',
       enabled = true,
       updated_at = NOW()
   WHERE id = 1;
   ```
   Replace `YOUR_PROJECT_REF` with your project reference (from Project Settings → API → Project URL, without trailing slash).

4. **Optional:** If your Edge function requires the anon key when called from pg_net, set the header:
   ```sql
   UPDATE public.moderation_webhook_config
   SET headers_json = '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
   WHERE id = 1;
   ```

After this, every INSERT into `posts`, `comments`, or `elections` will trigger an async HTTP POST to `content-moderation-trigger`.

---

## Option B: Supabase Dashboard Database Webhooks

To run content moderation **automatically** when users create posts, comments, or elections, you can instead configure **Supabase Database Webhooks** to call the `content-moderation-trigger` Edge function on INSERT.

## Steps

1. **Supabase Dashboard** → your project → **Database** → **Webhooks** (or **Database** → **Webhooks** in the left sidebar).
2. **Create a new webhook** for each table you want to moderate:
   - **posts**
   - **comments**
   - **elections** (optional)

### For each webhook

- **Name:** e.g. `Moderate new posts`
- **Table:** `posts` (or `comments` / `elections`)
- **Events:** **Insert**
- **Type:** **HTTP Request**
- **URL:**  
  `https://<YOUR_PROJECT_REF>.supabase.co/functions/v1/content-moderation-trigger`  
  Replace `<YOUR_PROJECT_REF>` with your Supabase project reference (e.g. from Project Settings → API).
- **HTTP method:** `POST`
- **Headers:**  
  - `Content-Type`: `application/json`  
  - `Authorization`: `Bearer <SUPABASE_ANON_OR_SERVICE_ROLE_KEY>`  
  (Use the anon key for simplicity; the Edge function uses the service role internally. For tighter security, you can use a dedicated secret and verify it in the function.)
- **Payload:** Supabase sends the default webhook payload; the Edge function accepts:
  - `type`: `"INSERT"`
  - `table`: `"posts"` | `"comments"` | `"elections"`
  - `record`: the new row (must include `id` and content fields: `content` / `body` / `text` for posts/comments; `title`, `description`, `question` for elections)

The Edge function already supports this format. If your webhook uses a different shape, ensure the function’s `normalizeBody` logic matches (see `content-moderation-trigger/index.ts`).

## Behaviour after setup

- **Insert** into `posts`, `comments`, or `elections` triggers the webhook → HTTP POST to `content-moderation-trigger`.
- The function runs Claude moderation, writes to `content_moderation_results`, and:
  - If **auto-remove** (confidence ≥ 0.85): updates the row (e.g. `status: 'removed'`), creates a `content_flags` row, and sends a **notification** to the author.
  - If **flagged for review** (confidence ≥ 0.4): creates a `content_flags` row with `status: 'pending_review'` so it appears in the **Content Moderation Control Center** queue.

## Optional: Restrict to specific schemas

In the webhook configuration you can limit to the `public` schema and only the tables above.

## Troubleshooting

- **No moderation running:** Check that the webhook is enabled and the URL is correct; check Edge function logs in Supabase → Edge Functions → `content-moderation-trigger` → Logs.
- **401/403:** Ensure the `Authorization` header uses a valid key (anon or service role).
- **Constraint error on content_moderation_results:** Ensure migration `20260307150000_content_moderation_industry_standard.sql` has been applied so `content_type` allows `'election'`.
