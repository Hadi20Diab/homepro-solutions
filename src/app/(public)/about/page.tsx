'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MdVerifiedUser, MdTimelapse, MdStar, MdPeople } from 'react-icons/md';
import { getAboutContent } from '@/lib/firestore/siteContent';
import { AboutContent } from '@/types';
import styles from './about.module.scss';

const VALUE_ICONS = [<MdVerifiedUser key="v" />, <MdStar key="s" />, <MdPeople key="p" />, <MdTimelapse key="t" />];

const DEFAULT: AboutContent = {
  heroTitle:    'About HomePro Solutions',
  heroSubtitle: 'Trusted home maintenance professionals since 2010, serving your community with pride.',
  story:        'HomePro Solutions started in 2010 when founder Robert Hayes decided there had to be a better way to get reliable home repairs done. Today, HomePro Solutions has grown into a team of 45 certified professionals.',
  mission:      'To provide reliable, high-quality home maintenance and repair services that enhance the lives of homeowners.',
  vision:       'To be the most trusted home services company in the region.',
  teamMembers:  [
    { name: 'Robert Hayes',   role: 'Founder & CEO',       image: 'https://i.pravatar.cc/200?img=11', bio: '20+ years in home maintenance industry.' },
    { name: 'Angela Torres',  role: 'Operations Manager',  image: 'https://i.pravatar.cc/200?img=47', bio: 'Ensures every job meets our quality standards.' },
    { name: 'David Kim',      role: 'Lead Electrician',    image: 'https://i.pravatar.cc/200?img=12', bio: 'Master electrician with 15 years of experience.' },
    { name: 'Maria Gonzalez', role: 'Plumbing Supervisor', image: 'https://i.pravatar.cc/200?img=48', bio: 'Certified plumber specializing in residential work.' },
  ],
  values: [
    { title: 'Integrity',   description: 'We always do what we say we will do.' },
    { title: 'Excellence',  description: 'We never settle for less than our best.' },
    { title: 'Community',   description: 'We are your neighbors, serving our community.' },
    { title: 'Reliability', description: 'You can always count on us to show up.' },
  ],
};

export default function AboutPage() {
  const [content, setContent] = useState<AboutContent>(DEFAULT);

  useEffect(() => {
    getAboutContent()
      .then(d => { if (d) setContent(d); })
      .catch(() => {});
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="page-hero">
        <div className="container">
          <h1>{content.heroTitle}</h1>
          <p>{content.heroSubtitle}</p>
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
              <p>{content.story}</p>
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
              <p>{content.mission}</p>
            </div>
            <div className={`${styles.mvCard} ${styles.mvCardAccent}`}>
              <h3>Our Vision</h3>
              <p>{content.vision}</p>
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
            {content.values.map((v, i) => (
              <div key={v.title} className={styles.valueCard}>
                <div className={styles.valueIcon}>{VALUE_ICONS[i % VALUE_ICONS.length]}</div>
                <h4>{v.title}</h4>
                <p>{v.description}</p>
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
            {content.teamMembers.map(m => (
              <div key={m.name} className={styles.teamCard}>
                {m.image && <img src={m.image} alt={m.name} className={styles.teamAvatar} />}
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
