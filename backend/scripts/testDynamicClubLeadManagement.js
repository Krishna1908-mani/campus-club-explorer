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
  console.log('🧪 COMPREHENSIVE TEST: DYNAMIC CLUB CREATION & LEAD MANAGEMENT');
  console.log('================================================================\n');

  // 1. Admin Login
  console.log('🛡️ 1. AUTHENTICATE ADMINISTRATOR:');
  const adminLoginRes = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'admin@campus.edu', password: 'admin123', expectedRole: 'admin' }),
  });
  assert(adminLoginRes.status === 200 && adminLoginRes.data.token, 'Admin successfully logs in');
  const adminToken = adminLoginRes.data.token;

  // 2. Dynamic Club Creation (Unassigned Lead)
  console.log('\n🏛️ 2. DYNAMIC CLUB CREATION (WITHOUT INITIAL LEAD):');
  const testClubName = `RoboVenture Club ${Date.now().toString().slice(-4)}`;
  const createClubRes = await request('/clubs', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({
      name: testClubName,
      short_description: 'Autonomous robotics and competitive hardware engineering.',
      full_description: 'RoboVenture Club designs autonomous mobile robots and IoT embedded systems for collegiate robotics tournaments.',
      category_id: '8f0582fc-18e9-4a2c-89c4-f77df2f31e09', // Coding & Tech
    }),
  });
  assert(createClubRes.status === 201 && createClubRes.data.data?.id, `Admin dynamically creates new club: "${testClubName}"`);
  const createdClubId = createClubRes.data.data.id;

  // 3. Verify Club Appears Automatically in Directory as "unassigned"
  console.log('\n📋 3. VERIFY AUTOMATIC APPEARANCE IN DIRECTORY:');
  const dirRes = await request('/admin/club-leads/directory', {
    method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(dirRes.status === 200 && dirRes.data.data?.directory, 'Admin fetches Club Lead Directory');
  
  const foundClubEntry = dirRes.data.data.directory.find(d => d.club.id === createdClubId);
  assert(
    foundClubEntry && foundClubEntry.assignmentStatus === 'unassigned' && foundClubEntry.lead === null,
    `Newly created club appears automatically with status: "Not Assigned" (unassigned)`
  );

  // 4. Provision Dedicated Club Lead Account for Newly Created Club
  console.log('\n👤 4. ADMIN CREATES DEDICATED CLUB LEAD ACCOUNT:');
  const leadEmail = `lead.robo.${Date.now().toString().slice(-4)}@campus.edu`;
  const leadName = 'Alex Mercer (Lead)';
  const createLeadRes = await request('/admin/club-leads/create-account', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({
      full_name: leadName,
      email: leadEmail,
      password: 'lead123',
      club_id: createdClubId,
      department: 'Robotics & Mechatronics',
      student_id: 'LEAD-ROBO-99',
    }),
  });
  assert(createLeadRes.status === 201 && createLeadRes.data.data?.user?.email === leadEmail, `Admin provisions Club Lead account for "${leadEmail}"`);
  const newLeadUserId = createLeadRes.data.data.user.id;

  // 5. Verify Directory Updates to "assigned" with Email & ID
  console.log('\n🔄 5. VERIFY DIRECTORY REGISTRY REFLECTS ASSIGNMENT:');
  const dirRes2 = await request('/admin/club-leads/directory', {
    method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const updatedEntry = dirRes2.data.data.directory.find(d => d.club.id === createdClubId);
  assert(
    updatedEntry &&
    updatedEntry.assignmentStatus === 'assigned' &&
    updatedEntry.lead?.email === leadEmail &&
    updatedEntry.lead?.id === newLeadUserId &&
    updatedEntry.accountStatus === 'active',
    `Club Lead directory displays assigned status, lead name, and login email (${leadEmail})`
  );

  // 6. Club Lead Signs in on Common /club-lead/login
  console.log('\n🧭 6. CLUB LEAD INDIVIDUAL AUTHENTICATION:');
  const leadLoginRes = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: leadEmail, password: 'lead123', expectedRole: 'club_lead' }),
  });
  assert(leadLoginRes.status === 200 && leadLoginRes.data.profile?.role === 'club_lead', 'Club Lead logs in with unique credentials');
  const newLeadToken = leadLoginRes.data.token;

  // 7. Dynamic Club Lead Dashboard Loads ONLY Assigned Club
  console.log('\n📊 7. SCOPED DASHBOARD DATA RESOLUTION:');
  const leadDashRes = await request('/club-lead/dashboard', {
    method: 'GET',
    headers: { Authorization: `Bearer ${newLeadToken}` },
  });
  assert(
    leadDashRes.status === 200 && leadDashRes.data.data?.club?.id === createdClubId,
    `Club Lead dashboard dynamically loads assigned club: "${leadDashRes.data.data?.club?.name}"`
  );

  // 8. Cross-Club Isolation & Authorization
  console.log('\n🔒 8. CROSS-CLUB ISOLATION:');
  const flagshipAiClubId = '466d5f07-1994-49f9-8d7d-6ea7ae85b3bc';
  // Attempting to post event for another club
  const crossEventRes = await request('/club-lead/events', {
    method: 'POST',
    headers: { Authorization: `Bearer ${newLeadToken}` },
    body: JSON.stringify({
      club_id: flagshipAiClubId, // Attempt to tamper club_id
      title: 'Malicious Injected Event',
      description: 'Tampered club ID',
      venue: 'Robotics Arena West',
      event_date: '2026-12-30',
    }),
  });
  // Event should be created strictly for their OWN club, NOT the tampered club
  assert(
    crossEventRes.status === 201 && crossEventRes.data.data?.club_id === createdClubId,
    `Server strictly forces Club Lead's assigned club ID (${createdClubId}), preventing cross-club tampering`
  );

  // 9. Account Status Management (Deactivate / Reactivate)
  console.log('\n⛔ 9. ACCOUNT STATUS DEACTIVATION & REACTIVATION:');
  // Deactivate account
  const deactRes = await request(`/admin/club-leads/${newLeadUserId}/status`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({ status: 'deactivated' }),
  });
  assert(deactRes.status === 200 && deactRes.data.success, 'Admin deactivates Club Lead account');

  // Attempt login with deactivated account -> Must be rejected
  const deactLoginRes = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: leadEmail, password: 'lead123', expectedRole: 'club_lead' }),
  });
  assert(deactLoginRes.status === 403 && deactLoginRes.data.message.includes('deactivated'), 'Deactivated Club Lead is REJECTED from logging in');

  // Reactivate account
  const reactRes = await request(`/admin/club-leads/${newLeadUserId}/status`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({ status: 'active' }),
  });
  assert(reactRes.status === 200 && reactRes.data.success, 'Admin reactivates Club Lead account');

  // 10. Password Reset
  console.log('\n🔑 10. SECURE PASSWORD RESET WORKFLOW:');
  const newPass = 'leadPass2026!';
  const resetRes = await request(`/admin/club-leads/${newLeadUserId}/reset-password`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({ new_password: newPass }),
  });
  assert(resetRes.status === 200 && resetRes.data.success, 'Admin resets Club Lead password');

  // Log in with new password
  const newPassLoginRes = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: leadEmail, password: newPass, expectedRole: 'club_lead' }),
  });
  assert(newPassLoginRes.status === 200, 'Club Lead logs in with newly reset password');

  // 11. Profile Edit
  console.log('\n✏️ 11. EDIT CLUB LEAD PROFILE DETAILS:');
  const editProfileRes = await request(`/admin/club-leads/${newLeadUserId}/profile`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({
      full_name: 'Alex Mercer (Senior Lead)',
      department: 'Advanced Cybernetics & AI',
      student_id: 'LEAD-SENIOR-01',
    }),
  });
  assert(editProfileRes.status === 200 && editProfileRes.data.success, 'Admin updates Club Lead profile information');

  // 12. Integrated Dynamic Club Creation (with Immediate Lead Creation)
  console.log('\n⚡ 12. INTEGRATED CLUB + LEAD ACCOUNT CREATION (PHASE 2):');
  const integratedClubName = `AeroSpace Club ${Date.now().toString().slice(-4)}`;
  const integratedLeadEmail = `lead.aero.${Date.now().toString().slice(-4)}@campus.edu`;
  const integratedRes = await request('/clubs', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({
      name: integratedClubName,
      short_description: 'Rocketry and aerodynamic simulations.',
      full_description: 'AeroSpace Club designs amateur sounding rockets and computational fluid dynamic models.',
      category_id: '8f0582fc-18e9-4a2c-89c4-f77df2f31e09',
      lead_full_name: 'Elena Rostova (Lead)',
      lead_email: integratedLeadEmail,
      lead_password: 'lead123',
      lead_department: 'Aerospace Engineering',
    }),
  });
  assert(
    integratedRes.status === 201 && integratedRes.data.lead?.user?.email === integratedLeadEmail,
    `Admin creates club and provisions lead account in single workflow ("${integratedClubName}" + "${integratedLeadEmail}")`
  );

  console.log('\n================================================================');
  console.log(`🏁 TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('================================================================');

  if (failed > 0) process.exit(1);
}

runTests().catch(console.error);
