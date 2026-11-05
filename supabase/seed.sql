-- ====================================================================
-- CAMPUS CLUB EXPLORER — SUPABASE SEED DATA
-- File: seed.sql
-- ====================================================================

-- 1. Insert Categories
INSERT INTO public.categories (id, name, slug, description, icon) VALUES
('c1000000-0000-0000-0000-000000000001', 'Coding & Technology', 'coding-technology', 'Software development, AI/ML, competitive programming, cybersecurity, and robotics.', 'Code2'),
('c1000000-0000-0000-0000-000000000002', 'Sports & Fitness', 'sports-fitness', 'Inter-college tournaments, track & field, fitness bootcamps, and indoor sports.', 'Trophy'),
('c1000000-0000-0000-0000-000000000003', 'Arts & Creativity', 'arts-creativity', 'Fine arts, digital illustration, origami, theater design, and creative writing.', 'Palette'),
('c1000000-0000-0000-0000-000000000004', 'Entrepreneurship', 'entrepreneurship', 'Startup incubator, pitch competitions, venture capital workshops, and founder talks.', 'Rocket'),
('c1000000-0000-0000-0000-000000000005', 'Cultural Activities', 'cultural-activities', 'Festivals, heritage celebrations, drama, literary debates, and language clubs.', 'Sparkles'),
('c1000000-0000-0000-0000-000000000006', 'Music & Dance', 'music-dance', 'Acoustic bands, choir, classical dance, hip-hop crews, and electronic music production.', 'Music'),
('c1000000-0000-0000-0000-000000000007', 'Photography & Media', 'photography-media', 'Digital cinematography, drone filmmaking, photojournalism, and podcast production.', 'Camera'),
('c1000000-0000-0000-0000-000000000008', 'Social Service & NGO', 'social-service', 'Community outreach, blood donation camps, environmental cleanliness, and peer tutoring.', 'HeartHandshake')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Clubs
INSERT INTO public.clubs (
    id, name, slug, category_id, short_description, full_description, mission,
    activities_and_achievements, logo_url, cover_image_url, establishment_date,
    faculty_coordinator, student_coordinator, contact_email, social_links,
    member_count, is_featured, is_active
) VALUES
(
    'b1000000-0000-0000-0000-000000000001',
    'Google Developer Student Club',
    'gdsc-campus',
    'c1000000-0000-0000-0000-000000000001',
    'Empowering student developers to build modern solutions for real-world campus problems using Google technologies.',
    'GDSC is a university-based community group supported by Google Developers. Students from all undergraduate or graduate programs with an interest in growing as a developer are welcome. By joining GDSC, students grow their knowledge in a peer-to-peer learning environment and build solutions for local businesses and their community.',
    'To bridge the gap between academic theory and practical industry software engineering through hands-on hackathons and tech talks.',
    'Winner of National Smart Campus Hackathon 2025; Hosted 14 workshops on Flutter, Cloud, and Generative AI; 450+ active members.',
    'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80',
    '2021-08-15',
    'Dr. Rajesh Kumar (Dept. of Computer Science)',
    'Aarav Sharma (Final Year CSE)',
    'gdsc@campus.edu',
    '{"website": "https://gdsc.community.dev", "github": "https://github.com/gdsc-campus", "instagram": "https://instagram.com/gdsc_campus", "linkedin": "https://linkedin.com/company/gdsc-campus"}'::jsonb,
    148,
    true,
    true
),
(
    'b1000000-0000-0000-0000-000000000002',
    'Robotics & Automation Society',
    'robotics-society',
    'c1000000-0000-0000-0000-000000000001',
    'Designing autonomous rovers, drone swarms, and industrial robotic arms with multidisciplinary engineering.',
    'The Robotics & Automation Society brings together students of mechanical, electronics, and computer science engineering to design and fabricate intelligent electromechanical systems. From bot combat leagues to autonomous navigation drones, we transform CAD blueprints into physical reality.',
    'To cultivate practical research in robotics, computer vision, and embedded systems through competitive robotics and research publications.',
    '1st place at Robocon Regionals 2024; Built an autonomous campus parcel delivery rover; Filed 2 student utility patents.',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80',
    '2019-01-20',
    'Prof. Sunita Menon (Dept. of Mechatronics)',
    'Pooja Nair (3rd Year ECE)',
    'robotics@campus.edu',
    '{"website": "https://robotics.campus.edu", "github": "https://github.com/robotics-campus", "youtube": "https://youtube.com/@campusrobotics"}'::jsonb,
    94,
    true,
    true
),
(
    'b1000000-0000-0000-0000-000000000003',
    'E-Cell: Entrepreneurship Cell',
    'entrepreneurship-cell',
    'c1000000-0000-0000-0000-000000000004',
    'Igniting the entrepreneurial spirit, mentoring student startup founders, and securing angel seed funding.',
    'E-Cell is the premier student-run startup accelerator on campus. We organize campus Shark Tank rounds, connect student ventures with venture capitalists and alumni angels, and conduct legal bootcamps on intellectual property and corporate incorporation.',
    'To make our campus a cradle of disruptive innovations and high-growth ventures solving urgent societal challenges.',
    'Facilitated $150K+ in angel funding for 6 student ventures; Hosted Annual Global E-Summit with 2,500+ attendees.',
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&auto=format&fit=crop&q=80',
    '2018-07-10',
    'Dr. Vikram Singhania (School of Management)',
    'Rhea Kapoor (Final Year B.Tech + MBA)',
    'ecell@campus.edu',
    '{"website": "https://ecell-campus.org", "linkedin": "https://linkedin.com/company/ecell-campus", "twitter": "https://x.com/ecell_campus"}'::jsonb,
    215,
    true,
    true
),
(
    'b1000000-0000-0000-0000-000000000004',
    'Campus Symphony & Harmony',
    'campus-music-society',
    'c1000000-0000-0000-0000-000000000006',
    'A sanctuary for instrumentalists, vocalists, songwriters, and live sound engineers across all genres.',
    'Whether you play the cello, master synthesizer patches, shred electric guitar riffs, or sing Indian classical ragas, Campus Symphony unites diverse sonic talents. We headline the annual inter-college music festival and record original studio EPs in the campus audio lab.',
    'To celebrate sonic expression, foster inter-genre collaborations, and elevate the campus cultural heartbeat.',
    'Released 3 original acoustic studio singles on Spotify; Champion of Battle of Bands 2025; Annual Winter Unplugged Night.',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1200&auto=format&fit=crop&q=80',
    '2017-09-01',
    'Prof. David Paul (Liberal Arts)',
    'Kabir Sengupta (3rd Year Architecture)',
    'music.club@campus.edu',
    '{"instagram": "https://instagram.com/campusharmony", "spotify": "https://open.spotify.com/artist/campussymphony"}'::jsonb,
    110,
    true,
    true
),
(
    'b1000000-0000-0000-0000-000000000005',
    'Apex Athletic & Football Club',
    'apex-football-club',
    'c1000000-0000-0000-0000-000000000002',
    'Fostering athletic excellence, tactical football gameplay, and daily strength & conditioning for all collegiate divisions.',
    'Apex FC represents the university in inter-university leagues, state championships, and 7-a-side weekend tournaments. We operate varsity teams as well as open recreation leagues for beginners wanting to stay fit and build teamwork.',
    'Promoting healthy physical lifestyle, competitive camaraderie, and university pride through sportsmanship.',
    'State University Football Trophy 2024 Gold Medalists; 12 team members drafted into national amateur leagues.',
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&auto=format&fit=crop&q=80',
    '2015-08-12',
    'Coach Anthony Fernandez (Director of Physical Education)',
    'Karthik Reddy (Final Year Mechanical)',
    'sports.apex@campus.edu',
    '{"instagram": "https://instagram.com/apex_campus_fc"}'::jsonb,
    88,
    false,
    true
),
(
    'b1000000-0000-0000-0000-000000000006',
    'Shutterbugs Photography & Cinema Club',
    'shutterbugs-photography',
    'c1000000-0000-0000-0000-000000000007',
    'Capturing the candid moments, architectural splendor, and cinematic stories that define collegiate life.',
    'Shutterbugs is the visual narrative team of our campus. Members gain access to professional studio lights, full-frame cameras, and color-grading suites. We run photowalks in old heritage towns, screen independent short films, and curate annual gallery exhibitions.',
    'To train visual storytellers through the craft of light, composition, documentary filmmaking, and creative editing.',
    'Covered 50+ major college festivals; 3 student short films selected at the National Youth Film Festival; Annual Photo Expo.',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200&auto=format&fit=crop&q=80',
    '2018-02-14',
    'Prof. Alok Mukherjee (Visual Communications)',
    'Neha Iyer (3rd Year Media Studies)',
    'shutterbugs@campus.edu',
    '{"instagram": "https://instagram.com/shutterbugs_campus", "behance": "https://behance.net/shutterbugs-campus"}'::jsonb,
    76,
    false,
    true
),
(
    'b1000000-0000-0000-0000-000000000007',
    'Rotaract Youth & Community Outreach',
    'rotaract-community-club',
    'c1000000-0000-0000-0000-000000000008',
    'Dedicated to selfless community service, environmental afforestation, underprivileged literacy, and crisis relief.',
    'Rotaract Club of Campus transforms passion into direct humanitarian action. We conduct weekly teaching sessions in nearby government schools, plant thousands of native saplings each monsoon, and run state-wide disaster relief collection drives.',
    'Service Above Self: developing leadership skills through civic engagement and uplifting vulnerable communities.',
    'Taught 300+ children in Project Vidya; Collected 450 units of blood in Annual Red Cross Blood Camp; Planted 2,000 trees.',
    'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1200&auto=format&fit=crop&q=80',
    '2016-07-22',
    'Dr. Meenakshi Sundaram (Humanities)',
    'Aditya Verma (Final Year Civil)',
    'rotaract@campus.edu',
    '{"website": "https://rotaractcampus.org", "instagram": "https://instagram.com/rotaract_campus"}'::jsonb,
    164,
    true,
    true
),
(
    'b1000000-0000-0000-0000-000000000008',
    'Kalakriti Fine Arts & Theatre Guild',
    'kalakriti-arts-guild',
    'c1000000-0000-0000-0000-000000000003',
    'Unleashing creative imaginations on canvas, stage sets, street plays (Nukkad Natak), and sculptures.',
    'Kalakriti is the home for actors, painters, sculptors, and playwrights. We organize live theatrical productions, street plays tackling contemporary social issues, pottery workshops, and wall mural projects that decorate our campus buildings.',
    'To celebrate artistic heritage, encourage daring creative experiments, and stimulate thought through theatrical storytelling.',
    'Best Street Play award at Mood Indigo 2024; Painted 12 campus wall murals; Staged 4 full-length auditorium plays.',
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=1200&auto=format&fit=crop&q=80',
    '2019-10-02',
    'Prof. Sharmila Roy (Department of Design)',
    'Rohan Chawla (2nd Year Design)',
    'kalakriti@campus.edu',
    '{"instagram": "https://instagram.com/kalakriti_arts"}'::jsonb,
    67,
    false,
    true
)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Events
INSERT INTO public.events (
    id, club_id, title, description, banner_url, event_date, start_time, end_time, venue, registration_url, status
) VALUES
(
    'e1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000001',
    'HackCampus 2026: 36-Hour National Hackathon',
    'Build generative AI apps, smart campus utilities, and decentralized systems with \$5,000 in prizes, free food, and mentor office hours.',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80',
    CURRENT_DATE + INTERVAL '12 days',
    '09:00:00',
    '21:00:00',
    'Auditorium Complex & Tech Innovation Labs',
    'https://hackcampus2026.devpost.com',
    'upcoming'
),
(
    'e1000000-0000-0000-0000-000000000002',
    'b1000000-0000-0000-0000-000000000003',
    'Pitch Deck Masterclass & VC Panel',
    'Learn how top venture capitalists evaluate seed-stage college startups. Featuring guest partners from Sequoia and Accel.',
    'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&auto=format&fit=crop&q=80',
    CURRENT_DATE + INTERVAL '5 days',
    '16:30:00',
    '19:00:00',
    'Management Block Hall A',
    'https://ecell-campus.org/register',
    'upcoming'
),
(
    'e1000000-0000-0000-0000-000000000004',
    'b1000000-0000-0000-0000-000000000004',
    'Under The Stars: Acoustic Night 2026',
    'An open-air evening of heartfelt acoustic melodies, indie folk performances, and warm cider under fairy lights.',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
    CURRENT_DATE + INTERVAL '18 days',
    '18:00:00',
    '22:00:00',
    'Central Amphitheater',
    NULL,
    'upcoming'
),
(
    'e1000000-0000-0000-0000-000000000002',
    'b1000000-0000-0000-0000-000000000002',
    'Autonomous Rover Hands-On BootCamp',
    'Learn ROS 2, LiDAR sensor fusion, and micro-controller circuit fabrication in an intensive 2-day workshop.',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&auto=format&fit=crop&q=80',
    CURRENT_DATE + INTERVAL '24 days',
    '10:00:00',
    '17:00:00',
    'Robotics Fabrication Lab 204',
    NULL,
    'upcoming'
),
(
    'e1000000-0000-0000-0000-000000000007',
    'b1000000-0000-0000-0000-000000000007',
    'Annual Blood Donation & Health Checkup Drive',
    'Join hands with Red Cross Hospital to donate blood and receive free cardiovascular and ocular screenings.',
    'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=1200&auto=format&fit=crop&q=80',
    CURRENT_DATE + INTERVAL '7 days',
    '09:00:00',
    '16:00:00',
    'Student Activity Center (SAC) Ground Floor',
    NULL,
    'upcoming'
)
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Announcements
INSERT INTO public.announcements (id, club_id, title, content) VALUES
(
    'a1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000001',
    'Core Team Applications Open for Fall 2026',
    'We are recruiting Leads for Android, Cloud, AI/ML, and UI/UX tracks. Check the GDSC dashboard and submit your portfolio before Friday.'
),
(
    'a1000000-0000-0000-0000-000000000002',
    'b1000000-0000-0000-0000-000000000003',
    'Campus Incubator Cohort #5 Shortlist Announced',
    'Congratulations to the 8 student teams selected for the 12-week accelerator grant program. Orientation kicks off this Monday at 5 PM.'
),
(
    'a1000000-0000-0000-0000-000000000003',
    'b1000000-0000-0000-0000-000000000004',
    'Auditions for Annual Battle of Bands',
    'Drummers, bassists, and lead vocalists: auditions will be held in Studio B on Wednesday evening. Bring your own instruments if possible.'
)
ON CONFLICT (id) DO NOTHING;
