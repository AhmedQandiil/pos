import { create } from 'zustand';
import { User } from '../types';
import { storage } from '../lib/localStorage';
import { MOCK_USERS } from '../lib/mockData';

/**
 * Permissions map defining which roles can perform specific actions
 */
const PERMISSIONS = {
  cancelOrder: ['admin', 'manager'],
  manageUsers: ['admin'],
  editPrices: ['admin', 'manager'],
  viewDashboard: ['admin', 'manager'],
  viewOwnOrders: ['cashier', 'admin', 'manager'],
  viewKitchen: ['kitchen', 'admin', 'manager', 'cashier'], // Kitchen role definitely needs this, others can too
} as const;

type Action = keyof typeof PERMISSIONS;

interface AuthState {
  currentUser: User | null;
  users: User[];
  
  /**
   * Authenticates a user with ID and PIN
   * @param userId User ID
   * @param pin 4-digit PIN
   * @returns boolean indicating success
   */
  login: (userId: string, pin: string) => boolean;
  
  /**
   * Logs out the current user and clears storage
   */
  logout: () => void;
  
  /**
   * Checks if the current user has permission for an action
   * @param action Action to check
   * @returns boolean indicating permission
   */
  hasPermission: (action: Action) => boolean;
  
  /**
   * Adds a new user
   * @param user User data
   */
  addUser: (user: User) => void;
  
  /**
   * Updates an existing user
   * @param user Updated user data
   */
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: storage.get<User | null>('pos_current_user', null),
  users: storage.get<User[]>('pos_users', MOCK_USERS),

  login: (userId: string, pin: string) => {
    // ✅ LOGIC FIX: Validates PIN and isActive status
    const user = get().users.find((u) => u.id === userId && u.pin === pin && u.isActive);
    if (user) {
      const updatedUser = { ...user, lastLogin: new Date() };
      set({ currentUser: updatedUser });
      storage.set('pos_current_user', updatedUser); // ✅ LOGIC FIX: Saves to localStorage
      return true;
    }
    return false;
  },

  logout: () => {
    // ✅ LOGIC FIX: Clears currentUser and storage
    set({ currentUser: null });
    storage.remove('pos_current_user');
  },

  hasPermission: (action: Action) => {
    // ✅ LOGIC FIX: Checks role permissions against PERMISSIONS map
    const user = get().currentUser;
    if (!user) return false;
    
    const allowedRoles = PERMISSIONS[action];
    return (allowedRoles as readonly string[]).includes(user.role);
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
