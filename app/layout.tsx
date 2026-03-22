import type { Metadata } from 'next';
import { Cairo, Space_Mono } from 'next/font/google';
import './index.css';
import { Toaster } from 'react-hot-toast';
import Sidebar from '../components/shared/Sidebar';
import Header from '../components/shared/Header';
import AuthWrapper from '../components/shared/AuthWrapper';

const cairo = Cairo({ 
  subsets: ['arabic'],
  variable: '--font-cairo',
  display: 'swap',
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'نظام الكاشير - مطعم الشيف أحمد',
  description: 'نظام إدارة مطاعم متكامل',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${spaceMono.variable}`}>
      <body className="bg-[#0f1117] text-white font-cairo overflow-hidden h-screen flex">
        <AuthWrapper>
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <Header />
            <main className="flex-1 overflow-auto p-4 md:p-6">
              {children}
            </main>
          </div>
        </AuthWrapper>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
