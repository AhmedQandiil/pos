'use client';

import { useAuthStore } from '../../store/authStore';
import { formatDateTime } from '../../lib/formatters';
import { USER_ROLE_LABELS } from '../../lib/constants';
import { Bell, User as UserIcon, Clock, Menu } from 'lucide-react'; // ✅ RESPONSIVE FIX
import { useState, useEffect } from 'react';
import { useUIStore } from '../../store/uiStore'; // ✅ RESPONSIVE FIX
import { cn } from '../../lib/utils';

export default function Header() {
  const { currentUser } = useAuthStore();
  const { toggleSidebarOpen } = useUIStore(); // ✅ RESPONSIVE FIX
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-20 bg-[#1a1d26] border-b border-white/5 flex items-center justify-between px-4 md:px-8 shrink-0">
      <div className="flex items-center gap-4 md:gap-6">
        {/* ✅ RESPONSIVE FIX: Hamburger Menu for Tablet/Mobile */}
        <button 
          onClick={toggleSidebarOpen}
          className="p-2 hover:bg-white/5 rounded-xl text-slate-400 lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hidden sm:flex">
            <UserIcon className="text-[#f59e0b] w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-sm">{currentUser?.name}</p>
            <p className="text-xs text-slate-400">{USER_ROLE_LABELS[currentUser?.role || 'cashier']}</p>
          </div>
        </div>
        
        <div className="h-8 w-px bg-white/5 hidden md:block" />
        
        <div className="flex items-center gap-2 text-slate-400 hidden md:flex">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-mono">{formatDateTime(time)}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all">
          <Bell className="w-5 h-5 text-slate-400" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#1a1d26]" />
        </button>
        
        <div className="bg-[#f59e0b]/10 px-4 py-2 rounded-xl border border-[#f59e0b]/20 hidden sm:block">
          <span className="text-[#f59e0b] text-sm font-bold">المناوبة الصباحية</span>
        </div>
      </div>
    </header>
  );
}
