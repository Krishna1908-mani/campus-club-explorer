# 🎓 Campus Club Explorer
### Full-Stack Collegiate Community Discovery & Engagement Platform

Campus Club Explorer is a production-grade full-stack web application designed for university and college campuses. It empowers students to discover student-led societies, filter clubs by interest categories, view detailed club profiles, RSVP for workshops and competitions, submit membership applications, and save favorite clubs. An administrative console enables faculty coordinators and student affairs officers to manage clubs, approve memberships, post announcements, publish events, and analyze student engagement.

---

## 📸 Screenshots & Highlights

```
+-----------------------------------------------------------------------------------+
|  [Logo] Campus Club Explorer      Home   Explore   Categories   Events   [Sign In]    |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|                   Discover Your Community. Explore Your Passion.                  |
|          Unite with student-led organizations, build cutting-edge projects,       |
|          and elevate your collegiate journey in one centralized platform.         |
|                                                                                   |
|                     [ Explore Clubs ]     [ Join a Club Today ]                   |
|                                                                                   |
|  +--------------------+ +--------------------+ +--------------------+             |
|  |   8 Active Clubs   | | 1,248 Students     | | 12 Upcoming Events |             |
|  +--------------------+ +--------------------+ +--------------------+             |
+-----------------------------------------------------------------------------------+
|  Featured Clubs:                                                                  |
|  +--------------------------+  +--------------------------+                       |
|  | [GDSC Logo] GDSC Campus  |  | [Robotics Society]       |                       |
|  | Coding & Technology      |  | Robotics & Automation    |                       |
|  | 148 Active Members       |  | 94 Active Members        |                       |
|  | [ View Details ]    (♥)  |  | [ View Details ]    (♥)  |                       |
|  +--------------------------+  +--------------------------+                       |
+-----------------------------------------------------------------------------------+
```

---

## 🚀 Key Features

### For College Students
- **Dynamic Club Discovery:** Real-time search with debouncing across club titles, keywords, missions, and activities.
- **Categorized Filtering:** 8 interest categories (Coding & Tech, Entrepreneurship, Sports & Fitness, Arts & Creativity, Cultural, Music & Dance, Photography, Social Service).
- **Club Profile Pages:** Comprehensive profiles with cover banners, logos, mission statements, key achievements, establishment date, and coordinators.
- **Membership Application System:** 1-click join requests that automatically update membership status (`pending`, `approved`, `rejected`), prevent duplicate enrollments, and support cancellation.
- **Personalized Student Dashboard:**
  - Active and pending memberships overview.
  - Bookmarked favorite clubs.
  - Registered event passes.
  - Campus announcements feed.
  - Profile editor (Student ID, department, year of study, bio, avatar).
- **Interactive Campus Calendar:** Upcoming workshops, hackathons, audition dates, and tournaments with direct registration.
- **Interactive Celebration & Bookmarks:** Canvas confetti on membership submission, instantaneous bookmark toggling.

### For Campus Administrators
- **Protected Administrative Console:** Secured with database-backed role validation (`profiles.role === 'admin'`) and Supabase Row Level Security.
- **Club Management (CRUD):** Add new clubs, edit descriptions, assign coordinators, upload logos & cover photos, toggle featured status, and activate/archive.
- **Membership Approval Workflow:** Single-click approval or rejection of student membership applications with automatic synchronization of club member counts.
- **Event Management:** Schedule events with dates, times, venues, banner images, and external registration links.
- **Category Management:** Create, update, or remove interest categories.
- **Campus Announcements:** Dispatch real-time notices to specific clubs or campus-wide.
- **Student Directory:** Searchable collegiate directory displaying student IDs, departments, and enrollment years.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 + Vite | Lightning-fast SPA build tooling and HMR |
| **Routing** | React Router DOM v6 | Declarative client-side routing & route protection |
| **Styling & System** | Tailwind CSS + Lucide Icons | Linear/Stripe-inspired UI with dark & light themes |
| **Backend API** | Node.js + Express.js | Modular RESTful architecture with controllers & services |
| **Database** | Supabase PostgreSQL | Relational database with foreign keys, triggers, and indices |
| **Authentication** | Supabase Auth & JWT | Verified session tokens and server-side RBAC |
| **Storage** | Supabase Storage (`club-assets`) | Cloud bucket storage for logos, covers, and avatars |
| **Security** | Row Level Security (RLS) + Helmet | DB policies blocking unauthorized mutations & privilege escalation |

---

## 📂 Project Structure

