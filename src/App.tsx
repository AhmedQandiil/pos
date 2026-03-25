/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
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

function RootRedirect() {
  const { currentUser } = useAuthStore();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role === 'kitchen') return <Navigate to="/kitchen" replace />;
  if (currentUser.role === 'cashier') return <Navigate to="/cashier" replace />;
  return <Navigate to="/dashboard" replace />;
}

function RoleGuard({ children, roles }: { children: React.ReactNode, roles: string[] }) {
  const { currentUser } = useAuthStore();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (!roles.includes(currentUser.role)) {
    return <RootRedirect />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={
          <AuthWrapper>
            <Layout>
              <Routes>
                <Route path="/" element={<RootRedirect />} />
                <Route path="/cashier" element={
                  <RoleGuard roles={['admin', 'manager', 'cashier']}>
                    <CashierPage />
                  </RoleGuard>
                } />
                <Route path="/dashboard" element={
                  <RoleGuard roles={['admin', 'manager']}>
                    <DashboardPage />
                  </RoleGuard>
                } />
                <Route path="/products" element={
                  <RoleGuard roles={['admin', 'manager']}>
                    <ProductsPage />
                  </RoleGuard>
                } />
                <Route path="/expenses" element={
                  <RoleGuard roles={['admin', 'manager']}>
                    <ExpensesPage />
                  </RoleGuard>
                } />
                <Route path="/orders" element={
                  <RoleGuard roles={['admin', 'manager', 'cashier']}>
                    <OrdersPage />
                  </RoleGuard>
                } />
                <Route path="/kitchen" element={
                  <RoleGuard roles={['admin', 'manager', 'cashier', 'kitchen']}>
                    <KitchenPage />
                  </RoleGuard>
                } />
                <Route path="/users" element={
                  <RoleGuard roles={['admin']}>
                    <UsersPage />
                  </RoleGuard>
                } />
                <Route path="/settings" element={
                  <RoleGuard roles={['admin']}>
                    <SettingsPage />
                  </RoleGuard>
                } />
              </Routes>
            </Layout>
          </AuthWrapper>
        } />
      </Routes>
    </BrowserRouter>
  );
}
