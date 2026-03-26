'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProjects } from '@/lib/firestore/projects';
import { Project } from '@/types';
import ProjectCard from '@/components/ui/ProjectCard';
import styles from './projects.module.scss';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState('All');

  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];
  const filtered = active === 'All' ? projects : projects.filter(p => p.category === active);

  useEffect(() => {
    getProjects(true)
      .then(setProjects)
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>Our Projects</h1>
          <p>Real transformations — before & after stories from homeowners we have served.</p>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Projects</span>
          </div>
        </div>
      </section>

      <section className={`section ${styles.section}`}>
        <div className="container">
          {/* Filter tabs */}
          {categories.length > 1 && (
            <div className={styles.filters}>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`${styles.filter} ${active === cat ? styles.active : ''}`}
                  onClick={() => setActive(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="page-loader"><div className="spinner" /></div>
          ) : filtered.length > 0 ? (
            <div className="grid-3">
              {filtered.map(p => <ProjectCard key={p.id} project={p} />)}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No Projects Yet</h3>
              <p>We are adding our portfolio soon. Check back shortly.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
