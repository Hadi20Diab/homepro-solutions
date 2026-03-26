'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getContactSubmissions } from '@/lib/firestore/contacts';
import { getProjectSubmissions } from '@/lib/firestore/projects';
import { getBlogPosts } from '@/lib/firestore/blog';
import { getProjects } from '@/lib/firestore/projects';
import { getServices } from '@/lib/firestore/services';
import { MdFolder, MdBuild, MdArticle, MdContacts, MdTrendingUp } from 'react-icons/md';
import styles from './page.module.scss';

interface StatCard {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

export default function DashboardOverview() {
  const { appUser } = useAuth();
  const [stats, setStats] = useState<StatCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [contacts, projSubs, blogs, projects, services] = await Promise.all([
          getContactSubmissions(),
          getProjectSubmissions(),
          getBlogPosts(),
          getProjects(),
          getServices(),
        ]);

        const unreadContacts = contacts.filter(c => !c.read).length;
        const unreadProjSubs = projSubs.filter(s => !s.read).length;

        setStats([
          { label: 'Services',             value: services.length,    icon: <MdBuild />,    color: '#1e3a5f' },
          { label: 'Projects',             value: projects.length,    icon: <MdFolder />,   color: '#f97316' },
          { label: 'Blog Posts',           value: blogs.length,       icon: <MdArticle />,  color: '#16a34a' },
          { label: 'Unread Contacts',      value: unreadContacts,     icon: <MdContacts />, color: '#dc2626' },
          { label: 'Project Submissions',  value: unreadProjSubs,     icon: <MdTrendingUp />, color: '#d97706' },
        ]);
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Welcome back, {appUser?.displayName || 'Admin'}</h1>
          <p>Here is what is happening with HomePro Solutions today.</p>
        </div>
      </div>

      {loading ? (
        <div className="page-loader"><div className="spinner" /></div>
      ) : (
        <div className={styles.statsGrid}>
          {stats.map(s => (
            <div key={s.label} className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: `${s.color}18`, color: s.color }}>
                {s.icon}
              </div>
              <div className={styles.statInfo}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.quickLinks}>
        <h2>Quick Actions</h2>
        <div className={styles.linkGrid}>
          {[
            { href: '/dashboard/blog',          label: 'Manage Blog',     icon: <MdArticle /> },
            { href: '/dashboard/projects',       label: 'Manage Projects', icon: <MdFolder /> },
            { href: '/dashboard/services',       label: 'Manage Services', icon: <MdBuild /> },
            { href: '/dashboard/contacts',       label: 'View Contacts',   icon: <MdContacts /> },
          ].map(l => (
            <a key={l.href} href={l.href} className={styles.quickLink}>
              <span className={styles.quickIcon}>{l.icon}</span>
              <span>{l.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
