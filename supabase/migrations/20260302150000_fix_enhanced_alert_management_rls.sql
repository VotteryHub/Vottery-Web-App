-- Fix RLS policies for enhanced alert management tables to be admin-only
-- This aligns runtime behavior with the UI promise that these controls are restricted to admins.

DO $$
BEGIN
  RAISE NOTICE 'Fixing RLS for enhanced alert management tables...';
END $$;

-- Helper to safely reset a policy
DO $$
BEGIN
  -- alert_correlation_groups
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'alert_correlation_groups') THEN
    DROP POLICY IF EXISTS "Admin full access to alert_correlation_groups" ON public.alert_correlation_groups;
    CREATE POLICY "Admin full access to alert_correlation_groups"
      ON public.alert_correlation_groups
      FOR ALL
      USING (public.is_admin())
      WITH CHECK (public.is_admin());
  END IF;

  -- quick_action_templates
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quick_action_templates') THEN
    DROP POLICY IF EXISTS "Admin full access to quick_action_templates" ON public.quick_action_templates;
    CREATE POLICY "Admin full access to quick_action_templates"
      ON public.quick_action_templates
      FOR ALL
      USING (public.is_admin())
      WITH CHECK (public.is_admin());
  END IF;

  -- quick_action_executions
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quick_action_executions') THEN
    DROP POLICY IF EXISTS "Admin full access to quick_action_executions" ON public.quick_action_executions;
    CREATE POLICY "Admin full access to quick_action_executions"
      ON public.quick_action_executions
      FOR ALL
      USING (public.is_admin())
      WITH CHECK (public.is_admin());
  END IF;

  -- compliance_escalation_workflows
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'compliance_escalation_workflows') THEN
    DROP POLICY IF EXISTS "Admin full access to compliance_escalation_workflows" ON public.compliance_escalation_workflows;
    CREATE POLICY "Admin full access to compliance_escalation_workflows"
      ON public.compliance_escalation_workflows
      FOR ALL
      USING (public.is_admin())
      WITH CHECK (public.is_admin());
  END IF;

  -- compliance_escalation_executions
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'compliance_escalation_executions') THEN
    DROP POLICY IF EXISTS "Admin full access to compliance_escalation_executions" ON public.compliance_escalation_executions;
    CREATE POLICY "Admin full access to compliance_escalation_executions"
      ON public.compliance_escalation_executions
      FOR ALL
      USING (public.is_admin())
      WITH CHECK (public.is_admin());
  END IF;

  -- sla_tracking
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sla_tracking') THEN
    DROP POLICY IF EXISTS "Admin full access to sla_tracking" ON public.sla_tracking;
    CREATE POLICY "Admin full access to sla_tracking"
      ON public.sla_tracking
      FOR ALL
      USING (public.is_admin())
      WITH CHECK (public.is_admin());
  END IF;
END $$;

DO $$
BEGIN
  RAISE NOTICE 'Enhanced alert management RLS policies updated to admin-only.';
END $$;

