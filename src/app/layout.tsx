import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { AuthProvider } from './context/authContext';
import RouteChangeLogger from '@/components/routeChangeLogger';

export const metadata: Metadata = {
  title: 'Dark & Dusky',
  description: 'Dark & Dusky - Genuine leather products',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Suspense fallback={null}>
            <RouteChangeLogger />
          </Suspense>
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
