-- Social Activity Feed Migration
-- Tables: activity_feed
-- Features: Personalized activity timeline, friend voting participation, election updates, achievement unlocks, social interactions

-- 1. Create activity_type enum
CREATE TYPE public.activity_type AS ENUM (
    'vote',
    'election_created',
    'election_completed',
    'achievement_unlocked',
    'friend_request_accepted',
    'post_liked',
    'post_commented',
    'post_shared',
    'new_follower',
    'message_received'
);

-- 2. Create activity_feed table
CREATE TABLE public.activity_feed (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    actor_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    activity_type public.activity_type NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    reference_id UUID,
    reference_type TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create indexes for performance
CREATE INDEX idx_activity_feed_user_id ON public.activity_feed(user_id);
CREATE INDEX idx_activity_feed_actor_id ON public.activity_feed(actor_id);
CREATE INDEX idx_activity_feed_activity_type ON public.activity_feed(activity_type);
CREATE INDEX idx_activity_feed_created_at ON public.activity_feed(created_at DESC);
CREATE INDEX idx_activity_feed_is_read ON public.activity_feed(is_read);
CREATE INDEX idx_activity_feed_reference ON public.activity_feed(reference_id, reference_type);

-- 4. Enable RLS
ALTER TABLE public.activity_feed ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
CREATE POLICY "users_view_own_activity_feed"
ON public.activity_feed
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "users_update_own_activity_feed"
ON public.activity_feed
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "system_insert_activity_feed"
ON public.activity_feed
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 6. Create function to generate activity on vote
CREATE OR REPLACE FUNCTION public.create_vote_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    election_title TEXT;
    friend_ids UUID[];
BEGIN
    -- Check if friendships table exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'friendships') THEN
        RETURN NEW;
    END IF;

    -- Get election title
    SELECT title INTO election_title FROM public.elections WHERE id = NEW.election_id;
    
    -- Get friend IDs (users who are friends with the voter)
    SELECT ARRAY_AGG(DISTINCT friend_id) INTO friend_ids
    FROM (
        SELECT user_two_id AS friend_id FROM public.friendships WHERE user_one_id = NEW.user_id
        UNION
        SELECT user_one_id AS friend_id FROM public.friendships WHERE user_two_id = NEW.user_id
    ) AS friends;
    
    -- Create activity for each friend
    IF friend_ids IS NOT NULL THEN
        INSERT INTO public.activity_feed (user_id, actor_id, activity_type, title, description, reference_id, reference_type, metadata)
        SELECT 
            friend_id,
            NEW.user_id,
            'vote'::public.activity_type,
            'Friend voted in an election',
            'A friend participated in: ' || election_title,
            NEW.election_id,
            'election',
            jsonb_build_object('vote_id', NEW.id, 'election_title', election_title)
        FROM UNNEST(friend_ids) AS friend_id;
    END IF;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RETURN NEW;
END;
$$;

-- 7. Create function to generate activity on election creation
CREATE OR REPLACE FUNCTION public.create_election_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    follower_ids UUID[];
BEGIN
    -- Check if followers table exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'followers') THEN
        RETURN NEW;
    END IF;

    -- Get follower IDs (users who follow the election creator)
    SELECT ARRAY_AGG(follower_id) INTO follower_ids
    FROM public.followers
    WHERE following_id = NEW.created_by;
    
    -- Create activity for each follower
    IF follower_ids IS NOT NULL THEN
        INSERT INTO public.activity_feed (user_id, actor_id, activity_type, title, description, reference_id, reference_type, metadata)
        SELECT 
            follower_id,
            NEW.created_by,
            'election_created'::public.activity_type,
            'New election created',
            NEW.title,
            NEW.id,
            'election',
            jsonb_build_object('election_id', NEW.id, 'category', NEW.category, 'prize_pool', NEW.prize_pool)
        FROM UNNEST(follower_ids) AS follower_id;
    END IF;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RETURN NEW;
END;
$$;