```
campus-club-explorer/
├── backend/
│   ├── config/
│   │   └── supabase.js          # Supabase client & fallback detector
│   ├── controllers/
│   │   ├── adminController.js   # Administrative statistics & student directory
│   │   ├── announcementController.js # Campus club notices
│   │   ├── authController.js    # Register, login, me, profile updates
│   │   ├── categoryController.js # Taxonomy management
│   │   ├── clubController.js    # Club search, filters, CRUD
│   │   ├── eventController.js   # Event schedules & student registrations
│   │   ├── favoriteController.js # Saved bookmarks
│   │   └── membershipController.js # Application approvals & join workflow
│   ├── data/
│   │   └── initialData.js       # Preloaded university seed data
│   ├── middleware/
│   │   ├── auth.js              # Token verification & requireAdmin guards
│   │   ├── errorHandler.js      # Centralized error responses
│   │   └── upload.js            # Multer memory storage & mime validation
│   ├── routes/                  # Express route definitions
│   ├── services/
│   │   └── supabaseService.js   # Supabase DB operations & fallback store
│   ├── server.js                # Express app entry point
│   ├── test-suite.js            # Automated integration test suite
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/          # Reusable Button, Input, Modal, Badge, Card, etc.
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx  # User session & profile management
│   │   │   ├── ThemeContext.jsx # Dark/Light mode theme state
│   │   │   └── ToastContext.jsx # Global toast notifications
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Landing page with dynamic statistics
│   │   │   ├── ExploreClubs.jsx # Discovery hub with debounced search & filters
│   │   │   ├── ClubDetails.jsx  # Full profile, coordinators, events, tabs
│   │   │   ├── Events.jsx       # Campus event calendar & RSVP
│   │   │   ├── Categories.jsx   # Interest categories directory
│   │   │   ├── About.jsx        # Mission & architecture
│   │   │   ├── Login.jsx        # Role selection portal (Admin, Club Lead, Student)
│   │   │   ├── Register.jsx     # Student onboarding with validation
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── StudentDashboard.jsx # Personalized student workspace
│   │   │   ├── AdminDashboard.jsx   # Administrative governance console
│   │   │   └── NotFound.jsx     # Custom 404 page
│   │   ├── services/
│   │   │   ├── api.js           # Axios client with interceptors
│   │   │   └── supabase.js      # Supabase client (frontend)
│   │   ├── App.jsx              # Application router
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Tailwind directives & design system
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
├── supabase/
│   ├── migrations/
│   │   └── 01_initial_schema.sql # PostgreSQL DDL, triggers, and constraints
│   ├── policies.sql             # Row Level Security (RLS) policies
│   └── seed.sql                 # Categories, clubs, events, announcements
├── package.json                 # Monorepo convenience scripts
└── README.md
```

---

## 🗄️ Supabase Database Architecture

The application is engineered around 8 relational PostgreSQL tables:

1. **`profiles`**: Linked directly to `auth.users(id)` via `ON DELETE CASCADE`. Stores `full_name`, `email`, `student_id`, `department`, `year_of_study`, `role` (`'student' | 'admin'`), and `avatar_url`.
2. **`categories`**: Interest domains (`Coding & Technology`, `Sports & Fitness`, `Arts & Creativity`, `Entrepreneurship`, etc.).
3. **`clubs`**: Detailed organization profiles with unique slugs, logos, cover banners, missions, coordinators, member counts, and featured flags.
4. **`memberships`**: Student club enrollments with status (`pending`, `approved`, `rejected`), uniqueness constraint on `(user_id, club_id)` preventing duplicate enrollments.
5. **`events`**: Upcoming or past events linked to clubs with dates, times, venues, and banners.
6. **`announcements`**: Official notices and bulletins posted by club leadership.
7. **`favorites`**: Saved bookmarks with unique constraint on `(user_id, club_id)`.
8. **`event_registrations`**: Student RSVPs for specific events with unique constraint on `(event_id, user_id)`.

### Automatic PostgreSQL Triggers
- **`handle_new_user()`**: Automatically inserts a student row into `public.profiles` whenever a user registers through Supabase Auth, preventing client-side privilege escalation.
- **`sync_club_member_count()`**: Automatically increments or decrements `clubs.member_count` in real-time as memberships are approved or revoked.
- **`handle_updated_at()`**: Automatically maintains timestamps across tables.

---

## 🔒 Row Level Security (RLS) Summary

