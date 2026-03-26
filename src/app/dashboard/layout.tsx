import Sidebar from '@/components/dashboard/Sidebar';
import ProtectedRoute from '@/components/dashboard/ProtectedRoute';
import styles from './dashboard.module.scss';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className={styles.layout}>
        <Sidebar />
        <main className={styles.main}>
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
