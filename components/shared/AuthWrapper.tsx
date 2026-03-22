'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Lock, User as UserIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { currentUser, login } = useAuthStore();
  const [pin, setPin] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (!currentUser) {
    const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (login(pin)) {
        toast.success('تم تسجيل الدخول بنجاح');
        setPin('');
      } else {
        toast.error('رمز PIN غير صحيح');
      }
    };

    const addDigit = (digit: string) => {
      if (pin.length < 4) setPin(pin + digit);
    };

    const clear = () => setPin('');

    return (
      <div className="fixed inset-0 bg-[#0f1117] z-50 flex items-center justify-center p-4">
        <div className="bg-[#1a1d26] w-full max-w-md rounded-2xl p-8 border border-white/5 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-[#f59e0b]/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="text-[#f59e0b] w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold">تسجيل الدخول</h1>
            <p className="text-slate-400 text-sm mt-2">أدخل رمز PIN الخاص بك للمتابعة</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="flex justify-center gap-4 mb-8">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full border-2 border-[#f59e0b] ${
                    pin.length > i ? 'bg-[#f59e0b]' : 'bg-transparent'
                  }`}
                />
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'OK'].map((btn) => (
                <button
                  key={btn}
                  type={btn === 'OK' ? 'submit' : 'button'}
                  onClick={() => {
                    if (btn === 'C') clear();
                    else if (btn === 'OK') return;
                    else addDigit(btn);
                  }}
                  className={`h-16 rounded-xl text-xl font-bold flex items-center justify-center transition-all active:scale-95 ${
                    btn === 'OK'
                      ? 'bg-[#f59e0b] text-black col-span-1'
                      : btn === 'C'
                      ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                      : 'bg-white/5 hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {btn}
                </button>
              ))}
            </div>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
