'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { getBlogPostBySlug } from '@/lib/firestore/blog';
import { BlogPost } from '@/types';
import { FiCalendar, FiUser, FiTag } from 'react-icons/fi';
import styles from './blog-detail.module.scss';

export default function BlogDetailPage() {
  const { slug } = useParams() as { slug: string };
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogPostBySlug(slug)
      .then(setPost)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (!post) return notFound();

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className={styles.heroMeta}>
            {post.tags.map(t => <span key={t} className="badge badge--accent">{t}</span>)}
          </div>
          <h1>{post.title}</h1>
          <div className={styles.metaRow}>
            <span><FiUser />{post.author}</span>
            <span><FiCalendar />{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/blog">Blog</Link>
            <span>/</span>
            <span>{post.title}</span>
          </div>
        </div>
      </section>

      <section className={`section ${styles.section}`}>
        <div className="container">
          <div className={styles.article}>
            {post.coverImage && (
              <img src={post.coverImage} alt={post.title} className={styles.cover} />
            )}
            <div
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>
      </section>
    </>
  );
}
