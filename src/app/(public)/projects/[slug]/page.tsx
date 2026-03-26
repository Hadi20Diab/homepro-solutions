'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { getProjectBySlug, createProjectSubmission } from '@/lib/firestore/projects';
import { Project } from '@/types';
import { toast } from 'react-hot-toast';
import { FiMapPin, FiCalendar, FiTag } from 'react-icons/fi';
import styles from './project-detail.module.scss';

export default function ProjectDetailPage() {
  const { slug } = useParams() as { slug: string };
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'before' | 'after'>('after');
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getProjectBySlug(slug)
      .then(p => { setProject(p); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (!project) return notFound();

  const images = activeTab === 'after' ? project.afterImages : project.beforeImages;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return toast.error('Please fill required fields');
    setSubmitting(true);
    try {
      await createProjectSubmission({
        projectId: project.id,
        projectTitle: project.title,
        ...form,
      });
      toast.success('Your interest has been submitted!');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch {
      toast.error('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>{project.title}</h1>
          <p>{project.shortDescription}</p>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/projects">Projects</Link>
            <span>/</span>
            <span>{project.title}</span>
          </div>
        </div>
      </section>

      <section className={`section ${styles.section}`}>
        <div className="container">
          <div className={styles.layout}>
            {/* Main Content */}
            <div className={styles.main}>
              {/* Before / After Toggle */}
              {(project.beforeImages.length > 0 || project.afterImages.length > 0) && (
                <div className={styles.gallery}>
                  <div className={styles.galleryTabs}>
                    <button
                      className={`${styles.tab} ${activeTab === 'after' ? styles.active : ''}`}
                      onClick={() => setActiveTab('after')}
                    >After</button>
                    <button
                      className={`${styles.tab} ${activeTab === 'before' ? styles.active : ''}`}
                      onClick={() => setActiveTab('before')}
                    >Before</button>
                  </div>
                  <div className={styles.images}>
                    {images.map((img, i) => (
                      <img key={i} src={img} alt={`${activeTab} image ${i + 1}`} className={styles.image} />
                    ))}
                    {images.length === 0 && (
                      <div className={styles.noImage}>No images available</div>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className={styles.desc}>
                <h2>Project Overview</h2>
                <p>{project.description}</p>
              </div>

              {/* Testimonial */}
              {project.clientTestimonial && (
                <blockquote className={styles.testimonial}>
                  <p>"{project.clientTestimonial}"</p>
                  <cite>— Verified Client</cite>
                </blockquote>
              )}
            </div>

            {/* Sidebar */}
            <div className={styles.sidebar}>
              {/* Meta */}
              <div className={styles.metaCard}>
                <h4>Project Details</h4>
                <div className={styles.metaItem}><FiTag /><span><strong>Category:</strong> {project.category}</span></div>
                <div className={styles.metaItem}><FiMapPin /><span><strong>Location:</strong> {project.location}</span></div>
                <div className={styles.metaItem}>
                  <FiCalendar />
                  <span>
                    <strong>Completed:</strong>{' '}
                    {new Date(project.completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                  </span>
                </div>
              </div>

              {/* Interest Form */}
              <div className={styles.formCard}>
                <h4>Interested in This Project?</h4>
                <p>Tell us about your project and we will reach out with a quote.</p>
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      placeholder="John Smith"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      placeholder="+1 (234) 567-890"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Message</label>
                    <textarea
                      placeholder="Tell us about your project..."
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      rows={4}
                    />
                  </div>
                  <button type="submit" className="btn btn--primary" disabled={submitting} style={{ width: '100%' }}>
                    {submitting ? 'Submitting...' : 'Submit Interest'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
