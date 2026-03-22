'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Receipt, 
  ChefHat, 
  Users, 
  Wallet,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { APP_NAME } from '../../lib/constants';
import { cn } from '../../lib/utils';

const menuItems = [
  { name: 'الكاشير', icon: ShoppingCart, path: '/cashier', roles: ['admin', 'manager', 'cashier'] },
  { name: 'لوحة التحكم', icon: LayoutDashboard, path: '/dashboard', roles: ['admin', 'manager'] },
  { name: 'المطبخ', icon: ChefHat, path: '/kitchen', roles: ['admin', 'manager', 'cashier'] },
  { name: 'المنتجات', icon: Package, path: '/products', roles: ['admin', 'manager'] },
  { name: 'المصاريف', icon: Wallet, path: '/expenses', roles: ['admin', 'manager'] },
  { name: 'سجل الطلبات', icon: Receipt, path: '/orders', roles: ['admin', 'manager', 'cashier'] },
  { name: 'المستخدمين', icon: Users, path: '/users', roles: ['admin'] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { currentUser, logout } = useAuthStore();

  const filteredMenu = menuItems.filter(item => 
    currentUser && item.roles.includes(currentUser.role)
  );

  return (
    <aside className="w-64 bg-[#1a1d26] border-l border-white/5 flex flex-col h-full shrink-0">
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#f59e0b] rounded-xl flex items-center justify-center">
            <ChefHat className="text-black w-6 h-6" />
          </div>
          <h1 className="font-bold text-lg leading-tight">{APP_NAME}</h1>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {filteredMenu.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                isActive 
                  ? "bg-[#f59e0b] text-black font-bold" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-black" : "group-hover:text-[#f59e0b]")} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
