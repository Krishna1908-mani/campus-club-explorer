-- ====================================================================
-- CAMPUS CLUB EXPLORER — SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
-- File: policies.sql
-- ====================================================================

-- 1. Helper function to check if the current user is an admin
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

-- --------------------------------------------------------------------
-- 2. ENABLE RLS ON ALL PUBLIC TABLES
-- --------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------
-- 3. PROFILES POLICIES
-- --------------------------------------------------------------------
-- Anyone can view profile summaries (needed to show coordinators and members)
CREATE POLICY "Profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

-- Users can only insert their own profile
CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Users can update their own profile, but CANNOT self-elevate role to admin
CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id AND
        (role = (SELECT role FROM public.profiles WHERE id = auth.uid()))
    );

-- Admins can update any profile (including granting admin role)
CREATE POLICY "Admins can update any profile"
    ON public.profiles FOR UPDATE
    USING (public.is_admin());

-- --------------------------------------------------------------------
-- 4. CATEGORIES POLICIES
-- --------------------------------------------------------------------
-- Everyone can view categories
CREATE POLICY "Categories are viewable by everyone"
    ON public.categories FOR SELECT
    USING (true);

-- Only admins can manage categories
CREATE POLICY "Only admins can insert categories"
    ON public.categories FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update categories"
    ON public.categories FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Only admins can delete categories"
    ON public.categories FOR DELETE
    USING (public.is_admin());

-- --------------------------------------------------------------------
-- 5. CLUBS POLICIES
-- --------------------------------------------------------------------
-- Anyone can view active clubs; Admins can view all clubs (including inactive)
CREATE POLICY "Active clubs viewable by everyone"
    ON public.clubs FOR SELECT
    USING (is_active = true OR public.is_admin());

-- Only admins can insert, update, delete clubs
CREATE POLICY "Only admins can insert clubs"
    ON public.clubs FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update clubs"
    ON public.clubs FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Only admins can delete clubs"
    ON public.clubs FOR DELETE
    USING (public.is_admin());

-- --------------------------------------------------------------------
-- 6. MEMBERSHIPS POLICIES
-- --------------------------------------------------------------------
-- Users can view their own memberships; Admins can view all; Approved memberships visible to all
CREATE POLICY "Memberships viewable by owner or admin or if approved"
    ON public.memberships FOR SELECT
    USING (
        auth.uid() = user_id OR
        public.is_admin() OR
        status = 'approved'
    );

-- Students can request to join a club (defaults to pending)
CREATE POLICY "Students can request to join a club"
    ON public.memberships FOR INSERT
    WITH CHECK (
        auth.uid() = user_id AND
        status = 'pending'
    );

-- Users can leave a club (delete their own membership) or Admins can delete
CREATE POLICY "Users can cancel their membership"
    ON public.memberships FOR DELETE
    USING (auth.uid() = user_id OR public.is_admin());

-- ONLY Admins can approve or reject memberships (update status)
CREATE POLICY "Only admins can update membership status"
    ON public.memberships FOR UPDATE
    USING (public.is_admin());

-- --------------------------------------------------------------------
-- 7. EVENTS POLICIES
-- --------------------------------------------------------------------
-- Everyone can view events
CREATE POLICY "Events viewable by everyone"
    ON public.events FOR SELECT
    USING (true);

-- Only admins can create, update, delete events
CREATE POLICY "Only admins can create events"
    ON public.events FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update events"
    ON public.events FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Only admins can delete events"
    ON public.events FOR DELETE
    USING (public.is_admin());

-- --------------------------------------------------------------------
-- 8. ANNOUNCEMENTS POLICIES
-- --------------------------------------------------------------------
-- Announcements are viewable by everyone
CREATE POLICY "Announcements viewable by everyone"
    ON public.announcements FOR SELECT
    USING (true);

-- Only admins can create, update, delete announcements
CREATE POLICY "Only admins can insert announcements"
    ON public.announcements FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update announcements"
    ON public.announcements FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Only admins can delete announcements"
    ON public.announcements FOR DELETE
    USING (public.is_admin());

-- --------------------------------------------------------------------
-- 9. FAVORITES POLICIES
-- --------------------------------------------------------------------
-- Users can view their own favorites
CREATE POLICY "Users can view their own favorites"
    ON public.favorites FOR SELECT
    USING (auth.uid() = user_id);

-- Users can add favorites for themselves
CREATE POLICY "Users can add favorites"
    ON public.favorites FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can remove their own favorites
CREATE POLICY "Users can delete their favorites"
    ON public.favorites FOR DELETE
    USING (auth.uid() = user_id);

-- --------------------------------------------------------------------
-- 10. EVENT REGISTRATIONS POLICIES
-- --------------------------------------------------------------------
-- Users can view their own registrations; Admins can view all
CREATE POLICY "Users can view registrations"
    ON public.event_registrations FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

-- Users can register for events for themselves
CREATE POLICY "Users can register for events"
    ON public.event_registrations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can cancel their registration
CREATE POLICY "Users can cancel event registration"
    ON public.event_registrations FOR DELETE
    USING (auth.uid() = user_id OR public.is_admin());

-- --------------------------------------------------------------------
-- 11. SUPABASE STORAGE BUCKET POLICIES (bucket: club-assets)
-- --------------------------------------------------------------------
-- Create bucket if not exists (note: can also be created via Supabase UI)
INSERT INTO storage.buckets (id, name, public)
VALUES ('club-assets', 'club-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Public can read assets
CREATE POLICY "Public Read Access on club-assets"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'club-assets');

-- Authenticated users can upload to profiles/avatars/ or admins can upload anywhere
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

-- Only admins or asset owner can delete storage objects
CREATE POLICY "Admins can delete club assets"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'club-assets' AND
        (public.is_admin() OR auth.uid()::text = (storage.foldername(name))[2])
    );
