-- =====================================================
-- VOTTERY PLATFORM: Elections, Votes, and User Profiles
-- Migration: 20260122041700_elections_votes_profiles.sql
-- =====================================================

-- 1. CUSTOM TYPES (IDEMPOTENT)
-- =====================================================

DO $$ BEGIN
    CREATE TYPE public.voting_type AS ENUM ('Plurality', 'Ranked Choice', 'Approval');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.election_status AS ENUM ('active', 'upcoming', 'completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('user', 'admin', 'moderator');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. CORE TABLES
-- =====================================================

-- User Profiles (intermediary table for auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    location TEXT,
    date_of_birth DATE,
    occupation TEXT,
    website TEXT,
    avatar TEXT,
    bio TEXT,
    verified BOOLEAN DEFAULT false,
    role public.user_role DEFAULT 'user'::public.user_role,
    interests JSONB DEFAULT '[]'::jsonb,
    languages JSONB DEFAULT '[]'::jsonb,
    stats JSONB DEFAULT '{"votes": 0, "elections": 0, "friends": 0, "groups": 0}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Elections Table
CREATE TABLE IF NOT EXISTS public.elections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT,
    voting_type public.voting_type DEFAULT 'Plurality'::public.voting_type,
    cover_image TEXT,
    cover_image_alt TEXT,
    total_voters INTEGER DEFAULT 0,
    end_date TEXT,
    entry_fee TEXT DEFAULT 'Free',
    is_gamified BOOLEAN DEFAULT false,
    prize_pool TEXT,
    number_of_winners INTEGER DEFAULT 0,
    status public.election_status DEFAULT 'active'::public.election_status,
    media_type TEXT,
    media_url TEXT,
    media_alt TEXT,
    minimum_watch_time INTEGER DEFAULT 0,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Election Options Table
CREATE TABLE IF NOT EXISTS public.election_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    election_id UUID REFERENCES public.elections(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    image TEXT,
    image_alt TEXT,
    option_order INTEGER DEFAULT 0,
    vote_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Votes Table
CREATE TABLE IF NOT EXISTS public.votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    election_id UUID REFERENCES public.elections(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    selected_option_id UUID REFERENCES public.election_options(id) ON DELETE SET NULL,
    ranked_choices JSONB DEFAULT '[]'::jsonb,
    selected_options JSONB DEFAULT '[]'::jsonb,
    blockchain_hash TEXT NOT NULL,
    vote_hash TEXT NOT NULL,
    gamified_ticket_id TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(election_id, user_id)
);

-- Posts Table (for home feed)
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    image TEXT,
    image_alt TEXT,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON public.user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_elections_status ON public.elections(status);
CREATE INDEX IF NOT EXISTS idx_elections_created_by ON public.elections(created_by);
CREATE INDEX IF NOT EXISTS idx_elections_category ON public.elections(category);
CREATE INDEX IF NOT EXISTS idx_election_options_election_id ON public.election_options(election_id);
CREATE INDEX IF NOT EXISTS idx_votes_election_id ON public.votes(election_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON public.votes(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);

-- 4. FUNCTIONS (BEFORE RLS POLICIES)
-- =====================================================

-- Trigger function to create user profile automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.user_profiles (
        id,
        name,
        username,
        email,
        avatar,
        role,
        interests,
        languages
    ) VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
        COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'user'::public.user_role),
        COALESCE((NEW.raw_user_meta_data->>'interests')::jsonb, '[]'::jsonb),
        COALESCE((NEW.raw_user_meta_data->>'languages')::jsonb, '[]'::jsonb)
    );
    RETURN NEW;
END;
$$;

-- Function to update election vote count
CREATE OR REPLACE FUNCTION public.update_election_vote_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.elections
        SET total_voters = total_voters + 1
        WHERE id = NEW.election_id;
        
        -- Update user stats
        UPDATE public.user_profiles
        SET stats = jsonb_set(
            stats,
            '{votes}',
            to_jsonb(COALESCE((stats->>'votes')::int, 0) + 1)
        )
        WHERE id = NEW.user_id;
        
        -- Update option vote count for Plurality voting
        IF NEW.selected_option_id IS NOT NULL THEN
            UPDATE public.election_options
            SET vote_count = vote_count + 1
            WHERE id = NEW.selected_option_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- 5. ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.elections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.election_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 6. ROW LEVEL SECURITY POLICIES
-- =====================================================

-- User Profiles Policies
DROP POLICY IF EXISTS "Users can view all profiles" ON public.user_profiles;
CREATE POLICY "Users can view all profiles"
    ON public.user_profiles FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile"
    ON public.user_profiles FOR UPDATE
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
CREATE POLICY "Users can insert own profile"
    ON public.user_profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Admins have full access to profiles" ON public.user_profiles;
CREATE POLICY "Admins have full access to profiles"
    ON public.user_profiles FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Elections Policies
DROP POLICY IF EXISTS "Anyone can view active elections" ON public.elections;
CREATE POLICY "Anyone can view active elections"
    ON public.elections FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can create elections" ON public.elections;
CREATE POLICY "Authenticated users can create elections"
    ON public.elections FOR INSERT
    WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can update own elections" ON public.elections;
CREATE POLICY "Users can update own elections"
    ON public.elections FOR UPDATE
    USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can delete own elections" ON public.elections;
CREATE POLICY "Users can delete own elections"
    ON public.elections FOR DELETE
    USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Admins have full access to elections" ON public.elections;
CREATE POLICY "Admins have full access to elections"
    ON public.elections FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Election Options Policies
DROP POLICY IF EXISTS "Anyone can view election options" ON public.election_options;
CREATE POLICY "Anyone can view election options"
    ON public.election_options FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Election creators can manage options" ON public.election_options;
CREATE POLICY "Election creators can manage options"
    ON public.election_options FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.elections
            WHERE elections.id = election_options.election_id
            AND elections.created_by = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Admins have full access to options" ON public.election_options;
CREATE POLICY "Admins have full access to options"
    ON public.election_options FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Votes Policies
DROP POLICY IF EXISTS "Users can view own votes" ON public.votes;
CREATE POLICY "Users can view own votes"
    ON public.votes FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Authenticated users can cast votes" ON public.votes;
CREATE POLICY "Authenticated users can cast votes"
    ON public.votes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all votes" ON public.votes;
CREATE POLICY "Admins can view all votes"
    ON public.votes FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Posts Policies
DROP POLICY IF EXISTS "Anyone can view posts" ON public.posts;
CREATE POLICY "Anyone can view posts"
    ON public.posts FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.posts;
CREATE POLICY "Authenticated users can create posts"
    ON public.posts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own posts" ON public.posts;
CREATE POLICY "Users can update own posts"
    ON public.posts FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own posts" ON public.posts;
CREATE POLICY "Users can delete own posts"
    ON public.posts FOR DELETE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins have full access to posts" ON public.posts;
CREATE POLICY "Admins have full access to posts"
    ON public.posts FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 7. TRIGGERS
-- =====================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS on_vote_cast ON public.votes;
CREATE TRIGGER on_vote_cast
    AFTER INSERT ON public.votes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_election_vote_count();

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_elections_updated_at ON public.elections;
CREATE TRIGGER update_elections_updated_at
    BEFORE UPDATE ON public.elections
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_posts_updated_at ON public.posts;
CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON public.posts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 8. MOCK DATA FOR TESTING (IDEMPOTENT)
-- =====================================================

DO $$
DECLARE
    admin_uuid UUID := '11111111-1111-1111-1111-111111111111';
    user1_uuid UUID := '22222222-2222-2222-2222-222222222222';
    user2_uuid UUID := '33333333-3333-3333-3333-333333333333';
    election1_uuid UUID := gen_random_uuid();
    election2_uuid UUID := gen_random_uuid();
    election3_uuid UUID := gen_random_uuid();
    option1_uuid UUID := gen_random_uuid();
    option2_uuid UUID := gen_random_uuid();
    option3_uuid UUID := gen_random_uuid();
    option4_uuid UUID := gen_random_uuid();
    user_exists BOOLEAN;
BEGIN
    -- Check if mock users already exist
    SELECT EXISTS (
        SELECT 1 FROM auth.users WHERE email IN ('admin@vottery.com', 'john.doe@vottery.com', 'sarah.martinez@vottery.com')
    ) INTO user_exists;

    -- Only insert users if they don't exist
    IF NOT user_exists THEN
        -- Create auth users (trigger will create user_profiles automatically)
        INSERT INTO auth.users (
            id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
            created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
            is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
            recovery_token, recovery_sent_at, email_change_token_new, email_change,
            email_change_sent_at, email_change_token_current, email_change_confirm_status,
            reauthentication_token, reauthentication_sent_at, phone, phone_change,
            phone_change_token, phone_change_sent_at
        ) VALUES
            (
                admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
                'admin@vottery.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
                jsonb_build_object(
                    'full_name', 'Admin User',
                    'username', 'admin',
                    'avatar_url', 'https://randomuser.me/api/portraits/men/1.jpg',
                    'role', 'admin',
                    'interests', jsonb_build_array('Politics', 'Technology', 'Democracy'),
                    'languages', jsonb_build_array(
                        jsonb_build_object('name', 'English', 'proficiency', 'Native')
                    )
                ),
                jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email')),
                false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null
            ),
            (
                user1_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
                'john.doe@vottery.com', crypt('SecurePass123!', gen_salt('bf', 10)), now(), now(), now(),
                jsonb_build_object(
                    'full_name', 'John Doe',
                    'username', 'johndoe',
                    'avatar_url', 'https://randomuser.me/api/portraits/men/32.jpg',
                    'role', 'user',
                    'interests', jsonb_build_array('Politics', 'Technology', 'Blockchain', 'Democracy', 'Social Justice', 'Environment'),
                    'languages', jsonb_build_array(
                        jsonb_build_object('name', 'English', 'proficiency', 'Native'),
                        jsonb_build_object('name', 'Spanish', 'proficiency', 'Intermediate'),
                        jsonb_build_object('name', 'French', 'proficiency', 'Beginner')
                    )
                ),
                jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email')),
                false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null
            ),
            (
                user2_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
                'sarah.martinez@vottery.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
                jsonb_build_object(
                    'full_name', 'Sarah Martinez',
                    'username', 'sarahm',
                    'avatar_url', 'https://randomuser.me/api/portraits/women/44.jpg',
                    'role', 'user',
                    'interests', jsonb_build_array('Community', 'Education', 'Politics'),
                    'languages', jsonb_build_array(
                        jsonb_build_object('name', 'English', 'proficiency', 'Native'),
                        jsonb_build_object('name', 'Spanish', 'proficiency', 'Native')
                    )
                ),
                jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email')),
                false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null
            );

        -- Update user profiles with additional details (trigger created basic profiles)
        UPDATE public.user_profiles
        SET 
            phone = '+1 (555) 123-4567',
            location = 'San Francisco, CA',
            date_of_birth = '1990-01-15',
            occupation = 'Software Engineer',
            website = 'https://johndoe.com',
            bio = 'Passionate about democratic participation and blockchain technology. Advocate for transparent voting systems and civic engagement. Building a better future through technology and community involvement.',
            verified = true,
            stats = jsonb_build_object('votes', 127, 'elections', 23, 'friends', 456, 'groups', 12)
        WHERE id = user1_uuid;

        UPDATE public.user_profiles
        SET 
            location = 'Austin, TX',
            occupation = 'Community Organizer',
            bio = 'Former school board member with 15 years of community organizing experience. Focused on affordable housing and public transportation improvements.',
            verified = true,
            stats = jsonb_build_object('votes', 89, 'elections', 12, 'friends', 234, 'groups', 8)
        WHERE id = user2_uuid;

        -- Create Elections
        INSERT INTO public.elections (
            id, title, description, category, voting_type, cover_image, cover_image_alt,
            total_voters, end_date, entry_fee, is_gamified, prize_pool, number_of_winners,
            status, media_type, media_url, media_alt, minimum_watch_time, created_by
        ) VALUES
            (
                election1_uuid,
                '2026 City Council Representative Election',
                'Vote for your preferred candidate to represent District 5 in the City Council. This election will determine local policy direction for infrastructure, education, and community development over the next four years.',
                'Local Government',
                'Plurality'::public.voting_type,
                'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800',
                'Modern city council chamber with wooden benches and American flag, professional government meeting space with natural lighting',
                12847,
                'Feb 15, 2026',
                'Free',
                true,
                '$50,000',
                10,
                'active'::public.election_status,
                'video',
                'https://www.w3schools.com/html/mov_bbb.mp4',
                'Campaign video showing diverse community members discussing local issues and candidate platforms in urban neighborhood setting',
                30,
                admin_uuid
            ),
            (
                election2_uuid,
                'State Education Budget Referendum',
                'Vote on the proposed $2.5 billion education budget increase for public schools. This referendum will determine funding for teacher salaries, classroom resources, and infrastructure improvements.',
                'State',
                'Approval'::public.voting_type,
                'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
                'Bright modern classroom with students engaged in learning, large windows with natural light, representing quality education',
                8432,
                'Mar 1, 2026',
                'Free',
                false,
                null,
                0,
                'active'::public.election_status,
                null,
                null,
                null,
                0,
                admin_uuid
            ),
            (
                election3_uuid,
                '2026 Presidential Election Primary',
                'Cast your vote in the presidential primary election. Your choice will help determine the party nominee for the upcoming general election.',
                'National',
                'Ranked Choice'::public.voting_type,
                'https://images.pexels.com/photos/1550337/pexels-photo-1550337.jpeg?w=800',
                'American flag waving proudly against clear blue sky with sunlight creating dramatic lighting and patriotic atmosphere',
                25691,
                'Jan 30, 2026',
                'Free',
                true,
                '$100,000',
                25,
                'upcoming'::public.election_status,
                null,
                null,
                null,
                0,
                admin_uuid
            );

        -- Create Election Options for Election 1 (City Council)
        INSERT INTO public.election_options (
            id, election_id, title, description, image, image_alt, option_order, vote_count
        ) VALUES
            (
                option1_uuid,
                election1_uuid,
                'Sarah Martinez',
                'Former school board member with 15 years of community organizing experience. Focused on affordable housing and public transportation improvements.',
                'https://randomuser.me/api/portraits/women/44.jpg',
                'Professional headshot of Hispanic woman with shoulder-length brown hair in navy blazer smiling warmly at camera',
                1,
                4523
            ),
            (
                option2_uuid,
                election1_uuid,
                'James Chen',
                'Small business owner and environmental advocate. Prioritizes green infrastructure, local business support, and sustainable development initiatives.',
                'https://randomuser.me/api/portraits/men/32.jpg',
                'Professional headshot of Asian man with short black hair in gray suit with confident expression',
                2,
                3891
            ),
            (
                option3_uuid,
                election1_uuid,
                'Patricia Johnson',
                'Retired police chief with strong public safety background. Advocates for community policing, youth programs, and neighborhood revitalization.',
                'https://randomuser.me/api/portraits/women/68.jpg',
                'Professional headshot of African American woman with short gray hair in black blazer with warm smile',
                3,
                2734
            ),
            (
                option4_uuid,
                election1_uuid,
                'Michael O''Brien',
                'Technology entrepreneur and education reform advocate. Focuses on digital infrastructure, STEM education, and innovation district development.',
                'https://randomuser.me/api/portraits/men/52.jpg',
                'Professional headshot of Caucasian man with red hair and beard in blue shirt with friendly expression',
                4,
                1699
            );

        -- Create sample posts
        INSERT INTO public.posts (user_id, content, image, image_alt, likes, comments, shares) VALUES
            (
                user1_uuid,
                'Just cast my vote in the City Council election! Democracy in action. Every vote counts!',
                'https://images.pixabay.com/photo/2016/11/22/19/15/hand-1850120_1280.jpg',
                'Close-up of diverse hands placing voting ballots into transparent ballot box, symbolizing democratic participation and civic duty',
                234,
                45,
                12
            ),
            (
                user2_uuid,
                'Excited to see such high participation in our local elections. This is what community engagement looks like!',
                null,
                null,
                156,
                28,
                8
            );

        RAISE NOTICE 'Mock data created successfully';
        RAISE NOTICE 'Demo Credentials:';
        RAISE NOTICE '  Admin: admin@vottery.com / admin123';
        RAISE NOTICE '  User 1: john.doe@vottery.com / SecurePass123!';
        RAISE NOTICE '  User 2: sarah.martinez@vottery.com / password123';
    ELSE
        RAISE NOTICE 'Mock data already exists, skipping insertion';
    END IF;
END $$;