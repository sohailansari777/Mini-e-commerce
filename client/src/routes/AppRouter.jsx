import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import LoginPage from '../feature/auth/ui/pages/LoginPage';
import Register from '../feature/auth/ui/pages/Register';
import ProductsPage from '../presentation/pages/Products/ProductsPage';
import AddProductPage from '../presentation/pages/AddProduct/AddProductPage';
import EditProductPage from '../presentation/pages/EditProduct/EditProductPage';
import ProfilePage from '../presentation/pages/Profile/ProfilePage';
import ProtectedRoute from '../presentation/components/ProtectedRoute';
import PublicOnlyRoute from '../presentation/components/PublicOnlyRoute';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <PublicOnlyRoute>
        <LoginPage />
      </PublicOnlyRoute>
    )
  },
  {
    path: '/register',
    element: (
      <PublicOnlyRoute>
        <Register />
      </PublicOnlyRoute>
    )
  },
  {
    path: '/products',
    element: <ProductsPage />
  },
  {
    path: '/products/add',
    element: (
      <ProtectedRoute>
        <AddProductPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/products/edit/:id',
    element: (
      <ProtectedRoute>
        <EditProductPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    )
  },
  {
    path: '/',
    element: <Navigate to="/products" replace />
  },
  {
    path: '*',
    element: <Navigate to="/products" replace />
  }
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;