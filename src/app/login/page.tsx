'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { User } from '../../types';
import { USER_ROLE_LABELS } from '../../lib/constants';
import { Lock, User as UserIcon, ArrowLeft, Delete, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function LoginPage() {
  const { users, login, currentUser } = useAuthStore();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'cashier') navigate('/cashier');
      else if (currentUser.role === 'kitchen') navigate('/kitchen');
      else navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleLogin = () => {
    if (!selectedUser) return;
    
    if (login(selectedUser.id, pin)) {
      toast.success(`مرحباً ${selectedUser.name}`);
    } else {
      setError(true);
      setPin('');
      toast.error('رمز PIN غير صحيح');
      setTimeout(() => setError(false), 500);
    }
  };

  const addDigit = (digit: string) => {
    if (pin.length < 4) setPin(pin + digit);
  };

  const backspace = () => setPin(pin.slice(0, -1));
  const clear = () => setPin('');

  useEffect(() => {
    if (pin.length === 4) {
      handleLogin();
    }
  }, [pin]);

  return (
    <div className="fixed inset-0 bg-[#0f1117] flex items-center justify-center p-4 md:p-8 font-cairo">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Branding & User Selector */}
        <div className="space-y-8">
          <div className="text-center lg:text-right space-y-4">
            <div className="w-20 h-20 bg-[#f59e0b] text-black rounded-3xl flex items-center justify-center mx-auto lg:mx-0 shadow-xl shadow-amber-500/20">
              <Lock className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-black tracking-tight">نظام إدارة المبيعات</h1>
            <p className="text-slate-500 text-lg font-bold">الرجاء اختيار المستخدم للمتابعة</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {users.filter(u => u.isActive).map((user) => (
              <button
                key={user.id}
                onClick={() => {
                  setSelectedUser(user);
                  setPin('');
                }}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 active:scale-95 ${
                  selectedUser?.id === user.id 
                    ? 'bg-[#f59e0b]/10 border-[#f59e0b] text-[#f59e0b]' 
                    : 'bg-[#1a1d26] border-white/5 text-slate-400 hover:border-white/10'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  selectedUser?.id === user.id ? 'bg-[#f59e0b] text-black' : 'bg-white/5'
                }`}>
                  <UserIcon className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="font-black text-sm truncate w-full">{user.name}</p>
                  <p className="text-[10px] font-bold opacity-60 uppercase">{USER_ROLE_LABELS[user.role]}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* PIN Pad */}
        <AnimatePresence mode="wait">
          {selectedUser && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-[#1a1d26] rounded-[2.5rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-[#f59e0b]/20" />
              
              <div className="flex flex-col items-center mb-8">
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-xl text-slate-500"
                >
                  <X className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-black mb-6">أدخل رمز PIN لـ {selectedUser.name}</h2>
                
                {/* PIN Display */}
                <motion.div 
                  animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
                  className="flex gap-4 mb-2"
                >
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                        pin.length > i 
                          ? 'bg-[#f59e0b] border-[#f59e0b] scale-110 shadow-[0_0_15px_rgba(245,158,11,0.5)]' 
                          : 'bg-transparent border-slate-700'
                      }`}
                    />
                  ))}
                </motion.div>
              </div>

              {/* Keypad */}
              <div className="grid grid-cols-3 gap-4">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'back'].map((btn) => (
                  <button
                    key={btn}
                    type="button"
                    onClick={() => {
                      if (btn === 'C') clear();
                      else if (btn === 'back') backspace();
                      else addDigit(btn);
                    }}
                    className={`h-20 rounded-2xl text-3xl font-black flex items-center justify-center transition-all active:scale-90 ${
                      btn === 'C'
                        ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                        : btn === 'back'
                        ? 'bg-slate-800 text-slate-400'
                        : 'bg-white/5 hover:bg-white/10 border border-white/5 text-white'
                    }`}
                  >
                    {btn === 'back' ? <ArrowLeft className="w-8 h-8" /> : btn}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!selectedUser && (
          <div className="hidden lg:flex h-full items-center justify-center border-2 border-dashed border-white/5 rounded-[2.5rem]">
            <div className="text-center space-y-4 opacity-20">
              <UserIcon className="w-20 h-20 mx-auto" />
              <p className="text-xl font-black">اختر مستخدماً للبدء</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
