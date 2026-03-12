# Apply migration and open Earnings & payouts

## 1. Run the new migration

Choose **one** of these:

### Option A: Supabase CLI (recommended if you use it)

From the project root (where `supabase/migrations` lives):

```bash
npx supabase db push
```

Or, if Supabase CLI is installed globally:

```bash
supabase db push
```

You may need to link the project first: `supabase link --project-ref YOUR_REF`.

### Option B: Supabase Dashboard (no CLI)

1. Open [Supabase Dashboard](https://supabase.com/dashboard) and select your project.
2. Go to **SQL Editor**.
3. Open **`supabase/manual_run_user_wallets_migration.sql`** in your repo (same as the migration in `supabase/migrations/20260228100000_...`).
4. Copy its full contents, paste into the SQL Editor, and click **Run**.

This migration ensures `user_wallets` exists and, if you have a legacy `wallets` table, backfills from it.

---

## 2. Open the new payout flow

After the migration is applied:

### Web

1. Start the app: `npm run start` (or `npm start`).
2. In the **header** or **left sidebar**, click **“Earnings & payouts”** or **“Digital Wallet”**.
3. Both open the YouTube-style **Earnings & payouts** screen (threshold, next payment date, request payout, history).

### Mobile (Flutter)

1. Run the app (e.g. from your IDE or `flutter run`).
2. Open the **profile** section (e.g. bottom navigation).
3. In the profile menu, tap **“Earnings & payouts”** or **“Digital Wallet”**.
4. Both open the same **Earnings & payouts** screen.

---

## Troubleshooting

- **“user_wallets does not exist”**  
  Run the migration (Option A or B above).

- **Web/Mobile use different data**  
  Ensure both apps use the same Supabase project (same `SUPABASE_URL` / `VITE_SUPABASE_URL` in Web and the same in Flutter env).

- **Node/npx not found when running `npx supabase db push`**  
  Use Option B and run the migration SQL in the Supabase Dashboard SQL Editor.
