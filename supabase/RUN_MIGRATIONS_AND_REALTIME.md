# Run migrations and enable Realtime

## 1. Run the new migration

Migration `20260303100000_security_audit_seed_and_realtime.sql`:

- Seeds **security_audit_checklist** only if the table is empty (so the Security & Compliance Audit screen has checklist items).
- Enables **Realtime** for `prize_distributions` and `notifications` so the Winner Notification Center gets updates in &lt;100ms.

**Option A – Supabase CLI (if you have it):**

```bash
cd path/to/vottery
npx supabase db push
```

**Option B – Supabase Dashboard:**

1. Open your project → **SQL Editor**.
2. Copy the contents of `supabase/migrations/20260303100000_security_audit_seed_and_realtime.sql`.
3. Run the script.

## 2. Confirm Realtime (optional)

In **Dashboard → Database → Replication** (or **Realtime**), ensure `prize_distributions` and `notifications` are in the **supabase_realtime** publication. The migration adds them if they exist; if you don’t see them, add the tables to the publication manually.
