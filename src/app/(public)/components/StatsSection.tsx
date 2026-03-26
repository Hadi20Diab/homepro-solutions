import { MdPeople, MdBuild, MdStar, MdVerifiedUser } from 'react-icons/md';
import styles from './StatsSection.module.scss';

const STATS = [
  { icon: <MdPeople />, value: '2,400+', label: 'Happy Clients' },
  { icon: <MdBuild />,  value: '8,500+', label: 'Jobs Completed' },
  { icon: <MdStar />,   value: '4.9/5',  label: 'Average Rating' },
  { icon: <MdVerifiedUser />, value: '15+', label: 'Years Experience' },
];

export default function StatsSection() {
  return (
    <section className={styles.stats}>
      <div className="container">
        <div className={styles.grid}>
          {STATS.map(s => (
            <div key={s.label} className={styles.item}>
              <div className={styles.icon}>{s.icon}</div>
              <strong className={styles.value}>{s.value}</strong>
              <span className={styles.label}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
