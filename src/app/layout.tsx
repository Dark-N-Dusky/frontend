import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/navbar/page';
import Footer from '@/components/footer/page';
import { AuthProvider } from './context/authContext';

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
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