| Table | SELECT | INSERT | UPDATE | DELETE |
| :--- | :--- | :--- | :--- | :--- |
| **`profiles`** | Public (view summaries) | Owner only (`auth.uid() = id`) | Owner (cannot change role) or Admin | Admin only |
| **`categories`** | Public | Admin only | Admin only | Admin only |
| **`clubs`** | Public (active clubs) or Admin | Admin only | Admin only | Admin only |
| **`memberships`** | Owner, Admin, or Approved | Owner (status defaults to `pending`) | Admin only (approve/reject) | Owner (cancel) or Admin |
| **`events`** | Public | Admin only | Admin only | Admin only |
| **`announcements`** | Public | Admin only | Admin only | Admin only |
| **`favorites`** | Owner only | Owner only | N/A | Owner only |
| **`event_registrations`** | Owner or Admin | Owner only | N/A | Owner or Admin |

---

## ⚙️ Quick Start (Local Setup)

### 1. Prerequisites
- Node.js (v18 or higher recommended; verified with v26)
- npm (v9 or higher)

### 2. Clone and Install
```bash
# Clone the repository
git clone https://github.com/your-username/campus-club-explorer.git
cd campus-club-explorer

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Configure Environment Variables

**Backend (`backend/.env`):**
```env
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=campus-club-explorer-jwt-secret-key-2026

# Optional: Add your live Supabase credentials when ready
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=/api
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

> **Note:** If Supabase credentials are not yet supplied, the application automatically runs in **high-fidelity local mode** with preloaded campus data and authentication, allowing full end-to-end evaluation out of the box!

### 4. Running the Application

In two separate terminal windows:

**Terminal 1 (Backend API):**
```bash
cd backend
npm run dev
# Server boots on http://localhost:5001
```

**Terminal 2 (Frontend Client):**
```bash
cd frontend
npm run dev
# Client runs on http://localhost:5173
```

Open your browser to [http://localhost:5173](http://localhost:5173).

---

## 🔐 Three Dedicated Authentication Portals

Campus Club Explorer enforces strict role-based access control with three official sign-in options:

| Role | Login Portal | Target Dashboard | Access Scope |
| :--- | :--- | :--- | :--- |
| **Administrator** | `/admin/login` | `/admin` | Campus-wide administration, 35 clubs oversight, Club Lead provisioning & directory, announcements |
| **Club Lead** | `/club-lead/login` | `/club-lead/dashboard` | Assigned club scoped portal, member management, club events & announcements |
| **Student** | `/student/login` | `/dashboard` | Club discovery, membership applications, RSVP for events, bookmarks |

- **Login Hub**: `/login` provides a selection page directing users to their dedicated portal.
- **Student Registration**: Public onboarding available via `/register` or from `/student/login`.
- **Club Lead Accounts**: Securely provisioned by Administrators via the Admin Dashboard.

---

## 🌐 Connecting to Live Supabase Cloud

1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Run the schema migration from `supabase/migrations/01_initial_schema.sql`.
4. Run the RLS security policies from `supabase/policies.sql`.
5. Run the seed data from `supabase/seed.sql`.
6. Create an **Admin User**:
   - Go to **Authentication > Users** in Supabase and click **Add User**.
   - Enter `admin@campus.edu` and a secure password.
   - Run this SQL query to grant admin privileges:
     ```sql
     UPDATE public.profiles
     SET role = 'admin'
     WHERE email = 'admin@campus.edu';
     ```
7. Under **Project Settings > API**, copy the `Project URL`, `anon/public key`, and `service_role key`.
8. Paste these into `backend/.env` and `frontend/.env`. Restart the server!

---

## 🧪 Testing

The repository includes an automated integration test suite that tests all 21 key API workflows (health, search, categories, auth, membership join, favorite toggling, event RSVP, admin verification, and 403 role-based security blocks):

```bash
cd backend
node test-suite.js
```

---

## 🚢 Deployment Guide

### Frontend on Vercel
1. Push repository to GitHub.
2. Link the repository to [Vercel](https://vercel.com).
3. Set the root directory to `frontend`.
4. Add environment variables:
   - `VITE_API_URL` = `https://your-backend.onrender.com/api`
   - `VITE_SUPABASE_URL` = Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key
5. Deploy!

### Backend on Render
1. Create a **Web Service** on [Render](https://render.com).
2. Set root directory to `backend`.
3. Set build command: `npm install`.
4. Set start command: `node server.js`.
5. Add environment variables:
   - `PORT` = `5001`
   - `NODE_ENV` = `production`
   - `FRONTEND_URL` = `https://your-frontend.vercel.app`
   - `JWT_SECRET` = A strong random secret
   - `SUPABASE_URL` = Your Supabase project URL
   - `SUPABASE_ANON_KEY` = Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY` = Your Supabase service role key
6. Deploy!

---

## 📄 License
This project is open-source under the MIT License.

