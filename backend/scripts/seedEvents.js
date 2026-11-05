import { supabaseAdmin, supabase } from '../config/supabase.js';

const client = supabaseAdmin || supabase;

async function seedEvents() {
  console.log('========================================================');
  console.log('🎟️ Seeding 30 College Events into Live Supabase Database');
  console.log('========================================================');

  // 1. Fetch club mapping (slug -> id)
  const { data: clubs, error: clubErr } = await client.from('clubs').select('id, slug, name');
  if (clubErr) {
    console.error('Error fetching clubs:', clubErr);
    process.exit(1);
  }

  const clubMap = {};
  clubs.forEach(c => {
    clubMap[c.slug] = c.id;
  });

  console.log(`Fetched ${clubs.length} clubs from database.`);

  // 2. Fetch existing event titles to avoid any duplication
  const { data: existingEvents, error: fetchErr } = await client.from('events').select('id, title');
  if (fetchErr) {
    console.error('Error fetching existing events:', fetchErr);
    process.exit(1);
  }

  const existingTitles = new Set((existingEvents || []).map(e => e.title));
  console.log(`Existing events in database: ${existingTitles.size}`);

  // 3. Define the 30 Sample College Events
  const thirtyEvents = [
    // Technical Events
    {
      title: 'National Level Hackathon',
      club_id: clubMap['gdsc-campus'],
      description: 'A 36-hour continuous software engineering hackathon bringing together collegiate developers to build solutions in AI, Cloud, and Sustainability.',
      event_date: '2026-11-28',
      start_time: '09:00:00',
      end_time: '21:00:00',
      venue: 'Main Tech Auditorium & Innovation Lab',
      registration_url: 'https://campus-club-explorer.edu/hackathon',
      max_participants: 350,
      status: 'upcoming',
      banner_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80'
    },
    {
      title: 'Web Development Workshop',
      club_id: clubMap['web-development-club'],
      description: 'Hands-on masterclass building full-stack web applications using React, Next.js, Tailwind CSS, and REST API integrations.',
      event_date: '2026-12-05',
      start_time: '14:00:00',
      end_time: '17:30:00',
      venue: 'Computer Lab 3, Turing Block',
      registration_url: 'https://campus-club-explorer.edu/webdev-workshop',
      max_participants: 120,
      status: 'upcoming',
      banner_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80'
    },
    {
      title: 'AI & Machine Learning Workshop',
      club_id: clubMap['ai-ml-club'],
      description: 'Deep dive into computer vision, neural networks, PyTorch model training, and deploying open-weights LLMs on local GPUs.',
      event_date: '2026-12-12',
      start_time: '10:00:00',
      end_time: '16:00:00',
      venue: 'Computing Center, Hall B',
      registration_url: 'https://campus-club-explorer.edu/aiml-workshop',
      max_participants: 150,
      status: 'upcoming',
      banner_url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&auto=format&fit=crop&q=80'
    },
    {
      title: 'Python Programming Contest',
      club_id: clubMap['competitive-programming-club'],
      description: 'Speed algorithmic problem solving challenge focusing on dynamic programming, string manipulation, and competitive graph algorithms.',
      event_date: '2026-12-18',
      start_time: '15:00:00',
      end_time: '18:00:00',
      venue: 'Central Systems Lab',
      registration_url: 'https://campus-club-explorer.edu/python-contest',
      max_participants: 200,
      status: 'upcoming',
      banner_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80'
    },
    {
      title: 'Cybersecurity Awareness Seminar',
      club_id: clubMap['cybersecurity-club'],
      description: 'Interactive session exploring ethical hacking, social engineering defenses, network forensics, and personal digital privacy practices.',
      event_date: '2026-12-22',
      start_time: '11:00:00',
      end_time: '13:30:00',
      venue: 'Cyber Defense Theater, Block 4',
      registration_url: 'https://campus-club-explorer.edu/cyber-seminar',
      max_participants: 180,
      status: 'upcoming',
      banner_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&auto=format&fit=crop&q=80'
    },
    {
      title: 'Robotics Competition',
      club_id: clubMap['robotics-iot-club'],
      description: 'Collegiate robotics showdown featuring line-follower sprints, obstacle avoidance drones, and autonomous rover combat.',
      event_date: '2027-01-10',
      start_time: '09:30:00',
      end_time: '17:00:00',
      venue: 'Indoor Sports Complex & Arena',
      registration_url: 'https://campus-club-explorer.edu/robocomp',
      max_participants: 250,
      status: 'upcoming',
      banner_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&auto=format&fit=crop&q=80'
    },

    // Cultural Events
    {
      title: 'Annual College Fest',
      club_id: clubMap['dance-club'],
      description: 'The premier university festival celebrating collegiate talent with celebrity performances, multi-stage art battles, and carnival stalls.',
      event_date: '2027-01-20',
      start_time: '16:00:00',
      end_time: '22:00:00',
      venue: 'University Grand Amphitheatre',
      registration_url: 'https://campus-club-explorer.edu/fest',
      max_participants: 1200,
      status: 'upcoming',
      banner_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80'
    },
    {
      title: 'Music Night',
      club_id: clubMap['aura-music-society'],
      description: 'An acoustic and orchestral evening under the stars featuring student soloists, jazz trios, and live symphonic jam sessions.',
      event_date: '2027-01-28',
      start_time: '18:00:00',
      end_time: '21:30:00',
      venue: 'Open Air Lawns',
      registration_url: 'https://campus-club-explorer.edu/music-night',
      max_participants: 500,
      status: 'upcoming',
      banner_url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1200&auto=format&fit=crop&q=80'
    },
    {
      title: 'Dance Competition',
      club_id: clubMap['dance-club'],
      description: 'Inter-college dance crew showdown featuring hip-hop cyphers, classical fusion, contemporary solos, and thematic group routines.',
      event_date: '2027-02-05',
      start_time: '17:00:00',
      end_time: '20:30:00',
      venue: 'Student Activity Center Auditorium',
      registration_url: 'https://campus-club-explorer.edu/dance-comp',
      max_participants: 400,
      status: 'upcoming',
      banner_url: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=1200&auto=format&fit=crop&q=80'
    },
    {
      title: 'Short Film Festival',
      club_id: clubMap['photography-cinematography-club'],
      description: 'Screening student-directed documentaries, narrative shorts, and experimental cinema followed by Q&A with indie jury filmmakers.',
      event_date: '2027-02-14',
      start_time: '14:00:00',
      end_time: '19:00:00',
      venue: 'Media Arts Screening Room',
      registration_url: 'https://campus-club-explorer.edu/filmfest',
      max_participants: 180,
      status: 'upcoming',
      banner_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80'
    },
    {
      title: 'Photography Competition',
      club_id: clubMap['photography-cinematography-club'],
      description: 'Campus theme photography contest showcasing student portraiture, architectural perspectives, and golden hour street captures.',
      event_date: '2027-02-20',
      start_time: '10:00:00',
      end_time: '16:30:00',
      venue: 'Central Library Visual Gallery',
      registration_url: 'https://campus-club-explorer.edu/photo-contest',
      max_participants: 220,
      status: 'upcoming',
      banner_url: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200&auto=format&fit=crop&q=80'
    },
    {
      title: 'Fashion Show',
      club_id: clubMap['fashion-design-club'],
      description: 'Annual runway exhibition spotlighting student garment construction, upcycled couture, and avant-garde aesthetic designs.',
      event_date: '2027-02-27',
      start_time: '18:30:00',
      end_time: '21:30:00',
      venue: 'Convocation Hall Runway Stage',
      registration_url: 'https://campus-club-explorer.edu/fashionshow',
      max_participants: 600,
      status: 'upcoming',
      banner_url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&auto=format&fit=crop&q=80'
    },

    // Sports Events
    {
      title: 'Inter-College Cricket Tournament',
      club_id: clubMap['cricket-club'],
      description: 'Statewide collegiate T20 knockout cup contested over turf pitches featuring 16 competing university teams.',
      event_date: '2026-11-20',
      start_time: '08:30:00',
      end_time: '17:00:00',
      venue: 'Main University Oval Ground',
      registration_url: 'https://campus-club-explorer.edu/cricket-tournament',
      max_participants: 300,
      status: 'upcoming',
      banner_url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=80'
    },
    {
      title: 'Volleyball Championship',
      club_id: clubMap['volleyball-club'],
      description: 'High-octane collegiate volleyball league with fast-paced spikes, tactical setting, and inter-department matches.',
      event_date: '2026-12-02',
      start_time: '09:00:00',
      end_time: '16:00:00',
      venue: 'North Campus Volleyball Courts',
      registration_url: 'https://campus-club-explorer.edu/volleyball-championship',
      max_participants: 160,
      status: 'upcoming',
      banner_url: 'https://images.unsplash.com/photo-1592656094267-764a45160876?w=1200&auto=format&fit=crop&q=80'
    },
    {
      title: 'Badminton Tournament',
      club_id: clubMap['badminton-club'],
      description: 'Singles and doubles indoor tournament with knockout fixtures, swift smashes, and seasonal trophy brackets.',
      event_date: '2026-12-10',
      start_time: '10:00:00',
      end_time: '18:00:00',
      venue: 'Indoor Badminton Complex',
      registration_url: 'https://campus-club-explorer.edu/badminton-tournament',
      max_participants: 120,
      status: 'upcoming',
      banner_url: 'https://images.unsplash.com/photo-1613918108466-292b78a8ef95?w=1200&auto=format&fit=crop&q=80'
    },
    {
      title: 'Football Championship',
      club_id: clubMap['apex-fc'],
      description: 'The pinnacle of collegiate soccer: 90-minute tactical matches with commentary, varsity derbies, and fan support.',
      event_date: '2026-12-15',
      start_time: '15:30:00',
      end_time: '19:00:00',
      venue: 'Varsity Stadium Pitch',
      registration_url: 'https://campus-club-explorer.edu/football-cup',
      max_participants: 220,
      status: 'upcoming',
      banner_url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200&auto=format&fit=crop&q=80'
    },
    {
      title: 'Chess Competition',
      club_id: clubMap['chess-club'],
      description: 'FIDE-rated collegiate rapid and blitz tournament with digital clocks, positional tactics, and live digital board broadcasts.',
      event_date: '2026-12-20',
      start_time: '10:00:00',
      end_time: '17:00:00',
      venue: 'Student Recreation Center, Hall A',
      registration_url: 'https://campus-club-explorer.edu/chess-competition',
      max_participants: 100,
      status: 'upcoming',
      banner_url: 'https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=1200&auto=format&fit=crop&q=80'
    },
    {
      title: 'Athletics Meet',
      club_id: clubMap['athletics-fitness-club'],
      description: 'Annual track and field championships covering 100m dashes, relays, long jump, shot put, and obstacle endurance courses.',
      event_date: '2027-01-08',
      start_time: '08:00:00',
      end_time: '14:00:00',
      venue: 'Synthetic Track & Field Complex',
      registration_url: 'https://campus-club-explorer.edu/athletics-meet',
      max_participants: 300,
      status: 'upcoming',
      banner_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&auto=format&fit=crop&q=80'
    },

    // Entrepreneurship Events
    {
      title: 'Startup Pitch Competition',
      club_id: clubMap['ecell-campus'],
      description: 'Student founders pitch innovative prototypes before angel investors, venture capitalists, and alumni entrepreneurs for seed grants.',
      event_date: '2026-11-25',
      start_time: '13:30:00',
      end_time: '18:00:00',
      venue: 'Venture Incubation Hub Auditorium',
      registration_url: 'https://campus-club-explorer.edu/startup-pitch',
      max_participants: 250,
      status: 'upcoming',
      banner_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&auto=format&fit=crop&q=80'
    },
    {
      title: 'Business Idea Challenge',
      club_id: clubMap['business-finance-club'],
      description: 'Case competition evaluating business model viability, financial forecasting, and go-to-market strategy for emerging consumer markets.',
      event_date: '2026-12-08',
      start_time: '11:00:00',
      end_time: '15:30:00',
      venue: 'Management School Seminar Hall',
      registration_url: 'https://campus-club-explorer.edu/idea-challenge',
      max_participants: 140,
      status: 'upcoming',
      banner_url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&auto=format&fit=crop&q=80'
    },
    {
      title: 'Entrepreneurship Workshop',
      club_id: clubMap['entrepreneurship-club'],
      description: 'Interactive clinic covering product-market fit, user interview methodologies, cap table structures, and legal fundamentals.',
      event_date: '2026-12-16',
      start_time: '10:00:00',
      end_time: '13:00:00',
      venue: 'Innovation Center Boardroom',
      registration_url: 'https://campus-club-explorer.edu/entrepreneur-workshop',
      max_participants: 90,
      status: 'upcoming',
      banner_url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&auto=format&fit=crop&q=80'
    },

    // Educational Events
    {
      title: 'Career Guidance Seminar',
      club_id: clubMap['marketing-management-club'],
      description: 'Industry veterans discuss technical hiring trends, portfolio curation, behavioral interviews, and career pivots in modern tech.',
      event_date: '2026-11-30',
      start_time: '14:00:00',
      end_time: '16:30:00',
      venue: 'Dean of Students Auditorium',
      registration_url: 'https://campus-club-explorer.edu/career-seminar',
      max_participants: 300,
      status: 'upcoming',
      banner_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80'
    },
    {
      title: 'Technical Paper Presentation',
      club_id: clubMap['open-source-dev-club'],
      description: 'Undergraduate symposium presenting peer-reviewed research papers across cloud distributed systems, cybersecurity, and computational biology.',
      event_date: '2026-12-14',
      start_time: '09:30:00',
      end_time: '15:00:00',
      venue: 'Science & Engineering Complex',
      registration_url: 'https://campus-club-explorer.edu/paper-presentation',
      max_participants: 160,
      status: 'upcoming',
      banner_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80'
    },
    {
      title: 'Project Expo',
      club_id: clubMap['mobile-app-dev-club'],
      description: 'Campus-wide exhibition showcasing final year capstones, hardware prototypes, mobile apps, and sustainable engineering models.',
      event_date: '2027-01-15',
      start_time: '10:00:00',
      end_time: '17:00:00',
      venue: 'Engineering Quadrangle Exhibition Area',
      registration_url: 'https://campus-club-explorer.edu/project-expo',
      max_participants: 450,
      status: 'upcoming',
      banner_url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&auto=format&fit=crop&q=80'
    },
    {
      title: 'Alumni Interaction Session',
      club_id: clubMap['entrepreneurship-club'],
      description: 'Fireside chat and networking dinner with distinguished university alumni working across global technology, finance, and research.',
      event_date: '2027-01-25',
      start_time: '17:00:00',
      end_time: '19:30:00',
      venue: 'Executive Conference Hall',
      registration_url: 'https://campus-club-explorer.edu/alumni-talk',
      max_participants: 200,
      status: 'upcoming',
      banner_url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&auto=format&fit=crop&q=80'
    },

    // Arts & Social Events
    {
      title: 'Drawing Competition',
      club_id: clubMap['fine-arts-club'],
      description: 'Live sketching and portraiture challenge focusing on campus architecture, human expression, and mixed-media watercolor techniques.',
      event_date: '2026-12-04',
      start_time: '11:00:00',
      end_time: '14:00:00',
      venue: 'Fine Arts Studio & Terrace',
      registration_url: 'https://campus-club-explorer.edu/drawing-comp',
      max_participants: 120,
      status: 'upcoming',
      banner_url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1200&auto=format&fit=crop&q=80'
    },
    {
      title: 'Debate Competition',
      club_id: clubMap['literary-debate-club'],
      description: 'British parliamentary style debating contest analyzing contemporary economic, technological, and ethical public dilemmas.',
      event_date: '2026-12-11',
      start_time: '15:00:00',
      end_time: '18:30:00',
      venue: 'Moot Court Hall, Law Block',
      registration_url: 'https://campus-club-explorer.edu/debate-comp',
      max_participants: 100,
      status: 'upcoming',
      banner_url: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1200&auto=format&fit=crop&q=80'
    },
    {
      title: 'Quiz Competition',
      club_id: clubMap['quiz-gk-club'],
      description: 'Trivia tournament covering world history, space discoveries, pop culture, sports records, and technical breakthroughs.',
      event_date: '2026-12-19',
      start_time: '16:00:00',
      end_time: '19:00:00',
      venue: 'Auditorium Hall C',
      registration_url: 'https://campus-club-explorer.edu/quiz-comp',
      max_participants: 180,
      status: 'upcoming',
      banner_url: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=1200&auto=format&fit=crop&q=80'
    },
    {
      title: 'Environmental Awareness Campaign',
      club_id: clubMap['environmental-sustainability-club'],
      description: 'Campus green drive featuring indigenous tree planting, composting workshops, solar energy walkthroughs, and zero-waste pledge stations.',
      event_date: '2026-12-24',
      start_time: '09:00:00',
      end_time: '13:00:00',
      venue: 'Central Campus Botanical Lawns',
      registration_url: 'https://campus-club-explorer.edu/eco-campaign',
      max_participants: 300,
      status: 'upcoming',
      banner_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&auto=format&fit=crop&q=80'
    },
    {
      title: 'Community Service Drive',
      club_id: clubMap['nss-community-service-club'],
      description: 'Humanitarian community outreach drive distributing winter essentials, tutoring primary school students, and organizing a mega blood donation camp.',
      event_date: '2027-01-05',
      start_time: '08:30:00',
      end_time: '15:30:00',
      venue: 'University Community Center & Outreach Van',
      registration_url: 'https://campus-club-explorer.edu/community-drive',
      max_participants: 350,
      status: 'upcoming',
      banner_url: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&auto=format&fit=crop&q=80'
    }
  ];

  // Filter out any that already exist
  const eventsToInsert = thirtyEvents.filter(e => !existingTitles.has(e.title));

  console.log(`Events to insert: ${eventsToInsert.length} (Skipping ${thirtyEvents.length - eventsToInsert.length} already existing)`);

  if (eventsToInsert.length > 0) {
    const { data: inserted, error: insertErr } = await client
      .from('events')
      .insert(eventsToInsert)
      .select('id, title, event_date, venue');

    if (insertErr) {
      console.error('Error inserting events:', insertErr);
      process.exit(1);
    }
    console.log(`Successfully inserted ${inserted.length} new events.`);
  }

  // 4. Verify Total Events
  const { data: allEvents, count, error: countErr } = await client
    .from('events')
    .select('id, title, event_date, status, clubs(name)', { count: 'exact' })
    .order('event_date', { ascending: true });

  if (countErr) {
    console.error('Verification query error:', countErr);
    process.exit(1);
  }

  console.log('========================================================');
  console.log(`🎉 SUCCESS: Verified Total Events in Live Database: ${count}`);
  console.log('========================================================');
  allEvents.forEach((evt, idx) => {
    console.log(`${String(idx + 1).padStart(2, ' ')}. [${evt.event_date}] [${(evt.clubs?.name || 'Society').padEnd(32)}] ${evt.title}`);
  });
}

seedEvents().catch(err => {
  console.error('Seeding script failed:', err);
  process.exit(1);
});

