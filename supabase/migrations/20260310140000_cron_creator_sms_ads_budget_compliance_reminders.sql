-- Schedule Edge functions: creator-sms-triggers, participatory-ads-budget-alert, compliance-doc-reminders
-- Requires: pg_cron + pg_net enabled; Vault secrets 'project_url' and 'creator_compliance_cron_key' (or service role key).
-- Run after deploying the three functions.

-- 1. creator-sms-triggers: every 15 minutes
SELECT cron.schedule(
  'creator-sms-triggers-cron',
  '*/15 * * * *',
  $$
  SELECT net.http_post(
    url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'project_url') || '/functions/v1/creator-sms-triggers',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'creator_compliance_cron_key')
    ),
    body := '{}'::jsonb
  ) AS request_id;
  $$
);

-- 2. participatory-ads-budget-alert: every 15 minutes
SELECT cron.schedule(
  'participatory-ads-budget-alert-cron',
  '*/15 * * * *',
  $$
  SELECT net.http_post(
    url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'project_url') || '/functions/v1/participatory-ads-budget-alert',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'creator_compliance_cron_key')
    ),
    body := '{}'::jsonb
  ) AS request_id;
  $$
);

-- 3. compliance-doc-reminders: daily at 08:00 UTC
SELECT cron.schedule(
  'compliance-doc-reminders-daily',
  '0 8 * * *',
  $$
  SELECT net.http_post(
    url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'project_url') || '/functions/v1/compliance-doc-reminders',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'creator_compliance_cron_key')
    ),
    body := '{}'::jsonb
  ) AS request_id;
  $$
);
