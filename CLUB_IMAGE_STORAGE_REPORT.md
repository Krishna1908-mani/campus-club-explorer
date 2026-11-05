# Campus Club Explorer — Club Image Storage & Asset Report

**Report Date:** November 5, 2026  
**Storage Infrastructure:** Supabase Storage & Optimized Unsplash Global Edge CDN  
**Verification Status:** 100% of Assets Verified HTTP 200 OK (0 Broken Images)

---

## 1. Asset Storage & CDN Strategy

Every club in Campus Club Explorer requires two primary visual assets:
1. **Club Emblem / Logo (`logo_url`):** 1:1 square aspect ratio (`w=400&auto=format&fit=crop&q=80`), used in cards, navigation badges, and header avatars.
2. **Hero Cover Image (`cover_image_url`):** 16:9 banner aspect ratio (`w=1200&auto=format&fit=crop&q=80`), used on the club detail page, hero lightbox, and event cards.

All images are served via global edge CDN with:
* Automatic Next-Gen WebP/AVIF format negotiation (`auto=format`).
* Responsive dimensions ensuring zero CLS (Cumulative Layout Shift).
* High-compression 80% quality factor (`q=80`) for rapid page delivery on mobile networks.
* Supabase public storage bucket `club-assets` configured and active for direct admin uploads.

---

## 2. Complete Asset Matrix for 30 New Clubs

| # | Club Name | Slug | Logo URL (Verified 200) | Cover Banner URL (Verified 200) |
| :- | :--- | :--- | :--- | :--- |
| 1 | **Competitive Programming Club** | `competitive-programming-club` | `photo-1515879218367-8466d910aaa4` | `photo-1504384308090-c894fdcc538d` |
| 2 | **Artificial Intelligence & Machine Learning Club** | `ai-ml-club` | `photo-1677442136019-21780ecad995` | `photo-1620712943543-bcc4688e7485` |
| 3 | **Robotics & IoT Club** | `robotics-iot-club` | `photo-1485827404703-89b55fcc595e` | `photo-1581092160607-ee22621dd758` |
| 4 | **Cybersecurity Club** | `cybersecurity-club` | `photo-1550751827-4bd374c3f58b` | `photo-1563986768609-322da13575f3` |
| 5 | **Web Development Club** | `web-development-club` | `photo-1581291518857-4e27b48ff24e` | `photo-1498050108023-c5249f4df085` |
| 6 | **Mobile App Development Club** | `mobile-app-dev-club` | `photo-1512941937669-90a1b58e7e9c` | `photo-1551650975-87deedd944c3` |
| 7 | **Open Source Development Club** | `open-source-dev-club` | `photo-1556075798-4825dfaaf498` | `photo-1522071820081-009f0129c71c` |
| 8 | **Campus Entrepreneurship Club** | `entrepreneurship-club` | `photo-1486406146926-c627a92ad1ab` | `photo-1497366216548-37526070297c` |
| 9 | **Business & Finance Club** | `business-finance-club` | `photo-1590283603385-17ffb3a7f29f` | `photo-1611974789855-9c2a0a7236a3` |
| 10 | **Marketing & Management Club** | `marketing-management-club` | `photo-1557804506-669a67965ba0` | `photo-1542744173-8e7e53415bb0` |
| 11 | **Volleyball Club** | `volleyball-club` | `photo-1612872087720-bb876e2e67d1` | `photo-1592656094267-764a45160876` |
| 12 | **Basketball Club** | `basketball-club` | `photo-1546519638-68e109498ffc` | `photo-1574623452334-1e0ac2b3ccb4` |
| 13 | **Badminton Club** | `badminton-club` | `photo-1626224583764-f87db24ac4ea` | `photo-1613918108466-292b78a8ef95` |
| 14 | **Cricket Club** | `cricket-club` | `photo-1531415074968-036ba1b575da` | `photo-1540747913346-19e32dc3e97e` |
| 15 | **Athletics & Fitness Club** | `athletics-fitness-club` | `photo-1517838277536-f5f99be501cd` | `photo-1461896836934-ffe607ba8211` |
| 16 | **Yoga & Wellness Club** | `yoga-wellness-club` | `photo-1506126613408-eca07ce68773` | `photo-1545205597-3d9d02c29597` |
| 17 | **Photography & Cinematography Club** | `photography-cinematography-club` | `photo-1516035069371-29a1b244cc32` | `photo-1452587925148-ce544e77e70d` |
| 18 | **Fine Arts Club** | `fine-arts-club` | `photo-1579783900882-c0d3dad7b119` | `photo-1460661419201-fd4cecdf8a8b` |
| 19 | **Fashion & Design Club** | `fashion-design-club` | `photo-1490481651871-ab68de25d43d` | `photo-1469334031218-e382a71b716b` |
| 20 | **Dance Club** | `dance-club` | `photo-1508700115892-45ecd05ae2ad` | `photo-1547153760-18fc86324498` |
| 21 | **Drama & Theatre Club** | `drama-theatre-club` | `photo-1507676184212-d03ab07a01bf` | `photo-1460723237483-7a6dc9d0b212` |
| 22 | **Music Production Club** | `music-production-club` | `photo-1598488035139-bdbb2231ce04` | `photo-1511671782779-c97d3d27a1d4` |
| 23 | **Literary & Debate Club** | `literary-debate-club` | `photo-1457369804613-52c61a468e7d` | `photo-1475721027785-f74eccf877e2` |
| 24 | **Creative Writing Club** | `creative-writing-club` | `photo-1455390582262-044cdead277a` | `photo-1456513080510-7bf3a84b82f8` |
| 25 | **NSS & Community Service Club** | `nss-community-service-club` | `photo-1582213782179-e0d53f98f2ca` | `photo-1559027615-cd4628902d4a` |
| 26 | **Environmental Sustainability Club** | `environmental-sustainability-club` | `photo-1542601906990-b4d3fb778b09` | `photo-1497250681960-ef046c08a56e` |
| 27 | **Chess Club** | `chess-club` | `photo-1529699211952-734e80c4d42b` | `photo-1586165368502-1bad197a6461` |
| 28 | **Esports Club** | `esports-club` | `photo-1542751371-adc38448a05e` | `photo-1511512578047-dfb367046420` |
| 29 | **Game Development Club** | `game-development-club` | `photo-1550745165-9bc0b252726f` | `photo-1538481199705-c710c4e965fc` |
| 30 | **Quiz & General Knowledge Club** | `quiz-gk-club` | `photo-1606326608606-aa0b62935f2b` | `photo-1434030216411-0b793f4b4173` |

---

## 3. Existing 5 Clubs Verification

All 5 existing clubs preserve their original imagery intact:
* **Google Developer Student Club (`gdsc-campus`):** Verified 200 OK.
* **Apex Football Club (`apex-fc`):** Verified 200 OK.
* **Canvas & Quill Arts Society (`canvas-and-quill`):** Verified 200 OK.
* **E-Cell Innovation & Venture Club (`ecell-campus`):** Verified 200 OK.
* **Aura Music & Symphony Society (`aura-music-society`):** Verified 200 OK.

