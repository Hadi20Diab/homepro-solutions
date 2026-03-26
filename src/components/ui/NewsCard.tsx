import Link from 'next/link';
import { FiCalendar, FiExternalLink, FiArrowRight } from 'react-icons/fi';
import { NewsPost } from '@/types';
import styles from './NewsCard.module.scss';

interface Props { post: NewsPost; }

export default function NewsCard({ post }: Props) {
  return (
    <article className={styles.card}>
      {post.coverImage && (
        <Link href={`/news/${post.slug}`} className={styles.imageWrap}>
          <img src={post.coverImage} alt={post.title} className={styles.image} />
        </Link>
      )}
      <div className={styles.body}>
        <div className={styles.meta}>
          <span><FiCalendar />{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          {post.source && <span><FiExternalLink />{post.source}</span>}
        </div>
        <Link href={`/news/${post.slug}`}>
          <h3 className={styles.title}>{post.title}</h3>
        </Link>
        <p className={styles.excerpt}>{post.excerpt}</p>
        <Link href={`/news/${post.slug}`} className={styles.link}>
          Read More <FiArrowRight />
        </Link>
      </div>
    </article>
  );
}
