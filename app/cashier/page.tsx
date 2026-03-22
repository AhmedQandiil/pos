'use client';

import React, { useState } from 'react';
import ProductGrid from '../../components/cashier/ProductGrid';
import OrderCart from '../../components/cashier/OrderCart';

export default function CashierPage() {
  return (
    <div className="flex h-full gap-6 overflow-hidden">
      {/* Left Panel: Products */}
      <div className="flex-1 flex flex-col min-w-0">
        <ProductGrid />
      </div>

      {/* Right Panel: Cart */}
      <div className="w-[400px] shrink-0 flex flex-col">
        <OrderCart />
      </div>
    </div>
  );
}
