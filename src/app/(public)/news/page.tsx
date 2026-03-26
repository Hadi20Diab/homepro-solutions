'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getNewsPosts } from '@/lib/firestore/news';
import { NewsPost } from '@/types';
import NewsCard from '@/components/ui/NewsCard';
import styles from './news.module.scss';

export default function NewsPage() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNewsPosts(true)
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>News & Updates</h1>
          <p>Stay up to date with the latest news, company updates, and industry trends.</p>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>News</span>
          </div>
        </div>
      </section>

      <section className={`section ${styles.section}`}>
        <div className="container">
          {loading ? (
            <div className="page-loader"><div className="spinner" /></div>
          ) : posts.length > 0 ? (
            <div className="grid-3">
              {posts.map(p => <NewsCard key={p.id} post={p} />)}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No News Yet</h3>
              <p>Check back soon for updates and company news.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
