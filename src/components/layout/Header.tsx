'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FiPhone, FiMenu, FiX } from 'react-icons/fi';
import { MdHandyman } from 'react-icons/md';
import styles from './Header.module.scss';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/news', label: 'News' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <MdHandyman className={styles.logoIcon} />
          <span>
            <strong>HomePro</strong> Solutions
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className={styles.nav} aria-label="Main navigation">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA + Hamburger */}
        <div className={styles.actions}>
          <a href="tel:+123456789" className={styles.phone}>
            <FiPhone />
            <span>+1 (234) 567-890</span>
          </a>
          <Link href="/contact" className="btn btn--primary btn--sm">
            Get a Quote
          </Link>
          <button
            className={styles.burger}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <nav className={styles.mobileNav} aria-label="Mobile navigation">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.mobileLink} ${pathname === link.href ? styles.active : ''}`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/contact" className={`btn btn--primary ${styles.mobileCta}`}>
            Get a Free Quote
          </Link>
        </nav>
      )}
    </header>
  );
}
