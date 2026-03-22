'use client';

import React, { useState } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { useAuthStore } from '../../store/authStore';
import { Save, Building2, Phone, MapPin, Truck, Coins, Percent } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Navigate } from 'react-router-dom';

export default function SettingsPage() {
  const { settings, updateSettings } = useSettingsStore();
  const { currentUser } = useAuthStore();
  
  const [formData, setFormData] = useState(settings);

  if (currentUser?.role !== 'admin') {
    return <Navigate to="/cashier" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    toast.success('تم حفظ الإعدادات بنجاح');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">إعدادات النظام</h1>
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-[#f59e0b]/20"
        >
          <Save className="w-5 h-5" />
          <span>حفظ التغييرات</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Restaurant Info */}
        <div className="bg-[#1a1d26] border border-white/5 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3 text-[#f59e0b] mb-2">
            <Building2 className="w-5 h-5" />
            <h2 className="text-xl font-bold">بيانات المطعم</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">اسم المطعم</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.restaurantName}
                  onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                  className="w-full bg-[#0f1117] border border-white/5 rounded-xl py-3 px-4 focus:outline-none focus:border-[#f59e0b]/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">رقم الهاتف (يظهر في الفاتورة)</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full bg-[#0f1117] border border-white/5 rounded-xl py-3 px-4 pl-12 focus:outline-none focus:border-[#f59e0b]/50 transition-all text-left"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">العنوان</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3 w-4 h-4 text-slate-500" />
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-[#0f1117] border border-white/5 rounded-xl py-3 px-4 pl-12 focus:outline-none focus:border-[#f59e0b]/50 transition-all resize-none h-24"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Financial Settings */}
        <div className="bg-[#1a1d26] border border-white/5 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3 text-[#f59e0b] mb-2">
            <Coins className="w-5 h-5" />
            <h2 className="text-xl font-bold">الإعدادات المالية</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">رسوم التوصيل الافتراضية</label>
              <div className="relative">
                <Truck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="number"
                  value={formData.defaultDeliveryFees}
                  onChange={(e) => setFormData({ ...formData, defaultDeliveryFees: Number(e.target.value) })}
                  className="w-full bg-[#0f1117] border border-white/5 rounded-xl py-3 px-4 pl-12 focus:outline-none focus:border-[#f59e0b]/50 transition-all font-space-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">العملة</label>
              <input
                type="text"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full bg-[#0f1117] border border-white/5 rounded-xl py-3 px-4 focus:outline-none focus:border-[#f59e0b]/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">نسبة الضريبة (%)</label>
              <div className="relative">
                <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="number"
                  value={formData.taxRate}
                  onChange={(e) => setFormData({ ...formData, taxRate: Number(e.target.value) })}
                  className="w-full bg-[#0f1117] border border-white/5 rounded-xl py-3 px-4 pl-12 focus:outline-none focus:border-[#f59e0b]/50 transition-all font-space-mono"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
