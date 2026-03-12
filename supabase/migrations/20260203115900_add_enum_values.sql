-- ADD MISSING ENUM VALUES
-- This migration MUST run before 20260203120000_comprehensive_rls_policies.sql
-- Enum values must be committed in a separate transaction before they can be used

-- Add 'draft' status to election_status enum if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'election_status' AND e.enumlabel = 'draft'
  ) THEN
    ALTER TYPE public.election_status ADD VALUE 'draft';
  END IF;
END $$;

-- Add 'pending' status to election_status enum if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'election_status' AND e.enumlabel = 'pending'
  ) THEN
    ALTER TYPE public.election_status ADD VALUE 'pending';
  END IF;
END $$;

-- Add 'upcoming' status to election_status enum if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'election_status' AND e.enumlabel = 'upcoming'
  ) THEN
    ALTER TYPE public.election_status ADD VALUE 'upcoming';
  END IF;
END $$;