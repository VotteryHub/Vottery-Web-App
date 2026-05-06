# Telemetry Retention & Cost Control Strategy

This document outlines the infrastructure and policies implemented to manage database costs and performance for the Vottery telemetry system.

## 1. System Inventory

| Role | Entity Name | Type |
|------|-------------|------|
| **Raw Telemetry/Events** | `public.user_engagement_signals` | Table |
| **Aggregated Metrics** | `public.daily_funnel_metrics` | Table |
| **Maintenance Logs** | `public.maintenance_logs` | Table |

## 2. Indexing Strategy

To ensure real-time dashboards and historical audits remain fast, the following indexes are implemented:

| Index Name | Columns | Purpose |
|------------|---------|---------|
| `idx_user_engagement_signals_type_created` | `(engagement_type, created_at DESC)` | Funnel analysis by event type/time range. |
| `idx_user_engagement_signals_content_created` | `(content_item_id, created_at DESC)` | Conversion analysis per specific election. |
| `idx_daily_funnel_metrics_day` | `(day DESC)` | Fast retrieval of historical daily stats. |

## 3. Retention Policy

A tiered data lifecycle policy is implemented to balance granular debugging needs with long-term cost efficiency.

| Data Type | Retention Period | Storage Location |
|-----------|------------------|------------------|
| **Raw Events** | 30 Days | `user_engagement_signals` |
| **Aggregated Metrics** | 12 Months | `daily_funnel_metrics` |

### Automated Maintenance
The system performs nightly maintenance via the `public.maintain_telemetry_data()` function.

- **Frequency**: Nightly at 02:00 AM UTC.
- **Production Scheduling**:
  - **Preferred (Supabase)**: Scheduled via the `pg_cron` extension.
    - `SELECT cron.schedule('maintain-telemetry', '0 2 * * *', 'SELECT public.maintain_telemetry_data()');`
  - **Fallback (Edge Function)**: A scheduled Supabase Edge Function that invokes the RPC.
  - **External**: GitHub Action or external cron calling the Supabase API.
- **Actions**:
  1. Aggregates previous day's funnel signals (filtered by `content_item_type = 'election'`).
  2. Purges raw funnel signals and system load events older than 30 days.
  3. Purges daily summaries older than 12 months.
  4. Records the run status in `public.maintenance_logs`.

## 4. Verification Steps

To verify that the retention system is operating correctly, run the following SQL queries in the Supabase Dashboard and compare against the expected outcomes.

### Step 1: Confirm Maintenance Run
**SQL Query:**
```sql
SELECT task_name, last_run_at, status 
FROM public.maintenance_logs 
WHERE task_name = 'telemetry_retention';
```
**Expected Output:** One row with `status = 'success'` and a `last_run_at` timestamp within the last 24 hours.

### Step 2: Verify Data Pruning
**SQL Query:**
```sql
SELECT MIN(created_at) as oldest_raw_event 
FROM public.user_engagement_signals 
WHERE engagement_type LIKE 'funnel_%';
```
**Expected Output:** The `oldest_raw_event` should be no more than 31 days old (e.g., if today is April 28, the date should be March 28 or later).

### Step 3: Audit Aggregation Coverage
**SQL Query:**
```sql
SELECT day, SUM(event_count) as total_events 
FROM public.daily_funnel_metrics 
GROUP BY 1 ORDER BY 1 DESC LIMIT 5;
```
**Expected Output:** A list of the most recent 5 days. `total_events` should match the expected platform activity volume for those dates.

## 5. Client-Side Protection

The `EventBusRecorder` service implements the following to prevent database spam:
- **Per-Type Rate Limiting**: 100ms debounce per event type to filter out UI re-render noise.
- **Per-Session Deduplication**: `VOTE_FLOW_STEP_VIEWED` events are tracked in a `Set` and logged only **once per step per election per session**.
- **Enum Alignment**: All funnel events are tagged with `contentType: 'election'` to match the database `public.content_item_type` enum.
