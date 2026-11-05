import { supabaseAdmin, supabase } from '../config/supabase.js';

const client = supabaseAdmin || supabase;

async function expandClubs() {
  console.log('========================================================');
  console.log('🚀 Executing 30-Club Expansion Migration to Supabase');
  console.log('========================================================');

  // 1. Ensure New Categories Exist
  const newCategories = [
    {
      name: 'Literature & Communication',
      slug: 'literature-media',
      description: 'Debate societies, creative writing, Model UN, and student journalism.',
      icon: 'book-open'
    },
    {
      name: 'Social Responsibility & Environment',
      slug: 'social-impact',
      description: 'Community volunteering, rural development, environmental sustainability, and youth leadership.',
      icon: 'globe'
    },
    {
      name: 'Gaming & Strategy',
      slug: 'gaming-strategy',
      description: 'Competitive esports, collegiate chess tactics, video game development, and trivia quiz bowls.',
      icon: 'gamepad-2'
    }
  ];

  console.log('Step 1: Upserting missing categories...');
  const { error: catErr } = await client
    .from('categories')
    .upsert(newCategories, { onConflict: 'slug', ignoreDuplicates: true });

  if (catErr) {
    console.error('Error inserting categories:', catErr);
    process.exit(1);
  }

  // Fetch all categories to map slug -> UUID
  const { data: allCategories, error: fetchCatErr } = await client
    .from('categories')
    .select('id, name, slug');

  if (fetchCatErr) {
    console.error('Error fetching categories:', fetchCatErr);
    process.exit(1);
  }

  const catMap = {};
  allCategories.forEach(c => {
    catMap[c.slug] = c.id;
  });

  console.log(`Step 1 Complete: ${allCategories.length} categories available in database.`);

  // 2. Define the 30 New Clubs with Verified 200 OK CDN Assets
  const thirtyClubs = [
    // A. Programming & Technology
    {
      name: 'Competitive Programming Club',
      slug: 'competitive-programming-club',
      category_id: catMap['coding-tech'],
      short_description: 'Master algorithmic problem solving, graph theory, dynamic programming, and ICPC collegiate contests.',
      full_description: 'The Competitive Programming Club is dedicated to cultivating algorithmic problem-solving excellence. Members engage in weekly virtual contests, dissect advanced data structures, and train for prestigious competitions including Google Code Jam, Codeforces rounds, and ACM-ICPC regionals.',
      mission: 'To elevate campus algorithmic problem-solving standards and mentor students toward competitive programming mastery.',
      activities_and_achievements: 'Hosted Campus Coding Showdown 2025 with 350+ coders; 4 teams qualified for Regional ICPC semifinals.',
      logo_url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&auto=format&fit=crop&q=80',
      cover_image_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80',
      establishment_date: '2021-09-01',
      faculty_coordinator: 'Prof. Robert Sterling (Dept. of CSE)',
      student_coordinator: 'Kavya Patel (Lead Programmer)',
      contact_email: 'cpc@campus.edu',
      member_count: 88,
      is_featured: true,
      is_active: true
    },
    {
      name: 'Artificial Intelligence & Machine Learning Club',
      slug: 'ai-ml-club',
      category_id: catMap['coding-tech'],
      short_description: 'Exploring neural networks, computer vision, natural language processing, and practical generative AI models.',
      full_description: 'AIML Club bridges academic research and enterprise machine learning deployments. We host hands-on labs covering PyTorch, Transformer architectures, reinforcement learning, and ethical AI development.',
      mission: 'To democratize artificial intelligence education and empower students to build intelligent systems solving real problems.',
      activities_and_achievements: 'Published 3 papers in undergraduate research symposiums; hosted Generative AI Hackathon with AWS sponsorship.',
      logo_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&auto=format&fit=crop&q=80',
      cover_image_url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&auto=format&fit=crop&q=80',
      establishment_date: '2022-02-15',
      faculty_coordinator: 'Dr. Maya Ananya (AI Research Lab)',
      student_coordinator: 'Rohan Sharma (President)',
      contact_email: 'aiml@campus.edu',
      member_count: 124,
      is_featured: true,
      is_active: true
    },
    {
      name: 'Robotics & IoT Club',
      slug: 'robotics-iot-club',
      category_id: catMap['coding-tech'],
      short_description: 'Designing autonomous robots, sensor networks, microcontrollers, and embedded hardware solutions.',
      full_description: 'The Robotics and Internet of Things Club is the physical computing laboratory of the campus. From micromouse maze solvers to quadcopter drones and automated greenhouse sensors, we turn electronics into autonomous hardware.',
      mission: 'To foster hardware innovation and interdisciplinary engineering through robotics projects.',
      activities_and_achievements: 'First place in National University Robo-Wars 2025; engineered automated hydroponic sensors for campus botany dept.',
      logo_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&auto=format&fit=crop&q=80',
      cover_image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80',
      establishment_date: '2020-08-10',
      faculty_coordinator: 'Prof. Tarun Sen (Dept. of ECE)',
      student_coordinator: 'Ananya Sen (Hardware Lead)',
      contact_email: 'robotics@campus.edu',
      member_count: 72,
      is_featured: false,
      is_active: true
    },
    {
      name: 'Cybersecurity Club',
      slug: 'cybersecurity-club',
      category_id: catMap['coding-tech'],
      short_description: 'Dedicated to penetration testing, ethical hacking, cryptography, defense operations, and capture-the-flag competitions.',
      full_description: 'Campus Cybersecurity Club trains defensive and offensive security engineers. We run private CTF competitions, vulnerability research workshops, reverse engineering bootcamps, and cybersecurity awareness sessions for the campus community.',
      mission: 'To cultivate white-hat security skills and safeguard digital infrastructure through hands-on education.',
      activities_and_achievements: 'Top 10 national ranking in CyberCollegiate CTF 2025; conducted campus-wide phishing defense training.',
      logo_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&auto=format&fit=crop&q=80',
      cover_image_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&auto=format&fit=crop&q=80',
      establishment_date: '2021-11-20',
      faculty_coordinator: 'Dr. Raymond Vance (Information Assurance)',
      student_coordinator: 'Vikram Joshi (Captain)',
      contact_email: 'cybersec@campus.edu',
      member_count: 96,
      is_featured: false,
      is_active: true
    },

    // B. Web & Digital Technology
    {
      name: 'Web Development Club',
      slug: 'web-development-club',
      category_id: catMap['coding-tech'],
      short_description: 'Building full-stack web applications, modern frontends, scalable REST/GraphQL APIs, and UI systems.',
      full_description: 'Web Development Club brings together frontend designers, backend engineers, and DevOps enthusiasts. We build and maintain internal student tools, conduct workshops in React, Next.js, Tailwind, and Node.js.',
      mission: 'To empower every student to design, code, and deploy production-ready web platforms.',
      activities_and_achievements: 'Engineered the campus transit tracking web app; organized WebCraft 2025 with 250+ student devs.',
      logo_url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&auto=format&fit=crop&q=80',
      cover_image_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80',
      establishment_date: '2019-07-15',
      faculty_coordinator: 'Prof. Sandra Williams (Dept. of CSE)',
      student_coordinator: 'Neil Deshmukh (Lead Developer)',
      contact_email: 'webdev@campus.edu',
      member_count: 130,
      is_featured: true,
      is_active: true
    },
    {
      name: 'Mobile App Development Club',
      slug: 'mobile-app-dev-club',
      category_id: catMap['coding-tech'],
      short_description: 'Creating native and cross-platform mobile apps using Flutter, Swift, Kotlin, and React Native.',
      full_description: 'Mobile App Development Club guides students from mobile UI concepts to App Store and Google Play releases. We focus on modern mobile architectures, state management, offline-first databases, and device sensor APIs.',
      mission: 'To transform innovative collegiate mobile ideas into fluid, cross-platform apps.',
      activities_and_achievements: 'Released 4 student-made apps on Play Store in 2025; held weekend Flutter sprint with 120 attendees.',
      logo_url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&auto=format&fit=crop&q=80',
      cover_image_url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&auto=format&fit=crop&q=80',
      establishment_date: '2022-09-12',
      faculty_coordinator: 'Prof. Kevin Harris (Mobile Computing)',
      student_coordinator: 'Zara Khan (Lead Architect)',
      contact_email: 'mobiledev@campus.edu',
      member_count: 64,
      is_featured: false,
      is_active: true
    },
    {
      name: 'Open Source Development Club',
      slug: 'open-source-dev-club',
      category_id: catMap['coding-tech'],
      short_description: 'Empowering students to contribute to global open-source ecosystems, Git collaboration, and Linux tools.',
      full_description: 'Open Source Club introduces students to collaborative software engineering. We demystify pull requests, open-source licensing, code reviews, and help students make impactful contributions to upstream projects like Linux, Apache, and Mozilla.',
      mission: 'To foster a culture of open contribution, transparent software development, and community knowledge sharing.',
      activities_and_achievements: 'Over 200 merged pull requests during Hacktoberfest 2025; 6 members selected for Google Summer of Code.',
      logo_url: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&auto=format&fit=crop&q=80',
      cover_image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
      establishment_date: '2020-10-01',
      faculty_coordinator: 'Dr. Linus Daniels (Software Systems)',
      student_coordinator: 'Aditya Verma (Maintainer)',
      contact_email: 'opensource@campus.edu',
      member_count: 82,
      is_featured: false,
      is_active: true
    },

    // C. Entrepreneurship & Business
    {
      name: 'Campus Entrepreneurship Club',
      slug: 'entrepreneurship-club',
      category_id: catMap['entrepreneurship'],
      short_description: 'Turning student ideas into scalable ventures through founder bootcamps, pitch sessions, and mentor roundtables.',
      full_description: 'The Campus Entrepreneurship Club helps collegiate builders transition from problem statements to viable business models. We facilitate founder roundtables, legal clinics, seed pitch sessions, and customer validation interviews.',
      mission: 'To inspire collegiate entrepreneurship and equip young founders with execution toolkits.',
      activities_and_achievements: 'Organized the 2025 Campus Venture Showcase; 8 student ventures received early-stage angel commitments.',
      logo_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&auto=format&fit=crop&q=80',
      cover_image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80',
      establishment_date: '2021-03-10',
      faculty_coordinator: 'Prof. Diane Ross (School of Management)',
      student_coordinator: 'Tanvi Chawla (President)',
      contact_email: 'entrepreneur@campus.edu',
      member_count: 105,
      is_featured: false,
      is_active: true
    },
    {
      name: 'Business & Finance Club',
      slug: 'business-finance-club',
      category_id: catMap['entrepreneurship'],
      short_description: 'Analyzing equity markets, algorithmic trading, financial modeling, venture capital, and corporate valuation.',
      full_description: 'Business & Finance Club prepares students for careers in investment banking, asset management, and corporate strategy. We manage a simulated collegiate equity portfolio, organize DCF valuation bootcamps, and host Wall Street alumni talks.',
      mission: 'To build rigorous financial literacy and analytical decision-making capabilities across campus.',
      activities_and_achievements: 'First place in Statewide Intercollegiate Equity Pitch 2025; managed top-performing simulated student fund.',
      logo_url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&auto=format&fit=crop&q=80',
      cover_image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&auto=format&fit=crop&q=80',
      establishment_date: '2020-04-14',
      faculty_coordinator: 'Dr. Warren Bradley (Finance & Economics)',
      student_coordinator: 'Siddharth Nair (Chief Analyst)',
      contact_email: 'finance@campus.edu',
      member_count: 76,
      is_featured: false,
      is_active: true
    },
    {
      name: 'Marketing & Management Club',
      slug: 'marketing-management-club',
      category_id: catMap['entrepreneurship'],
      short_description: 'Exploring consumer psychology, growth marketing, digital branding campaigns, and brand strategy.',
      full_description: 'Marketing & Management Club is the creative business engine of campus. We dissect brand turnarounds, formulate viral social media campaigns, organize product management case competitions, and partner with campus events for creative direction.',
      mission: 'To develop modern marketing strategists skilled in digital storytelling, analytics, and leadership.',
      activities_and_achievements: 'Designed branding strategy for University Fest 2025; conducted Growth Marketing Sprint with 140 participants.',
      logo_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&auto=format&fit=crop&q=80',
      cover_image_url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&auto=format&fit=crop&q=80',
      establishment_date: '2022-01-18',
      faculty_coordinator: 'Prof. Lisa Chang (Marketing Dept.)',
      student_coordinator: 'Natasha Roy (Creative Director)',
      contact_email: 'marketing@campus.edu',
      member_count: 68,
      is_featured: false,
      is_active: true
    },

    // D. Sports
    {
      name: 'Volleyball Club',
      slug: 'volleyball-club',
      category_id: catMap['sports-fitness'],
      short_description: 'Competitive collegiate volleyball training, intramural spikes, and statewide beach tournament play.',
      full_description: 'Volleyball Club unites indoor and sand court players of all levels. We organize tactical setting and spiking clinics, intramural leagues, and field teams for university varsity tournaments.',
      mission: 'To promote athletic excellence, court discipline, and spirited teamwork through volleyball.',
      activities_and_achievements: 'Champions of the 2025 State Inter-Collegiate Volleyball Cup; hosted Open Campus Beach Spikes tournament.',
      logo_url: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&auto=format&fit=crop&q=80',
      cover_image_url: 'https://images.unsplash.com/photo-1592656094267-764a45160876?w=1200&auto=format&fit=crop&q=80',
      establishment_date: '2019-11-05',
      faculty_coordinator: 'Coach Paul Mendez (Athletics Dept.)',
      student_coordinator: 'Devon Reed (Team Captain)',
      contact_email: 'volleyball@campus.edu',
      member_count: 54,
      is_featured: false,
      is_active: true
    },
    {
      name: 'Basketball Club',
      slug: 'basketball-club',
      category_id: catMap['sports-fitness'],
      short_description: 'High-intensity collegiate hoops, tactical offense drills, pickup leagues, and inter-university showdowns.',
      full_description: 'Basketball Club represents campus ballers playing competitive 5v5 and 3v3 hoops. We run morning shooting workouts, collegiate league matches, and host the annual Midnight Madness 3v3 intramural showdown.',
      mission: 'To elevate campus basketball culture through rigorous athletic conditioning and inclusive competition.',
      activities_and_achievements: 'State Universities Runner-Up 2025; organized 32-team Midnight Madness charity tournament.',
      logo_url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&auto=format&fit=crop&q=80',
      cover_image_url: 'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=1200&auto=format&fit=crop&q=80',
      establishment_date: '2018-10-12',
      faculty_coordinator: 'Coach Marcus Jordan (Physical Education)',
      student_coordinator: 'Tariq Washington (Varsity Captain)',
      contact_email: 'basketball@campus.edu',
      member_count: 78,
      is_featured: true,
      is_active: true
    },
    {
      name: 'Badminton Club',
      slug: 'badminton-club',
      category_id: catMap['sports-fitness'],
      short_description: 'Agile court footwork, smash techniques, doubles strategy, and seasonal collegiate badminton championships.',
      full_description: 'Badminton Club provides indoor court sessions for both singles speedsters and doubles strategists. We focus on aerobic endurance, deceptive wristwork, match temperament, and statewide collegiate tournaments.',
      mission: 'To provide high-caliber badminton training and foster recreational sportsmanship across campus.',
      activities_and_achievements: 'Gold medals in Men’s and Women’s Doubles at Inter-Collegiate Sports Meet 2025.',
      logo_url: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&auto=format&fit=crop&q=80',
      cover_image_url: 'https://images.unsplash.com/photo-1613918108466-292b78a8ef95?w=1200&auto=format&fit=crop&q=80',
      establishment_date: '2021-02-28',
      faculty_coordinator: 'Prof. Grace Lin (Athletic Coordinator)',
      student_coordinator: 'Chen Wei (Club President)',
      contact_email: 'badminton@campus.edu',
      member_count: 62,
      is_featured: false,
      is_active: true
    },
    {
      name: 'Cricket Club',
      slug: 'cricket-club',
      category_id: catMap['sports-fitness'],
      short_description: 'Premier campus cricket club fostering batting technique, fast bowling, fielding drills, and tournament trophies.',
      full_description: 'Cricket Club commands a storied tradition of turf-pitch excellence. We practice daily net sessions, simulate tactical death-overs situations, and compete in statewide collegiate T20 and 50-over championships.',
      mission: 'To cultivate cricketing excellence, sporting discipline, and community spirit on the pitch.',
      activities_and_achievements: 'Champions of the Inter-University Premier League 2025; undefeated in home series.',
      logo_url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&auto=format&fit=crop&q=80',
      cover_image_url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=80',
      establishment_date: '2017-08-20',
      faculty_coordinator: 'Prof. Anil Deshmukh (Athletic Council)',
      student_coordinator: 'Rahul Dravid Nair (Captain)',
      contact_email: 'cricket@campus.edu',
      member_count: 92,
      is_featured: false,
      is_active: true
    },

    // E. Fitness & Wellness
    {
      name: 'Athletics & Fitness Club',
      slug: 'athletics-fitness-club',
      category_id: catMap['sports-fitness'],
      short_description: 'Strength conditioning, track sprints, high-intensity functional training, and marathon preparation.',
      full_description: 'Athletics & Fitness Club is the university hub for functional training, powerlifting, track athletics, and cardiovascular conditioning. Certified student trainers run weekly bootcamps and marathon prep squads.',
      mission: 'To inspire physical resilience, health consciousness, and athletic achievement across the student body.',
      activities_and_achievements: 'Organized the Annual 10K Campus Run with 600+ finishers; equipped open student calisthenics park.',
      logo_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80',
      cover_image_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&auto=format&fit=crop&q=80',
      establishment_date: '2020-09-15',
      faculty_coordinator: 'Coach Liam Vance (Strength & Conditioning)',
      student_coordinator: 'Jordan Cole (Fitness Lead)',
      contact_email: 'fitness@campus.edu',
      member_count: 85,
      is_featured: false,
      is_active: true
    },
    {
      name: 'Yoga & Wellness Club',
      slug: 'yoga-wellness-club',
      category_id: catMap['sports-fitness'],
      short_description: 'Cultivating mental clarity, mindfulness meditation, breathwork, and restorative yoga asanas on campus lawns.',
      full_description: 'Yoga & Wellness Club offers a serene sanctuary from academic pressures. We conduct daily morning sun salutations, guided mindfulness meditation, breathwork workshops, and holistic stress reduction sessions.',
      mission: 'To nurture holistic student well-being, mindfulness, and physical balance through yoga traditions.',
      activities_and_achievements: 'Conducted International Yoga Day campus gathering with 400 participants; weekly mental wellness circles.',
      logo_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&auto=format&fit=crop&q=80',
      cover_image_url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1200&auto=format&fit=crop&q=80',
      establishment_date: '2021-06-21',
      faculty_coordinator: 'Dr. Sunita Rao (Student Counseling)',
      student_coordinator: 'Priya Menon (Yoga Instructor)',
      contact_email: 'yoga@campus.edu',
      member_count: 70,
      is_featured: false,
      is_active: true
    },

    // F. Arts & Creativity
    {
      name: 'Photography & Cinematography Club',
      slug: 'photography-cinematography-club',
      category_id: catMap['arts-creativity'],
      short_description: 'Visual storytelling through 35mm film, digital mirrorless cameras, documentary cinematography, and color grading.',
      full_description: 'Photography & Cinematography Club captures the essence of campus life. We organize photo walks, studio portraiture lighting workshops, indie short film productions, and curate the annual Campus Visions visual gallery.',
      mission: 'To cultivate visual storytelling and photographic artistry across digital and analog mediums.',
      activities_and_achievements: 'Produced the official university admissions film 2025; hosted 3 gallery exhibitions featuring student work.',
      logo_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&auto=format&fit=crop&q=80',
      cover_image_url: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200&auto=format&fit=crop&q=80',
      establishment_date: '2019-09-01',
      faculty_coordinator: 'Prof. Arthur Pendelton (Media Studies)',
      student_coordinator: 'Lucas Silva (Head of Photography)',
      contact_email: 'photography@campus.edu',
      member_count: 88,
      is_featured: true,
      is_active: true
    },
    {
      name: 'Fine Arts Club',
      slug: 'fine-arts-club',
      category_id: catMap['arts-creativity'],
      short_description: 'Oil painting, charcoal illustration, watercolor landscapes, sculpting, and campus art gallery exhibits.',
      full_description: 'Fine Arts Club provides an inspiring studio space for painters, sculptors, and mixed-media artists. Members hold live figure drawing sessions, outdoor plein-air painting excursions, and annual public art installations.',
      mission: 'To nurture artistic expression and enrich campus public spaces through classical and contemporary visual arts.',
      activities_and_achievements: 'Painted the monumental student center community mural; annual fine arts auction raising funds for art supplies.',
      logo_url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400&auto=format&fit=crop&q=80',
      cover_image_url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1200&auto=format&fit=crop&q=80',
      establishment_date: '2018-03-15',
      faculty_coordinator: 'Dr. Claire Dupont (School of Art)',
      student_coordinator: 'Emily Watson (Curator)',
      contact_email: 'finearts@campus.edu',
      member_count: 65,
      is_featured: false,
      is_active: true
    },
    {
      name: 'Fashion & Design Club',
      slug: 'fashion-design-club',
      category_id: catMap['arts-creativity'],
      short_description: 'Garment construction, sustainable upcycling, haute couture fashion showcases, and runway art direction.',
      full_description: 'Fashion & Design Club is the epicenter of textile innovation on campus. We focus on sustainable fashion, pattern drafting, creative styling, modeling, and produce the flagship Annual Campus Spring Runway.',
      mission: 'To pioneer sustainable student fashion design and celebrate individual sartorial expression.',
      activities_and_achievements: 'Staged the 2025 Runway Showcase attended by 800+ guests; launched campus circular clothing thrift swap.',
      logo_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&auto=format&fit=crop&q=80',
      cover_image_url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&auto=format&fit=crop&q=80',
      establishment_date: '2022-04-10',
      faculty_coordinator: 'Prof. Beatrice Laurent (Design Dept.)',
      student_coordinator: 'Chloe Mercier (Artistic Director)',
      contact_email: 'fashion@campus.edu',
      member_count: 58,
      is_featured: false,
      is_active: true
    },

    // G. Performing Arts
    {
      name: 'Dance Club',
      slug: 'dance-club',
      category_id: catMap['music-dance'],
      short_description: 'Contemporary choreography, hip-hop cyphers, classical fusion, and high-energy inter-collegiate stage routines.',
      full_description: 'Dance Club commands the university stage with electrifying performances. From street hip-hop and breaking to lyrical contemporary and classical Bharatanatyam fusion, our crews perform at all major campus showcases.',
      mission: 'To celebrate diversity in movement, musical rhythm, and high-energy stage performance.',
      activities_and_achievements: 'First place in National Inter-University Dance Battle 2025; regular free open community workshops.',
      logo_url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop&q=80',
      cover_image_url: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=1200&auto=format&fit=crop&q=80',
      establishment_date: '2018-11-20',
      faculty_coordinator: 'Prof. Maya Krishnan (Performing Arts)',
      student_coordinator: 'Rohan Sengupta (Crew Choreographer)',
      contact_email: 'dance@campus.edu',
      member_count: 94,
      is_featured: true,
      is_active: true
    },
    {
      name: 'Drama & Theatre Club',
      slug: 'drama-theatre-club',
      category_id: catMap['music-dance'],
      short_description: 'Stage production, method acting, playwrighting, lighting design, and full-length campus theatrical plays.',
      full_description: 'Drama & Theatre Club produces compelling theatrical experiences ranging from classical Shakespearean tragedies to contemporary satirical comedies and experimental black-box student-written plays.',
      mission: 'To illuminate the human condition through evocative dramatic storytelling and theatrical discipline.',
      activities_and_achievements: 'Staged 4 sold-out theater performances of "The Crucible" in 2025; Best Production at Regional Drama Fest.',
      logo_url: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=400&auto=format&fit=crop&q=80',
      cover_image_url: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=1200&auto=format&fit=crop&q=80',
      establishment_date: '2017-09-14',
      faculty_coordinator: 'Dr. Alistair Finch (Dramatic Arts)',
      student_coordinator: 'Seraphina Vance (Lead Director)',
      contact_email: 'drama@campus.edu',
      member_count: 74,
      is_featured: false,
      is_active: true
    },
    {
      name: 'Music Production Club',
      slug: 'music-production-club',
      category_id: catMap['music-dance'],
      short_description: 'Digital audio workstations, beatmaking, mixing, mastering, synthesizer sound design, and indie record releases.',
      full_description: 'Music Production Club unites audio engineers, beatmakers, and electronic artists. We run studio mixing sessions, synthesize custom sound patches, analyze acoustics, and produce the campus indie artist compilations.',
      mission: 'To empower student music creators with cutting-edge digital audio production skills.',
      activities_and_achievements: 'Released campus compilation album "Echoes Vol. 2" streaming over 50k plays; hosted Ableton Live masterclass.',
      logo_url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&auto=format&fit=crop&q=80',
      cover_image_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80',
      establishment_date: '2021-08-05',
      faculty_coordinator: 'Prof. Daniel Scott (Audio Engineering)',
      student_coordinator: 'Arman Malik (Producer Lead)',
      contact_email: 'musicproduction@campus.edu',
      member_count: 68,
      is_featured: false,
      is_active: true
    },

    // H. Literature & Communication
    {
      name: 'Literary & Debate Club',
      slug: 'literary-debate-club',
      category_id: catMap['literature-media'],
      short_description: 'Parliamentary debate, model United Nations, persuasive rhetoric, and inter-collegiate oratory tournaments.',
      full_description: 'Literary & Debate Club is the premier collegiate platform for public discourse, argumentative rigor, and critical rhetoric. Members compete in British Parliamentary and Asian Parliamentary debate tournaments globally.',
      mission: 'To champion intellectual curiosity, eloquent articulation, and civil discourse on pressing global issues.',
      activities_and_achievements: 'National Parliamentary Debate Champions 2025; organized the Annual Collegiate Model UN with 300 delegates.',
      logo_url: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&auto=format&fit=crop&q=80',
      cover_image_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&auto=format&fit=crop&q=80',
      establishment_date: '2018-02-12',
      faculty_coordinator: 'Prof. Eleanor Ward (Dept. of Humanities)',
      student_coordinator: 'Varun Kashyap (Debate President)',
      contact_email: 'debate@campus.edu',
      member_count: 80,
      is_featured: false,
      is_active: true
    },
    {
      name: 'Creative Writing Club',
      slug: 'creative-writing-club',
      category_id: catMap['literature-media'],
      short_description: 'Poetry slams, short fiction workshops, manuscript critique circles, and student literary anthology publications.',
      full_description: 'Creative Writing Club provides a nurturing circle for fiction writers, poets, essayists, and playwrights. We host weekly prompt sprints, constructive manuscript workshops, and publish the semesterly print journal "Ink & Solitude".',
      mission: 'To inspire original literary voices and cultivate passionate creative writing craft.',
      activities_and_achievements: 'Published two print literary journals; organized the Annual Campus Slam Poetry Showcase.',
      logo_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&auto=format&fit=crop&q=80',
      cover_image_url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&auto=format&fit=crop&q=80',
      establishment_date: '2020-09-28',
      faculty_coordinator: 'Dr. Miriam Ross (Creative Writing)',
      student_coordinator: 'Althea Gomez (Editor-in-Chief)',
      contact_email: 'creativewriting@campus.edu',
      member_count: 62,
      is_featured: false,
      is_active: true
    },

    // I. Social Responsibility
    {
      name: 'NSS & Community Service Club',
      slug: 'nss-community-service-club',
      category_id: catMap['social-impact'],
      short_description: 'Youth leadership through rural education camps, blood donation drives, disaster relief, and civic engagement.',
      full_description: 'National Service Scheme (NSS) and Community Service Club channels collegiate energy into high-impact humanitarian work. We coordinate literacy camps in underserved communities, organize megaton blood donation drives, and lead disaster relief.',
      mission: 'Not me, but you — to serve society with humility, empathy, and meaningful student volunteer action.',
      activities_and_achievements: 'Collected 450 units of blood in 2025 campus drive; mentored 200+ primary school students in rural literacy camp.',
      logo_url: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&auto=format&fit=crop&q=80',
      cover_image_url: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&auto=format&fit=crop&q=80',
      establishment_date: '2016-08-15',
      faculty_coordinator: 'Dr. Rajeshwar Sharma (Program Officer)',
      student_coordinator: 'Meera Krishnan (Volunteer Secretary)',
      contact_email: 'nss@campus.edu',
      member_count: 115,
      is_featured: true,
      is_active: true
    },
    {
      name: 'Environmental Sustainability Club',
      slug: 'environmental-sustainability-club',
      category_id: catMap['social-impact'],
      short_description: 'Campus zero-waste initiatives, tree plantation drives, solar awareness, and ecological conservation projects.',
      full_description: 'Environmental Sustainability Club leads the green transformation of our university. From campus-wide single-use plastic bans to community botanical gardens, composting initiatives, and renewable energy audits, we protect our planet locally.',
      mission: 'To foster environmental stewardship and build an ecologically regenerative campus ecosystem.',
      activities_and_achievements: 'Planted 1,000 indigenous trees on campus periphery; eliminated single-use plastic bottles from dining halls.',
      logo_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&auto=format&fit=crop&q=80',
      cover_image_url: 'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?w=1200&auto=format&fit=crop&q=80',
      establishment_date: '2021-04-22',
      faculty_coordinator: 'Dr. Hannah Green (Environmental Sciences)',
      student_coordinator: 'Ethan Brooks (Eco Lead)',
      contact_email: 'sustainability@campus.edu',
      member_count: 78,
      is_featured: false,
      is_active: true
    },

    // J. Gaming
    {
      name: 'Chess Club',
      slug: 'chess-club',
      category_id: catMap['gaming-strategy'],
      short_description: 'Grandmaster tactics, rapid and blitz chess tournaments, positional endgame theory, and rated collegiate matches.',
      full_description: 'Campus Chess Club is the home of strategic intellect on campus. We analyze historical masterpieces, host weekly FIDE-rated blitz tourneys, teach opening repertoire clinics, and field university teams in national collegiate championships.',
      mission: 'To elevate tactical foresight, analytical patience, and chess artistry across all skill brackets.',
      activities_and_achievements: 'University Chess Team won Gold at Statewide Inter-Varsity Chess Championship 2025.',
      logo_url: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=400&auto=format&fit=crop&q=80',
      cover_image_url: 'https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=1200&auto=format&fit=crop&q=80',
      establishment_date: '2019-10-10',
      faculty_coordinator: 'Prof. Gary Kaspar (Mathematics Dept.)',
      student_coordinator: 'Magnus Anand (Club Captain)',
      contact_email: 'chess@campus.edu',
      member_count: 70,
      is_featured: false,
      is_active: true
    },
    {
      name: 'Esports Club',
      slug: 'esports-club',
      category_id: catMap['gaming-strategy'],
      short_description: 'Competitive PC and console gaming teams, LAN tournaments, tactical FPS coaching, and collegiate leagues.',
      full_description: 'Esports Club organizes university competition in Valorant, League of Legends, Rocket League, and CS2. We coordinate high-speed LAN tournaments, provide broadcast casting production, and represent campus in collegiate esports leagues.',
      mission: 'To legitimize collegiate esports, promote healthy digital gaming culture, and foster tournament champions.',
      activities_and_achievements: 'Champions of the Collegiate Esports Invitational 2025; hosted 64-team campus LAN championship.',
      logo_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&auto=format&fit=crop&q=80',
      cover_image_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80',
      establishment_date: '2021-05-15',
      faculty_coordinator: 'Prof. Tyler Vance (Digital Media)',
      student_coordinator: 'Kai Thorne (Esports Director)',
      contact_email: 'esports@campus.edu',
      member_count: 140,
      is_featured: true,
      is_active: true
    },
    {
      name: 'Game Development Club',
      slug: 'game-development-club',
      category_id: catMap['gaming-strategy'],
      short_description: 'Designing video games from scratch using Unity, Unreal Engine, Godot, Blender 3D art, and game jams.',
      full_description: 'Game Development Club brings together programmers, 3D modelers, sound designers, and narrative writers. We hold 48-hour campus game jams, run shaders and physics programming workshops, and build playable indie game prototypes.',
      mission: 'To turn creative game concepts into interactive digital realities through multidisciplinary collaboration.',
      activities_and_achievements: 'Hosted Campus 48-Hour Game Jam with 18 playable indie submissions; 2 student games featured on itch.io.',
      logo_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&auto=format&fit=crop&q=80',
      cover_image_url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&auto=format&fit=crop&q=80',
      establishment_date: '2020-11-12',
      faculty_coordinator: 'Prof. David Kim (Interactive Media)',
      student_coordinator: 'Maya Sterling (Lead Designer)',
      contact_email: 'gamedev@campus.edu',
      member_count: 86,
      is_featured: false,
      is_active: true
    },
    {
      name: 'Quiz & General Knowledge Club',
      slug: 'quiz-gk-club',
      category_id: catMap['gaming-strategy'],
      short_description: 'Testing trivia mastery across history, science, pop culture, global geopolitics, and inter-varsity quiz bowls.',
      full_description: 'Quiz & General Knowledge Club is the gathering of curious minds. We host high-energy pub-style trivia nights, thematic science and pop culture quizzes, and train teams for prestigious collegiate quiz festivals.',
      mission: 'To foster lifelong curiosity, broad knowledge acquisition, and enthusiastic trivia competition.',
      activities_and_achievements: 'Winners of the All-State Intercollegiate Quiz Bowl 2025; host of the weekly campus brain brawl.',
      logo_url: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=400&auto=format&fit=crop&q=80',
      cover_image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&auto=format&fit=crop&q=80',
      establishment_date: '2018-09-05',
      faculty_coordinator: 'Dr. Jonathan Blake (History & Philosophy)',
      student_coordinator: 'Pranav Mukerji (Quizmaster)',
      contact_email: 'quiz@campus.edu',
      member_count: 66,
      is_featured: false,
      is_active: true
    }
  ];

  console.log(`Step 2: Upserting ${thirtyClubs.length} clubs into Supabase...`);
  const { data: upserted, error: clubErr } = await client
    .from('clubs')
    .upsert(thirtyClubs, { onConflict: 'slug', ignoreDuplicates: true })
    .select('id, name, slug');

  if (clubErr) {
    console.error('Error inserting clubs:', clubErr);
    process.exit(1);
  }

  console.log(`Step 2 Complete: Upsert operation executed successfully.`);

  // 3. Complete Verification
  const { data: allClubs, count, error: verifyErr } = await client
    .from('clubs')
    .select('id, name, slug, member_count, is_featured, categories(name, slug)', { count: 'exact' })
    .order('name', { ascending: true });

  if (verifyErr) {
    console.error('Verification query failed:', verifyErr);
    process.exit(1);
  }

  console.log('========================================================');
  console.log(`🎉 SUCCESS: Verified Total Clubs in Live Database: ${count}`);
  console.log('========================================================');
  allClubs.forEach((c, idx) => {
    const featuredTag = c.is_featured ? '⭐ [Featured]' : '            ';
    console.log(`${String(idx + 1).padStart(2, ' ')}. ${featuredTag} [${(c.categories?.name || 'Unknown').padEnd(28)}] ${c.name} (${c.slug})`);
  });
}

expandClubs().catch(err => {
  console.error('Migration script failed:', err);
  process.exit(1);
});

