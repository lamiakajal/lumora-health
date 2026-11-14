# Image guide

Drop optimized files into `public/images/` using the names below. Anything that
is missing falls back to an animated illustration or the person's initials, so
the site never shows a broken image.

## Rules for every photo

- Free for commercial use: **Unsplash**, **Pexels**, **Pixabay** (no credit
  required) or Freepik (credit required on the free plan).
- Real, well-lit, natural photos. Same style across the site: bright, clinical
  but warm, white coats, teal or white scrubs.
- Landscape files at least 1920 px wide, portraits at least 1200 px tall.
- Save as `.webp`, `.jpg` or `.png` (WebP preferred, under 250 KB).
- Never use patient photos that identify a real person without written consent.

## Hero and banners

| File name | What to search | Notes |
| --- | --- | --- |
| `hero.webp` | `doctors team hospital corridor` | Done. Portrait crop, faces in the middle |
| `team-smiling.webp` | `smiling medical team` | Done. About section and CTA banner |
| `team-corridor.webp` | `doctors walking hospital hallway` | Done. Careers banner |
| `cta-welcome.webp` | `friendly doctor welcoming patient` | Final call-to-action banner, space on one side for text |
| `telehealth.webp` | `video call doctor laptop patient` | Telehealth section |
| `insurance.webp` | `health insurance card documents` | Insurance page |
| `contact.webp` | `hospital reception friendly` | Contact page |
| `careers.webp` | `nurses team hospital` | Careers page |
| `about-1.webp`, `about-2.webp`, `about-3.webp` | `nurse patient care`, `doctor consultation`, `modern hospital interior` | About tiles |

## Facilities slider (8 photos, landscape)

`facility-lab.webp` (`modern medical laboratory`), `facility-surgery.webp`
(`operating theatre`), `facility-radiology.webp` (`MRI scanner room`),
`facility-icu.webp` (`intensive care unit`), `facility-room.webp`
(`hospital patient room`), `facility-pediatric.webp` (`children hospital ward`),
`facility-pharmacy.webp` (`hospital pharmacy`), `facility-waiting.webp`
(`hospital waiting room modern`).

## Locations (3 photos)

`location-sf.webp`, `location-toronto.webp`, `location-vancouver.webp`
Search: `modern medical clinic building exterior`.

## Blog covers (6 photos, landscape)

`blog-heart-health.webp` (`healthy heart`), `blog-mental-health.webp`
(`mental health therapy`), `blog-kids-care.webp` (`pediatrician child`),
`blog-nutrition.webp` (`healthy food nutrition`), `blog-telehealth.webp`
(`telemedicine`), `blog-flu-season.webp` (`flu vaccine`).

## Doctors

Put each portrait in `public/images/doctors/<slug>.webp` (or `.jpg`/`.png`).
Portrait shot, head and shoulders, 4:3 or 1:1, at least 800 px wide, white coat
or scrubs, plain light background, friendly look. Search terms: `doctor portrait`,
`female doctor portrait`, `senior doctor portrait`, `surgeon portrait`,
`psychologist portrait`, `pediatrician portrait`.

| Slug | Name | Specialty | Suggested photo |
| --- | --- | --- | --- |
| `amelia-hart` | Dr. Amelia Hart | Primary Care | woman, 40s |
| `samuel-tremblay` | Dr. Samuel Tremblay | Family Medicine | man, 40s |
| `emily-carter` | Dr. Emily Carter | Geriatrics | woman, 50s |
| `daniel-okafor` | Dr. Daniel Okafor | Cardiology | Black man, 50s |
| `elena-vasquez` | Dr. Elena Vasquez | Interventional Cardiology | Latina woman, 40s |
| `henry-caldwell` | Dr. Henry Caldwell | Cardiac Electrophysiology | white man, 60s |
| `kenji-nakamura` | Dr. Kenji Nakamura | Cardiac Surgery | East Asian man, 50s |
| `laura-bennett` | Dr. Laura Bennett | Vascular Surgery | woman, 40s |
| `miguel-alvarez` | Dr. Miguel Alvarez | Pediatric Cardiology | Latino man, 40s |
| `david-kessler` | Dr. David Kessler | Neurology | man, 50s |
| `fatima-al-sayed` | Dr. Fatima Al-Sayed | Neurosurgery | Middle Eastern woman, 40s |
| `jonathan-weiss` | Dr. Jonathan Weiss | Psychiatry | man, 50s |
| `grace-adeyemi` | Dr. Grace Adeyemi | Clinical Psychology | Black woman, 30s |
| `noah-patel` | Dr. Noah Patel | Child and Adolescent Psychiatry | South Asian man, 40s |
| `priya-raman` | Dr. Priya Raman | Pediatrics | South Asian woman, 30s |
| `olivia-chen` | Dr. Olivia Chen | Pediatric Surgery | East Asian woman, 40s |
| `sofia-marchetti` | Dr. Sofia Marchetti | Obstetrics and Gynecology | woman, 50s |
| `marcus-lee` | Dr. Marcus Lee | Dermatology | East Asian man, 30s |
| `aisha-rahman` | Dr. Aisha Rahman | Emergency and Urgent Care | South Asian woman, 30s |
| `robert-hayes` | Dr. Robert Hayes | Orthopedic Surgery | man, 50s |
| `chloe-martin` | Dr. Chloe Martin | Sports Medicine and Physiotherapy | woman, 30s |
| `ahmed-khalil` | Dr. Ahmed Khalil | Oncology | Middle Eastern man, 50s |
| `isabelle-roy` | Dr. Isabelle Roy | Ophthalmology | woman, 40s |
| `thomas-grant` | Dr. Thomas Grant | Ear, Nose and Throat | man, 40s |
| `natalie-brooks` | Dr. Natalie Brooks | Gastroenterology | woman, 40s |
| `victor-ivanov` | Dr. Victor Ivanov | Urology | man, 50s |
| `hannah-kim` | Dr. Hannah Kim | Endocrinology | Asian woman, 40s |
| `carlos-mendes` | Dr. Carlos Mendes | Pulmonology | man, 50s |
| `rachel-goldberg` | Dr. Rachel Goldberg | Rheumatology | woman, 40s |
| `peter-nguyen` | Dr. Peter Nguyen | Radiology | Asian man, 40s |
| `james-oduya` | Dr. James Oduya | Nephrology | Black man, 40s |
| `linda-park` | Dr. Linda Park | Dentistry | woman, 40s |
| `mark-thompson` | Dr. Mark Thompson | Anesthesiology | man, 50s |
| `sarah-whitfield` | Dr. Sarah Whitfield | Nutrition and Dietetics | woman, 40s |

Start with the first 12 for launch; the rest show initials until a photo is added.
These names are fictional placeholders. Replace them with the client's real team.

## Optional video and GIF

| File name | What to search | Notes |
| --- | --- | --- |
| `hero-loop.mp4` | `hospital hallway loop`, `doctor walking` (Pexels videos) | 8 to 15 s, no sound, under 4 MB, 1280 px wide |
| `tour.mp4` | `hospital tour`, `modern clinic interior` | Virtual tour section, under 8 MB |
| `telehealth-demo.mp4` | `video consultation` | Short demo, no sound |

For the README, record a screen GIF of the site with ScreenToGif (Windows) and save
it as `docs/demo.gif` (under 8 MB).
