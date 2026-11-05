/**
 * CAMPUS CLUB EXPLORER — AUTOMATED BACKEND INTEGRATION TEST SUITE
 */
import app from './server.js';

const PORT = process.env.PORT || 5001;
const BASE_URL = `http://localhost:${PORT}/api`;

const runTests = async () => {
  // Give server 500ms to settle
  await new Promise(r => setTimeout(r, 500));

  console.log('----------------------------------------------------');
  console.log('🧪 Starting Campus Club Explorer Automated Test Suite');
  console.log(`   Target API: ${BASE_URL}`);
  console.log('----------------------------------------------------');

  let passed = 0;
  let failed = 0;

  const assert = (condition, title) => {
    if (condition) {
      console.log(`  ✅ PASS: ${title}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${title}`);
      failed++;
    }
  };

  try {
    // 1. Health check
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthJson = await healthRes.json();
    assert(healthRes.status === 200 && healthJson.status === 'healthy', 'GET /api/health returns 200 healthy');

    // 2. Categories
    const catRes = await fetch(`${BASE_URL}/categories`);
    const catJson = await catRes.json();
    assert(catRes.status === 200 && Array.isArray(catJson.data) && catJson.data.length >= 8, 'GET /api/categories returns all 8 categories');

    // 3. Clubs listing
    const clubsRes = await fetch(`${BASE_URL}/clubs?limit=4`);
    const clubsJson = await clubsRes.json();
    assert(clubsRes.status === 200 && clubsJson.data.length === 4, 'GET /api/clubs returns paginated list');

    // 4. Clubs search
    const searchRes = await fetch(`${BASE_URL}/clubs?search=google`);
    const searchJson = await searchRes.json();
    assert(searchRes.status === 200 && searchJson.data.some(c => c.name.toLowerCase().includes('google')), 'GET /api/clubs?search=google filters properly');

    // 5. Featured clubs
    const featRes = await fetch(`${BASE_URL}/clubs/featured`);
    const featJson = await featRes.json();
    assert(featRes.status === 200 && featJson.data.length > 0 && featJson.data[0].is_featured, 'GET /api/clubs/featured returns featured clubs');

    // 6. Club stats
    const statsRes = await fetch(`${BASE_URL}/clubs/stats`);
    const statsJson = await statsRes.json();
    assert(statsRes.status === 200 && statsJson.data.totalClubs > 0, 'GET /api/clubs/stats returns dynamic counts');

    // 7. Club details by slug
    const clubDetailRes = await fetch(`${BASE_URL}/clubs/gdsc-campus`);
    const clubDetailJson = await clubDetailRes.json();
    assert(clubDetailRes.status === 200 && clubDetailJson.data.slug === 'gdsc-campus', 'GET /api/clubs/:slug returns complete club profile');

    // 8. Student Login
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student@campus.edu', password: 'password123' }),
    });
    const loginJson = await loginRes.json();
    assert(loginRes.status === 200 && Boolean(loginJson.token), 'POST /api/auth/login authenticates student');
    const studentToken = loginJson.token;

    // 9. Authenticated GET /api/auth/me
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const meJson = await meRes.json();
    assert(meRes.status === 200 && meJson.profile.role === 'student', 'GET /api/auth/me returns student profile');

    // 10. Student Join Club
    const joinRes = await fetch(`${BASE_URL}/memberships`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({ club_id: 'b1000000-0000-0000-0000-000000000005' }),
    });
    const joinJson = await joinRes.json();
    assert(joinRes.status === 201 || (joinRes.status === 400 && joinJson.message.includes('already have')), 'POST /api/memberships processes membership request');

    // 11. Student List Memberships
    const myMemRes = await fetch(`${BASE_URL}/memberships/my`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const myMemJson = await myMemRes.json();
    assert(myMemRes.status === 200 && Array.isArray(myMemJson.data), 'GET /api/memberships/my returns student memberships');

    // 12. Student Favorites Add & Remove
    const addFavRes = await fetch(`${BASE_URL}/favorites/b1000000-0000-0000-0000-000000000002`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert(addFavRes.status === 201, 'POST /api/favorites/:id bookmarks club');

    const delFavRes = await fetch(`${BASE_URL}/favorites/b1000000-0000-0000-0000-000000000002`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert(delFavRes.status === 200, 'DELETE /api/favorites/:id removes bookmark');

    // 13. Events Listing & Registration
    const eventsRes = await fetch(`${BASE_URL}/events`);
    const eventsJson = await eventsRes.json();
    assert(eventsRes.status === 200 && eventsJson.data.length > 0, 'GET /api/events returns campus calendar');

    const regEventRes = await fetch(`${BASE_URL}/events/${eventsJson.data[0].id}/register`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert(regEventRes.status === 201, 'POST /api/events/:id/register registers student for event');

    // 14. Admin Login
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@campus.edu', password: 'admin123' }),
    });
    const adminLoginJson = await adminLoginRes.json();
    assert(adminLoginRes.status === 200 && adminLoginJson.profile.role === 'admin', 'POST /api/auth/login authenticates administrator');
    const adminToken = adminLoginJson.token;

    // 15. Admin Dashboard Stats
    const adminStatsRes = await fetch(`${BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const adminStatsJson = await adminStatsRes.json();
    assert(adminStatsRes.status === 200 && adminStatsJson.data.totalClubs > 0, 'GET /api/admin/stats returns full administrative metrics');

    // 16. Admin Club CRUD
    const createClubRes = await fetch(`${BASE_URL}/clubs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        name: 'Automated Test Club',
        category_id: 'c1000000-0000-0000-0000-000000000001',
        short_description: 'Test short description',
        full_description: 'Test full description for integration test',
      }),
    });
    const createClubJson = await createClubRes.json();
    assert(createClubRes.status === 201 && createClubJson.data.name === 'Automated Test Club', 'POST /api/clubs creates club (Admin Only)');

    const testClubId = createClubJson.data.id;

    // Update Club
    const updateClubRes = await fetch(`${BASE_URL}/clubs/${testClubId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ short_description: 'Updated test description' }),
    });
    assert(updateClubRes.status === 200, 'PUT /api/clubs/:id updates club (Admin Only)');

    // Delete Club
    const delClubRes = await fetch(`${BASE_URL}/clubs/${testClubId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(delClubRes.status === 200, 'DELETE /api/clubs/:id deletes club (Admin Only)');

    // 17. Role-Based Protection Check: Student attempting admin route should receive 403 Forbidden
    const forbiddenRes = await fetch(`${BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert(forbiddenRes.status === 403, 'GET /api/admin/stats correctly blocks non-admin with 403 Forbidden');

  } catch (err) {
    console.error('Fatal test error:', err);
    failed++;
  } finally {
    console.log('----------------------------------------------------');
    console.log(`🏁 Test Results: ${passed} Passed, ${failed} Failed`);
    console.log('----------------------------------------------------');
    process.exit(failed > 0 ? 1 : 0);
  }
};

runTests();
