-- Messaging Enhancements Migration
-- Tables: message_reactions, message_media_gallery
-- Features: Voice messages, emoji reactions, rich media gallery

-- 1. Add voice message support to direct_messages (already has message_type field)
-- Update message_type to support 'voice' in addition to 'text'
COMMENT ON COLUMN public.direct_messages.message_type IS 'Message type: text, voice, image, video, file';

-- 2. Create message_reactions table
CREATE TABLE public.message_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID REFERENCES public.direct_messages(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    reaction_emoji TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(message_id, user_id, reaction_emoji)
);

-- 3. Create message_media_gallery table for rich media attachments
CREATE TABLE public.message_media_gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID REFERENCES public.message_threads(id) ON DELETE CASCADE NOT NULL,
    message_id UUID REFERENCES public.direct_messages(id) ON DELETE CASCADE NOT NULL,
    media_type TEXT NOT NULL,
    media_url TEXT NOT NULL,
    media_alt TEXT,
    thumbnail_url TEXT,
    file_size BIGINT,
    duration INTEGER,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create indexes for performance
CREATE INDEX idx_message_reactions_message_id ON public.message_reactions(message_id);
CREATE INDEX idx_message_reactions_user_id ON public.message_reactions(user_id);
CREATE INDEX idx_message_media_gallery_thread_id ON public.message_media_gallery(thread_id);
CREATE INDEX idx_message_media_gallery_message_id ON public.message_media_gallery(message_id);
CREATE INDEX idx_message_media_gallery_media_type ON public.message_media_gallery(media_type);

-- 5. Enable RLS
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_media_gallery ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for message_reactions
CREATE POLICY "users_view_reactions_in_threads"
ON public.message_reactions
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

CREATE POLICY "users_add_reactions"
ON public.message_reactions
FOR INSERT
TO authenticated
WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
        SELECT 1 FROM public.direct_messages dm
        JOIN public.message_threads mt ON dm.thread_id = mt.id
        WHERE dm.id = message_id
        AND (mt.participant_one_id = auth.uid() OR mt.participant_two_id = auth.uid())
    )
);

CREATE POLICY "users_remove_own_reactions"
ON public.message_reactions
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- 7. RLS Policies for message_media_gallery
CREATE POLICY "users_view_thread_media"
ON public.message_media_gallery
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.message_threads mt
        WHERE mt.id = thread_id
        AND (mt.participant_one_id = auth.uid() OR mt.participant_two_id = auth.uid())
    )
);

CREATE POLICY "users_add_media"
ON public.message_media_gallery
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.message_threads mt
        WHERE mt.id = thread_id
        AND (mt.participant_one_id = auth.uid() OR mt.participant_two_id = auth.uid())
    )
);

CREATE POLICY "users_delete_own_media"
ON public.message_media_gallery
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.direct_messages dm
        WHERE dm.id = message_id
        AND dm.sender_id = auth.uid()
    )
);

-- 8. Mock data for testing
DO $$
DECLARE
    user1_id UUID;
    user2_id UUID;
    thread1_id UUID;
    message1_id UUID;
    message2_id UUID;
BEGIN
    -- Get existing users and thread
    SELECT id INTO user1_id FROM public.user_profiles ORDER BY created_at LIMIT 1;
    SELECT id INTO user2_id FROM public.user_profiles ORDER BY created_at LIMIT 1 OFFSET 1;
    SELECT id INTO thread1_id FROM public.message_threads ORDER BY created_at LIMIT 1;
    SELECT id INTO message1_id FROM public.direct_messages WHERE thread_id = thread1_id ORDER BY created_at LIMIT 1;
    SELECT id INTO message2_id FROM public.direct_messages WHERE thread_id = thread1_id ORDER BY created_at LIMIT 1 OFFSET 1;

    IF user1_id IS NOT NULL AND user2_id IS NOT NULL AND thread1_id IS NOT NULL THEN
        -- Add reactions to existing messages
        INSERT INTO public.message_reactions (message_id, user_id, reaction_emoji)
        VALUES 
            (message1_id, user2_id, '👍'),
            (message1_id, user1_id, '❤️'),
            (message2_id, user1_id, '😊');

        -- Add media gallery entries
        INSERT INTO public.message_media_gallery (thread_id, message_id, media_type, media_url, media_alt, thumbnail_url, file_size)
        VALUES 
            (thread1_id, message1_id, 'image', 'https://images.unsplash.com/photo-1557683316-973673baf926', 'Shared image from conversation', 'https://images.unsplash.com/photo-1557683316-973673baf926?w=200', 245678),
            (thread1_id, message2_id, 'video', 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4', 'Shared video clip', 'https://sample-videos.com/video123/thumbnail.jpg', 1048576);

        RAISE NOTICE 'Mock messaging enhancements data created successfully';
    ELSE
        RAISE NOTICE 'Required data not found. Please ensure users and threads exist.';
    END IF;
END $$;