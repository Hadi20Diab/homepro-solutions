'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { getNewsPostBySlug } from '@/lib/firestore/news';
import { NewsPost } from '@/types';
import { FiCalendar, FiExternalLink } from 'react-icons/fi';
import styles from './news-detail.module.scss';

export default function NewsDetailPage() {
  const { slug } = useParams() as { slug: string };
  const [post, setPost] = useState<NewsPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNewsPostBySlug(slug)
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
          <h1>{post.title}</h1>
          <div className={styles.metaRow}>
            <span><FiCalendar />{new Date(post.createdAt).toLocaleDateString()}</span>
            {post.source && <span><FiExternalLink />{post.source}</span>}
          </div>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/news">News</Link>
            <span>/</span>
            <span>{post.title}</span>
          </div>
        </div>
      </section>

      <section className={`section ${styles.section}`}>
        <div className="container">
          <div className={styles.article}>
            {post.coverImage && <img src={post.coverImage} alt={post.title} className={styles.cover} />}
            <div className={styles.content} dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </div>
      </section>
    </>
  );
}
