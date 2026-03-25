'use client';

import React from 'react';
import { Toaster } from 'react-hot-toast';
import Sidebar from './Sidebar';
import Header from './Header';
import AuthWrapper from './AuthWrapper';

import { useUIStore } from '../../store/uiStore'; // ✅ RESPONSIVE FIX
import { cn } from '../../lib/utils';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSidebarCollapsed } = useUIStore(); // ✅ RESPONSIVE FIX

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0f1117] text-white font-cairo" dir="rtl">
      <AuthWrapper>
        <Sidebar />
        {/* ✅ RESPONSIVE FIX: Content area adapts to sidebar state and mobile nav */}
        <div 
          className={cn(
            "flex-1 flex flex-col min-w-0 transition-all duration-300",
            "lg:pr-[220px]", // ✅ RESPONSIVE FIX: Desktop expanded
            isSidebarCollapsed && "lg:pr-16", // ✅ RESPONSIVE FIX: Desktop collapsed
            "pr-0", // ✅ RESPONSIVE FIX: Mobile/Tablet
            "pb-20 md:pb-0" // ✅ RESPONSIVE FIX: Mobile bottom nav space
          )}
        >
          <Header />
          <main className="flex-1 overflow-auto p-4 md:p-6 scroll-touch no-scrollbar">
            {children}
          </main>
        </div>
      </AuthWrapper>
      <Toaster position="top-center" />
    </div>
  );
}
