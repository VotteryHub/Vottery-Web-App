# System Healthcheck Documentation

## Overview
The `scripts/healthcheck.mjs` script provides a comprehensive validation of the Vottery environment, including database connectivity, optional module availability, and edge function reachability.

## Environment Variables

### Core Required (Fatal if missing)
These variables MUST be present for the application and healthcheck to function.
- `VITE_SUPABASE_URL`: The Supabase project URL.
- `VITE_SUPABASE_ANON_KEY`: The public anonymous key.

### Recommended / Optional
- `SUPABASE_SERVICE_ROLE_KEY`: Required for write-based checks and admin operations. If missing, healthcheck runs in **ANON-ONLY** mode.
- `VITE_SENTRY_DSN`: Required for error tracking. If missing, module is marked **DEGRADED**.

### Module Specific (Optional)
If these keys are missing, the corresponding module is marked **DEGRADED**, but the healthcheck will pass unless the module is explicitly required via `REQUIRED_MODULES`.
- **AI**: `VITE_ANTHROPIC_API_KEY`, `VITE_OPENAI_API_KEY`
- **Comms**: `VITE_RESEND_API_KEY`, `VITE_TWILIO_API_KEY`
- **Payments**: `VITE_STRIPE_PUBLIC_KEY`
- **Ads**: `VITE_ADSENSE_CLIENT`
- **KYC**: `VITE_HCAPTCHA_SITE_KEY`

## Module Enforcement
To force a non-zero exit code when an optional module is missing, use the `REQUIRED_MODULES` environment variable:
```bash
# Example: Ensure AI and Payments are functional
REQUIRED_MODULES=ai,payments node scripts/healthcheck.mjs
```

## Exit Codes
- `0`: Success (all core and required modules are operational).
- `1`: Failure (missing core vars, or a required module is missing keys).
