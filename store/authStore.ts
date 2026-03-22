import { create } from 'zustand';
import { User } from '../types';
import { storage } from '../lib/localStorage';
import { MOCK_USERS } from '../lib/mockData';

interface AuthState {
  currentUser: User | null;
  users: User[];
  login: (pin: string) => boolean;
  logout: () => void;
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: storage.get<User | null>('pos_current_user', null),
  users: storage.get<User[]>('pos_users', MOCK_USERS),

  login: (pin) => {
    const user = get().users.find((u) => u.pin === pin && u.isActive);
    if (user) {
      const updatedUser = { ...user, lastLogin: new Date().toISOString() };
      set({ currentUser: updatedUser });
      storage.set('pos_current_user', updatedUser);
      return true;
    }
    return false;
  },

  logout: () => {
    set({ currentUser: null });
    storage.remove('pos_current_user');
  },

  addUser: (user) => {
    set((state) => {
      const newUsers = [...state.users, user];
      storage.set('pos_users', newUsers);
      return { users: newUsers };
    });
  },

  updateUser: (user) => {
    set((state) => {
      const newUsers = state.users.map((u) => (u.id === user.id ? user : u));
      storage.set('pos_users', newUsers);
      return { users: newUsers };
    });
  },
}));
