'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getServices } from '@/lib/firestore/services';
import { Service } from '@/types';
import ServiceCard from '@/components/ui/ServiceCard';
import styles from './services.module.scss';
import { MdPhone } from 'react-icons/md';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServices(true)
      .then(setServices)
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>Our Services</h1>
          <p>Professional home maintenance services tailored to your needs.</p>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Services</span>
          </div>
        </div>
      </section>

      <section className={`section ${styles.section}`}>
        <div className="container">
          {loading ? (
            <div className="page-loader"><div className="spinner" /></div>
          ) : services.length > 0 ? (
            <div className="grid-3">
              {services.map(s => <ServiceCard key={s.id} service={s} />)}
            </div>
          ) : (
            <div className="empty-state">
              <h3>Services Coming Soon</h3>
              <p>We are updating our services list. Check back shortly.</p>
            </div>
          )}

          {/* CTA */}
          <div className={styles.ctaBanner}>
            <div>
              <h3>Need a Service Not Listed?</h3>
              <p>We handle a wide range of home maintenance tasks. Get in touch and tell us what you need.</p>
            </div>
            <a href="tel:+123456789" className="btn btn--primary btn--lg">
              <MdPhone /> Call Now
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
