'use client';

import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Receipt, 
  ChefHat, 
  Users, 
  Wallet,
  Settings as SettingsIcon,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Menu,
  MoreHorizontal
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore'; // ✅ RESPONSIVE FIX
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
  { name: 'الإعدادات', icon: SettingsIcon, path: '/settings', roles: ['admin'] },
];

const mobileMenuItems = [
  { name: 'كاشير', icon: ShoppingCart, path: '/cashier' },
  { name: 'داش بورد', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'منتجات', icon: Package, path: '/products' },
  { name: 'مصاريف', icon: Wallet, path: '/expenses' },
  { name: 'المزيد', icon: MoreHorizontal, path: '/settings' },
];

export default function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  const { currentUser, logout } = useAuthStore();
  const { isSidebarCollapsed, toggleSidebarCollapse, isSidebarOpen, closeSidebar } = useUIStore(); // ✅ RESPONSIVE FIX

  const filteredMenu = menuItems.filter(item => 
    currentUser && item.roles.includes(currentUser.role)
  );

  // ✅ RESPONSIVE FIX: Bottom Navigation for Mobile
  const BottomNav = () => (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1a1d26] border-t border-white/5 flex items-center justify-around px-2 py-3 safe-bottom md:hidden z-50">
      {mobileMenuItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center gap-1 transition-all touch-feedback",
              isActive ? "text-[#f59e0b]" : "text-slate-400"
            )}
          >
            <Icon className="w-6 h-6" />
            <span className="text-[10px] font-bold">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* ✅ RESPONSIVE FIX: Mobile Bottom Nav */}
      <BottomNav />

      {/* ✅ RESPONSIVE FIX: Tablet Overlay Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* ✅ RESPONSIVE FIX: Desktop/Tablet Sidebar (Fixed on RIGHT for RTL) */}
      <aside 
        className={cn(
          "fixed top-0 right-0 bottom-0 bg-[#1a1d26] border-l border-white/5 flex flex-col h-full shrink-0 transition-all duration-300 z-50", // ✅ RTL FIX: right-0, border-l
          isSidebarCollapsed ? "w-16" : "w-[220px]", // ✅ RESPONSIVE FIX: 64px vs 220px
          !isSidebarOpen ? "translate-x-full lg:translate-x-0" : "translate-x-0" // ✅ RESPONSIVE FIX: Slide-in for mobile/tablet
        )}
      >
        {/* Header */}
        <div className={cn(
          "p-4 border-b border-white/5 flex items-center transition-all",
          isSidebarCollapsed ? "justify-center" : "justify-between"
        )}>
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-3 transition-all animate-in fade-in slide-in-from-right-2">
              <div className="w-8 h-8 bg-[#f59e0b] rounded-lg flex items-center justify-center shrink-0">
                <ChefHat className="text-black w-5 h-5" />
              </div>
              <h1 className="font-bold text-sm leading-tight whitespace-nowrap">{APP_NAME}</h1>
            </div>
          )}
          
          <button 
            onClick={toggleSidebarCollapse}
            className={cn(
              "p-1.5 hover:bg-white/5 rounded-lg text-slate-400 transition-all",
              isSidebarCollapsed ? "mx-auto" : ""
            )}
            title={isSidebarCollapsed ? "توسيع" : "طي"}
          >
            {isSidebarCollapsed ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto no-scrollbar">
          {filteredMenu.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative",
                  isSidebarCollapsed ? "justify-center" : "justify-start",
                  isActive 
                    ? "bg-[#f59e0b] text-black font-bold" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
                title={isSidebarCollapsed ? item.name : ""}
              >
                <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-black" : "group-hover:text-[#f59e0b]")} />
                {!isSidebarCollapsed && <span className="whitespace-nowrap text-sm animate-in fade-in slide-in-from-right-2">{item.name}</span>}
                
                {/* ✅ RTL FIX: Active indicator on RIGHT side */}
                {isActive && (
                  <div className={cn(
                    "absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-black rounded-l-full",
                    isSidebarCollapsed && "hidden"
                  )} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-2 border-t border-white/5">
          <button
            onClick={logout}
            className={cn(
              "flex items-center gap-3 px-3 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 transition-all",
              isSidebarCollapsed && "justify-center"
            )}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!isSidebarCollapsed && <span className="text-sm">تسجيل الخروج</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
