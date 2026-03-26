'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { getProjects } from '@/lib/firestore/projects';
import { Project } from '@/types';
import ProjectCard from '@/components/ui/ProjectCard';
import styles from './ProjectsSection.module.scss';

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects(true)
      .then(data => setProjects(data.slice(0, 3)))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && projects.length === 0) return null;

  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className="section-header">
          <span className="label">Our Work</span>
          <h2>Featured Projects</h2>
          <p>
            See the transformation — real before and after results from
            projects we have completed for homeowners like you.
          </p>
        </div>

        {loading ? (
          <div className="page-loader" style={{ minHeight: '300px' }}>
            <div className="spinner" />
          </div>
        ) : (
          <div className="grid-3">
            {projects.map(p => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}

        <div className={styles.cta}>
          <Link href="/projects" className="btn btn--primary">
            View All Projects <FiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
