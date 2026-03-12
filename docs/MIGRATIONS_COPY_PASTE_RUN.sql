-- =============================================================================
-- VOTTERY – ADDITIVE MIGRATIONS (COPY, PASTE & RUN)
-- Run this entire block in Supabase Dashboard → SQL Editor → New query.
-- Safe to run multiple times (uses IF NOT EXISTS / DO blocks).
--
-- Covers:
--   • direct_messages.metadata (Web DMC voice message duration)
--   • elections.creator_can_see_totals (creator can see vote totals)
--   • messages.metadata (Mobile DMC voice, if you use conversations/messages)
-- =============================================================================

-- ---------- 1. Voice message metadata (Web DMC) ----------
-- direct_messages: store voice duration etc. for Web ConversationPanel
ALTER TABLE public.direct_messages
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.direct_messages.metadata IS 'Optional payload e.g. { "duration": 15 } for voice messages.';

-- ---------- 2. Creator can see vote totals (elections) ----------
ALTER TABLE public.elections
  ADD COLUMN IF NOT EXISTS creator_can_see_totals BOOLEAN DEFAULT true;

COMMENT ON COLUMN public.elections.creator_can_see_totals IS 'When true, the election creator can view live vote totals while the election is open.';

-- ---------- 3. Mobile DMC: messages.metadata (if you use conversations/messages) ----------
-- Only runs if table public.messages exists; adds metadata for voice duration.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'messages'
  ) THEN
    ALTER TABLE public.messages
      ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;
    RAISE NOTICE 'messages.metadata added (or already present).';
  END IF;
END $$;

-- =============================================================================
-- DONE. Optional next steps:
-- • Bulk management: if you have not yet run it, run the migration file
--   supabase/migrations/20260123123800_bulk_management_operations.sql
--   (creates bulk_operations, bulk_operation_items, bulk_operation_logs).
-- • Storage: ensure a bucket named "voice_messages" exists in Supabase
--   Dashboard → Storage → New bucket (public if you use getPublicUrl).
-- =============================================================================
