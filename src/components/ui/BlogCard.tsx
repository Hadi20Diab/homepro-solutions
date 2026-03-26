import Link from 'next/link';
import { FiCalendar, FiUser, FiTag, FiArrowRight } from 'react-icons/fi';
import { BlogPost } from '@/types';
import styles from './BlogCard.module.scss';

interface Props { post: BlogPost; }

export default function BlogCard({ post }: Props) {
  return (
    <article className={styles.card}>
      {post.coverImage && (
        <Link href={`/blog/${post.slug}`} className={styles.imageWrap}>
          <img src={post.coverImage} alt={post.title} className={styles.image} />
          {post.featured && <span className={styles.featured}>Featured</span>}
        </Link>
      )}
      <div className={styles.body}>
        {post.tags.length > 0 && (
          <div className={styles.tags}>
            {post.tags.slice(0, 2).map(t => (
              <span key={t} className={styles.tag}><FiTag />{t}</span>
            ))}
          </div>
        )}
        <Link href={`/blog/${post.slug}`}>
          <h3 className={styles.title}>{post.title}</h3>
        </Link>
        <p className={styles.excerpt}>{post.excerpt}</p>
        <div className={styles.footer}>
          <div className={styles.meta}>
            <span><FiUser />{post.author}</span>
            <span><FiCalendar />{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <Link href={`/blog/${post.slug}`} className={styles.link}>
            Read More <FiArrowRight />
          </Link>
        </div>
      </div>
    </article>
  );
}
