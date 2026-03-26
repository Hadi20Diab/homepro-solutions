'use client';

import Link from 'next/link';
import { FiArrowRight, FiPhoneCall } from 'react-icons/fi';
import { MdVerifiedUser, MdTimelapse, MdStar } from 'react-icons/md';
import styles from './HeroSection.module.scss';

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      {/* Background */}
      <div className={styles.bg} />
      <div className={styles.overlay} />

      <div className={`container ${styles.inner}`}>
        <div className={styles.content}>
          <span className={styles.badge}>
            <MdVerifiedUser /> Licensed & Insured Professionals
          </span>

          <h1 className={styles.headline}>
            Professional Home<br />
            <span className={styles.highlight}>Maintenance</span> &<br />
            Repair Services
          </h1>

          <p className={styles.sub}>
            From plumbing fixes to full electrical overhauls — HomePro Solutions
            delivers quality workmanship, on time, every time. Serving your community
            with trust since 2010.
          </p>

          <div className={styles.actions}>
            <Link href="/contact" className="btn btn--primary btn--lg">
              Get a Free Quote <FiArrowRight />
            </Link>
            <a href="tel:+123456789" className={styles.phoneBtn}>
              <FiPhoneCall />
              <div>
                <small>Call us now</small>
                <strong>+1 (234) 567-890</strong>
              </div>
            </a>
          </div>

          <div className={styles.trust}>
            <div className={styles.trustItem}>
              <MdStar className={styles.starIcon} />
              <span><strong>4.9/5</strong> Rating</span>
            </div>
            <div className={styles.divider} />
            <div className={styles.trustItem}>
              <MdTimelapse />
              <span><strong>15+</strong> Years Experience</span>
            </div>
            <div className={styles.divider} />
            <div className={styles.trustItem}>
              <MdVerifiedUser />
              <span><strong>2,400+</strong> Happy Clients</span>
            </div>
          </div>
        </div>

        <div className={styles.imageCol}>
          <div className={styles.imageCard}>
            <img
              // src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80"
              // src="https://cdn.foochia.com/media/cd7a0042-551d-4aa3-8b69-8a0c9c90cad4.webp"
              src="https://cleanfinderr.com/wp-content/uploads/2024/07/Curtain-cleaning-company-in-Riyadh.jpg"
              alt="Professional home maintenance technician at work"
            />
            <div className={styles.floatCard}>
              <div className={styles.floatIcon}><MdVerifiedUser /></div>
              <div>
                <strong>Trusted by thousands</strong>
                <p>across the region</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave */}
      <div className={styles.wave}>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,80 C240,20 480,80 720,40 C960,0 1200,60 1440,40 L1440,80 Z" fill="#f8fafc" />
        </svg>
      </div>
    </section>
  );
}
