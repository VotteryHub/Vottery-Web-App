# Creator Prize Compliance – Automated Flagging

The Edge function **`check-creator-prize-compliance`** flags gamified elections that ended **14+ days ago** and are not yet in `creator_prize_compliance_flags`. Admins can then review and resolve (or mark as resolved) in the backend.

## What it does

1. Selects elections where `is_gamified = true` and end date + time is at least 14 days in the past.
2. Skips elections that already have a row in `creator_prize_compliance_flags`.
3. Inserts one row per election: `user_id` (creator), `election_id`, `flag_type: 'unpaid_prize'`, and a short note.

## Deploy

```bash
supabase functions deploy check-creator-prize-compliance
```

## Invoke manually

```bash
curl -X POST "https://<project-ref>.supabase.co/functions/v1/check-creator-prize-compliance" \
  -H "Authorization: Bearer <SUPABASE_ANON_OR_SERVICE_ROLE_KEY>"
```

Or from the Supabase Dashboard: Edge Functions → `check-creator-prize-compliance` → Invoke.

## Schedule (cron)

- **Supabase:** Use Dashboard → Database → Extensions → enable `pg_cron` if needed; then add a cron job that calls `net.http_post` to your function URL (with a secret header or service key) on a schedule (e.g. daily at 02:00 UTC).
- **External:** Use your host’s cron or a scheduler (e.g. GitHub Actions, Vercel Cron) to `POST` to the function URL daily.

Response shape: `{ ok, checked, endedAfterGrace, alreadyFlagged, newlyFlagged, electionIds }`.
