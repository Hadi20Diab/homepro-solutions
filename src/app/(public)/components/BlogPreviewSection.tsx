'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { getBlogPosts } from '@/lib/firestore/blog';
import { BlogPost } from '@/types';
import BlogCard from '@/components/ui/BlogCard';
import styles from './BlogPreviewSection.module.scss';

export default function BlogPreviewSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogPosts(true)
      .then(data => setPosts(data.slice(0, 3)))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && posts.length === 0) return null;

  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className="section-header">
          <span className="label">Tips & Insights</span>
          <h2>From Our Blog</h2>
          <p>
            Expert home maintenance tips, DIY guides, and industry news
            to help you keep your home in top condition.
          </p>
        </div>

        {loading ? (
          <div className="page-loader" style={{ minHeight: '200px' }}>
            <div className="spinner" />
          </div>
        ) : (
          <div className="grid-3">
            {posts.map(p => <BlogCard key={p.id} post={p} />)}
          </div>
        )}

        <div className={styles.cta}>
          <Link href="/blog" className="btn btn--outline">
            Read All Articles <FiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
