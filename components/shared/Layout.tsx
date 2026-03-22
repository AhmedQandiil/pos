'use client';

import React from 'react';
import { Toaster } from 'react-hot-toast';
import Sidebar from './Sidebar';
import Header from './Header';
import AuthWrapper from './AuthWrapper';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0f1117] text-white font-cairo" dir="rtl">
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
    </div>
  );
}
