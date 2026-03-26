'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getBlogPosts } from '@/lib/firestore/blog';
import { BlogPost } from '@/types';
import BlogCard from '@/components/ui/BlogCard';
import styles from './blog.module.scss';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogPosts(true)
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>Blog</h1>
          <p>Home maintenance tips, DIY guides, and expert advice.</p>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Blog</span>
          </div>
        </div>
      </section>

      <section className={`section ${styles.section}`}>
        <div className="container">
          {loading ? (
            <div className="page-loader"><div className="spinner" /></div>
          ) : posts.length > 0 ? (
            <div className="grid-3">
              {posts.map(p => <BlogCard key={p.id} post={p} />)}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No Blog Posts Yet</h3>
              <p>We are working on some great content. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
