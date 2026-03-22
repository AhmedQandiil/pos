/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/shared/Layout';
import AuthWrapper from './components/shared/AuthWrapper';
import LoginPage from './app/login/page';
import CashierPage from './app/cashier/page';
import DashboardPage from './app/dashboard/page';
import ProductsPage from './app/products/page';
import ExpensesPage from './app/expenses/page';
import OrdersPage from './app/orders/page';
import KitchenPage from './app/kitchen/page';
import UsersPage from './app/users/page';
import SettingsPage from './app/settings/page';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={
          <AuthWrapper>
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="/cashier" replace />} />
                <Route path="/cashier" element={<CashierPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/expenses" element={<ExpensesPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/kitchen" element={<KitchenPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </Layout>
          </AuthWrapper>
        } />
      </Routes>
    </BrowserRouter>
  );
}
