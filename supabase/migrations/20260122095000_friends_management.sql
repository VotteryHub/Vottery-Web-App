-- Friends Management System Migration
-- Tables: friend_requests, friendships, followers
-- Features: Friend requests, connections, follower lists, social network

-- 1. Create friend_requests table
CREATE TABLE public.friend_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    receiver_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'pending',
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT different_users CHECK (sender_id != receiver_id),
    CONSTRAINT valid_status CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled'))
);

-- 2. Create friendships table
CREATE TABLE public.friendships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_one_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    user_two_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT different_friends CHECK (user_one_id != user_two_id),
    UNIQUE(user_one_id, user_two_id)
);

-- 3. Create followers table
CREATE TABLE public.followers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    following_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT different_follow_users CHECK (follower_id != following_id),
    UNIQUE(follower_id, following_id)
);

-- 4. Create indexes for performance
CREATE INDEX idx_friend_requests_sender ON public.friend_requests(sender_id);
CREATE INDEX idx_friend_requests_receiver ON public.friend_requests(receiver_id);
CREATE INDEX idx_friend_requests_status ON public.friend_requests(status);
CREATE INDEX idx_friendships_user_one ON public.friendships(user_one_id);
CREATE INDEX idx_friendships_user_two ON public.friendships(user_two_id);
CREATE INDEX idx_followers_follower ON public.followers(follower_id);
CREATE INDEX idx_followers_following ON public.followers(following_id);

-- 5. Create function to create friendship on request acceptance
CREATE OR REPLACE FUNCTION public.create_friendship_on_accept()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
        INSERT INTO public.friendships (user_one_id, user_two_id)
        VALUES (
            LEAST(NEW.sender_id, NEW.receiver_id),
            GREATEST(NEW.sender_id, NEW.receiver_id)
        )
        ON CONFLICT (user_one_id, user_two_id) DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$;

-- 6. Enable RLS
ALTER TABLE public.friend_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.followers ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies for friend_requests
CREATE POLICY "users_view_own_requests"
ON public.friend_requests
FOR SELECT
TO authenticated
USING (
    sender_id = auth.uid() OR receiver_id = auth.uid()
);

CREATE POLICY "users_send_requests"
ON public.friend_requests
FOR INSERT
TO authenticated
WITH CHECK (sender_id = auth.uid());

CREATE POLICY "users_update_received_requests"
ON public.friend_requests
FOR UPDATE
TO authenticated
USING (receiver_id = auth.uid() OR sender_id = auth.uid())
WITH CHECK (receiver_id = auth.uid() OR sender_id = auth.uid());

CREATE POLICY "users_delete_own_requests"
ON public.friend_requests
FOR DELETE
TO authenticated
USING (sender_id = auth.uid() OR receiver_id = auth.uid());

-- 8. RLS Policies for friendships
CREATE POLICY "users_view_friendships"
ON public.friendships
FOR SELECT
TO authenticated
USING (
    user_one_id = auth.uid() OR user_two_id = auth.uid()
);

CREATE POLICY "users_delete_own_friendships"
ON public.friendships
FOR DELETE
TO authenticated
USING (
    user_one_id = auth.uid() OR user_two_id = auth.uid()
);

-- 9. RLS Policies for followers
CREATE POLICY "users_view_followers"
ON public.followers
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "users_follow_others"
ON public.followers
FOR INSERT
TO authenticated
WITH CHECK (follower_id = auth.uid());

CREATE POLICY "users_unfollow"
ON public.followers
FOR DELETE
TO authenticated
USING (follower_id = auth.uid());

-- 10. Create trigger for friendship creation
CREATE TRIGGER on_friend_request_accepted
    AFTER UPDATE ON public.friend_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.create_friendship_on_accept();

-- 11. Mock data for testing
DO $$
DECLARE
    user1_id UUID;
    user2_id UUID;
    user3_id UUID;
BEGIN
    -- Get existing users
    SELECT id INTO user1_id FROM public.user_profiles ORDER BY created_at LIMIT 1;
    SELECT id INTO user2_id FROM public.user_profiles ORDER BY created_at LIMIT 1 OFFSET 1;
    SELECT id INTO user3_id FROM public.user_profiles ORDER BY created_at LIMIT 1 OFFSET 2;

    IF user1_id IS NOT NULL AND user2_id IS NOT NULL THEN
        -- Create friend requests
        INSERT INTO public.friend_requests (sender_id, receiver_id, status, message)
        VALUES 
            (user2_id, user1_id, 'pending', 'Hey! Let\'s connect on Vottery!'),
            (user1_id, user2_id, 'accepted', 'Would love to connect!');

        IF user3_id IS NOT NULL THEN
            INSERT INTO public.friend_requests (sender_id, receiver_id, status, message)
            VALUES 
                (user3_id, user1_id, 'pending', 'Saw your voting activity. Let\'s be friends!'),
                (user1_id, user3_id, 'pending', 'Great to see you here!');
        END IF;

        -- Create friendships (user1 and user2 are friends)
        INSERT INTO public.friendships (user_one_id, user_two_id)
        VALUES (LEAST(user1_id, user2_id), GREATEST(user1_id, user2_id))
        ON CONFLICT DO NOTHING;

        -- Create follower relationships
        IF user3_id IS NOT NULL THEN
            INSERT INTO public.followers (follower_id, following_id)
            VALUES 
                (user1_id, user2_id),
                (user2_id, user1_id),
                (user3_id, user1_id),
                (user1_id, user3_id)
            ON CONFLICT DO NOTHING;
        END IF;

        RAISE NOTICE 'Mock friends management data created successfully';
    ELSE
        RAISE NOTICE 'Not enough users found. Please run user migration first.';
    END IF;
END $$;