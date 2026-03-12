-- Direct Messaging System Migration
-- Tables: message_threads, direct_messages, message_read_status
-- Features: Real-time chat, typing indicators, read receipts, thread management

-- 1. Create message_threads table
CREATE TABLE public.message_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_one_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    participant_two_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    last_message_content TEXT,
    last_message_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT different_participants CHECK (participant_one_id != participant_two_id)
);

-- 2. Create direct_messages table
CREATE TABLE public.direct_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID REFERENCES public.message_threads(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text',
    attachment_url TEXT,
    attachment_alt TEXT,
    is_edited BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create message_read_status table
CREATE TABLE public.message_read_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID REFERENCES public.direct_messages(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(message_id, user_id)
);

-- 4. Create indexes for performance
CREATE INDEX idx_message_threads_participant_one ON public.message_threads(participant_one_id);
CREATE INDEX idx_message_threads_participant_two ON public.message_threads(participant_two_id);
CREATE INDEX idx_message_threads_last_message_at ON public.message_threads(last_message_at DESC);
CREATE INDEX idx_direct_messages_thread_id ON public.direct_messages(thread_id);
CREATE INDEX idx_direct_messages_sender_id ON public.direct_messages(sender_id);
CREATE INDEX idx_direct_messages_created_at ON public.direct_messages(created_at DESC);
CREATE INDEX idx_message_read_status_message_id ON public.message_read_status(message_id);
CREATE INDEX idx_message_read_status_user_id ON public.message_read_status(user_id);

-- 5. Create function to update thread last message
CREATE OR REPLACE FUNCTION public.update_thread_last_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.message_threads
    SET 
        last_message_content = NEW.content,
        last_message_at = NEW.created_at,
        updated_at = NEW.created_at
    WHERE id = NEW.thread_id;
    RETURN NEW;
END;
$$;

-- 6. Enable RLS
ALTER TABLE public.message_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_read_status ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies for message_threads
CREATE POLICY "users_view_own_threads"
ON public.message_threads
FOR SELECT
TO authenticated
USING (
    participant_one_id = auth.uid() OR participant_two_id = auth.uid()
);

CREATE POLICY "users_create_threads"
ON public.message_threads
FOR INSERT
TO authenticated
WITH CHECK (
    participant_one_id = auth.uid() OR participant_two_id = auth.uid()
);

CREATE POLICY "users_update_own_threads"
ON public.message_threads
FOR UPDATE
TO authenticated
USING (
    participant_one_id = auth.uid() OR participant_two_id = auth.uid()
)
WITH CHECK (
    participant_one_id = auth.uid() OR participant_two_id = auth.uid()
);

-- 8. RLS Policies for direct_messages
CREATE POLICY "users_view_thread_messages"
ON public.direct_messages
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.message_threads mt
        WHERE mt.id = thread_id
        AND (mt.participant_one_id = auth.uid() OR mt.participant_two_id = auth.uid())
    )
);

CREATE POLICY "users_send_messages"
ON public.direct_messages
FOR INSERT
TO authenticated
WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
        SELECT 1 FROM public.message_threads mt
        WHERE mt.id = thread_id
        AND (mt.participant_one_id = auth.uid() OR mt.participant_two_id = auth.uid())
    )
);

CREATE POLICY "users_update_own_messages"
ON public.direct_messages
FOR UPDATE
TO authenticated
USING (sender_id = auth.uid())
WITH CHECK (sender_id = auth.uid());

CREATE POLICY "users_delete_own_messages"
ON public.direct_messages
FOR DELETE
TO authenticated
USING (sender_id = auth.uid());

-- 9. RLS Policies for message_read_status
CREATE POLICY "users_view_read_status"
ON public.message_read_status
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.direct_messages dm
        JOIN public.message_threads mt ON dm.thread_id = mt.id
        WHERE dm.id = message_id
        AND (mt.participant_one_id = auth.uid() OR mt.participant_two_id = auth.uid())
    )
);

CREATE POLICY "users_manage_own_read_status"
ON public.message_read_status
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 10. Create trigger for updating thread last message
CREATE TRIGGER on_message_created
    AFTER INSERT ON public.direct_messages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_thread_last_message();

-- 11. Mock data for testing
DO $$
DECLARE
    user1_id UUID;
    user2_id UUID;
    user3_id UUID;
    thread1_id UUID := gen_random_uuid();
    thread2_id UUID := gen_random_uuid();
    message1_id UUID := gen_random_uuid();
    message2_id UUID := gen_random_uuid();
    message3_id UUID := gen_random_uuid();
    message4_id UUID := gen_random_uuid();
BEGIN
    -- Get existing users
    SELECT id INTO user1_id FROM public.user_profiles ORDER BY created_at LIMIT 1;
    SELECT id INTO user2_id FROM public.user_profiles ORDER BY created_at LIMIT 1 OFFSET 1;
    SELECT id INTO user3_id FROM public.user_profiles ORDER BY created_at LIMIT 1 OFFSET 2;

    IF user1_id IS NOT NULL AND user2_id IS NOT NULL THEN
        -- Create message threads
        INSERT INTO public.message_threads (id, participant_one_id, participant_two_id, last_message_content, last_message_at)
        VALUES 
            (thread1_id, user1_id, user2_id, 'Hey! How are you doing?', NOW() - INTERVAL '2 hours'),
            (thread2_id, user1_id, COALESCE(user3_id, user2_id), 'Did you see the latest election results?', NOW() - INTERVAL '1 day');

        -- Create messages for thread 1
        INSERT INTO public.direct_messages (id, thread_id, sender_id, content, created_at)
        VALUES 
            (message1_id, thread1_id, user1_id, 'Hey! How are you doing?', NOW() - INTERVAL '2 hours'),
            (message2_id, thread1_id, user2_id, 'I am doing great! Just voted in the new community election.', NOW() - INTERVAL '1 hour 50 minutes'),
            (gen_random_uuid(), thread1_id, user1_id, 'That is awesome! Which option did you choose?', NOW() - INTERVAL '1 hour 45 minutes'),
            (gen_random_uuid(), thread1_id, user2_id, 'I went with Option B. The prize pool is looking good!', NOW() - INTERVAL '1 hour 40 minutes');

        -- Create messages for thread 2
        INSERT INTO public.direct_messages (id, thread_id, sender_id, content, created_at)
        VALUES 
            (message3_id, thread2_id, user1_id, 'Did you see the latest election results?', NOW() - INTERVAL '1 day'),
            (message4_id, thread2_id, COALESCE(user3_id, user2_id), 'Yes! The turnout was incredible. Over 10,000 voters participated!', NOW() - INTERVAL '23 hours');

        -- Create read status (user2 has read messages in thread1)
        INSERT INTO public.message_read_status (message_id, user_id, read_at)
        VALUES 
            (message1_id, user2_id, NOW() - INTERVAL '1 hour 55 minutes'),
            (message2_id, user1_id, NOW() - INTERVAL '1 hour 48 minutes');

        RAISE NOTICE 'Mock messaging data created successfully';
    ELSE
        RAISE NOTICE 'Not enough users found. Please run user migration first.';
    END IF;
END $$;