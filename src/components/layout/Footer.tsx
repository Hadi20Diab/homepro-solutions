import Link from 'next/link';
import { MdHandyman } from 'react-icons/md';
import { FiPhone, FiMail, FiMapPin, FiFacebook, FiInstagram, FiTwitter, FiYoutube } from 'react-icons/fi';
import styles from './Footer.module.scss';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className="container">
          <div className={styles.grid}>
            {/* Brand */}
            <div className={styles.brand}>
              <Link href="/" className={styles.logo}>
                <MdHandyman />
                <span><strong>HomePro</strong> Solutions</span>
              </Link>
              <p>
                Your trusted partner for home maintenance, repairs, and improvements.
                Quality workmanship guaranteed.
              </p>
              <div className={styles.social}>
                <a href="#" aria-label="Facebook"><FiFacebook /></a>
                <a href="#" aria-label="Instagram"><FiInstagram /></a>
                <a href="#" aria-label="Twitter"><FiTwitter /></a>
                <a href="#" aria-label="YouTube"><FiYoutube /></a>
              </div>
            </div>

            {/* Services */}
            <div className={styles.col}>
              <h4>Our Services</h4>
              <ul>
                {['Plumbing', 'Electrical', 'AC Repair', 'Painting', 'Carpentry', 'Deep Cleaning'].map(s => (
                  <li key={s}><Link href="/services">{s}</Link></li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div className={styles.col}>
              <h4>Quick Links</h4>
              <ul>
                {[
                  { href: '/about', label: 'About Us' },
                  { href: '/projects', label: 'Our Projects' },
                  { href: '/blog', label: 'Blog' },
                  { href: '/news', label: 'News' },
                  { href: '/contact', label: 'Contact Us' },
                ].map(l => (
                  <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className={styles.col}>
              <h4>Contact Us</h4>
              <ul className={styles.contactList}>
                <li>
                  <FiMapPin />
                  <span>123 Main Street, Your City, State 12345</span>
                </li>
                <li>
                  <FiPhone />
                  <a href="tel:+123456789">+1 (234) 567-890</a>
                </li>
                <li>
                  <FiMail />
                  <a href="mailto:info@homepro.com">info@homepro.com</a>
                </li>
              </ul>
              <div className={styles.hours}>
                <strong>Working Hours</strong>
                <p>Mon–Sat: 8:00 AM – 6:00 PM</p>
                <p>Sun: Emergency only</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className="container">
          <p>&copy; {year} HomePro Solutions. All rights reserved.</p>
          <div className={styles.legal}>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-of-service">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
