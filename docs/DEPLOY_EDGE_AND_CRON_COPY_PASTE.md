# Deploy Edge Function + Schedule + Migrations (Copy-Paste)

## Part 1: Run this migration first (if not already applied)

Run in **Supabase Dashboard → SQL Editor** (or `psql`). Creates the table the Edge function writes to.

```sql
-- Creator prize compliance: flag creators who have not distributed prizes after election end
-- Used for red-flag/blacklist when creator fails to send prizes to lucky voters

CREATE TABLE IF NOT EXISTS public.creator_prize_compliance_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  election_id UUID NOT NULL REFERENCES public.elections(id) ON DELETE CASCADE,
  flag_type TEXT NOT NULL DEFAULT 'unpaid_prize' CHECK (flag_type IN ('unpaid_prize', 'partial', 'resolved')),
  flagged_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(election_id)
);

COMMENT ON TABLE public.creator_prize_compliance_flags IS 'Tracks creators who have not distributed gamified election prizes; used for platform red-flag/blacklist.';

CREATE INDEX IF NOT EXISTS idx_creator_prize_compliance_user ON public.creator_prize_compliance_flags(user_id);
CREATE INDEX IF NOT EXISTS idx_creator_prize_compliance_election ON public.creator_prize_compliance_flags(election_id);
CREATE INDEX IF NOT EXISTS idx_creator_prize_compliance_flag_type ON public.creator_prize_compliance_flags(flag_type);

ALTER TABLE public.creator_prize_compliance_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage creator_prize_compliance_flags"
  ON public.creator_prize_compliance_flags FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Creators can view own flags"
  ON public.creator_prize_compliance_flags FOR SELECT
  USING (user_id = auth.uid());
```

---

## Part 2: Deploy the Edge function

1. **Install Supabase CLI** (if needed):
   ```bash
   npm install -g supabase
   ```

2. **Log in and link your project** (from your repo root):
   ```bash
   supabase login
   supabase link --project-ref YOUR_PROJECT_REF
   ```
   (`YOUR_PROJECT_REF` is in Dashboard → Project Settings → General.)

3. **Deploy the function**:
   ```bash
   supabase functions deploy check-creator-prize-compliance
   ```

4. **Test it** (replace with your project ref and anon or service_role key):
   ```bash
   curl -X POST "https://YOUR_PROJECT_REF.supabase.co/functions/v1/check-creator-prize-compliance" \
     -H "Authorization: Bearer YOUR_ANON_OR_SERVICE_ROLE_KEY" \
     -H "Content-Type: application/json"
   ```
   You should get JSON like: `{"ok":true,"checked":...,"endedAfterGrace":...,"alreadyFlagged":...,"newlyFlagged":...,"electionIds":[]}`

---

## Part 3: Schedule the function (choose one)

### Option A: Supabase cron (pg_cron + pg_net) – recommended

1. In **Dashboard → Database → Extensions**, enable:
   - **pg_cron**
   - **pg_net**

2. Store your project URL and key in **Vault** (Dashboard → Project Settings → Vault, or SQL below). Use a secret name you’ll reference in cron.

   Or create secrets via SQL (run in SQL Editor; replace placeholders). Signature: `vault.create_secret(secret_value, name, description)`.
   ```sql
   -- One-time: add secrets to Vault (replace values with your real URL and key)
   SELECT vault.create_secret(
     'https://YOUR_PROJECT_REF.supabase.co',
     'project_url',
     'Base URL for Edge Function cron'
   );
   SELECT vault.create_secret(
     'YOUR_SERVICE_ROLE_OR_ANON_KEY',
     'creator_compliance_cron_key',
     'Key for check-creator-prize-compliance cron'
   );
   ```
   Or use **Dashboard → Project Settings → Vault** to create secrets named `project_url` and `creator_compliance_cron_key`.

3. Schedule the function (e.g. daily at 02:00 UTC). Run in **SQL Editor** – **replace the secret names** if you used different ones:
   ```sql
   -- Run daily at 02:00 UTC
   SELECT cron.schedule(
     'check-creator-prize-compliance-daily',
     '0 2 * * *',
     $$
     SELECT net.http_post(
       url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'project_url') || '/functions/v1/check-creator-prize-compliance',
       headers := jsonb_build_object(
         'Content-Type', 'application/json',
         'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'creator_compliance_cron_key')
       ),
       body := '{}'::jsonb
     ) AS request_id;
     $$
     );
   ```

   If you didn’t use Vault and want to hardcode (less secure; use only for testing):
   ```sql
   -- Replace YOUR_PROJECT_REF and YOUR_SERVICE_ROLE_KEY, then run
   SELECT cron.schedule(
     'check-creator-prize-compliance-daily',
     '0 2 * * *',
     $$
     SELECT net.http_post(
       url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/check-creator-prize-compliance',
       headers := '{"Content-Type":"application/json","Authorization":"Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb,
       body := '{}'::jsonb
     ) AS request_id;
     $$
     );
   ```

   **Cron syntax:** `0 2 * * *` = 02:00 UTC every day. Examples: `0 */6 * * *` = every 6 hours; `0 0 * * 0` = Sundays at midnight UTC.

