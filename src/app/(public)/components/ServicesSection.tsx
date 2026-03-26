'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { getServices } from '@/lib/firestore/services';
import { Service } from '@/types';
import ServiceCard from '@/components/ui/ServiceCard';
import styles from './ServicesSection.module.scss';

// Default services shown when Firestore is empty
const DEFAULT_SERVICES: Service[] = [
  {
    id: '1', title: 'Plumbing Services', slug: 'plumbing',
    shortDescription: 'Leaks, clogs, pipe replacements, and full plumbing installations.',
    description: '', icon: 'MdWater', image: '', order: 1, isActive: true,
    features: ['Emergency repairs', 'Pipe installation', 'Drain cleaning', 'Water heater service'],
    createdAt: '', updatedAt: '',
  },
  {
    id: '2', title: 'Electrical Services', slug: 'electrical',
    shortDescription: 'Safe, certified electrical repairs, wiring, and panel upgrades.',
    description: '', icon: 'MdBolt', image: '', order: 2, isActive: true,
    features: ['Wiring & rewiring', 'Panel upgrades', 'Outlet installation', 'Safety inspections'],
    createdAt: '', updatedAt: '',
  },
  {
    id: '3', title: 'AC Repair & Maintenance', slug: 'ac-repair',
    shortDescription: 'Keep cool with expert AC installation and maintenance.',
    description: '', icon: 'MdAcUnit', image: '', order: 3, isActive: true,
    features: ['AC installation', 'Maintenance plans', 'Refrigerant recharge', 'Duct cleaning'],
    createdAt: '', updatedAt: '',
  },
  {
    id: '4', title: 'Painting Services', slug: 'painting',
    shortDescription: 'Interior and exterior painting with premium materials.',
    description: '', icon: 'MdBrush', image: '', order: 4, isActive: true,
    features: ['Interior painting', 'Exterior painting', 'Color consultation', 'Surface prep'],
    createdAt: '', updatedAt: '',
  },
  {
    id: '5', title: 'Carpentry & Woodwork', slug: 'carpentry',
    shortDescription: 'Custom carpentry, furniture repair, and woodwork installations.',
    description: '', icon: 'MdCarpenter', image: '', order: 5, isActive: true,
    features: ['Custom furniture', 'Door repair', 'Cabinet installation', 'Flooring'],
    createdAt: '', updatedAt: '',
  },
  {
    id: '6', title: 'Deep Cleaning', slug: 'cleaning',
    shortDescription: 'Professional deep cleaning for homes and offices.',
    description: '', icon: 'MdBuilding', image: '', order: 6, isActive: true,
    features: ['Deep cleaning', 'Move-in/out cleaning', 'Post-construction', 'Regular plans'],
    createdAt: '', updatedAt: '',
  },
];

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServices(true)
      .then(data => setServices(data.length ? data : DEFAULT_SERVICES))
      .catch(() => setServices(DEFAULT_SERVICES))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className="section-header">
          <span className="label">What We Do</span>
          <h2>Our Expert Services</h2>
          <p>
            We provide a comprehensive range of home maintenance services,
            delivered by certified professionals with a satisfaction guarantee.
          </p>
        </div>

        {loading ? (
          <div className="page-loader" style={{ minHeight: '300px' }}>
            <div className="spinner" />
          </div>
        ) : (
          <div className="grid-3">
            {services.map(s => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        )}

        <div className={styles.cta}>
          <Link href="/services" className="btn btn--outline">
            View All Services <FiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
