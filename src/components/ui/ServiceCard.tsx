import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight } from 'react-icons/fi';
import { Service } from '@/types';
import styles from './ServiceCard.module.scss';

interface Props {
  service: Service;
}

// Map icon names to dynamic import - we'll use react-icons FiXxx pattern
import {
  MdBusiness, MdBolt, MdWater, MdAcUnit, MdBrush, MdCarpenter,
} from 'react-icons/md';

const ICON_MAP: Record<string, React.ReactNode> = {
  MdBolt:     <MdBolt />,
  MdWater:    <MdWater />,
  MdAcUnit:   <MdAcUnit />,
  MdBrush:    <MdBrush />,
  MdCarpenter:<MdCarpenter />,
  MdBuilding: <MdBusiness />,
  MdBusiness: <MdBusiness />,
};

export default function ServiceCard({ service }: Props) {
  return (
    <Link href={`/services#${service.slug}`} className={styles.card}>
      <div className={styles.iconWrap}>
        {ICON_MAP[service.icon] ?? <MdBolt />}
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{service.title}</h3>
        <p className={styles.desc}>{service.shortDescription}</p>
        <ul className={styles.features}>
          {service.features.slice(0, 3).map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
        <span className={styles.link}>
          Learn More <FiArrowRight />
        </span>
      </div>
    </Link>
  );
}
