'use client';

import { useEffect, useState } from 'react';
import { MdPeople, MdBuild, MdStar, MdVerifiedUser } from 'react-icons/md';
import { getHomeContent } from '@/lib/firestore/siteContent';
import styles from './StatsSection.module.scss';

const ICONS = [<MdPeople key="p" />, <MdBuild key="b" />, <MdStar key="s" />, <MdVerifiedUser key="v" />];

const DEFAULT_STATS = [
  { value: '2,400+', label: 'Happy Clients' },
  { value: '8,500+', label: 'Jobs Completed' },
  { value: '4.9/5',  label: 'Average Rating' },
  { value: '15+',    label: 'Years Experience' },
];

export default function StatsSection() {
  const [stats, setStats] = useState(DEFAULT_STATS);

  useEffect(() => {
    getHomeContent()
      .then(d => { if (d?.stats?.length) setStats(d.stats); })
      .catch(() => {});
  }, []);

  return (
    <section className={styles.stats}>
      <div className="container">
        <div className={styles.grid}>
          {stats.map((s, i) => (
            <div key={s.label} className={styles.item}>
              <div className={styles.icon}>{ICONS[i % ICONS.length]}</div>
              <strong className={styles.value}>{s.value}</strong>
              <span className={styles.label}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
