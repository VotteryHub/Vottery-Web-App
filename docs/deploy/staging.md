# Staging Deployment Guide

## Overview
The Vottery staging environment is a production-like environment used for final QA, performance testing, and Release Candidate validation. It mirror production infrastructure but uses a separate Supabase project and Vercel environment.

## Infrastructure Stack
- **Frontend**: [Vercel](https://vercel.com) (Branch-based deployments for `staging` branch)
- **Backend**: [Supabase](https://supabase.com) (Staging project)
- **Edge Functions**: Supabase Edge Functions
- **Database**: PostgreSQL (Supabase) with RLS enabled
- **Storage**: Supabase Storage Buckets (Avatars, Branding, Evidence)

## Environment Configuration
Staging environment variables are managed in the Vercel dashboard and Supabase secrets.
See [.env.staging.example](../../.env.staging.example) for the full list of required variables.

### Critical Variables
| Variable | Usage |
| :--- | :--- |
| `VITE_SUPABASE_URL` | Supabase Staging API URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase Staging Anonymous Key |
| `VITE_SENTRY_DSN` | Sentry Staging DSN |
| `VITE_ENV` | Must be set to `staging` |

## Deployment Process

### 1. Database Migrations
Before deploying frontend changes, ensure the database schema is up-to-date.
```powershell
supabase link --project-ref <staging-project-ref>
supabase db push
```

### 2. Edge Functions
Deploy orchestrated functions to staging.
```powershell
supabase functions deploy identity-orchestrator --project-ref <staging-project-ref>
supabase functions deploy ai-proxy --project-ref <staging-project-ref>
supabase functions deploy send-sms-alert --project-ref <staging-project-ref>
```

### 3. Frontend Deployment
Push to the `staging` branch. Vercel will automatically trigger a build and deploy to the staging URL.

## Monitoring
- **Sentry**: Check the `vottery-web-staging` project for errors.
- **Supabase Logs**: Monitor Edge Function logs for orchestration failures.

## Seeding Data
To populate the environment with fresh test data:
```powershell
npm run seed:staging
```
See [staging-test-accounts.md](./staging-test-accounts.md) for available test credentials.
