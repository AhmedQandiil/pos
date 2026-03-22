/**
 * Utility for interacting with localStorage with error handling and date re-hydration
 */
export const storage = {
  /**
   * Saves data to localStorage
   * @param key Storage key
   * @param data Data to save
   */
  set: <T>(key: string, data: T): void => {
    if (typeof window === 'undefined') return; // ✅ BUG FIX: SSR check
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving to storage: ${key}`, error); // ✅ BUG FIX: Error handling
    }
  },

  /**
   * Loads data from localStorage with date re-hydration
   * @param key Storage key
   * @param defaultValue Default value if key not found
   */
  get: <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue; // ✅ BUG FIX: SSR check
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;

      // ✅ BUG FIX: Date re-hydration logic
      return JSON.parse(item, (key, value) => {
        const isDateString = typeof value === 'string' && 
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value);
        return isDateString ? new Date(value) : value;
      });
    } catch (error) {
      console.error(`Error loading from storage: ${key}`, error); // ✅ BUG FIX: Error handling
      return defaultValue;
    }
  },

  /**
   * Removes an item from localStorage
   * @param key Storage key
   */
  remove: (key: string): void => {
    if (typeof window === 'undefined') return; // ✅ BUG FIX: SSR check
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from storage: ${key}`, error); // ✅ BUG FIX: Error handling
    }
  },

  /**
   * Clears all storage for this app
   */
  clear: (): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing storage', error);
    }
  }
};

// ✅ BUG FIX: Export helper functions as requested
export const saveToStorage = storage.set;
export const loadFromStorage = storage.get;
export const clearStorage = storage.remove;
