-- Content Moderation Results Table
CREATE TABLE IF NOT EXISTS public.content_moderation_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('post', 'comment')),
  content_text TEXT,
  confidence_score DECIMAL(4,3) DEFAULT 0,
  categories TEXT[] DEFAULT ARRAY['safe'],
  primary_category TEXT DEFAULT 'safe',
  reasoning TEXT,
  auto_removed BOOLEAN DEFAULT FALSE,
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  moderated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(content_id, content_type)
);

-- Add FK for reviewed_by safely
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'content_moderation_results_reviewed_by_fkey'
    AND table_name = 'content_moderation_results'
  ) THEN
    ALTER TABLE public.content_moderation_results
      ADD CONSTRAINT content_moderation_results_reviewed_by_fkey
      FOREIGN KEY (reviewed_by) REFERENCES public.user_profiles(id);
  END IF;
END $$;

-- Add moderator_role column to group_members if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'group_members' AND column_name = 'moderator_role'
  ) THEN
    ALTER TABLE public.group_members ADD COLUMN moderator_role TEXT DEFAULT NULL;
  END IF;
END $$;

-- Group Posts Table for approval workflow
CREATE TABLE IF NOT EXISTS public.group_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL,
  user_id UUID,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  flags INTEGER DEFAULT 0,
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  rejected_by UUID,
  rejected_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure group_posts.user_id column exists (handles case where table existed without this column)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'group_posts' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.group_posts ADD COLUMN user_id UUID;
  END IF;
END $$;

-- Ensure group_posts.approved_by column exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'group_posts' AND column_name = 'approved_by'
  ) THEN
    ALTER TABLE public.group_posts ADD COLUMN approved_by UUID;
  END IF;
END $$;

-- Ensure group_posts.rejected_by column exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'group_posts' AND column_name = 'rejected_by'
  ) THEN
    ALTER TABLE public.group_posts ADD COLUMN rejected_by UUID;
  END IF;
END $$;

-- Ensure group_posts.status column exists (handles case where table existed without this column)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'group_posts' AND column_name = 'status'
  ) THEN
    ALTER TABLE public.group_posts ADD COLUMN status TEXT DEFAULT 'pending';
  END IF;
END $$;

-- Ensure group_posts.status has the correct CHECK constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints cc
    JOIN information_schema.constraint_column_usage ccu
      ON cc.constraint_name = ccu.constraint_name
      AND cc.constraint_schema = ccu.constraint_schema
    WHERE ccu.table_schema = 'public'
      AND ccu.table_name = 'group_posts'
      AND ccu.column_name = 'status'
  ) THEN
    ALTER TABLE public.group_posts
      ADD CONSTRAINT group_posts_status_check
      CHECK (status IN ('pending', 'approved', 'rejected'));
  END IF;
END $$;

-- Add FKs for group_posts safely
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'group_posts_group_id_fkey'
    AND table_name = 'group_posts'
  ) THEN
    ALTER TABLE public.group_posts
      ADD CONSTRAINT group_posts_group_id_fkey
      FOREIGN KEY (group_id) REFERENCES public.groups(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'group_posts_user_id_fkey'
    AND table_name = 'group_posts'
  ) THEN
    ALTER TABLE public.group_posts
      ADD CONSTRAINT group_posts_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES public.user_profiles(id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'group_posts_approved_by_fkey'
    AND table_name = 'group_posts'
  ) THEN
    ALTER TABLE public.group_posts
      ADD CONSTRAINT group_posts_approved_by_fkey
      FOREIGN KEY (approved_by) REFERENCES public.user_profiles(id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'group_posts_rejected_by_fkey'
    AND table_name = 'group_posts'
  ) THEN
    ALTER TABLE public.group_posts
      ADD CONSTRAINT group_posts_rejected_by_fkey
      FOREIGN KEY (rejected_by) REFERENCES public.user_profiles(id);
  END IF;
END $$;

-- Group Events Table
CREATE TABLE IF NOT EXISTS public.group_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TIME,
  event_type TEXT DEFAULT 'virtual' CHECK (event_type IN ('virtual', 'in-person', 'hybrid')),
  location TEXT,
  max_attendees INTEGER DEFAULT 100,
  rsvp_enabled BOOLEAN DEFAULT TRUE,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure group_events.id column exists (handles case where table existed without id column)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'group_events' AND column_name = 'id'
  ) THEN
    ALTER TABLE public.group_events ADD COLUMN id UUID DEFAULT gen_random_uuid();
  END IF;
END $$;

-- Ensure group_events.id has a unique constraint so it can be used as FK target.
-- This handles the case where the table existed and id was added via ALTER TABLE
-- without a PRIMARY KEY constraint (e.g. from a prior partial migration run).
DO $$
BEGIN
  -- Only add unique constraint if there is no primary key AND no unique constraint on id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
      AND tc.table_name = kcu.table_name
    WHERE tc.table_schema = 'public'
      AND tc.table_name = 'group_events'
      AND kcu.column_name = 'id'
      AND tc.constraint_type IN ('PRIMARY KEY', 'UNIQUE')
  ) THEN
    ALTER TABLE public.group_events ADD CONSTRAINT group_events_id_unique UNIQUE (id);
  END IF;
END $$;

-- Ensure group_events.created_by column exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'group_events' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE public.group_events ADD COLUMN created_by UUID;
  END IF;
END $$;

