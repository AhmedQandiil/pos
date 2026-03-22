import { create } from 'zustand';
import { Product, Category } from '../types';
import { storage } from '../lib/localStorage';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../lib/mockData';

interface ProductsState {
  products: Product[];
  categories: Category[];
  
  /**
   * Adds a new product and persists it
   * @param product Product data
   */
  addProduct: (product: Product) => void;
  
  /**
   * Updates an existing product
   * @param product Updated product data
   */
  updateProduct: (product: Product) => void;
  
  /**
   * Deletes a product
   * @param productId ID of the product to delete
   */
  deleteProduct: (productId: string) => void;
  
  /**
   * Adds a new category
   * @param category Category data
   */
  addCategory: (category: Category) => void;
}

export const useProductsStore = create<ProductsState>((set) => ({
  products: storage.get<Product[]>('pos_products', MOCK_PRODUCTS),
  categories: storage.get<Category[]>('pos_categories', MOCK_CATEGORIES),

  addProduct: (product) => {
    set((state) => {
      const newProducts = [...state.products, product];
      storage.set('pos_products', newProducts);
      return { products: newProducts };
    });
  },

  updateProduct: (product) => {
    set((state) => {
      const newProducts = state.products.map((p) => (p.id === product.id ? product : p));
      storage.set('pos_products', newProducts);
      return { products: newProducts };
    });
  },

  deleteProduct: (productId) => {
    set((state) => {
      const newProducts = state.products.filter((p) => p.id !== productId);
      storage.set('pos_products', newProducts);
      return { products: newProducts };
    });
  },

  addCategory: (category) => {
    set((state) => {
      const newCategories = [...state.categories, category];
      storage.set('pos_categories', newCategories);
      return { categories: newCategories };
    });
  },
}));
