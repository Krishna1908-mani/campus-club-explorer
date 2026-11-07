-- ====================================================================
-- CAMPUS CLUB EXPLORER — SUPABASE POSTGRESQL SCHEMA MIGRATION
-- Migration: 03_club_lead_role_and_management.sql
-- Description: Implement Club Lead role, club_lead_assignments table,
--              RLS isolation policies, and helper functions.
-- ====================================================================

-- 1. EXTEND PROFILES ROLE CONSTRAINT TO INCLUDE 'club_lead'
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
    CHECK (role IN ('student', 'club_lead', 'admin'));

-- 2. CREATE CLUB LEAD ASSIGNMENTS TABLE
CREATE TABLE IF NOT EXISTS public.club_lead_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_user_club_assignment UNIQUE (user_id, club_id)
);

-- Indexes for lightning-fast lookups
CREATE INDEX IF NOT EXISTS idx_club_lead_assignments_user ON public.club_lead_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_club_lead_assignments_club ON public.club_lead_assignments(club_id);
CREATE INDEX IF NOT EXISTS idx_club_lead_assignments_active ON public.club_lead_assignments(is_active);

-- Auto-update updated_at timestamp trigger
DROP TRIGGER IF EXISTS set_club_lead_assignments_updated_at ON public.club_lead_assignments;
CREATE TRIGGER set_club_lead_assignments_updated_at
    BEFORE UPDATE ON public.club_lead_assignments
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- --------------------------------------------------------------------
-- 3. RLS HELPER FUNCTIONS
-- --------------------------------------------------------------------

