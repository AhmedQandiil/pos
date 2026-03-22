'use client';

import React, { useState, useMemo } from 'react';
import { useProductsStore } from '../../store/productsStore';
import ProductTable from '../../components/products/ProductTable';
import ProductForm from '../../components/products/ProductForm';
import CategoryModal from '../../components/products/CategoryModal';
import CategoryFilter from '../../components/products/CategoryFilter';
import { Plus, Search, FolderPlus } from 'lucide-react';
import { Product } from '../../types';

export default function ProductsPage() {
  const { products, categories } = useProductsStore();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                           p.nameEn?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory ? p.categoryId === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4"> {/* ✅ RESPONSIVE FIX */}
        <h1 className="text-2xl md:text-3xl font-bold">إدارة المنتجات</h1> {/* ✅ RESPONSIVE FIX */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto"> {/* ✅ RESPONSIVE FIX */}
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-bold py-3 px-6 rounded-xl transition-all border border-white/5 min-h-[48px]" // ✅ RESPONSIVE FIX
          >
            <FolderPlus className="w-5 h-5" />
            <span>إضافة تصنيف</span>
          </button>
          <button
            onClick={handleAdd}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold py-3 px-6 rounded-xl transition-all min-h-[48px]" // ✅ RESPONSIVE FIX
          >
            <Plus className="w-5 h-5" />
            <span>إضافة منتج جديد</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4"> {/* ✅ RESPONSIVE FIX */}
        <div className="relative flex-1 w-full"> {/* ✅ RESPONSIVE FIX */}
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="ابحث عن منتج..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1a1d26] border border-white/5 rounded-xl py-4 pr-12 pl-4 focus:outline-none focus:border-[#f59e0b]/50 transition-all min-h-[48px] text-lg" // ✅ RESPONSIVE FIX
          />
        </div>
        <div className="w-full md:w-auto"> {/* ✅ RESPONSIVE FIX */}
          <CategoryFilter 
            categories={categories} 
            selected={selectedCategory} 
            onChange={setSelectedCategory} 
          />
        </div>
      </div>

      <ProductTable products={filteredProducts} onEdit={handleEdit} />

      {isFormOpen && (
        <ProductForm 
          product={editingProduct} 
          onClose={() => setIsFormOpen(false)} 
        />
      )}

      {isCategoryModalOpen && (
        <CategoryModal 
          onClose={() => setIsCategoryModalOpen(false)} 
        />
      )}
    </div>
  );
}
