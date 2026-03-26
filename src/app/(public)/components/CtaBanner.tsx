'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiArrowRight, FiPhoneCall } from 'react-icons/fi';
import { getHomeContent } from '@/lib/firestore/siteContent';
import styles from './CtaBanner.module.scss';

export default function CtaBanner() {
  const [ctaTitle, setCtaTitle] = useState('Ready to Fix It Right the First Time?');
  const [ctaSub, setCtaSub] = useState("Don't let small issues turn into big problems. Our certified technicians are ready to help — same day service available.");

  useEffect(() => {
    getHomeContent()
      .then(d => {
        if (d?.ctaBannerTitle) setCtaTitle(d.ctaBannerTitle);
        if (d?.ctaBannerSubtitle) setCtaSub(d.ctaBannerSubtitle);
      })
      .catch(() => {});
  }, []);

  return (
    <section className={styles.cta}>
      <div className={styles.overlay} />
      <div className={`container ${styles.inner}`}>
        <div className={styles.content}>
          <h2>{ctaTitle}</h2>
          <p>{ctaSub}</p>
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
