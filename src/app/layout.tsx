import type { Metadata } from 'next';
import './globals.scss';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: {
    default: 'HomePro Solutions – Home Maintenance & Repair Services',
    template: '%s | HomePro Solutions',
  },
  description:
    'HomePro Solutions offers professional plumbing, electrical, AC repair, cleaning, and home maintenance services. Get a free quote today.',
  keywords: ['home maintenance', 'plumbing', 'electrical', 'AC repair', 'cleaning', 'repairs'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                fontFamily: 'Inter, sans-serif',
                borderRadius: '8px',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
