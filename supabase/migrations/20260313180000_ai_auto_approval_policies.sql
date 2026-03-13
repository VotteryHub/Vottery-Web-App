-- AI Auto-Approval Policies
-- Shared between Web and Mobile for multi-AI consensus decisions.

create table if not exists public.ai_auto_approval_policies (
  id uuid primary key default gen_random_uuid(),
  analysis_type text not null,
  min_confidence numeric not null default 0.85,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ai_auto_approval_policies_analysis_type_unique unique (analysis_type)
);

comment on table public.ai_auto_approval_policies is
  'Per-analysis-type auto-approval thresholds for multi-AI consensus (used by Web and Mobile).';

comment on column public.ai_auto_approval_policies.analysis_type is
  'Logical analysis type, e.g. fraud_detection, payment_dispute, content_moderation.';

comment on column public.ai_auto_approval_policies.min_confidence is
  'Minimum overall consensus confidence (0-1) required for auto-approval.';

comment on column public.ai_auto_approval_policies.enabled is
  'If false, auto-approval is disabled for this analysis type.';

-- Simple trigger to keep updated_at fresh
create or replace function public.ai_auto_approval_policies_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists ai_auto_approval_policies_set_updated_at
  on public.ai_auto_approval_policies;

create trigger ai_auto_approval_policies_set_updated_at
before update on public.ai_auto_approval_policies
for each row
execute procedure public.ai_auto_approval_policies_set_updated_at();

-- Optional seed policies for common analysis types.
insert into public.ai_auto_approval_policies (analysis_type, min_confidence, enabled)
values
  ('fraud_detection', 0.85, true),
  ('payment_dispute', 0.9, true),
  ('content_moderation', 0.9, false)
on conflict (analysis_type) do nothing;

