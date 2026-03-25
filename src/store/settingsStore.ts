import { create } from 'zustand';
import { Settings } from '../types';
import { storage } from '../lib/localStorage';

interface SettingsState {
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
}

const DEFAULT_SETTINGS: Settings = {
  restaurantName: 'مطعم البركة',
  phoneNumber: '0123456789',
  address: 'القاهرة، مصر',
  defaultDeliveryFees: 15,
  currency: 'ج.م',
  taxRate: 0,
  receiptFooter: 'شكراً لزيارتكم! نتمنى رؤيتكم قريباً.',
  qrCodeContent: 'https://albaraka-restaurant.com',
};

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: storage.get<Settings>('pos_settings', DEFAULT_SETTINGS),

  updateSettings: (newSettings) => {
    set((state) => {
      const updated = { ...state.settings, ...newSettings };
      storage.set('pos_settings', updated);
      return { settings: updated };
    });
  },
}));
