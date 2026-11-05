# Campus Club Explorer — Club Expansion Architecture Audit

**Audit Date:** November 5, 2026  
**Document Target:** Phase 1 Project & Schema Audit for 5 to 35 Club Scaling

---

## 1. Executive Summary

Campus Club Explorer is an established full-stack collegiate platform connecting university students to campus organizations, events, and leadership opportunities. The current deployment state consists of:
* **Frontend:** React 18, Vite 6, Tailwind CSS (Luxury Burgundy, Charcoal & White palette) hosted on Vercel.
* **Backend:** Node.js (v18+) with Express 4.21 hosted on Render.
* **Database & Storage:** Supabase Cloud PostgreSQL with Row Level Security (RLS) and public S3 Storage (`umoyhynpzruntvfpcomo.supabase.co`).
* **Existing Seed Records:** 5 production clubs, 5 categories, 1 verified student profile, 1 administrator account, and 1 verified public storage bucket (`club-assets`).

This audit establishes the baseline schemas, endpoints, and constraints necessary to scale the application from **5 to 35 clubs** without data loss, downtime, or breaking changes.

---

## 2. Project Architecture & Frameworks

### Frontend Architecture (`frontend/`)
* **Core:** React 18.3.1 with Vite 6.0.7 bundler.
* **Routing:** `react-router-dom` v6.28 with client-side SPA fallback handled by [`frontend/vercel.json`](file:///Users/krishnapothuri/MERN%20PROJECT/frontend/vercel.json).
* **Styling:** Tailwind CSS 3.4.17 with custom Burgundy (`#800020`), Dark Wine (`#3B0010`), Gold (`#C5A46D`), Charcoal (`#1C1C1C`), and Off-White (`#FAF9F7`) tokens.
* **Component Hierarchy:**
  * `src/components/common/`: Reusable primitives (`ClubCard`, `Badge`, `Button`, `Input`, `Modal`, `Navbar`, `Footer`, `Pagination`, `EmptyState`, `Skeleton`).
  * `src/pages/`: `Home`, `ExploreClubs`, `ClubDetail`, `Categories`, `Events`, `About`, `Login`, `Register`, `StudentDashboard`, `AdminDashboard`.
  * `src/services/api.js`: Unified Axios client configured with JWT interceptors and auto-normalizing API base URL.
  * `src/context/`: `AuthContext` (JWT session management) and `ToastContext` (transient feedback alerts).

### Backend Architecture (`backend/`)
* **Runtime:** Node.js ECMAScript Modules (`"type": "module"`).
* **Server Framework:** Express 4.21.2 with Helmet, CORS, and Morgan.
* **Controllers & Routes:**
  * `clubController.js` & `clubRoutes.js`: Club querying, search, pagination, category filtering, creation, and detail fetching.
  * `categoryController.js` & `categoryRoutes.js`: Category taxonomy retrieval.
  * `membershipController.js` & `membershipRoutes.js`: Join club workflows, roster management, leave club actions.
  * `eventController.js` & `eventRoutes.js`: Campus event calendar and student registrations.
  * `announcementController.js` & `announcementRoutes.js`: Club bulletin announcements.
  * `authController.js` & `authRoutes.js`: User registration, JWT login, admin promotion, password reset.
  * `uploadController.js` & `uploadRoutes.js`: Multer memory buffer streaming to Supabase Storage.
  * `adminController.js` & `adminRoutes.js`: Administrative metrics, club approvals, and user roster management.

---

## 3. Database Schema & Field Definitions

Direct inspection of live Supabase PostgreSQL tables revealed the following production schema:

### `categories` Table
| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | PRIMARY KEY, DEFAULT `gen_random_uuid()` | Unique category identifier |
| `name` | `TEXT` | NOT NULL, UNIQUE | Display name (e.g. "Coding & Technology") |
| `slug` | `TEXT` | NOT NULL, UNIQUE | URL-safe identifier (e.g. `coding-tech`) |
| `description` | `TEXT` | NULLABLE | Category scope and domain summary |
| `icon` | `TEXT` | NULLABLE | Lucide icon symbol mapping |
| `created_at` | `TIMESTAMPTZ` | DEFAULT `now()` | Record creation timestamp |

### `clubs` Table
| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | PRIMARY KEY, DEFAULT `gen_random_uuid()` | Unique club identifier |
| `name` | `TEXT` | NOT NULL, UNIQUE | Full name of student organization |
| `slug` | `TEXT` | NOT NULL, UNIQUE | URL-safe slug for routes (`/clubs/:slug`) |
| `category_id` | `UUID` | REFERENCES `categories(id)` ON DELETE SET NULL | Foreign key to category |
| `short_description` | `TEXT` | NOT NULL | 1-2 sentence card summary |
| `full_description` | `TEXT` | NOT NULL | Multi-paragraph overview on detail page |
| `mission` | `TEXT` | NULLABLE | Core club mission statement |
| `activities_and_achievements` | `TEXT` | NULLABLE | Highlighted achievements and recurring events |
| `logo_url` | `TEXT` | NULLABLE | Square 1:1 club emblem image URL |
| `cover_image_url` | `TEXT` | NULLABLE | 16:9 banner hero image URL |
| `establishment_date` | `DATE` | NULLABLE | Founding date |
| `faculty_coordinator` | `TEXT` | NULLABLE | Faculty advisor name & department |
| `student_coordinator` | `TEXT` | NULLABLE | Student lead or president name |
| `contact_email` | `TEXT` | NULLABLE | Official organization email |
| `social_links` | `JSONB` | DEFAULT `'{}'::jsonb` | Map of `{ instagram, linkedin, github, website, etc. }` |
| `member_count` | `INTEGER` | DEFAULT 0 | Active student roster count |
| `is_featured` | `BOOLEAN` | DEFAULT `false` | Highlighted flag on Home and Spotlight views |
| `is_active` | `BOOLEAN` | DEFAULT `true` | Public visibility flag |
| `created_at` | `TIMESTAMPTZ` | DEFAULT `now()` | Record creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | DEFAULT `now()` | Last modification timestamp |

### Foreign Key & Downstream Relationships
* `club_memberships`: `(user_id, club_id)` UNIQUE composite key, references `clubs(id)` ON DELETE CASCADE.
* `events`: references `clubs(id)` ON DELETE CASCADE.
* `announcements`: references `clubs(id)` ON DELETE CASCADE.
* `user_favorites`: references `clubs(id)` ON DELETE CASCADE.

---

## 4. Existing Categories in Supabase

| Existing Slug | Display Name | Existing Club Count |
| :--- | :--- | :---: |
| `coding-tech` | Coding & Technology | 1 (GDSC) |
| `sports-fitness` | Sports & Fitness | 1 (Apex FC) |
| `arts-creativity` | Arts & Creativity | 1 (Canvas & Quill) |
| `entrepreneurship` | Entrepreneurship | 1 (E-Cell) |
| `music-dance` | Music & Performing Arts | 1 (Aura Symphony) |

### Necessary Additional Categories for 35 Clubs
To give students a rich, logical taxonomy matching the 10 domain clusters (A to J), the following categories are defined:
1. `literature-media`: **Literature & Communication** (Debate, Creative Writing)
2. `social-impact`: **Social Responsibility & Environment** (NSS, Sustainability)
3. `gaming-strategy`: **Gaming & Strategy** (Chess, Esports, Game Dev, Quiz)

---

## 5. Image Storage & Asset Hosting

* **Bucket Name:** `club-assets`
* **Visibility:** Public (`public: true` verified via Supabase Storage API)
* **Storage Provider:** Supabase Storage (backed by AWS S3 infrastructure)
* **CDN Configuration:** Images are formatted with high-speed Unsplash CDN and Supabase asset endpoints with explicit parameters (`auto=format&fit=crop&q=80`) ensuring crisp rendering, fast load times, and responsive mobile layouts without layout shifts.

---

## 6. API Contracts Verification

| Method | Endpoint | Query / Body Params | Returns |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/clubs` | `search`, `category`, `sort`, `featured`, `page`, `limit` | `{ success: true, data: [...], pagination: { total, page, limit, totalPages } }` |
| `GET` | `/api/clubs/featured` | `limit` (default 6) | `{ success: true, data: [...] }` |
| `GET` | `/api/clubs/:idOrSlug` | `idOrSlug` (UUID or slug) | `{ success: true, data: { ...club, categories, events, announcements, membership, isFavorite } }` |
| `GET` | `/api/categories` | None | `{ success: true, data: [...] }` |
| `POST` | `/api/memberships` | `{ club_id }` (Auth required) | `{ success: true, data: membership }` |
| `DELETE` | `/api/memberships/:clubId`| `clubId` (Auth required) | `{ success: true, message: 'Successfully left club' }` |
| `GET` | `/api/health` | None | `{ status: 'healthy', database: 'Supabase PostgreSQL (Live)' }` |

---

## 7. Audit Conclusion & Expansion Strategy

1. **Preservation:** The existing 5 clubs (`gdsc-campus`, `apex-fc`, `canvas-and-quill`, `ecell-campus`, `aura-music-society`) are preserved with their exact UUIDs, members, and relations intact.
2. **Safe Seeding:** All 30 new clubs will be inserted using an idempotent `.upsert(records, { onConflict: 'slug', ignoreDuplicates: true })` mechanism.
3. **Pagination & Discovery:** `ExploreClubs.jsx` already supports dynamic pagination (`limit: 12`), which will naturally paginate 35 clubs across 3 clean pages (12 + 12 + 11).

