'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  MdHandyman, MdDashboard, MdBuild, MdFolder,
  MdArticle, MdNewspaper, MdContacts, MdPeople,
  MdHome, MdInfo, MdChevronLeft, MdMenuOpen, MdLogout,
} from 'react-icons/md';
import { useAuth } from '@/contexts/AuthContext';
import styles from './Sidebar.module.scss';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  section?: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard',              label: 'Overview',     icon: <MdDashboard /> },
  { href: '/dashboard/services',     label: 'Services',     icon: <MdBuild />,     section: 'services' },
  { href: '/dashboard/projects',     label: 'Projects',     icon: <MdFolder />,    section: 'projects' },
  { href: '/dashboard/blog',         label: 'Blog',         icon: <MdArticle />,   section: 'blog' },
  { href: '/dashboard/news',         label: 'News',         icon: <MdNewspaper />, section: 'news' },
  { href: '/dashboard/contacts',     label: 'Contacts',     icon: <MdContacts />,  section: 'contacts' },
  { href: '/dashboard/submissions',  label: 'Submissions',  icon: <MdFolder />,    section: 'projects' },
  { href: '/dashboard/home-content', label: 'Home Content', icon: <MdHome />,      section: 'home_content' },
  { href: '/dashboard/about-content',label: 'About Content',icon: <MdInfo />,      section: 'about_content' },
  { href: '/dashboard/users',        label: 'Users',        icon: <MdPeople />,    section: 'users' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { appUser, signOut, hasPermission } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const visibleItems = NAV_ITEMS.filter(item =>
    !item.section || hasPermission(item.section)
  );

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      {/* Logo */}
      <div className={styles.logo}>
        {!collapsed && (
          <Link href="/" className={styles.logoLink}>
            <MdHandyman className={styles.logoIcon} />
            <span><strong>HomePro</strong></span>
          </Link>
        )}
        <button
          className={styles.collapseBtn}
          onClick={() => setCollapsed(c => !c)}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? <MdMenuOpen /> : <MdChevronLeft />}
        </button>
      </div>

      {/* User Info */}
      {!collapsed && appUser && (
        <div className={styles.user}>
          <div className={styles.avatar}>
            {(appUser.displayName ?? appUser.email ?? '?').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className={styles.userName}>{appUser.displayName ?? appUser.email}</p>
            <p className={styles.userRole}>{appUser.role}</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className={styles.nav}>
        {visibleItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            title={collapsed ? item.label : undefined}
            className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {!collapsed && <span className={styles.navLabel}>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Sign Out */}
      <button
        className={styles.signOut}
        onClick={handleSignOut}
        title={collapsed ? 'Sign Out' : undefined}
      >
        <MdLogout />
        {!collapsed && <span>Sign Out</span>}
      </button>
    </aside>
  );
}
