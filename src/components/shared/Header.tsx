'use client';

import { useAuthStore } from '../../store/authStore';
import { formatDateTime } from '../../lib/formatters';
import { USER_ROLE_LABELS } from '../../lib/constants';
import { User as UserIcon, Clock, Menu } from 'lucide-react'; // ✅ RESPONSIVE FIX
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
    <header className="h-16 md:h-20 bg-[#1a1d26] border-b border-white/5 flex items-center justify-between px-3 md:px-8 shrink-0">
      <div className="flex items-center gap-3 md:gap-6">
        {/* ✅ RESPONSIVE FIX: Hamburger Menu for Tablet/Mobile */}
        <button 
          onClick={toggleSidebarOpen}
          className="p-1.5 hover:bg-white/5 rounded-xl text-slate-400 lg:hidden"
        >
          <Menu className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-white/5 rounded-full flex items-center justify-center hidden sm:flex">
            <UserIcon className="text-[#f59e0b] w-4 h-4 md:w-5 md:h-5" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-xs md:text-sm truncate max-w-[100px] md:max-w-none">{currentUser?.name}</p>
            <p className="text-[10px] md:text-xs text-slate-400 truncate">{USER_ROLE_LABELS[currentUser?.role || 'cashier']}</p>
          </div>
        </div>
        
        <div className="h-6 md:h-8 w-px bg-white/5 hidden md:block" />
        
        <div className="flex items-center gap-2 text-slate-400 hidden md:flex">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-xs font-mono">{formatDateTime(time)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="bg-[#f59e0b]/10 px-3 py-1.5 md:px-4 md:py-2 rounded-xl border border-[#f59e0b]/20">
          <span className="text-[#f59e0b] text-[10px] md:text-sm font-bold whitespace-nowrap">المناوبة الصباحية</span>
        </div>
      </div>
    </header>
  );
}