-- 8. Create function to generate activity on post interaction
CREATE OR REPLACE FUNCTION public.create_post_interaction_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if posts table exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'posts') THEN
        RETURN NEW;
    END IF;

    -- Only create activity if likes/comments/shares increased
    IF (NEW.likes > OLD.likes OR NEW.comments > OLD.comments OR NEW.shares > OLD.shares) AND NEW.user_id != auth.uid() THEN
        INSERT INTO public.activity_feed (user_id, actor_id, activity_type, title, description, reference_id, reference_type, metadata)
        VALUES (
            NEW.user_id,
            auth.uid(),
            CASE 
                WHEN NEW.likes > OLD.likes THEN 'post_liked'::public.activity_type
                WHEN NEW.comments > OLD.comments THEN 'post_commented'::public.activity_type
                WHEN NEW.shares > OLD.shares THEN 'post_shared'::public.activity_type
            END,
            CASE 
                WHEN NEW.likes > OLD.likes THEN 'Someone liked your post'
                WHEN NEW.comments > OLD.comments THEN 'Someone commented on your post'
                WHEN NEW.shares > OLD.shares THEN 'Someone shared your post'
            END,
            LEFT(NEW.content, 100),
            NEW.id,
            'post',
            jsonb_build_object('post_id', NEW.id)
        );
    END IF;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RETURN NEW;
END;
$$;

-- 9. Create function to generate activity on friend request acceptance
CREATE OR REPLACE FUNCTION public.create_friend_request_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
        -- Create activity for sender
        INSERT INTO public.activity_feed (user_id, actor_id, activity_type, title, description, reference_id, reference_type, metadata)
        VALUES (
            NEW.sender_id,
            NEW.receiver_id,
            'friend_request_accepted'::public.activity_type,
            'Friend request accepted',
            'Your friend request was accepted',
            NEW.id,
            'friend_request',
            jsonb_build_object('friend_request_id', NEW.id)
        );
    END IF;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RETURN NEW;
END;
$$;

-- 10. Create function to generate activity on new follower
CREATE OR REPLACE FUNCTION public.create_follower_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.activity_feed (user_id, actor_id, activity_type, title, description, reference_id, reference_type, metadata)
    VALUES (
        NEW.following_id,
        NEW.follower_id,
        'new_follower'::public.activity_type,
        'New follower',
        'Someone started following you',
        NEW.id,
        'follower',
        jsonb_build_object('follower_id', NEW.follower_id)
    );
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RETURN NEW;
END;
$$;

-- 11. Create triggers (only if tables exist)
DO $$
BEGIN
    -- Trigger for votes
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'votes') THEN
        CREATE TRIGGER on_vote_created_activity
            AFTER INSERT ON public.votes
            FOR EACH ROW
            EXECUTE FUNCTION public.create_vote_activity();
    END IF;

    -- Trigger for elections
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'elections') THEN
        CREATE TRIGGER on_election_created
            AFTER INSERT ON public.elections
            FOR EACH ROW
            EXECUTE FUNCTION public.create_election_activity();
    END IF;

    -- Trigger for posts
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'posts') THEN
        CREATE TRIGGER on_post_interaction
            AFTER UPDATE ON public.posts
            FOR EACH ROW
            EXECUTE FUNCTION public.create_post_interaction_activity();
    END IF;

    -- Trigger for friend_requests
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'friend_requests') THEN
        CREATE TRIGGER on_friend_request_accepted_activity
            AFTER UPDATE ON public.friend_requests
            FOR EACH ROW
            EXECUTE FUNCTION public.create_friend_request_activity();
    END IF;

    -- Trigger for followers
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'followers') THEN
        CREATE TRIGGER on_new_follower
            AFTER INSERT ON public.followers
            FOR EACH ROW
            EXECUTE FUNCTION public.create_follower_activity();
    END IF;
END $$;

-- 12. Mock data for testing
DO $$
DECLARE
    user1_id UUID;
    user2_id UUID;
    user3_id UUID;
    election1_id UUID;
    post1_id UUID;
