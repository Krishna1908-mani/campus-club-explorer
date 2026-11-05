-- ====================================================================
-- CAMPUS CLUB EXPLORER — SAFE IDEMPOTENT PRODUCTION MIGRATION
-- File: supabase/migrations/02_safe_production_migration.sql
-- Description: Creates all 8 tables, indexes, triggers, storage bucket,
--              and RLS policies without dropping existing data.
-- ====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- --------------------------------------------------------------------
-- 2. CREATE TABLES (Idempotent: IF NOT EXISTS)
-- --------------------------------------------------------------------

-- Table 1: PROFILES (Linked with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    student_id TEXT,
    department TEXT,
    year_of_study TEXT,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
    avatar_url TEXT,
    bio TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Table 2: CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT DEFAULT 'Users',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

-- Table 3: CLUBS
CREATE TABLE IF NOT EXISTS public.clubs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    mission TEXT,
    activities_and_achievements TEXT,
    logo_url TEXT,
    cover_image_url TEXT,
    establishment_date DATE,
    faculty_coordinator TEXT,
    student_coordinator TEXT,
    contact_email TEXT,
    social_links JSONB NOT NULL DEFAULT '{}'::jsonb,
    member_count INTEGER NOT NULL DEFAULT 0 CHECK (member_count >= 0),
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_clubs_slug ON public.clubs(slug);
CREATE INDEX IF NOT EXISTS idx_clubs_category ON public.clubs(category_id);
CREATE INDEX IF NOT EXISTS idx_clubs_is_featured ON public.clubs(is_featured);
CREATE INDEX IF NOT EXISTS idx_clubs_is_active ON public.clubs(is_active);

-- Table 4: MEMBERSHIPS
CREATE TABLE IF NOT EXISTS public.memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    role_in_club TEXT NOT NULL DEFAULT 'member',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_user_club_membership UNIQUE (user_id, club_id)
);

CREATE INDEX IF NOT EXISTS idx_memberships_user_id ON public.memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_club_id ON public.memberships(club_id);
CREATE INDEX IF NOT EXISTS idx_memberships_status ON public.memberships(status);

-- Table 5: EVENTS
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    banner_url TEXT,
    event_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    venue TEXT NOT NULL,
    registration_url TEXT,
    max_participants INTEGER,
    status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_events_club_id ON public.events(club_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);

-- Table 6: ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_announcements_club_id ON public.announcements(club_id);

