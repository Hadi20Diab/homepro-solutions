'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createContactSubmission } from '@/lib/firestore/contacts';
import { toast } from 'react-hot-toast';
import { FiPhone, FiMail, FiMapPin, FiClock } from 'react-icons/fi';
import styles from './contact.module.scss';

const SERVICES = ['Plumbing', 'Electrical', 'AC Repair', 'Painting', 'Carpentry', 'Deep Cleaning', 'Other'];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', service: '', subject: '', message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      await createContactSubmission(form);
      toast.success('Your message has been sent! We will be in touch shortly.');
      setForm({ name: '', email: '', phone: '', service: '', subject: '', message: '' });
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>Contact Us</h1>
          <p>Get in touch with our team for a free quote or any questions.</p>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Contact</span>
          </div>
        </div>
      </section>

      <section className={`section ${styles.section}`}>
        <div className="container">
          <div className={styles.layout}>
            {/* Info */}
            <div className={styles.info}>
              <h2>Let's Talk About Your Project</h2>
              <p>
                Whether you need an emergency fix or are planning a home renovation,
                our team is ready to help. Reach out using any method below.
              </p>

              <div className={styles.contactItems}>
                <div className={styles.contactItem}>
                  <div className={styles.icon}><FiPhone /></div>
                  <div>
                    <strong>Phone</strong>
                    <a href="tel:+123456789">+1 (234) 567-890</a>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <div className={styles.icon}><FiMail /></div>
                  <div>
                    <strong>Email</strong>
                    <a href="mailto:info@homepro.com">info@homepro.com</a>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <div className={styles.icon}><FiMapPin /></div>
                  <div>
                    <strong>Address</strong>
                    <span>123 Main Street, Your City, State 12345</span>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <div className={styles.icon}><FiClock /></div>
                  <div>
                    <strong>Working Hours</strong>
                    <span>Mon–Sat: 8:00 AM – 6:00 PM</span>
                    <span>Sunday: Emergency only</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className={styles.formWrap}>
              <h3>Request a Service</h3>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className="grid-2">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      placeholder="John Smith"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+1 (234) 567-890"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Service Needed</label>
                    <select
                      value={form.service}
                      onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
                    >
                      <option value="">Select a service...</option>
                      {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Message *</label>
                  <textarea
                    placeholder="Describe your project or issue..."
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    rows={5}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn--primary btn--lg"
                  disabled={submitting}
                  style={{ width: '100%' }}
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