4. **List/unschedule** (optional):
   ```sql
   SELECT * FROM cron.job;
   -- To remove: SELECT cron.unschedule('check-creator-prize-compliance-daily');
   ```

### Option B: External cron (e.g. server or GitHub Actions)

On a server or in a scheduled workflow, run daily (replace placeholders):

```bash
curl -X POST "https://YOUR_PROJECT_REF.supabase.co/functions/v1/check-creator-prize-compliance" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{}'
```

- **Linux/macOS cron:** `crontab -e` and add:
  `0 2 * * * curl -X POST "https://YOUR_PROJECT_REF.supabase.co/functions/v1/check-creator-prize-compliance" -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" -H "Content-Type: application/json" -d '{}'`

---

## Summary

| Step | What to do |
|------|------------|
| 1 | Run **Part 1** SQL in Supabase SQL Editor (once). |
| 2 | Run **Part 2** in terminal: `supabase functions deploy check-creator-prize-compliance`. |
| 3 | Test with the `curl` in Part 2. |
| 4 | Use **Part 3 Option A** (pg_cron + pg_net) or **Option B** (external cron) to run it daily. |

No other migrations are required for this Edge function; it only uses `creator_prize_compliance_flags` and the existing `elections` table.

---

## Additional Edge functions (creator SMS, ads budget alert, compliance reminders)

### 1. `creator-sms-triggers` (earnings milestones)

- **Deploy:** `supabase functions deploy creator-sms-triggers`
- **Cron (e.g. every 15 min):** `*/15 * * * *`  
  Invoke: `POST /functions/v1/creator-sms-triggers` with `Authorization: Bearer SERVICE_ROLE_KEY`
- **Purpose:** Finds `milestone_achievements` with `is_achieved=true` and `celebration_sent=false`, sends SMS via `send-sms-alert`, sets `celebration_sent=true`.

### 2. `participatory-ads-budget-alert` (Slack/Discord)

- **Deploy:** `supabase functions deploy participatory-ads-budget-alert`
- **Secrets (required for alerts):** In **Supabase Dashboard → Project Settings → Edge Functions → participatory-ads-budget-alert → Secrets**, add:
  - `SLACK_WEBHOOK_URL` — your Slack Incoming Webhook URL (optional if you only use Discord).
  - `DISCORD_WEBHOOK_URL` — your Discord channel webhook URL (optional if you only use Slack).  
  At least one of the two must be set for the function to send alerts.
- **Cron (e.g. every 15 min):** `*/15 * * * *`  
  Invoke: `POST /functions/v1/participatory-ads-budget-alert`
- **Purpose:** Reads `sponsored_elections` where active and `budget_spent/budget_total >= 0.9`, posts alert to webhooks, updates `alert_sent_at`.

### 3. `compliance-doc-reminders` (tax/compliance expiration)

- **Deploy:** `supabase functions deploy compliance-doc-reminders`
- **Cron (e.g. daily):** `0 8 * * *`  
  Invoke: `POST /functions/v1/compliance-doc-reminders`
- **Purpose:** Finds `creator_compliance_documents` expiring in 30/15/7 days or expired, inserts into `document_renewal_reminders` (one per document per reminder_type) for in-app/email delivery.
- **Tables:** Uses existing `creator_compliance_documents` and `document_renewal_reminders` (from multi_currency_payout_compliance_system migration).

---

## One-shot: Deploy all three + cron schedules

1. **Deploy the three Edge functions** (from repo root, with Supabase linked):
   ```bash
   supabase functions deploy creator-sms-triggers
   supabase functions deploy participatory-ads-budget-alert
   supabase functions deploy compliance-doc-reminders
   ```

2. **Set secrets for participatory-ads-budget-alert:**  
   Dashboard → Edge Functions → participatory-ads-budget-alert → Secrets → Add `SLACK_WEBHOOK_URL` and/or `DISCORD_WEBHOOK_URL`.

3. **Schedule all three with pg_cron:**  
   Run the migration `supabase/migrations/20260310140000_cron_creator_sms_ads_budget_compliance_reminders.sql` in **SQL Editor** (after enabling pg_cron and pg_net, and storing `project_url` and `creator_compliance_cron_key` in Vault as in Part 3 Option A above).

**Note:** If `supabase functions deploy` fails with "Access token not provided", run `supabase login` once, then rerun the deploy commands.
