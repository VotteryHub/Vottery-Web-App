# Vottery Supabase Deployment

Complete these steps to finish deployment.

---

## Step 1: Migration (Remove PayPal/Crypto)

**Option A – Supabase Dashboard (no CLI needed)**

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project
2. Go to **SQL Editor**
3. Paste and run:

```sql
-- Migration: Remove PayPal and Cryptocurrency from payout options (20260302120000)

UPDATE public.payout_settings
SET preferred_method = 'stripe'::public.payout_method
WHERE preferred_method IN ('paypal', 'crypto_wallet');
```

**Option B – Supabase CLI**

```powershell
cd "c:\Users\Osita\Downloads\vottery_1\vottery"
supabase login          # One-time: opens browser
supabase link --project-ref mdmdlhmtjmznmvkmgrzb
supabase db push
```

---

## Step 2: Deploy Edge Function

```powershell
cd "c:\Users\Osita\Downloads\vottery_1\vottery"
supabase functions deploy platform-gamification-api
```

---

## Step 3: Set API Key Secret

Generate a secure key and set it:

```powershell
# Generate a random 32-byte hex key
$key = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object { [char]$_ })
supabase secrets set "PLATFORM_GAMIFICATION_API_KEY=$key"
Write-Host "Save this API key: $key"
```

Or use a custom value:

```powershell
supabase secrets set PLATFORM_GAMIFICATION_API_KEY=your-secure-api-key-here
```

---

## One-Line Script (after `supabase login`)

```powershell
.\deploy-supabase.ps1
```

---

## Summary

| Item | Status |
|------|--------|
| PayPal/Crypto removal (Web + Mobile) | Done |
| Migration SQL | Run manually (Step 1) |
| Platform Gamification API | Deploy (Step 2) |
| API Key secret | Set (Step 3) |
| Mobile API Rate Limiting nav | Done |
