import { create } from 'zustand';

interface UIState {
  isSidebarCollapsed: boolean;
  isSidebarOpen: boolean;
  toggleSidebarCollapse: () => void;
  toggleSidebarOpen: () => void;
  closeSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarCollapsed: false,
  isSidebarOpen: false,
  toggleSidebarCollapse: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  toggleSidebarOpen: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  closeSidebar: () => set({ isSidebarOpen: false }),
}));
