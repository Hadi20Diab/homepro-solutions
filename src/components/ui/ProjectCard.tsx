import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight, FiMapPin, FiCalendar } from 'react-icons/fi';
import { Project } from '@/types';
import styles from './ProjectCard.module.scss';

interface Props { project: Project; }

export default function ProjectCard({ project }: Props) {
  const imageUrl = project.afterImages[0] ?? project.beforeImages[0] ?? '/images/placeholder.jpg';

  return (
    <Link href={`/projects/${project.slug}`} className={styles.card}>
      <div className={styles.imageWrap}>
        <img src={imageUrl} alt={project.title} className={styles.image} />
        <span className={styles.category}>{project.category}</span>
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.desc}>{project.shortDescription}</p>
        <div className={styles.meta}>
          <span><FiMapPin /> {project.location}</span>
          <span><FiCalendar /> {new Date(project.completionDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
        </div>
        <span className={styles.link}>View Project <FiArrowRight /></span>
      </div>
    </Link>
  );
}
