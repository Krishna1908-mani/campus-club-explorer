import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5001/api';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data };
}

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('================================================================');
  console.log('🧪 TESTING 3 SEPARATE LOGIN FLOWS & ROLE ENFORCEMENT');
  console.log('================================================================\n');

  // Test Accounts
  const adminCreds = { email: 'admin@campus.edu', password: 'admin123' };
  const leadCreds = { email: 'lead@campus.edu', password: 'lead123' };
  const studentCreds = { email: 'student@campus.edu', password: 'password123' };

  // -------------------------------------------------------------------------
  // 1. ADMIN LOGIN TESTS (/admin/login - expectedRole: admin)
  // -------------------------------------------------------------------------
  console.log('🛡️ 1. ADMIN LOGIN FLOW TESTS:');

  // 1a. Admin can sign in
  const res1a = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ ...adminCreds, expectedRole: 'admin' }),
  });
  assert(res1a.status === 200 && res1a.data.success && res1a.data.profile?.role === 'admin', 'Admin account signs in successfully via Admin Login');

  // 1b. Student CANNOT sign in through Admin Login
  const res1b = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ ...studentCreds, expectedRole: 'admin' }),
  });
  assert(res1b.status === 403 && res1b.data.message === 'This account does not have Admin access.', 'Student is DENIED access through Admin Login with exact message');

  // 1c. Club Lead CANNOT sign in through Admin Login
  const res1c = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ ...leadCreds, expectedRole: 'admin' }),
  });
  assert(res1c.status === 403 && res1c.data.message === 'This account does not have Admin access.', 'Club Lead is DENIED access through Admin Login with exact message');

  // -------------------------------------------------------------------------
  // 2. CLUB LEAD LOGIN TESTS (/club-lead/login - expectedRole: club_lead)
  // -------------------------------------------------------------------------
  console.log('\n🧭 2. CLUB LEAD LOGIN FLOW TESTS:');

  // 2a. Club Lead can sign in
  const res2a = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ ...leadCreds, expectedRole: 'club_lead' }),
  });
  assert(res2a.status === 200 && res2a.data.success && res2a.data.profile?.role === 'club_lead', 'Club Lead signs in successfully via Club Lead Login');
  const leadToken = res2a.data.token;

  // 2b. Student CANNOT use Club Lead Login
  const res2b = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ ...studentCreds, expectedRole: 'club_lead' }),
  });
  assert(res2b.status === 403 && res2b.data.message === 'This account does not have Club Lead access.', 'Student is DENIED access through Club Lead Login with exact message');

  // 2c. Admin CANNOT use Club Lead Login
  const res2c = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ ...adminCreds, expectedRole: 'club_lead' }),
  });
  assert(res2c.status === 403 && res2c.data.message === 'This account does not have Club Lead access.', 'Admin is DENIED access through Club Lead Login');

  // 2d. Scoped access: Club lead can access their assigned club dashboard
  const res2d = await request('/club-lead/dashboard', {
    method: 'GET',
    headers: { Authorization: `Bearer ${leadToken}` },
  });
  assert(res2d.status === 200 && res2d.data.data?.club?.slug === 'ai-ml-club', 'Club Lead accesses ONLY assigned club (AI & ML Club)');

  // -------------------------------------------------------------------------
  // 3. STUDENT LOGIN TESTS (/student/login - expectedRole: student)
  // -------------------------------------------------------------------------
  console.log('\n🎓 3. STUDENT LOGIN FLOW TESTS:');

  // 3a. Student can sign in
  const res3a = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ ...studentCreds, expectedRole: 'student' }),
  });
  assert(res3a.status === 200 && res3a.data.success && res3a.data.profile?.role === 'student', 'Student signs in successfully via Student Login');
  const studentToken = res3a.data.token;

  // 3b. Admin CANNOT use Student Login
  const res3b = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ ...adminCreds, expectedRole: 'student' }),
  });
  assert(res3b.status === 403 && res3b.data.message.includes('reserved for students'), 'Admin is DENIED access through Student Login');

  // 3c. Club Lead CANNOT use Student Login
  const res3c = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ ...leadCreds, expectedRole: 'student' }),
  });
  assert(res3c.status === 403 && res3c.data.message.includes('reserved for students'), 'Club Lead is DENIED access through Student Login');

  // -------------------------------------------------------------------------
  // 4. SECURITY & PERMISSION BOUNDARIES
  // -------------------------------------------------------------------------
  console.log('\n🔒 4. SECURITY BOUNDARIES & API AUTHORIZATION:');

  // 4a. Student CANNOT access Club Lead API
  const res4a = await request('/club-lead/dashboard', {
    method: 'GET',
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  assert(res4a.status === 403, 'Student blocked (HTTP 403) from Club Lead API');

  // 4b. Student CANNOT access Admin API
  const res4b = await request('/admin/stats', {
    method: 'GET',
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  assert(res4b.status === 403, 'Student blocked (HTTP 403) from Admin API');

  // 4c. Club Lead CANNOT access Admin API
  const res4c = await request('/admin/stats', {
    method: 'GET',
    headers: { Authorization: `Bearer ${leadToken}` },
  });
  assert(res4c.status === 403, 'Club Lead blocked (HTTP 403) from Admin API');

  // 4d. Unauthenticated request rejected
  const res4d = await request('/club-lead/dashboard', {
    method: 'GET',
  });
  assert(res4d.status === 401, 'Unauthenticated request blocked (HTTP 401)');

  console.log('\n================================================================');
  console.log(`🏁 TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('================================================================');

  if (failed > 0) process.exit(1);
}

runTests().catch(console.error);
