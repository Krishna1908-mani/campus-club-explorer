import { supabaseAdmin, supabase } from '../config/supabase.js';

const client = supabaseAdmin || supabase;

async function seed() {
  console.log('--- Checking & Seeding Supabase Database ---');

  // 1. Categories
  const categories = [
    {
      name: 'Coding & Technology',
      slug: 'coding-tech',
      description: 'Software development, competitive programming, AI/ML, web dev, and hackathons.',
      icon: 'code'
    },
    {
      name: 'Sports & Fitness',
      slug: 'sports-fitness',
      description: 'Competitive and recreational collegiate athletics, fitness, and outdoor activities.',
      icon: 'activity'
    },
    {
      name: 'Arts & Creativity',
      slug: 'arts-creativity',
      description: 'Visual arts, literature, creative writing, photography, and design.',
      icon: 'palette'
    },
    {
      name: 'Entrepreneurship',
      slug: 'entrepreneurship',
      description: 'Startup incubation, venture capital, pitch competitions, and business leadership.',
      icon: 'trending-up'
    },
    {
      name: 'Music & Performing Arts',
      slug: 'music-dance',
      description: 'Orchestral music, acoustic bands, theater, vocal performance, and stage arts.',
      icon: 'music'
    }
  ];

  console.log(`Upserting ${categories.length} categories...`);
  const { data: upsertedCats, error: catErr } = await client
    .from('categories')
    .upsert(categories, { onConflict: 'slug', ignoreDuplicates: true })
    .select();

  if (catErr) {
    console.error('Error inserting categories:', catErr);
    process.exit(1);
  }

  // Fetch all categories to get their generated IDs
  const { data: allCats, error: fetchCatErr } = await client
    .from('categories')
    .select('id, name, slug');

  if (fetchCatErr) {
    console.error('Error fetching categories:', fetchCatErr);
    process.exit(1);
  }

  const catMap = {};
  allCats.forEach(c => {
    catMap[c.slug] = c.id;
  });

  console.log('Category mapping ready:', catMap);

  // 2. Five Sample Clubs
  const sampleClubs = [
    {
      name: 'Google Developer Student Club',
      slug: 'gdsc-campus',
      category_id: catMap['coding-tech'],
      short_description: 'University tech community focused on mobile, cloud, web, and machine learning technologies.',
      full_description: 'Google Developer Student Clubs (GDSC) are university-based community groups for students interested in Google developer technologies. By joining GDSC, students grow their knowledge in a peer-to-peer learning environment and build solutions for local businesses and their community.',
      mission: 'To bridge the gap between academic theory and practical software engineering practice.',
      activities_and_achievements: 'Organized Annual Hack-a-Thon 2025 with 400+ participants; regular workshops on Next.js, Cloud Run, and TensorFlow.',
      logo_url: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=200&auto=format&fit=crop&q=80',
      cover_image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80',
      establishment_date: '2021-08-15',
      faculty_coordinator: 'Dr. Alan Vance (Dept of Computer Science)',
      student_coordinator: 'Arjun Mehta (Lead Organizer)',
      contact_email: 'gdsc@campus.edu',
      social_links: {
        github: 'https://github.com/gdsc-campus',
        linkedin: 'https://linkedin.com/company/gdsc-campus',
        website: 'https://gdsc.community.dev'
      },
      member_count: 142,
      is_featured: true,
      is_active: true
    },
    {
      name: 'Apex Football Club',
      slug: 'apex-fc',
      category_id: catMap['sports-fitness'],
      short_description: 'Premier university football team training for inter-collegiate tournaments and sportsmanship.',
      full_description: 'Apex Football Club represents the pinnacle of campus athletics. We run daily conditioning sessions, tactical training drills, and participate in statewide collegiate leagues. All skill levels are welcome for open tryouts and intramural weekend games.',
      mission: 'To foster physical fitness, athletic discipline, and unity across the campus community.',
      activities_and_achievements: 'State Inter-Collegiate Champions 2024 & 2025; hosted the All-University Futsal Invitational with 24 competing teams.',
      logo_url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200&auto=format&fit=crop&q=80',
      cover_image_url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&auto=format&fit=crop&q=80',
      establishment_date: '2018-09-01',
      faculty_coordinator: 'Prof. Marcus Brody (Director of Athletics)',
      student_coordinator: 'David Chen (Captain)',
      contact_email: 'apexfootball@campus.edu',
      social_links: {
        instagram: 'https://instagram.com/apexfc_campus',
        youtube: 'https://youtube.com/@apexfc_campus'
      },
      member_count: 68,
      is_featured: true,
      is_active: true
    },
    {
      name: 'Canvas & Quill Arts Society',
      slug: 'canvas-and-quill',
      category_id: catMap['arts-creativity'],
      short_description: 'A collective of illustrators, writers, and digital artists shaping campus culture through visual media.',
      full_description: 'Canvas & Quill is the creative haven of the university. We organize live sketching retreats, annual art exhibitions, zine publishing, and digital concept art workshops in collaboration with visiting artists.',
      mission: 'To empower artistic expression and showcase emerging student creators to a broader audience.',
      activities_and_achievements: 'Published the annual campus literary anthology "Veritas"; designed university festival brand identity.',
      logo_url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=200&auto=format&fit=crop&q=80',
      cover_image_url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1200&auto=format&fit=crop&q=80',
      establishment_date: '2019-02-10',
      faculty_coordinator: 'Dr. Elena Rostova (School of Fine Arts)',
      student_coordinator: 'Maya Lin (Creative Director)',
      contact_email: 'canvasquill@campus.edu',
      social_links: {
        instagram: 'https://instagram.com/canvas_quill',
        website: 'https://canvasquill.campus.edu'
      },
      member_count: 95,
      is_featured: true,
      is_active: true
    },
    {
      name: 'E-Cell Innovation & Venture Club',
      slug: 'ecell-campus',
      category_id: catMap['entrepreneurship'],
      short_description: 'Student-run startup incubator mentoring founders from ideation to seed capital and venture pitches.',
      full_description: 'The Entrepreneurship Cell (E-Cell) is dedicated to fostering startup culture on campus. We provide founder mentorship, pitch deck reviews, legal consulting clinics, and angel investor networking for student entrepreneurs.',
      mission: 'To ignite entrepreneurial thinking and turn collegiate research projects into scalable startups.',
      activities_and_achievements: 'Facilitated $150K in student startup grant funding in 2025; organized Global Entrepreneurship Summit with 50+ founders.',
      logo_url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=200&auto=format&fit=crop&q=80',
      cover_image_url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&auto=format&fit=crop&q=80',
      establishment_date: '2020-01-20',
      faculty_coordinator: 'Prof. Rajiv Singhania (Business School)',
      student_coordinator: 'Sara Al-Mansoor (President)',
      contact_email: 'ecell@campus.edu',
      social_links: {
        linkedin: 'https://linkedin.com/company/ecell-campus',
        twitter: 'https://x.com/ecell_campus'
      },
      member_count: 110,
      is_featured: true,
      is_active: true
    },
    {
      name: 'Aura Music & Symphony Society',
      slug: 'aura-music-society',
      category_id: catMap['music-dance'],
      short_description: 'Orchestral, acoustic, and vocal performers uniting the campus through live concerts and recitals.',
      full_description: 'Aura Music Society brings together instrumentalists, composers, and vocalists across classical, jazz, and contemporary genres. The society hosts acoustic jam sessions, semester recitals, and charity concerts.',
      mission: 'To enrich campus life through musical excellence, collaborative performance, and musical education.',
      activities_and_achievements: 'Headlined the Annual Campus Spring Gala 2025; regular collaborative jam sessions with visiting conservatory musicians.',
      logo_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&auto=format&fit=crop&q=80',
      cover_image_url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1200&auto=format&fit=crop&q=80',
      establishment_date: '2022-03-12',
      faculty_coordinator: 'Dr. Julian Sterling (Conservatory of Music)',
      student_coordinator: 'Lucas Morales (Conductor & Lead)',
      contact_email: 'auramusic@campus.edu',
      social_links: {
        instagram: 'https://instagram.com/aura_symphony',
        youtube: 'https://youtube.com/@aura_musicsociety'
      },
      member_count: 84,
      is_featured: false,
      is_active: true
    }
  ];

  console.log(`Upserting ${sampleClubs.length} sample clubs...`);
  const { data: upsertedClubs, error: clubErr } = await client
    .from('clubs')
    .upsert(sampleClubs, { onConflict: 'slug', ignoreDuplicates: true })
    .select();

  if (clubErr) {
    console.error('Error inserting clubs:', clubErr);
    process.exit(1);
  }

  // 3. Verify directly from Supabase
  const { data: verifiedClubs, error: verifyErr } = await client
    .from('clubs')
    .select(`
      id,
      name,
      slug,
      short_description,
      member_count,
      is_featured,
      categories (
        id,
        name,
        slug
      )
    `);

  if (verifyErr) {
    console.error('Error verifying clubs:', verifyErr);
    process.exit(1);
  }

  console.log('\n--- Live Supabase Verification Success ---');
  console.log(`Total clubs retrieved from Supabase: ${verifiedClubs.length}`);
  verifiedClubs.forEach((c, idx) => {
    console.log(`${idx + 1}. [${c.categories?.name || 'No Category'}] ${c.name} (${c.slug}) - ${c.member_count} members`);
  });
}

seed().catch(err => {
  console.error('Seeding script failed:', err);
  process.exit(1);
});

