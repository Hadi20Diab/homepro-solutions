'use client';

import { useEffect, useState } from 'react';
import {
  MdVerifiedUser, MdTimelapse, MdSupportAgent, MdStar,
  MdPriceCheck, MdSecurity,
} from 'react-icons/md';
import { getHomeContent } from '@/lib/firestore/siteContent';
import styles from './WhyUsSection.module.scss';

const ICONS = [<MdVerifiedUser key="v" />, <MdTimelapse key="t" />, <MdSupportAgent key="s" />, <MdStar key="st" />, <MdPriceCheck key="p" />, <MdSecurity key="sec" />];

const DEFAULT_POINTS = [
  { title: 'Licensed & Insured',      description: 'All our technicians are fully licensed, insured, and background-checked for your peace of mind.' },
  { title: 'On-Time Guarantee',       description: "We respect your time. If we're late, the service is discounted. That is our promise." },
  { title: '24/7 Emergency Support',  description: "Home emergencies don't wait. Our support team is available around the clock, every day." },
  { title: 'Quality Workmanship',     description: 'We use only premium materials and follow industry best practices on every single job.' },
  { title: 'Transparent Pricing',     description: 'No hidden fees. You get a detailed quote upfront before any work begins.' },
  { title: 'Satisfaction Guaranteed', description: 'Not satisfied? We will come back and fix it free of charge. Your happiness is our priority.' },
];

export default function WhyUsSection() {
  const [title, setTitle] = useState('Why Choose HomePro Solutions?');
  const [points, setPoints] = useState(DEFAULT_POINTS);

  useEffect(() => {
    getHomeContent()
      .then(d => {
        if (d?.whyUsTitle) setTitle(d.whyUsTitle);
        if (d?.whyUsPoints?.length) setPoints(d.whyUsPoints);
      })
      .catch(() => {});
  }, []);
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.layout}>
          {/* Left: Image */}
          <div className={styles.imageCol}>
            <div className={styles.imageCard}>
              <img
                src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80"
                alt="Technician at work"
              />
            </div>
            <div className={styles.expBadge}>
              <strong>15+</strong>
              <span>Years of Excellence</span>
            </div>
          </div>

          {/* Right: Reasons */}
          <div className={styles.rightCol}>
            <div className="section-header" style={{ textAlign: 'left', marginBottom: 0 }}>
              <span className="label">Why Choose Us</span>
              <h2>{title}</h2>
              <p>
                We go beyond fixing problems — we build lasting relationships
                with homeowners who trust us with their most valuable asset.
              </p>
            </div>

            <div className={styles.grid}>
              {points.map((r, i) => (
                <div key={r.title} className={styles.item}>
                  <div className={styles.icon}>{ICONS[i % ICONS.length]}</div>
                  <div>
                    <h4>{r.title}</h4>
                    <p>{r.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
