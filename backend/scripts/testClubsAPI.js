const BASE = 'http://127.0.0.1:5001/api';

async function runTests() {
  console.log('========================================================');
  console.log('🧪 Running Full-Stack Club API & Discovery Test Suite');
  console.log('========================================================');

  let passed = 0;
  let failed = 0;

  function assert(desc, condition) {
    if (condition) {
      console.log(`✅ PASS: ${desc}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${desc}`);
      failed++;
    }
  }

  // 1. Total clubs & pagination check
  const res1 = await fetch(`${BASE}/clubs`).then(r => r.json());
  assert('GET /api/clubs returns success', res1.success === true);
  assert('Total clubs in database is exactly 35', res1.pagination.total === 35);
  assert('Default page 1 limit is 12', res1.data.length === 12);
  assert('Total pages is 3', res1.pagination.totalPages === 3);

  // 2. Pagination Page 2 & Page 3
  const resPage2 = await fetch(`${BASE}/clubs?page=2`).then(r => r.json());
  assert('Page 2 returns 12 clubs', resPage2.data.length === 12);

  const resPage3 = await fetch(`${BASE}/clubs?page=3`).then(r => r.json());
  assert('Page 3 returns 11 clubs (35 total)', resPage3.data.length === 11);

  // 3. Search by name & description
  const resSearch = await fetch(`${BASE}/clubs?search=Chess`).then(r => r.json());
  assert('Search for "Chess" finds Chess Club', resSearch.data.some(c => c.slug === 'chess-club'));

  const resSearchAi = await fetch(`${BASE}/clubs?search=Artificial`).then(r => r.json());
  assert('Search for "Artificial" finds AIML Club', resSearchAi.data.some(c => c.slug === 'ai-ml-club'));

  // 4. Category filtering
  const resSports = await fetch(`${BASE}/clubs?category=sports-fitness`).then(r => r.json());
  assert('Category filter "sports-fitness" returns sports clubs', resSports.data.length >= 6);

  const resGaming = await fetch(`${BASE}/clubs?category=gaming-strategy`).then(r => r.json());
  assert('Category filter "gaming-strategy" returns 4 gaming clubs', resGaming.data.length === 4);

  // 5. Featured clubs endpoint
  const resFeat = await fetch(`${BASE}/clubs/featured?limit=10`).then(r => r.json());
  assert('GET /api/clubs/featured returns spotlight clubs', resFeat.data.length > 0 && resFeat.data.every(c => c.is_featured));

  // 6. Club Detail by slug
  const resDetail = await fetch(`${BASE}/clubs/esports-club`).then(r => r.json());
  assert('GET /api/clubs/esports-club returns complete detail', resDetail.data?.slug === 'esports-club' && resDetail.data?.categories?.name === 'Gaming & Strategy');

  // 7. Categories list
  const resCats = await fetch(`${BASE}/categories`).then(r => r.json());
  assert('GET /api/categories returns all 8 categories', resCats.data.length === 8);

  console.log('========================================================');
  console.log(`Total Tests: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
  console.log('========================================================');

  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('Test runner failed:', err);
  process.exit(1);
});

