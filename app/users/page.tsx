'use client';

import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { User, UserRole } from '../../types';
import { USER_ROLE_LABELS } from '../../lib/constants';
import { Plus, User as UserIcon, Shield, Edit2, Trash2, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { generateId } from '../../lib/utils';

export default function UsersPage() {
  const { users, addUser, updateUser, currentUser } = useAuthStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  if (currentUser?.role !== 'admin') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500">
        <Shield className="w-16 h-16 mb-4 opacity-20" />
        <h2 className="text-2xl font-bold">عذراً، هذه الصفحة للمدير فقط</h2>
      </div>
    );
  }

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">إدارة المستخدمين</h1>
        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold py-3 px-6 rounded-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة مستخدم جديد</span>
        </button>
      </div>

      <div className="bg-[#1a1d26] border border-white/5 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="text-slate-400 text-sm border-b border-white/5">
                <th className="p-4 font-bold">المستخدم</th>
                <th className="p-4 font-bold">الدور</th>
                <th className="p-4 font-bold">الحالة</th>
                <th className="p-4 font-bold">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-bold">{user.name}</p>
                        <p className="text-xs text-slate-500 font-mono">PIN: {user.pin}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      user.role === 'admin' ? 'bg-purple-500/10 text-purple-500' :
                      user.role === 'manager' ? 'bg-blue-500/10 text-blue-500' :
                      'bg-slate-500/10 text-slate-400'
                    }`}>
                      {USER_ROLE_LABELS[user.role]}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      user.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {user.isActive ? 'نشط' : 'موقف'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(user)}
                        className="p-2 hover:bg-white/5 rounded-lg text-blue-400 transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <UserForm 
          user={editingUser} 
          onClose={() => setIsFormOpen(false)} 
          onSubmit={(data) => {
            if (editingUser) {
              updateUser({ ...editingUser, ...data });
              toast.success('تم تحديث المستخدم');
            } else {
              addUser({ ...data, id: generateId(), isActive: true });
              toast.success('تم إضافة المستخدم');
            }
            setIsFormOpen(false);
          }}
        />
      )}
    </div>
  );
}

function UserForm({ user, onClose, onSubmit }: { user: User | null, onClose: () => void, onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    pin: user?.pin || '',
    role: user?.role || 'cashier' as UserRole,
    isActive: user?.isActive ?? true,
  });

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-[#1a1d26] w-full max-w-md rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-xl font-bold">{user ? 'تعديل مستخدم' : 'إضافة مستخدم جديد'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-slate-400 font-bold">الاسم *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#0f1117] border border-white/10 rounded-xl p-3 focus:outline-none focus:border-[#f59e0b]"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-400 font-bold">رمز PIN (4 أرقام) *</label>
            <input
              type="text"
              maxLength={4}
              value={formData.pin}
              onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
              className="w-full bg-[#0f1117] border border-white/10 rounded-xl p-3 focus:outline-none focus:border-[#f59e0b] font-space-mono"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-400 font-bold">الدور *</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              className="w-full bg-[#0f1117] border border-white/10 rounded-xl p-3 focus:outline-none focus:border-[#f59e0b]"
              required
            >
              {Object.entries(USER_ROLE_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 py-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-5 h-5 rounded border-white/10 bg-[#0f1117] text-[#f59e0b] focus:ring-[#f59e0b]"
            />
            <label htmlFor="isActive" className="font-bold">حساب نشط</label>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold py-4 rounded-xl transition-all"
            >
              حفظ البيانات
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 font-bold py-4 rounded-xl transition-all border border-white/5"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