BEGIN
    -- Get existing users
    SELECT id INTO user1_id FROM public.user_profiles ORDER BY created_at LIMIT 1;
    SELECT id INTO user2_id FROM public.user_profiles ORDER BY created_at LIMIT 1 OFFSET 1;
    SELECT id INTO user3_id FROM public.user_profiles ORDER BY created_at LIMIT 1 OFFSET 2;
    
    -- Get existing election and post
    SELECT id INTO election1_id FROM public.elections ORDER BY created_at LIMIT 1;
    SELECT id INTO post1_id FROM public.posts ORDER BY created_at LIMIT 1;

    IF user1_id IS NOT NULL AND user2_id IS NOT NULL THEN
        -- Create sample activities
        INSERT INTO public.activity_feed (user_id, actor_id, activity_type, title, description, reference_id, reference_type, metadata, created_at)
        VALUES 
            (user1_id, user2_id, 'vote'::public.activity_type, 'Friend voted in an election', 'A friend participated in: Best Pizza Topping', election1_id, 'election', '{"vote_id": "sample", "election_title": "Best Pizza Topping"}'::jsonb, NOW() - INTERVAL '2 hours'),
            (user1_id, user2_id, 'post_liked'::public.activity_type, 'Someone liked your post', 'Your post about voting got a like', post1_id, 'post', '{"post_id": "sample"}'::jsonb, NOW() - INTERVAL '4 hours'),
            (user1_id, user3_id, 'friend_request_accepted'::public.activity_type, 'Friend request accepted', 'Your friend request was accepted', NULL, 'friend_request', '{"friend_request_id": "sample"}'::jsonb, NOW() - INTERVAL '1 day'),
            (user1_id, user2_id, 'election_created'::public.activity_type, 'New election created', 'Favorite Programming Language', election1_id, 'election', '{"election_id": "sample", "category": "Technology", "prize_pool": "$500"}'::jsonb, NOW() - INTERVAL '6 hours'),
            (user1_id, user3_id, 'new_follower'::public.activity_type, 'New follower', 'Someone started following you', NULL, 'follower', '{"follower_id": "sample"}'::jsonb, NOW() - INTERVAL '12 hours'),
            (user1_id, user2_id, 'achievement_unlocked'::public.activity_type, 'Achievement unlocked', 'You earned the "First Vote" badge!', NULL, 'achievement', '{"achievement_name": "First Vote", "rarity": "common"}'::jsonb, NOW() - INTERVAL '3 days'),
            (user1_id, user3_id, 'post_commented'::public.activity_type, 'Someone commented on your post', 'Great insights on the election results!', post1_id, 'post', '{"post_id": "sample"}'::jsonb, NOW() - INTERVAL '8 hours'),
            (user1_id, user2_id, 'post_shared'::public.activity_type, 'Someone shared your post', 'Your election announcement was shared', post1_id, 'post', '{"post_id": "sample"}'::jsonb, NOW() - INTERVAL '5 hours');

        IF user3_id IS NOT NULL THEN
            INSERT INTO public.activity_feed (user_id, actor_id, activity_type, title, description, reference_id, reference_type, metadata, created_at)
            VALUES 
                (user2_id, user1_id, 'vote'::public.activity_type, 'Friend voted in an election', 'A friend participated in: Best Movie of 2024', election1_id, 'election', '{"vote_id": "sample2", "election_title": "Best Movie of 2024"}'::jsonb, NOW() - INTERVAL '1 hour'),
                (user2_id, user3_id, 'new_follower'::public.activity_type, 'New follower', 'Someone started following you', NULL, 'follower', '{"follower_id": "sample2"}'::jsonb, NOW() - INTERVAL '10 hours'),
                (user3_id, user1_id, 'election_created'::public.activity_type, 'New election created', 'Best Coffee Shop in Town', election1_id, 'election', '{"election_id": "sample3", "category": "Food & Drink", "prize_pool": "$200"}'::jsonb, NOW() - INTERVAL '2 days');
        END IF;

        RAISE NOTICE 'Mock social activity feed data created successfully';
    ELSE
        RAISE NOTICE 'Not enough users found. Please run user migration first.';
    END IF;
END $$;