-- Add FKs for group_events safely
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'group_events_group_id_fkey'
    AND table_name = 'group_events'
  ) THEN
    ALTER TABLE public.group_events
      ADD CONSTRAINT group_events_group_id_fkey
      FOREIGN KEY (group_id) REFERENCES public.groups(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'group_events_created_by_fkey'
    AND table_name = 'group_events'
  ) THEN
    ALTER TABLE public.group_events
      ADD CONSTRAINT group_events_created_by_fkey
      FOREIGN KEY (created_by) REFERENCES public.user_profiles(id);
  END IF;
END $$;

-- Group Event RSVPs
CREATE TABLE IF NOT EXISTS public.group_event_rsvps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID,
  user_id UUID,
  status TEXT DEFAULT 'attending' CHECK (status IN ('attending', 'maybe', 'declined')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Ensure group_event_rsvps.event_id column exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'group_event_rsvps' AND column_name = 'event_id'
  ) THEN
    ALTER TABLE public.group_event_rsvps ADD COLUMN event_id UUID;
  END IF;
END $$;

-- Ensure group_event_rsvps.user_id column exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'group_event_rsvps' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.group_event_rsvps ADD COLUMN user_id UUID;
  END IF;
END $$;

-- Add FKs for group_event_rsvps safely
DO $$
BEGIN
  -- Verify group_events.id exists and has a unique/pk constraint before adding FK
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
      AND tc.table_name = kcu.table_name
    WHERE tc.table_schema = 'public'
      AND tc.table_name = 'group_events'
      AND kcu.column_name = 'id'
      AND tc.constraint_type IN ('PRIMARY KEY', 'UNIQUE')
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'group_event_rsvps_event_id_fkey'
    AND table_name = 'group_event_rsvps'
  ) THEN
    ALTER TABLE public.group_event_rsvps
      ADD CONSTRAINT group_event_rsvps_event_id_fkey
      FOREIGN KEY (event_id) REFERENCES public.group_events(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'group_event_rsvps_user_id_fkey'
    AND table_name = 'group_event_rsvps'
  ) THEN
    ALTER TABLE public.group_event_rsvps
      ADD CONSTRAINT group_event_rsvps_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES public.user_profiles(id);
  END IF;
END $$;

-- Group Admin Actions Log
CREATE TABLE IF NOT EXISTS public.group_admin_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL,
  action TEXT NOT NULL,
  target_user_id UUID,
  target_user TEXT,
  old_role TEXT,
  new_role TEXT,
  reason TEXT,
  performed_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure group_admin_actions.target_user_id column exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'group_admin_actions' AND column_name = 'target_user_id'
  ) THEN
    ALTER TABLE public.group_admin_actions ADD COLUMN target_user_id UUID;
  END IF;
END $$;

-- Ensure group_admin_actions.performed_by column exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'group_admin_actions' AND column_name = 'performed_by'
  ) THEN
    ALTER TABLE public.group_admin_actions ADD COLUMN performed_by UUID;
  END IF;
END $$;

-- Add FKs for group_admin_actions safely
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'group_admin_actions_group_id_fkey'
    AND table_name = 'group_admin_actions'
  ) THEN
    ALTER TABLE public.group_admin_actions
      ADD CONSTRAINT group_admin_actions_group_id_fkey
      FOREIGN KEY (group_id) REFERENCES public.groups(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'group_admin_actions_target_user_id_fkey'
    AND table_name = 'group_admin_actions'
  ) THEN
    ALTER TABLE public.group_admin_actions
      ADD CONSTRAINT group_admin_actions_target_user_id_fkey
      FOREIGN KEY (target_user_id) REFERENCES public.user_profiles(id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'group_admin_actions_performed_by_fkey'
    AND table_name = 'group_admin_actions'
  ) THEN
    ALTER TABLE public.group_admin_actions
      ADD CONSTRAINT group_admin_actions_performed_by_fkey
      FOREIGN KEY (performed_by) REFERENCES public.user_profiles(id);
  END IF;
END $$;

-- RLS Policies
ALTER TABLE public.content_moderation_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_admin_actions ENABLE ROW LEVEL SECURITY;

-- Content moderation: admins can view all
DROP POLICY IF EXISTS "Admins can view moderation results" ON public.content_moderation_results;
CREATE POLICY "Admins can view moderation results" ON public.content_moderation_results
  FOR SELECT USING (true);

-- Group posts: members can view approved, moderators can view all
DROP POLICY IF EXISTS "Members can view approved group posts" ON public.group_posts;
CREATE POLICY "Members can view approved group posts" ON public.group_posts
  FOR SELECT USING (status = 'approved' OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create group posts" ON public.group_posts;
CREATE POLICY "Users can create group posts" ON public.group_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Moderators can update group posts" ON public.group_posts;
CREATE POLICY "Moderators can update group posts" ON public.group_posts
  FOR UPDATE USING (true);

-- Group events: public read
DROP POLICY IF EXISTS "Anyone can view group events" ON public.group_events;
CREATE POLICY "Anyone can view group events" ON public.group_events
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Moderators can create events" ON public.group_events;
CREATE POLICY "Moderators can create events" ON public.group_events
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- RSVPs
DROP POLICY IF EXISTS "Users can manage their RSVPs" ON public.group_event_rsvps;
CREATE POLICY "Users can manage their RSVPs" ON public.group_event_rsvps
  FOR ALL USING (auth.uid() = user_id);

-- Admin actions: admins can view
DROP POLICY IF EXISTS "Admins can view action log" ON public.group_admin_actions;
CREATE POLICY "Admins can view action log" ON public.group_admin_actions
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can log actions" ON public.group_admin_actions;
CREATE POLICY "Admins can log actions" ON public.group_admin_actions
  FOR INSERT WITH CHECK (auth.uid() = performed_by);
