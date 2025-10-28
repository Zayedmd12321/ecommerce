// File: app/layout.tsx

import type { Metadata } from 'next';
import './globals.css';
import { Inter, Poppins } from 'next/font/google';
import Navbar from '@/components/Navbar';
import { AuthProvider } from './context/AuthContext'; // 1. Import the provider
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-poppins',
});

export const metadata = {
  title: 'Next.js E-Commerce Store',
  description: 'A demo app showing different rendering strategies.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true} data-theme="dark">
      <body className={`${inter.variable} ${poppins.variable}`}>
        {/* 2. Wrap the layout with the AuthProvider */}
        <AuthProvider>
          <div className="main-layout">
            <Navbar />
            <main className="main-content">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}