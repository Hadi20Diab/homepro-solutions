import {
  MdVerifiedUser, MdTimelapse, MdSupportAgent, MdStar,
  MdPriceCheck, MdSecurity,
} from 'react-icons/md';
import styles from './WhyUsSection.module.scss';

const REASONS = [
  {
    icon: <MdVerifiedUser />,
    title: 'Licensed & Insured',
    desc: 'All our technicians are fully licensed, insured, and background-checked for your peace of mind.',
  },
  {
    icon: <MdTimelapse />,
    title: 'On-Time Guarantee',
    desc: "We respect your time. If we're late, the service is discounted. That is our promise.",
  },
  {
    icon: <MdSupportAgent />,
    title: '24/7 Emergency Support',
    desc: "Home emergencies don't wait. Our support team is available around the clock, every day.",
  },
  {
    icon: <MdStar />,
    title: 'Quality Workmanship',
    desc: 'We use only premium materials and follow industry best practices on every single job.',
  },
  {
    icon: <MdPriceCheck />,
    title: 'Transparent Pricing',
    desc: 'No hidden fees. You get a detailed quote upfront before any work begins.',
  },
  {
    icon: <MdSecurity />,
    title: 'Satisfaction Guaranteed',
    desc: 'Not satisfied? We will come back and fix it free of charge. Your happiness is our priority.',
  },
];

export default function WhyUsSection() {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.layout}>
          {/* Left: Image */}
          <div className={styles.imageCol}>
            <div className={styles.imageCard}>
              <img
                src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80"
                alt="Technician at work"
              />
            </div>
            <div className={styles.expBadge}>
              <strong>15+</strong>
              <span>Years of Excellence</span>
            </div>
          </div>

          {/* Right: Reasons */}
          <div className={styles.rightCol}>
            <div className="section-header" style={{ textAlign: 'left', marginBottom: 0 }}>
              <span className="label">Why Choose Us</span>
              <h2>The HomePro Difference</h2>
              <p>
                We go beyond fixing problems — we build lasting relationships
                with homeowners who trust us with their most valuable asset.
              </p>
            </div>

            <div className={styles.grid}>
              {REASONS.map(r => (
                <div key={r.title} className={styles.item}>
                  <div className={styles.icon}>{r.icon}</div>
                  <div>
                    <h4>{r.title}</h4>
                    <p>{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
