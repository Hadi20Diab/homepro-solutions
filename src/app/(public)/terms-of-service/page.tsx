import type { Metadata } from 'next';
import Link from 'next/link';
import styles from '../privacy-policy/legal.module.scss';

export const metadata: Metadata = { title: 'Terms of Service | HomePro Solutions' };

export default function TermsOfServicePage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>Terms of Service</h1>
          <p>Last updated: January 1, 2025</p>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.content}>

            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using the HomePro Solutions website and services, you agree to be
              bound by these Terms of Service and our <Link href="/privacy-policy">Privacy Policy</Link>.
              If you do not agree to these terms, please do not use our services.
            </p>

            <h2>2. Services</h2>
            <p>
              HomePro Solutions provides home maintenance, repair, and improvement services as
              described on our website. We reserve the right to modify, suspend, or discontinue
              any service at any time with reasonable notice.
            </p>

            <h2>3. Bookings and Cancellations</h2>
            <ul>
              <li>Service bookings are confirmed upon receipt of a written or digital acceptance from us.</li>
              <li>Cancellations made more than 24 hours before a scheduled appointment will incur no charge.</li>
              <li>Cancellations within 24 hours may incur a cancellation fee of up to 50% of the quoted service price.</li>
              <li>No-shows may be charged the full quoted price.</li>
            </ul>

            <h2>4. Pricing and Payment</h2>
            <p>
              All prices are quoted in the local currency and are inclusive of applicable taxes unless
              stated otherwise. Payment is due upon completion of the service unless a different
              arrangement has been agreed in writing. We accept cash, bank transfer, and major
              credit/debit cards.
            </p>

            <h2>5. Warranties and Liability</h2>
            <p>
              HomePro Solutions warrants that all services will be performed with reasonable care and
              skill. In the event of defective workmanship, we will return to remedy the issue at no
              additional cost within 30 days of the original service date.
            </p>
            <p>
              Our liability is limited to the cost of the original service. We are not liable for
              indirect, incidental, or consequential losses arising from our services, except where
              required by applicable law.
            </p>

            <h2>6. Your Responsibilities</h2>
            <ul>
              <li>Provide safe and reasonable access to your property at the scheduled time.</li>
              <li>Ensure that the work area is clear and free of hazards before our technicians arrive.</li>
              <li>Inform us of any pre-existing conditions, known defects, or relevant building regulations.</li>
              <li>Ensure that all relevant permissions and consents are in place.</li>
            </ul>

            <h2>7. Intellectual Property</h2>
            <p>
              All content on this website — including text, images, logos, and design — is the
              property of HomePro Solutions and is protected by intellectual property laws. You may
              not reproduce or distribute our content without prior written permission.
            </p>

            <h2>8. Use of Website</h2>
            <p>
              You agree not to use our website for any unlawful purpose, to transmit any harmful
              or offensive content, or to interfere with the operation of the website or its
              underlying systems.
            </p>

            <h2>9. Governing Law</h2>
            <p>
              These Terms of Service are governed by the laws of the jurisdiction in which HomePro
              Solutions operates. Any disputes shall be subject to the exclusive jurisdiction of
              the courts in that jurisdiction.
            </p>

            <h2>10. Changes to These Terms</h2>
            <p>
              We may update these Terms of Service at any time. Continued use of our services
              after changes are posted constitutes your acceptance of the revised terms.
            </p>

            <h2>11. Contact Us</h2>
            <p>
              For questions about these Terms of Service, contact us at:
            </p>
            <address>
              HomePro Solutions<br />
              123 Main Street, Your City, State 12345<br />
              Email: <a href="mailto:legal@homepro.com">legal@homepro.com</a><br />
              Phone: <a href="tel:+123456789">+1 (234) 567-890</a>
            </address>

          </div>
        </div>
      </section>
    </>
  );
}