-- Function: Check if auth.uid() is an active Club Lead for a specific club
CREATE OR REPLACE FUNCTION public.is_club_lead_for_club(target_club_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.club_lead_assignments cla
        JOIN public.profiles p ON p.id = cla.user_id
        WHERE cla.user_id = auth.uid()
          AND cla.club_id = target_club_id
          AND cla.is_active = true
          AND p.role = 'club_lead'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function: Check if auth.uid() is an active Club Lead for any club
CREATE OR REPLACE FUNCTION public.is_any_club_lead()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.club_lead_assignments cla
        JOIN public.profiles p ON p.id = cla.user_id
        WHERE cla.user_id = auth.uid()
          AND cla.is_active = true
          AND p.role = 'club_lead'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function: Retrieve current user's primary assigned club ID
CREATE OR REPLACE FUNCTION public.get_my_assigned_club_id()
RETURNS UUID AS $$
DECLARE
    assigned_club UUID;
BEGIN
    SELECT club_id INTO assigned_club
    FROM public.club_lead_assignments
    WHERE user_id = auth.uid() AND is_active = true
    LIMIT 1;
    RETURN assigned_club;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- --------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------------------

-- Enable RLS on club_lead_assignments
ALTER TABLE public.club_lead_assignments ENABLE ROW LEVEL SECURITY;

-- 4.1 CLUB LEAD ASSIGNMENTS POLICIES
DROP POLICY IF EXISTS "Club lead assignments viewable by admin or assigned user" ON public.club_lead_assignments;
CREATE POLICY "Club lead assignments viewable by admin or assigned user"
    ON public.club_lead_assignments FOR SELECT
    USING (
        public.is_admin() OR
        auth.uid() = user_id
    );

DROP POLICY IF EXISTS "Only admins can insert club lead assignments" ON public.club_lead_assignments;
CREATE POLICY "Only admins can insert club lead assignments"
    ON public.club_lead_assignments FOR INSERT
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Only admins can update club lead assignments" ON public.club_lead_assignments;
CREATE POLICY "Only admins can update club lead assignments"
    ON public.club_lead_assignments FOR UPDATE
    USING (public.is_admin());

DROP POLICY IF EXISTS "Only admins can delete club lead assignments" ON public.club_lead_assignments;
CREATE POLICY "Only admins can delete club lead assignments"
    ON public.club_lead_assignments FOR DELETE
    USING (public.is_admin());

-- 4.2 CLUBS POLICIES (Club Lead can update their assigned club details)
DROP POLICY IF EXISTS "Only admins can update clubs" ON public.clubs;
DROP POLICY IF EXISTS "Admins or assigned club leads can update clubs" ON public.clubs;
CREATE POLICY "Admins or assigned club leads can update clubs"
    ON public.clubs FOR UPDATE
    USING (public.is_admin() OR public.is_club_lead_for_club(id));

-- 4.3 MEMBERSHIPS POLICIES (Club Lead can view and approve/reject requests for their club)
DROP POLICY IF EXISTS "Memberships viewable by owner or admin or if approved" ON public.memberships;
DROP POLICY IF EXISTS "Memberships viewable by owner, admin, club lead, or if approved" ON public.memberships;
CREATE POLICY "Memberships viewable by owner, admin, club lead, or if approved"
    ON public.memberships FOR SELECT
    USING (
        auth.uid() = user_id OR
        public.is_admin() OR
        public.is_club_lead_for_club(club_id) OR
        status = 'approved'
    );

DROP POLICY IF EXISTS "Only admins can update membership status" ON public.memberships;
DROP POLICY IF EXISTS "Admins or assigned club leads can update membership status" ON public.memberships;
CREATE POLICY "Admins or assigned club leads can update membership status"
    ON public.memberships FOR UPDATE
    USING (public.is_admin() OR public.is_club_lead_for_club(club_id));

DROP POLICY IF EXISTS "Users can cancel their membership" ON public.memberships;
DROP POLICY IF EXISTS "Users or admins or club leads can delete membership" ON public.memberships;
CREATE POLICY "Users or admins or club leads can delete membership"
    ON public.memberships FOR DELETE
    USING (
        auth.uid() = user_id OR
        public.is_admin() OR
        public.is_club_lead_for_club(club_id)
    );

-- 4.4 EVENTS POLICIES (Club Lead can create, update, delete events for their assigned club)
DROP POLICY IF EXISTS "Only admins can create events" ON public.events;
DROP POLICY IF EXISTS "Admins or assigned club leads can create events" ON public.events;
CREATE POLICY "Admins or assigned club leads can create events"
    ON public.events FOR INSERT
    WITH CHECK (public.is_admin() OR public.is_club_lead_for_club(club_id));

DROP POLICY IF EXISTS "Only admins can update events" ON public.events;
DROP POLICY IF EXISTS "Admins or assigned club leads can update events" ON public.events;
CREATE POLICY "Admins or assigned club leads can update events"
    ON public.events FOR UPDATE
    USING (public.is_admin() OR public.is_club_lead_for_club(club_id));

DROP POLICY IF EXISTS "Only admins can delete events" ON public.events;
DROP POLICY IF EXISTS "Admins or assigned club leads can delete events" ON public.events;
CREATE POLICY "Admins or assigned club leads can delete events"
    ON public.events FOR DELETE
    USING (public.is_admin() OR public.is_club_lead_for_club(club_id));

-- 4.5 ANNOUNCEMENTS POLICIES (Club Lead can create, update, delete announcements for their club)
DROP POLICY IF EXISTS "Only admins can insert announcements" ON public.announcements;
DROP POLICY IF EXISTS "Admins or assigned club leads can insert announcements" ON public.announcements;
CREATE POLICY "Admins or assigned club leads can insert announcements"
    ON public.announcements FOR INSERT
    WITH CHECK (public.is_admin() OR public.is_club_lead_for_club(club_id));

DROP POLICY IF EXISTS "Only admins can update announcements" ON public.announcements;
DROP POLICY IF EXISTS "Admins or assigned club leads can update announcements" ON public.announcements;
CREATE POLICY "Admins or assigned club leads can update announcements"
    ON public.announcements FOR UPDATE
    USING (public.is_admin() OR public.is_club_lead_for_club(club_id));

DROP POLICY IF EXISTS "Only admins can delete announcements" ON public.announcements;
DROP POLICY IF EXISTS "Admins or assigned club leads can delete announcements" ON public.announcements;
CREATE POLICY "Admins or assigned club leads can delete announcements"
    ON public.announcements FOR DELETE
    USING (public.is_admin() OR public.is_club_lead_for_club(club_id));

-- 4.6 EVENT REGISTRATIONS POLICIES (Club Lead can view registrations for their club's events)
DROP POLICY IF EXISTS "Event registrations viewable by user, admin, or event organizing club lead" ON public.event_registrations;
CREATE POLICY "Event registrations viewable by user, admin, or event organizing club lead"
    ON public.event_registrations FOR SELECT
    USING (
        auth.uid() = user_id OR
        public.is_admin() OR
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = event_id AND public.is_club_lead_for_club(e.club_id)
        )
    );
