import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './legal.module.scss';

export const metadata: Metadata = { title: 'Privacy Policy | HomePro Solutions' };

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>Privacy Policy</h1>
          <p>Last updated: January 1, 2025</p>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.content}>

            <h2>1. Information We Collect</h2>
            <p>
              When you use HomePro Solutions, we may collect the following types of information:
            </p>
            <ul>
              <li><strong>Contact information</strong> — your name, email address, phone number, and service address when you submit an enquiry or book a service.</li>
              <li><strong>Usage data</strong> — pages you visit, time spent on the site, and browser/device information collected automatically via cookies and analytics tools.</li>
              <li><strong>Communications</strong> — records of messages or calls you send to us.</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Respond to your enquiries and provide the services you request.</li>
              <li>Send you service confirmations, invoices, and updates.</li>
              <li>Improve our website and services through analytics.</li>
              <li>Send promotional emails where you have opted in (you may unsubscribe at any time).</li>
              <li>Comply with legal and regulatory obligations.</li>
            </ul>

            <h2>3. Cookies</h2>
            <p>
              Our website uses cookies to enhance your browsing experience. Cookies are small files
              stored on your device that help us remember your preferences and understand how visitors
              use our site. You can control cookies through your browser settings. Disabling cookies
              may affect certain features of the website.
            </p>

            <h2>4. Data Sharing</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may share
              your data with trusted service providers (e.g., payment processors, email platforms)
              who assist us in operating our website and delivering services, subject to strict
              confidentiality agreements.
            </p>

            <h2>5. Data Retention</h2>
            <p>
              We retain your personal data only as long as necessary to fulfil the purposes outlined
              in this policy or as required by law. You may request deletion of your data at any time
              by contacting us at the address below.
            </p>

            <h2>6. Security</h2>
            <p>
              We implement industry-standard technical and organisational measures to protect your
              data from unauthorised access, loss, or misuse. However, no method of transmission
              over the internet is 100% secure.
            </p>

            <h2>7. Your Rights</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul>
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your data.</li>
              <li>Object to or restrict certain processing activities.</li>
              <li>Data portability (receive your data in a structured, machine-readable format).</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us at{' '}
              <a href="mailto:privacy@homepro.com">privacy@homepro.com</a>.
            </p>

            <h2>8. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party sites. We are not responsible for the
              privacy practices of those sites and encourage you to review their policies.
            </p>

            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of significant
              changes by posting the updated policy on this page with a revised date.
            </p>

            <h2>10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <address>
              HomePro Solutions<br />
              123 Main Street, Your City, State 12345<br />
              Email: <a href="mailto:privacy@homepro.com">privacy@homepro.com</a><br />
              Phone: <a href="tel:+123456789">+1 (234) 567-890</a>
            </address>

          </div>
        </div>
      </section>
    </>
  );
}
