import { MdStar, MdFormatQuote } from 'react-icons/md';
import styles from './TestimonialsSection.module.scss';

const TESTIMONIALS = [
  {
    name: 'Sarah Mitchell',
    role: 'Homeowner, Downtown',
    rating: 5,
    text: "HomePro fixed a major plumbing issue in my kitchen within hours of calling. The technician was professional, clean, and thorough. Highly recommended!",
    img: 'https://i.pravatar.cc/60?img=47'
  },
  {
    name: 'James Ortega',
    role: 'Property Manager',
    rating: 5,
    text: "I've used HomePro across 12 of my properties. Their electrical team is top-notch — always on time and the pricing is transparent with no surprises.",
    img: 'https://i.pravatar.cc/60?img=12'
  },
  {
    name: 'Linda Chen',
    role: 'Homeowner, Suburbs',
    rating: 5,
    text: 'Our AC stopped working on the hottest day of the year. HomePro came same day and had it running within 2 hours. Absolute lifesavers!',
    img: 'https://i.pravatar.cc/60?img=48'
  },
];

export default function TestimonialsSection() {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className="section-header">
          <span className="label">Testimonials</span>
          <h2>What Our Clients Say</h2>
          <p>
            Real stories from real customers. See why homeowners trust us
            with their most important repairs.
          </p>
        </div>
        <div className="grid-3">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className={styles.card}>
              <MdFormatQuote className={styles.quoteIcon} />
              <div className={styles.stars}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <MdStar key={i} />
                ))}
              </div>
              <p className={styles.text}>{t.text}</p>
              <div className={styles.author}>
                <img src={t.img} alt={t.name} className={styles.avatar} />
                <div>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
