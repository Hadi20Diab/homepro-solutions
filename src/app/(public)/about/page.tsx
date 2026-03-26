import type { Metadata } from 'next';
import styles from './about.module.scss';
import { MdVerifiedUser, MdTimelapse, MdStar, MdPeople } from 'react-icons/md';
import Link from 'next/link';

export const metadata: Metadata = { title: 'About Us' };

const TEAM = [
  { name: 'Robert Hayes', role: 'Founder & CEO', img: 'https://i.pravatar.cc/200?img=11', bio: '20+ years in home maintenance industry.' },
  { name: 'Angela Torres', role: 'Operations Manager', img: 'https://i.pravatar.cc/200?img=47', bio: 'Ensures every job meets our quality standards.' },
  { name: 'David Kim', role: 'Lead Electrician', img: 'https://i.pravatar.cc/200?img=12', bio: 'Master electrician with 15 years of experience.' },
  { name: 'Maria Gonzalez', role: 'Plumbing Supervisor', img: 'https://i.pravatar.cc/200?img=48', bio: 'Certified plumber specializing in residential work.' },
];

const VALUES = [
  { icon: <MdVerifiedUser />, title: 'Integrity', desc: 'We always do what we say we will do.' },
  { icon: <MdStar />,         title: 'Excellence', desc: 'We never settle for less than our best.' },
  { icon: <MdPeople />,       title: 'Community', desc: 'We are your neighbors, serving our community.' },
  { icon: <MdTimelapse />,    title: 'Reliability', desc: 'You can always count on us to show up.' },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="page-hero">
        <div className="container">
          <h1>About HomePro Solutions</h1>
          <p>Trusted home maintenance professionals since 2010, serving your community with pride.</p>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>About</span>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className={`section ${styles.storySection}`}>
        <div className="container">
          <div className={styles.storyGrid}>
            <div className={styles.storyImage}>
              <img
                src="https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=600&q=80"
                alt="HomePro team at work"
              />
            </div>
            <div className={styles.storyContent}>
              <span className="label" style={{ color: '#f97316', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.875rem' }}>Our Story</span>
              <h2>From a One-Man Show to a Trusted Team</h2>
              <p>
                HomePro Solutions started in 2010 when founder Robert Hayes decided there had
                to be a better way to get reliable home repairs done. Armed with a toolbox and
                a commitment to honest work, he began serving his local neighborhood.
              </p>
              <p>
                Today, HomePro Solutions has grown into a team of 45 certified professionals,
                completing over 8,500 jobs and earning the trust of thousands of homeowners
                across the region.
              </p>
              <div className={styles.storyStats}>
                <div><strong>2010</strong><span>Founded</span></div>
                <div><strong>45+</strong><span>Team Members</span></div>
                <div><strong>8,500+</strong><span>Jobs Done</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className={`section ${styles.mvSection}`}>
        <div className="container">
          <div className="grid-2">
            <div className={styles.mvCard}>
              <h3>Our Mission</h3>
              <p>
                To provide reliable, high-quality home maintenance and repair services that
                enhance the lives of homeowners while building lasting relationships based on
                trust, transparency, and exceptional workmanship.
              </p>
            </div>
            <div className={`${styles.mvCard} ${styles.mvCardAccent}`}>
              <h3>Our Vision</h3>
              <p>
                To be the most trusted home services company in the region — known for our
                people, our values, and the transformations we create in the homes and lives
                of our customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={`section ${styles.valuesSection}`}>
        <div className="container">
          <div className="section-header">
            <span className="label">What Drives Us</span>
            <h2>Our Core Values</h2>
          </div>
          <div className="grid-4">
            {VALUES.map(v => (
              <div key={v.title} className={styles.valueCard}>
                <div className={styles.valueIcon}>{v.icon}</div>
                <h4>{v.title}</h4>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className={`section ${styles.teamSection}`}>
        <div className="container">
          <div className="section-header">
            <span className="label">Meet The Team</span>
            <h2>The People Behind HomePro</h2>
          </div>
          <div className="grid-4">
            {TEAM.map(m => (
              <div key={m.name} className={styles.teamCard}>
                <img src={m.img} alt={m.name} className={styles.teamAvatar} />
                <div className={styles.teamInfo}>
                  <h4>{m.name}</h4>
                  <span className={styles.teamRole}>{m.role}</span>
                  <p>{m.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
