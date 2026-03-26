/**
 * Firestore Seed Script
 * ─────────────────────
 * Populates the Firestore database with initial content for HomePro Solutions.
 * Uses firebase-admin SDK which bypasses Firestore security rules.
 *
 * Setup (one-time):
 *   1. Firebase Console → Project Settings → Service Accounts → Generate New Private Key
 *   2. Save the downloaded JSON as  serviceAccount.json  in the project root.
 *   3. Run:  npm run db:seed
 *
 * Alternatively, set FIREBASE_SERVICE_ACCOUNT env var to the raw JSON string.
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// ─── Firebase Admin init ──────────────────────────────────────────────────────
function initAdmin() {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) {
    console.error('❌  NEXT_PUBLIC_FIREBASE_PROJECT_ID is missing from .env.local');
    process.exit(1);
  }

  // Option 1: FIREBASE_SERVICE_ACCOUNT env var contains the JSON
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount), projectId });
    return;
  }

  // Option 2: serviceAccount.json file in project root
  const saPath = resolve(process.cwd(), 'serviceAccount.json');
  if (existsSync(saPath)) {
    const serviceAccount = JSON.parse(readFileSync(saPath, 'utf8'));
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount), projectId });
    return;
  }

  // Option 3: GOOGLE_APPLICATION_CREDENTIALS (already handled by applicationDefault)
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp({ credential: admin.credential.applicationDefault(), projectId });
    return;
  }

  console.error(`
❌  No Firebase Admin credentials found.

To run the seed, do ONE of the following:

  A) Download a service account key:
       Firebase Console → Project Settings → Service Accounts
       → "Generate new private key" → save as  serviceAccount.json
       in the project root, then run:  npm run db:seed

  B) Set FIREBASE_SERVICE_ACCOUNT in .env.local to the JSON string of
     the service account key file.

  C) Set GOOGLE_APPLICATION_CREDENTIALS to the path of the JSON key file.
`);
  process.exit(1);
}

initAdmin();
const db = admin.firestore();

const now = new Date().toISOString();

// ─── helpers ──────────────────────────────────────────────────────────────────
async function clearCollection(col: string) {
  const snap = await db.collection(col).get();
  await Promise.all(snap.docs.map(d => d.ref.delete()));
  console.log(`  ✓ cleared "${col}" (${snap.size} docs removed)`);
}

async function seed() {
  console.log('\n🌱  Starting Firestore seed...\n');

  // ─── 1. Services ──────────────────────────────────────────────────────────
  console.log('📦  Seeding services…');
  await clearCollection('services');

  const services = [
    {
      title:            'Plumbing',
      slug:             'plumbing',
      description:      'From leaky faucets to full pipe installations, our licensed plumbers handle every water concern in your home or office with speed and precision.',
      shortDescription: 'Expert plumbing repairs and installations for residential and commercial properties.',
      icon:             'MdWater',
      image:            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      features:         ['Leak detection & repair', 'Pipe installation & replacement', 'Water heater service', 'Drain cleaning', 'Emergency call-outs'],
      order:            1,
      isActive:         true,
      createdAt:        now,
      updatedAt:        now,
    },
    {
      title:            'Electrical',
      slug:             'electrical',
      description:      'Safe, certified electrical work ranging from simple socket repairs to full rewiring projects. Our electricians comply with all local safety codes.',
      shortDescription: 'Certified electrical repairs, installations, and safety inspections.',
      icon:             'MdBolt',
      image:            'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800',
      features:         ['Wiring & rewiring', 'Circuit breaker installation', 'Smart home integration', 'Safety inspections', 'Generator hookup'],
      order:            2,
      isActive:         true,
      createdAt:        now,
      updatedAt:        now,
    },
    {
      title:            'AC Repair & Installation',
      slug:             'ac-repair-installation',
      description:      'Beat the heat with our professional AC services. We service all major brands, provide routine maintenance, and handle complete system replacements.',
      shortDescription: 'Complete air conditioning repair, maintenance, and new installation services.',
      icon:             'MdAcUnit',
      image:            'https://images.unsplash.com/photo-1631648093729-8b6a3d3b56f8?w=800',
      features:         ['AC unit installation', 'Refrigerant top-up', 'Filter & coil cleaning', 'Thermostat repair', 'Annual maintenance plans'],
      order:            3,
      isActive:         true,
      createdAt:        now,
      updatedAt:        now,
    },
    {
      title:            'Painting & Decoration',
      slug:             'painting-decoration',
      description:      'Transform your space with our skilled painters. We offer interior and exterior painting with premium, long-lasting materials and a clean, precise finish.',
      shortDescription: 'Interior and exterior painting with premium materials and expert craftsmanship.',
      icon:             'MdBrush',
      image:            'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=800',
      features:         ['Interior & exterior painting', 'Wallpaper installation', 'Texture & feature walls', 'Colour consultation', 'Surface preparation'],
      order:            4,
      isActive:         true,
      createdAt:        now,
      updatedAt:        now,
    },
    {
      title:            'Carpentry',
      slug:             'carpentry',
      description:      'Custom woodwork and furniture fitting by skilled carpenters. From built-in wardrobes to bespoke kitchen cabinets, we create pieces that last a lifetime.',
      shortDescription: 'Bespoke carpentry, cabinetry, and furniture fitting for every room.',
      icon:             'MdCarpenter',
      image:            'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800',
      features:         ['Custom cabinets & wardrobes', 'Door installation & repair', 'Skirting & architrave', 'Bespoke shelving', 'Deck & pergola building'],
      order:            5,
      isActive:         true,
      createdAt:        now,
      updatedAt:        now,
    },
    {
      title:            'Deep Cleaning',
      slug:             'deep-cleaning',
      description:      'Comprehensive deep cleaning solutions for homes and offices. We use eco-friendly products and industrial equipment to deliver a spotless, hygienic environment.',
      shortDescription: 'Professional deep cleaning for homes and offices using eco-friendly products.',
      icon:             'MdCleaningServices',
      image:            'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800',
      features:         ['Full property deep clean', 'Post-construction clean-up', 'Carpet & upholstery cleaning', 'Kitchen & bathroom sanitising', 'Move-in / move-out cleaning'],
      order:            6,
      isActive:         true,
      createdAt:        now,
      updatedAt:        now,
    },
  ];

  for (const svc of services) {
    const ref = await db.collection('services').add(svc);
    console.log(`  ✓ service: "${svc.title}" (${ref.id})`);
  }

  // ─── 2. Projects ──────────────────────────────────────────────────────────
  console.log('\n📦  Seeding projects…');
  await clearCollection('projects');

  const projects = [
    {
      title:             'Full Kitchen Renovation — Dubai Marina',
      slug:              'full-kitchen-renovation-dubai-marina',
      description:       'A complete kitchen overhaul for a 3-bedroom apartment in Dubai Marina. The scope included replacing all plumbing connections, installing new cabinetry, and a full repaint with moisture-resistant finishes.',
      shortDescription:  'Complete kitchen overhaul covering plumbing, carpentry, and painting.',
      category:          'Plumbing',
      beforeImages:      ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800'],
      afterImages:       ['https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800'],
      completionDate:    '2024-11-15',
      location:          'Dubai Marina, Dubai',
      clientTestimonial: 'HomePro transformed our dated kitchen into a modern masterpiece. The team was professional, tidy, and finished on time!',
      isFeatured:        true,
      isActive:          true,
      order:             1,
      createdAt:         now,
      updatedAt:         now,
    },
    {
      title:             'Office Rewiring — Business Bay',
      slug:              'office-rewiring-business-bay',
      description:       'Full electrical rewiring for a 1,500 sq ft office in Business Bay. We upgraded the distribution board, installed 16 new circuits, and fitted energy-efficient LED lighting throughout.',
      shortDescription:  'High-spec office rewiring with LED upgrade and new distribution board.',
      category:          'Electrical',
      beforeImages:      ['https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?w=800'],
      afterImages:       ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
      completionDate:    '2024-12-03',
      location:          'Business Bay, Dubai',
      clientTestimonial: 'Top-notch work. They rewired our entire office over a weekend so we had zero downtime during business hours.',
      isFeatured:        true,
      isActive:          true,
      order:             2,
      createdAt:         now,
      updatedAt:         now,
    },
    {
      title:             'Villa AC System Install — Jumeirah',
      slug:              'villa-ac-system-install-jumeirah',
      description:       'Supply and installation of a 5-zone ducted AC system in a new-build villa in Jumeirah. The project was completed in two days with no disruption to neighbouring units.',
      shortDescription:  '5-zone ducted AC system supplied and installed in a new-build Jumeirah villa.',
      category:          'AC Repair & Installation',
      beforeImages:      ['https://images.unsplash.com/photo-1499916078039-922301b0eb9b?w=800'],
      afterImages:       ['https://mastermindshvac.com/wp-content/uploads/2026/02/AC-Repair-Dubai-247-Expert-HVAC-Services-Maintenance__.webp'],
      completionDate:    '2025-01-10',
      location:          'Jumeirah 2, Dubai',
      clientTestimonial: 'Incredibly smooth installation. The team cleaned up after themselves and the system has been running perfectly ever since.',
      isFeatured:        false,
      isActive:          true,
      order:             3,
      createdAt:         now,
      updatedAt:         now,
    },
    {
      title:             'Apartment Full Repaint — JLT',
      slug:              'apartment-full-repaint-jlt',
      description:       'Interior repaint of a two-bedroom apartment in Jumeirah Lake Towers. We applied two coats of premium emulsion throughout and used specialised bathroom paint in wet areas.',
      shortDescription:  'Full interior repaint of a 2-bed apartment with premium moisture-resistant finishes.',
      category:          'Painting & Decoration',
      beforeImages:      ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
      afterImages:       ['https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=800'],
      completionDate:    '2025-02-20',
      location:          'JLT, Dubai',
      clientTestimonial: 'The painters were fast and tidy. Our apartment looks brand new and the smell was gone the next day!',
      isFeatured:        false,
      isActive:          true,
      order:             4,
      createdAt:         now,
      updatedAt:         now,
    },
  ];

  for (const proj of projects) {
    const ref = await db.collection('projects').add(proj);
    console.log(`  ✓ project: "${proj.title}" (${ref.id})`);
  }

  // ─── 3. Blog Posts ────────────────────────────────────────────────────────
  console.log('\n📦  Seeding blog…');
  await clearCollection('blog');

  const blog = [
    {
      title:       '5 Warning Signs Your Home Has a Hidden Plumbing Leak',
      slug:        '5-warning-signs-hidden-plumbing-leak',
      excerpt:     'Water damage from hidden leaks can cost thousands to fix. Here are five early warning signs every homeowner should know — and what to do about them.',
      content:     `<h2>Why Hidden Leaks Are So Dangerous</h2>
<p>Most plumbing leaks don't announce themselves with a dramatic burst pipe. Instead they hide inside walls, under floors, and beneath concrete slabs for months before the damage becomes obvious. By then, you could be facing mould, structural damage, and a bill that runs into the thousands.</p>
<h2>1. Unexplained Spike in Your Water Bill</h2>
<p>If your water consumption has shot up but your usage habits haven't changed, a hidden leak is the most likely culprit. Even a slow drip can waste hundreds of litres per day.</p>
<h2>2. Damp Patches or Discolouration on Walls and Ceilings</h2>
<p>Yellow-brown stains or bubbling paint are classic signs of water pooling behind a surface. Don't paint over them — investigate first.</p>
<h2>3. Musty or Mouldy Smell</h2>
<p>Persistent musty odours, especially in rooms without obvious moisture sources, often indicate mould growing where you can't see it — a direct consequence of a hidden leak.</p>
<h2>4. Low Water Pressure</h2>
<p>A sudden drop in pressure across multiple taps suggests that water is escaping somewhere it shouldn't be, reducing the flow available to your fixtures.</p>
<h2>5. The Sound of Running Water When Nothing Is On</h2>
<p>Put your ear against the wall near pipes. If you can hear running or dripping water when all taps are closed, call a plumber immediately.</p>
<h2>What To Do Next</h2>
<p>Turn off all water-using appliances and check your meter. If the dial is still moving, you almost certainly have a leak. Contact HomePro Solutions for a non-invasive leak detection service — we can pinpoint the exact location without tearing out your walls.</p>`,
      coverImage:  'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=900',
      tags:        ['plumbing', 'maintenance', 'tips', 'water'],
      author:      'HomePro Editorial',
      isPublished: true,
      featured:    true,
      createdAt:   now,
      updatedAt:   now,
    },
    {
      title:       'How to Extend the Life of Your AC Unit — A Seasonal Maintenance Checklist',
      slug:        'extend-ac-life-seasonal-maintenance-checklist',
      excerpt:     'A well-maintained AC unit can last 15+ years. Follow this simple seasonal checklist to keep yours running efficiently and avoid costly breakdowns.',
      content:     `<h2>Why Maintenance Matters</h2>
<p>An air conditioning unit is one of the most-used appliances in any UAE home or office. Skipping annual maintenance doesn't just shorten its life — it drives up your electricity bill and reduces air quality.</p>
<h2>Before Summer (April / May)</h2>
<ul>
<li><strong>Clean or replace the air filter</strong> — a clogged filter makes the motor work harder.</li>
<li><strong>Inspect and clean the evaporator and condenser coils</strong> — dirt on the coils reduces heat transfer efficiency.</li>
<li><strong>Check refrigerant levels</strong> — low refrigerant means the unit runs longer to achieve the same cooling.</li>
<li><strong>Test thermostat calibration</strong> — even a 2°C error costs you money.</li>
</ul>
<h2>During Summer (June – September)</h2>
<ul>
<li>Check filters monthly and clean if dusty.</li>
<li>Keep the outdoor unit clear of debris.</li>
<li>Listen for unusual noises — rattling or grinding means a part may need replacing.</li>
</ul>
<h2>After Summer (October)</h2>
<ul>
<li>Book a professional deep clean.</li>
<li>Inspect electrical connections and capacitors.</li>
<li>Clear and treat the condensate drain to prevent algae build-up.</li>
</ul>
<p>Not sure what state your AC is in? HomePro's annual maintenance plan covers two full service visits, priority call-outs, and a 20% discount on all parts.</p>`,
      coverImage:  'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=900',
      tags:        ['ac', 'maintenance', 'summer', 'energy-saving'],
      author:      'HomePro Editorial',
      isPublished: true,
      featured:    false,
      createdAt:   now,
      updatedAt:   now,
    },
    {
      title:       'Choosing the Right Paint Finish for Every Room in Your Home',
      slug:        'choosing-right-paint-finish-every-room',
      excerpt:     'Matt, eggshell, satin, or gloss? The finish you choose has a huge impact on how a room looks and how easy it is to keep clean. Here is your definitive guide.',
      content:     `<h2>Why Paint Finish Matters</h2>
<p>The same colour can look completely different depending on whether it has a matt, eggshell, satin, or gloss finish. Beyond appearance, the finish affects durability and cleanability — critical factors in a busy home.</p>
<h2>Matt / Flat Finish</h2>
<p>Best for: living rooms, bedrooms, ceilings.</p>
<p>Matt paint absorbs light, hiding surface imperfections and creating a smooth, contemporary look. The trade-off is that it marks easily and is harder to wipe clean.</p>
<h2>Eggshell Finish</h2>
<p>Best for: hallways, children's bedrooms, dining rooms.</p>
<p>A slight sheen that is noticeably more durable than matt. Easy to clean with a damp cloth and still looks elegant.</p>
<h2>Satin Finish</h2>
<p>Best for: kitchens, bathrooms, woodwork.</p>
<p>Satin paints are designed to withstand moisture and frequent cleaning. They reflect more light, which can brighten a small space.</p>
<h2>Gloss Finish</h2>
<p>Best for: doors, skirting boards, window frames.</p>
<p>High-gloss finishes are the most durable and easiest to clean, but they highlight surface imperfections, so preparation is everything.</p>
<h2>Our Recommendation</h2>
<p>For most UAE homes, we recommend eggshell throughout the living areas and bedrooms, satin in wet areas, and gloss on all woodwork. Contact HomePro for a free colour consultation.</p>`,
      coverImage:  'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=900',
      tags:        ['painting', 'interior-design', 'tips', 'home-improvement'],
      author:      'HomePro Editorial',
      isPublished: true,
      featured:    false,
      createdAt:   now,
      updatedAt:   now,
    },
    {
      title:       'Electrical Safety at Home: 7 Habits That Could Save Your Life',
      slug:        'electrical-safety-home-7-habits',
      excerpt:     'Electrical faults are one of the leading causes of house fires. These seven simple habits dramatically reduce your risk — and most cost nothing at all.',
      content:     `<h2>The Hidden Danger in Your Home</h2>
<p>Electrical faults cause thousands of house fires every year. The frightening thing is that most of them are entirely preventable with simple, consistent habits. Here are the seven most important ones.</p>
<h2>1. Never Overload a Socket or Extension Lead</h2>
<p>Every socket and extension lead has a maximum current rating. Plugging in too many high-wattage devices at once generates heat and, eventually, fire.</p>
<h2>2. Replace Damaged Cables Immediately</h2>
<p>A frayed or cracked cable is a live hazard. Wrap it in insulating tape as a temporary measure and replace it as soon as possible.</p>
<h2>3. Keep Electrical Devices Away from Water</h2>
<p>This sounds obvious, but bathrooms and kitchens are danger zones. Use only bathroom-rated fittings near water sources.</p>
<h2>4. Test Your Smoke Detectors Monthly</h2>
<p>Press the test button once a month and replace the batteries every year. A working smoke detector gives you the minutes you need to escape.</p>
<h2>5. Don't Run Cables Under Rugs</h2>
<p>Hidden cables can overheat undetected. Route cables along skirting boards instead.</p>
<h2>6. Switch Off Appliances at the Wall When Not in Use</h2>
<p>Standby mode still draws current and, on older appliances, can be a fire risk overnight.</p>
<h2>7. Have Your Wiring Inspected Every 10 Years</h2>
<p>Wiring degrades over time. A HomePro electrical safety inspection will identify any issues before they become emergencies.</p>`,
      coverImage:  'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=900',
      tags:        ['electrical', 'safety', 'fire-prevention', 'tips'],
      author:      'HomePro Editorial',
      isPublished: true,
      featured:    true,
      createdAt:   now,
      updatedAt:   now,
    },
  ];

  for (const post of blog) {
    const ref = await db.collection('blog').add(post);
    console.log(`  ✓ blog: "${post.title}" (${ref.id})`);
  }

  // ─── 4. News Posts ────────────────────────────────────────────────────────
  console.log('\n📦  Seeding news…');
  await clearCollection('news');

  const news = [
    {
      title:       'HomePro Solutions Expands to Abu Dhabi and Sharjah',
      slug:        'homepro-expands-abu-dhabi-sharjah',
      excerpt:     'We are thrilled to announce the expansion of HomePro Solutions into Abu Dhabi and Sharjah, bringing our award-winning home services to thousands of new customers.',
      content:     `<p>HomePro Solutions is proud to announce the launch of operations in Abu Dhabi and Sharjah, effective immediately. Both markets have seen significant demand for reliable, transparent home maintenance services, and we are excited to meet that need.</p>
<p>Our Abu Dhabi hub is based in Al Reem Island and covers all districts including Khalidiyah, Corniche, and Khalifa City. The Sharjah team operates from Al Majaz and serves the entire emirate.</p>
<p>All new customers in both emirates can book online and receive a 15% discount on their first service using the promo code <strong>WELCOME15</strong>.</p>`,
      coverImage:  'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900',
      author:      'HomePro PR Team',
      category:    'Company News',
      isPublished: true,
      createdAt:   now,
      updatedAt:   now,
    },
    {
      title:       'HomePro Wins "Best Home Services Provider" at UAE Business Awards 2025',
      slug:        'homepro-wins-best-home-services-uae-business-awards-2025',
      excerpt:     'We are honoured to have been recognised as the Best Home Services Provider at the prestigious UAE Business Awards 2025 gala in Dubai.',
      content:     `<p>On the evening of Friday 14 February 2025, HomePro Solutions received the "Best Home Services Provider" award at the 12th annual UAE Business Awards, held at the Atlantis The Palm, Dubai.</p>
<p>The award recognises companies that demonstrate exceptional quality, customer satisfaction, and innovation in their field. HomePro was selected from a shortlist of five finalists based on customer reviews, response times, and service completion rates.</p>
<p>"This award belongs to every technician, dispatcher, and admin team member who shows up every day committed to delivering excellent service," said the HomePro CEO accepting the award on stage.</p>
<p>We thank all our loyal customers — this would not be possible without your trust.</p>`,
      coverImage:  'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=900',
      author:      'HomePro PR Team',
      category:    'Awards',
      isPublished: true,
      createdAt:   now,
      updatedAt:   now,
    },
    {
      title:       'Introducing HomePro Care: Our New Annual Home Maintenance Plan',
      slug:        'introducing-homepro-care-annual-maintenance-plan',
      excerpt:     'HomePro Care is our new all-inclusive annual maintenance plan designed to keep your home in perfect condition year-round for one fixed price.',
      content:     `<p>We are delighted to launch <strong>HomePro Care</strong> — our comprehensive annual home maintenance plan that gives you complete peace of mind for a single, predictable annual fee.</p>
<h2>What's Included</h2>
<ul>
<li>Two full AC service visits (pre and post summer)</li>
<li>Annual plumbing inspection and drain flush</li>
<li>Electrical safety check</li>
<li>Priority booking — jump the queue any time</li>
<li>20% discount on all labour for additional call-outs</li>
<li>Free parts for any issue identified during inspections</li>
</ul>
<h2>Pricing</h2>
<p>HomePro Care starts from AED 1,499 per year for apartments up to 1,500 sq ft, with tiered pricing for larger properties.</p>
<p>Early bird subscribers who sign up before 31 March 2025 receive the first year at AED 999. <a href="/contact">Contact us today to sign up.</a></p>`,
      coverImage:  'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=900',
      author:      'HomePro Product Team',
      category:    'Product Launch',
      isPublished: true,
      createdAt:   now,
      updatedAt:   now,
    },
  ];

  for (const post of news) {
    const ref = await db.collection('news').add(post);
    console.log(`  ✓ news: "${post.title}" (${ref.id})`);
  }

  // ─── 5. Home Content ──────────────────────────────────────────────────────
  console.log('\n📦  Seeding siteContent/home…');

  const homeContent = {
    hero: {
      headline:        'Your Home, Perfectly Maintained',
      subheadline:     'HomePro Solutions delivers fast, reliable, and fairly priced home maintenance services across Dubai, Abu Dhabi, and Sharjah. Book online in under 2 minutes.',
      ctaText:         'Get a Free Quote',
      ctaLink:         '/contact',
      backgroundImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600',
    },
    statsTitle: 'Trusted by Thousands of Happy Customers',
    stats: [
      { label: 'Completed Jobs',       value: '12,000+' },
      { label: 'Certified Technicians', value: '85+'    },
      { label: 'Customer Satisfaction', value: '98%'   },
      { label: 'Years in Business',    value: '10+'    },
    ],
    whyUsTitle: 'Why Homeowners Choose HomePro',
    whyUsPoints: [
      { title: 'On-Time Guarantee',    description: 'We respect your time. If our technician is late, your next service call is free.', icon: 'MdTimelapse'    },
      { title: '24/7 Emergency Line',  description: 'Burst pipe at midnight? Our emergency team is available around the clock, every day of the year.', icon: 'MdSupportAgent' },
      { title: 'Transparent Pricing',  description: 'You get a full written quote before any work begins. No hidden charges, no surprises.', icon: 'MdPriceCheck'   },
      { title: 'Certified & Insured',  description: 'Every technician is background-checked, licensed, and fully insured for your complete peace of mind.', icon: 'MdVerified'     },
    ],
    ctaBannerTitle:    'Ready to Get Started?',
    ctaBannerSubtitle: 'Book your first service today and get 10% off with code FIRSTJOB.',
  };

  await db.doc('siteContent/home').set(homeContent);
  console.log('  ✓ siteContent/home');

  // ─── 6. About Content ─────────────────────────────────────────────────────
  console.log('\n📦  Seeding siteContent/about…');

  const aboutContent = {
    heroTitle:    'About HomePro Solutions',
    heroSubtitle: 'We started with one van and a promise: honest, reliable home services with no hidden costs. Ten years later, we have over 85 certified technicians and thousands of happy customers.',
    story:        'HomePro Solutions was founded in Dubai in 2015 by two engineers who were frustrated by unreliable tradespeople and unpredictable quotes. They set out to build a home services company that treated every customer the way they would want to be treated — with transparency, respect, and genuine expertise. From a single-person operation, HomePro has grown to a team of over 100 professionals serving customers across the UAE.',
    mission:      'To make professional home maintenance accessible to every household in the UAE through transparent pricing, fast response times, and consistently excellent workmanship.',
    vision:       'To be the most trusted name in home services across the Middle East, known for quality, integrity, and innovation.',
    teamMembers: [
      { name: 'Khaled Al Rashidi',  role: 'CEO & Co-Founder',          image: 'https://i.pravatar.cc/300?img=12', bio: 'Civil engineer with 20 years of experience in construction and facilities management. Khaled oversees strategy and growth.' },
      { name: 'Priya Nair',         role: 'Operations Director',        image: 'https://i.pravatar.cc/300?img=47', bio: 'Former facilities manager at a leading UAE hotel group, Priya ensures every job is completed on time and to the highest standard.' },
      { name: 'Ahmed Mansouri',     role: 'Head of Technical Services', image: 'https://i.pravatar.cc/300?img=33', bio: 'Master electrician and licensed plumber with 15 years of field experience. Ahmed leads our technical training programme.' },
      { name: 'Sara Al Marzouqi',   role: 'Customer Experience Lead',   image: 'https://i.pravatar.cc/300?img=49', bio: 'Sara ensures every customer interaction is best in class, from the first booking to the post-job follow-up.' },
    ],
    values: [
      { title: 'Transparency',  description: 'We provide written quotes before work begins and never charge for something we have not agreed upfront.' },
      { title: 'Reliability',   description: 'We show up when we say we will. Our on-time rate is 97% — and we make it right when things go wrong.' },
      { title: 'Quality',       description: 'Every job is inspected before we leave. If it is not right, we come back and fix it at no extra charge.' },
      { title: 'Respect',       description: 'We treat your home like our own — removing shoes, protecting surfaces, and leaving the workspace spotless.' },
    ],
  };

  await db.doc('siteContent/about').set(aboutContent);
  console.log('  ✓ siteContent/about');

  // ─── 7. Admin Users ───────────────────────────────────────────────────────
  console.log('\n📦  Seeding admin users…');

  const seedUsers = [
    { email: 'admin@homepro.com',    password: 'HomePro@2025!', name: 'Admin',           role: 'admin'           },
    { email: 'blog@homepro.com',     password: 'HomePro@2025!', name: 'Blog Editor',     role: 'editor_blog'     },
    { email: 'services@homepro.com', password: 'HomePro@2025!', name: 'Services Editor', role: 'editor_services' },
    { email: 'projects@homepro.com', password: 'HomePro@2025!', name: 'Projects Editor', role: 'editor_projects' },
    { email: 'news@homepro.com',     password: 'HomePro@2025!', name: 'News Editor',     role: 'editor_news'     },
  ];

  for (const u of seedUsers) {
    try {
      let uid: string;
      const existing = await admin.auth().getUserByEmail(u.email).catch(() => null);
      if (existing) {
        uid = existing.uid;
        await admin.auth().updateUser(uid, { password: u.password, displayName: u.name });
      } else {
        const created = await admin.auth().createUser({ email: u.email, password: u.password, displayName: u.name });
        uid = created.uid;
      }
      await db.doc(`users/${uid}`).set(
        { email: u.email, name: u.name, displayName: u.name, role: u.role, createdAt: now },
        { merge: true },
      );
      console.log(`  ✓ user: ${u.email}  (${u.role})`);
    } catch (e) {
      console.warn(`  ⚠  could not seed user ${u.email}:`, (e as { message?: string }).message);
    }
  }

  // ─── 8. Project Submissions ───────────────────────────────────────────────
  console.log('\n📦  Seeding projectSubmissions…');
  await clearCollection('projectSubmissions');

  const projectSubmissions = [
    {
      projectId:    'seed-proj-1',
      projectSlug:  'office-rewiring-business-bay',
      projectTitle: 'Office Rewiring — Business Bay',
      name:         'Mohammed Al Farsi',
      email:        'mohammed.alfarsi@example.com',
      phone:        '+971 50 123 4567',
      message:      'We have a similar-sized office in DIFC and are looking for a complete rewiring quote. Could you please advise on availability in March?',
      createdAt:    new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      read:         false,
    },
    {
      projectId:    'seed-proj-2',
      projectSlug:  'full-kitchen-renovation-dubai-marina',
      projectTitle: 'Full Kitchen Renovation — Dubai Marina',
      name:         'Sarah Thompson',
      email:        's.thompson@example.com',
      phone:        '+971 55 987 6543',
      message:      'I loved the before/after photos of this project! We are planning a similar renovation for our apartment in JBR. How long does a project like this typically take?',
      createdAt:    new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      read:         true,
    },
    {
      projectId:    'seed-proj-3',
      projectSlug:  'villa-ac-system-install-jumeirah',
      projectTitle: 'Villa AC System Install — Jumeirah',
      name:         'Fatima Al Zaabi',
      email:        'fatima.z@example.com',
      phone:        '+971 52 456 7890',
      message:      'We need a multi-zone AC system for a 5-bedroom villa in Al Barsha. Would love to discuss the options and get a quotation.',
      createdAt:    new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      read:         false,
    },
    {
      projectId:    'seed-proj-4',
      projectSlug:  'apartment-full-repaint-jlt',
      projectTitle: 'Apartment Full Repaint — JLT',
      name:         'Ravi Menon',
      email:        'ravi.menon@example.com',
      phone:        '+971 54 333 2211',
      message:      'Our 3-bedroom apartment in Downtown Dubai needs a full repaint before we move in next month. Can you provide an urgent quote?',
      createdAt:    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      read:         true,
    },
  ];

  for (const sub of projectSubmissions) {
    const ref = await db.collection('projectSubmissions').add(sub);
    console.log(`  ✓ project submission: "${sub.name}" → "${sub.projectTitle}" (${ref.id})`);
  }

  // ─── 9. Contact Submissions ───────────────────────────────────────────────
  console.log('\n📦  Seeding contactSubmissions…');
  await clearCollection('contacts');

  const contactSubmissions = [
    {
      name:      'James Hartley',
      email:     'james.hartley@example.com',
      phone:     '+971 50 111 2233',
      service:   'Plumbing',
      subject:   'Urgent leak under kitchen sink',
      message:   'I have a persistent leak under my kitchen sink that my landlord has been ignoring. Can you send someone to assess the issue this week?',
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      read:      false,
    },
    {
      name:      'Aisha Khalid',
      email:     'aisha.khalid@example.com',
      phone:     '+971 55 888 9900',
      service:   'Electrical',
      subject:   'Circuit breaker tripping repeatedly',
      message:   'Our main circuit breaker trips every time we run the washing machine and dishwasher at the same time. We need an electrician to check the wiring.',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      read:      false,
    },
    {
      name:      'Daniel Osei',
      email:     'd.osei@example.com',
      phone:     '+971 52 777 5544',
      service:   'AC Repair & Installation',
      subject:   'AC not cooling — possible gas leak',
      message:   'Our central AC has been blowing warm air for two days. The filter is clean so I suspect a gas issue. Please advise on the earliest available appointment.',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      read:      true,
    },
    {
      name:      'Noura Hamdan',
      email:     'noura.hamdan@example.com',
      phone:     '+971 56 200 3311',
      service:   'General Enquiry',
      subject:   'Annual maintenance contract pricing',
      message:   'We manage 12 residential units in Sports City. Could you please send details of your annual maintenance contract packages and pricing?',
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      read:      true,
    },
  ];

  for (const sub of contactSubmissions) {
    const ref = await db.collection('contacts').add(sub);
    console.log(`  ✓ contact submission: "${sub.name}" — "${sub.subject}" (${ref.id})`);
  }

  // ─── Done ──────────────────────────────────────────────────────────────────
  console.log('\n✅  Seed complete!\n');
  process.exit(0);
}

seed().catch(err => {
  console.error('\n❌  Seed failed:', err);
  process.exit(1);
});
