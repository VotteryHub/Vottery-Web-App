-- Enable Realtime for Messaging Tables
-- This allows postgres_changes to broadcast events to the frontend

-- 1. Ensure the publication exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END $$;

-- 2. Add Messaging tables to the publication
-- We use a DO block to avoid errors if they are already added
DO $$
BEGIN
  -- direct_messages
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'direct_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.direct_messages;
  END IF;

  -- message_threads
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'message_threads'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.message_threads;
  END IF;

  -- message_read_status
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'message_read_status'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.message_read_status;
  END IF;

  -- message_reactions
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'message_reactions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.message_reactions;
  END IF;
END $$;

-- 3. Set REPLICA IDENTITY to FULL for more detailed payloads
-- This is necessary for 'UPDATE' and 'DELETE' events to include old data
ALTER TABLE public.direct_messages REPLICA IDENTITY FULL;
ALTER TABLE public.message_threads REPLICA IDENTITY FULL;
ALTER TABLE public.message_read_status REPLICA IDENTITY FULL;
ALTER TABLE public.message_reactions REPLICA IDENTITY FULL;

-- 4. Enable RLS for all messaging tables (Safety check)
ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_read_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;

-- 5. Correct the 'direct_messages_insert' policy if needed
-- Users should only be able to insert messages into threads they are part of
DROP POLICY IF EXISTS "direct_messages_insert" ON public.direct_messages;
CREATE POLICY "direct_messages_insert" ON public.direct_messages
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.message_threads mt
    WHERE mt.id = direct_messages.thread_id
    AND (mt.participant_one_id = auth.uid() OR mt.participant_two_id = auth.uid())
  )
  AND sender_id = auth.uid()
);

-- 6. Correct the 'direct_messages_select' policy
-- Users should only be able to read messages from threads they are participants in
DROP POLICY IF EXISTS "direct_messages_select" ON public.direct_messages;
CREATE POLICY "direct_messages_select" ON public.direct_messages
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.message_threads mt
    WHERE mt.id = direct_messages.thread_id
    AND (mt.participant_one_id = auth.uid() OR mt.participant_two_id = auth.uid())
  )
);
