'use client';

import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { USER_ROLE_LABELS } from '../../lib/constants';
import { X, Shield, Lock, User as UserIcon } from 'lucide-react';

interface UserFormProps {
  user: User | null;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function UserForm({ user, onClose, onSubmit }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    pin: user?.pin || '',
    role: user?.role || 'cashier' as UserRole,
    isActive: user?.isActive ?? true,
  });

  return (
    <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center md:p-4 backdrop-blur-md">
      <div className="bg-[#1a1d26] w-full h-full md:h-auto md:max-w-md md:rounded-3xl overflow-hidden border border-white/5 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center shrink-0 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#f59e0b]/20 rounded-xl flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-[#f59e0b]" />
            </div>
            <h2 className="text-xl font-black">{user ? 'تعديل مستخدم' : 'إضافة مستخدم جديد'}</h2>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-2xl transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content */}
        <form 
          onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} 
          className="p-6 space-y-8 overflow-y-auto flex-1"
        >
          <div className="space-y-6">
            {/* Name Input */}
            <div className="space-y-3">
              <label className="text-sm text-slate-400 font-black uppercase tracking-wider flex items-center gap-2">
                <UserIcon className="w-4 h-4" />
                الاسم الكامل *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="أدخل اسم الموظف..."
                className="w-full bg-[#0f1117] border-2 border-white/5 rounded-2xl p-4 md:p-3 focus:outline-none focus:border-[#f59e0b] text-xl md:text-lg font-bold transition-all"
                required
              />
            </div>

            {/* PIN Input */}
            <div className="space-y-3">
              <label className="text-sm text-slate-400 font-black uppercase tracking-wider flex items-center gap-2">
                <Lock className="w-4 h-4" />
                رمز PIN (4 أرقام) *
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                value={formData.pin}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  setFormData({ ...formData, pin: val });
                }}
                placeholder="0000"
                className="w-full bg-[#0f1117] border-2 border-white/5 rounded-2xl p-4 md:p-3 focus:outline-none focus:border-[#f59e0b] font-space-mono text-3xl md:text-2xl tracking-[0.5em] text-center font-black transition-all"
                required
              />
              <p className="text-xs text-slate-500 font-bold">يستخدم هذا الرمز لتسجيل الدخول السريع</p>
            </div>

            {/* Role Selection */}
            <div className="space-y-3">
              <label className="text-sm text-slate-400 font-black uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4" />
                الدور / الصلاحية *
              </label>
              <div className="grid grid-cols-1 gap-3">
                {Object.entries(USER_ROLE_LABELS).map(([val, label]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: val as UserRole })}
                    className={`p-4 rounded-2xl border-2 text-right transition-all flex items-center justify-between ${
                      formData.role === val 
                        ? 'bg-[#f59e0b]/10 border-[#f59e0b] text-[#f59e0b]' 
                        : 'bg-[#0f1117] border-white/5 text-slate-400 hover:border-white/10'
                    }`}
                  >
                    <span className="text-lg font-black">{label}</span>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      formData.role === val ? 'border-[#f59e0b]' : 'border-slate-700'
                    }`}>
                      {formData.role === val && <div className="w-3 h-3 bg-[#f59e0b] rounded-full" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center justify-between p-4 bg-[#0f1117] rounded-2xl border-2 border-white/5">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${formData.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="font-black text-lg">حساب نشط</span>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                className={`w-14 h-8 rounded-full transition-all relative ${formData.isActive ? 'bg-emerald-500' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${formData.isActive ? 'right-7' : 'right-1'}`} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 flex flex-col md:flex-row gap-4 shrink-0">
            <button
              type="submit"
              className="flex-1 bg-[#f59e0b] hover:bg-[#d97706] text-black font-black py-5 md:py-4 rounded-2xl transition-all text-xl md:text-lg shadow-lg shadow-amber-500/20"
            >
              حفظ بيانات المستخدم
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 font-black py-5 md:py-4 rounded-2xl transition-all border-2 border-white/5 text-xl md:text-lg"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