-- Table 7: FAVORITES
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_user_club_favorite UNIQUE (user_id, club_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_club_id ON public.favorites(club_id);

-- Table 8: EVENT REGISTRATIONS
CREATE TABLE IF NOT EXISTS public.event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    registration_status TEXT NOT NULL DEFAULT 'registered' CHECK (registration_status IN ('registered', 'attended', 'cancelled')),
    registered_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_user_event_registration UNIQUE (event_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_event_registrations_event ON public.event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user ON public.event_registrations(user_id);

-- --------------------------------------------------------------------
-- 3. AUTOMATIC TRIGGERS & SYNC FUNCTIONS
-- --------------------------------------------------------------------

-- Function: Automatically maintain updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_clubs_updated_at ON public.clubs;
CREATE TRIGGER set_clubs_updated_at
    BEFORE UPDATE ON public.clubs
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_memberships_updated_at ON public.memberships;
CREATE TRIGGER set_memberships_updated_at
    BEFORE UPDATE ON public.memberships
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_events_updated_at ON public.events;
CREATE TRIGGER set_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_announcements_updated_at ON public.announcements;
CREATE TRIGGER set_announcements_updated_at
    BEFORE UPDATE ON public.announcements
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function: Recalculate member_count on clubs when memberships change
CREATE OR REPLACE FUNCTION public.sync_club_member_count()
RETURNS TRIGGER AS $$
DECLARE
    target_club_id UUID;
BEGIN
    IF TG_OP = 'DELETE' THEN
        target_club_id := OLD.club_id;
    ELSE
        target_club_id := NEW.club_id;
    END IF;

    UPDATE public.clubs
    SET member_count = (
        SELECT COUNT(*)
        FROM public.memberships
        WHERE club_id = target_club_id AND status = 'approved'
    )
    WHERE id = target_club_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_club_member_count_trigger ON public.memberships;
CREATE TRIGGER update_club_member_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.memberships
    FOR EACH ROW EXECUTE FUNCTION public.sync_club_member_count();

-- Function: Automatically create profile when a user registers via Supabase auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        student_id,
        department,
        year_of_study,
        role
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'student_id',
        NEW.raw_user_meta_data->>'department',
        NEW.raw_user_meta_data->>'year_of_study',
        'student' -- Always default to student, NEVER trust role from client signup
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- --------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------------------

-- Helper function: Is current user an administrator?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Enable RLS on all 8 tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- 4.1 PROFILES POLICIES
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone"
    ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id AND
        (role = (SELECT role FROM public.profiles WHERE id = auth.uid()))
    );

DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile"
    ON public.profiles FOR UPDATE USING (public.is_admin());

-- 4.2 CATEGORIES POLICIES
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
CREATE POLICY "Categories are viewable by everyone"
    ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can insert categories" ON public.categories;
CREATE POLICY "Only admins can insert categories"
    ON public.categories FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Only admins can update categories" ON public.categories;
CREATE POLICY "Only admins can update categories"
    ON public.categories FOR UPDATE USING (public.is_admin());

DROP POLICY IF EXISTS "Only admins can delete categories" ON public.categories;
CREATE POLICY "Only admins can delete categories"
    ON public.categories FOR DELETE USING (public.is_admin());

-- 4.3 CLUBS POLICIES
DROP POLICY IF EXISTS "Active clubs viewable by everyone" ON public.clubs;
CREATE POLICY "Active clubs viewable by everyone"
    ON public.clubs FOR SELECT USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Only admins can insert clubs" ON public.clubs;
CREATE POLICY "Only admins can insert clubs"
    ON public.clubs FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Only admins can update clubs" ON public.clubs;
CREATE POLICY "Only admins can update clubs"
    ON public.clubs FOR UPDATE USING (public.is_admin());

DROP POLICY IF EXISTS "Only admins can delete clubs" ON public.clubs;
CREATE POLICY "Only admins can delete clubs"
    ON public.clubs FOR DELETE USING (public.is_admin());

-- 4.4 MEMBERSHIPS POLICIES
DROP POLICY IF EXISTS "Memberships viewable by owner or admin or if approved" ON public.memberships;
CREATE POLICY "Memberships viewable by owner or admin or if approved"
    ON public.memberships FOR SELECT
    USING (
        auth.uid() = user_id OR
        public.is_admin() OR
        status = 'approved'
    );

DROP POLICY IF EXISTS "Students can request to join a club" ON public.memberships;
CREATE POLICY "Students can request to join a club"
    ON public.memberships FOR INSERT
    WITH CHECK (
        auth.uid() = user_id AND
        status = 'pending'
    );

DROP POLICY IF EXISTS "Users can cancel their membership" ON public.memberships;
CREATE POLICY "Users can cancel their membership"
    ON public.memberships FOR DELETE
    USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Only admins can update membership status" ON public.memberships;
CREATE POLICY "Only admins can update membership status"
    ON public.memberships FOR UPDATE USING (public.is_admin());

-- 4.5 EVENTS POLICIES
DROP POLICY IF EXISTS "Events viewable by everyone" ON public.events;
CREATE POLICY "Events viewable by everyone"
    ON public.events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can create events" ON public.events;
CREATE POLICY "Only admins can create events"
    ON public.events FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Only admins can update events" ON public.events;
CREATE POLICY "Only admins can update events"
    ON public.events FOR UPDATE USING (public.is_admin());

DROP POLICY IF EXISTS "Only admins can delete events" ON public.events;
CREATE POLICY "Only admins can delete events"
    ON public.events FOR DELETE USING (public.is_admin());

-- 4.6 ANNOUNCEMENTS POLICIES
DROP POLICY IF EXISTS "Announcements viewable by everyone" ON public.announcements;
CREATE POLICY "Announcements viewable by everyone"
    ON public.announcements FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can insert announcements" ON public.announcements;
CREATE POLICY "Only admins can insert announcements"
    ON public.announcements FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Only admins can update announcements" ON public.announcements;
CREATE POLICY "Only admins can update announcements"
    ON public.announcements FOR UPDATE USING (public.is_admin());

DROP POLICY IF EXISTS "Only admins can delete announcements" ON public.announcements;
CREATE POLICY "Only admins can delete announcements"
    ON public.announcements FOR DELETE USING (public.is_admin());

-- 4.7 FAVORITES POLICIES
DROP POLICY IF EXISTS "Users can view their own favorites" ON public.favorites;
CREATE POLICY "Users can view their own favorites"
    ON public.favorites FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can add favorites" ON public.favorites;
CREATE POLICY "Users can add favorites"
    ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their favorites" ON public.favorites;
CREATE POLICY "Users can delete their favorites"
    ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- 4.8 EVENT REGISTRATIONS POLICIES
DROP POLICY IF EXISTS "Users can view registrations" ON public.event_registrations;
CREATE POLICY "Users can view registrations"
    ON public.event_registrations FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can register for events" ON public.event_registrations;
CREATE POLICY "Users can register for events"
    ON public.event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can cancel event registration" ON public.event_registrations;
CREATE POLICY "Users can cancel event registration"
    ON public.event_registrations FOR DELETE USING (auth.uid() = user_id OR public.is_admin());

-- --------------------------------------------------------------------
-- 5. STORAGE BUCKET CONFIGURATION (bucket: club-assets)
-- --------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('club-assets', 'club-assets', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Read Access on club-assets" ON storage.objects;
CREATE POLICY "Public Read Access on club-assets"
    ON storage.objects FOR SELECT USING (bucket_id = 'club-assets');

DROP POLICY IF EXISTS "Authenticated users can upload club assets" ON storage.objects;
CREATE POLICY "Authenticated users can upload club assets"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'club-assets' AND
        (
            auth.role() = 'authenticated' AND
            (storage.foldername(name))[1] = 'profiles'
            OR public.is_admin()
        )
    );

DROP POLICY IF EXISTS "Admins can delete club assets" ON storage.objects;
CREATE POLICY "Admins can delete club assets"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'club-assets' AND
        (public.is_admin() OR auth.uid()::text = (storage.foldername(name))[2])
    );
