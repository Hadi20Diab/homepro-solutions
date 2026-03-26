import Link from 'next/link';
import { FiArrowRight, FiPhoneCall } from 'react-icons/fi';
import styles from './CtaBanner.module.scss';

export default function CtaBanner() {
  return (
    <section className={styles.cta}>
      <div className={styles.overlay} />
      <div className={`container ${styles.inner}`}>
        <div className={styles.content}>
          <h2>Ready to Fix It Right the First Time?</h2>
          <p>
            Don't let small issues turn into big problems. Our certified
            technicians are ready to help — same day service available.
          </p>
          <div className={styles.actions}>
            <Link href="/contact" className="btn btn--primary btn--lg">
              Get a Free Quote <FiArrowRight />
            </Link>
            <a href="tel:+123456789" className={styles.phoneBtn}>
              <FiPhoneCall />
              <span>Call +1 (234) 567-890</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
