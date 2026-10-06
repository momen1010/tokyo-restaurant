import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import CheckoutPage from '@/features/checkout/CheckoutPage.jsx'
import CustomerLayout from './layouts/CustomerLayout.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'

import HomePage from '@/features/home/HomePage.jsx'
import MenuPage from '@/features/menu/MenuPage.jsx'

import LoginPage from '@/features/auth/LoginPage.jsx'
import AccountPage from '@/features/auth/AccountPage.jsx'
import { RequireAuth, RequireAdmin } from '@/features/auth/guards.jsx'

import AdminLoginPage from '@/features/admin/auth/AdminLoginPage.jsx'

import NotFound from '@/shared/ui/NotFound.jsx'

const AdminDashboard = lazy(
  () => import('@/features/admin/dashboard/AdminDashboard.jsx')
)

const DesignSystemPage = lazy(
  () => import('@/features/design/DesignSystemPage.jsx')
)

const wait = (element) => (
  <Suspense fallback={<p className="p-8 text-center">...</p>}>
    {element}
  </Suspense>
)

export const router = createBrowserRouter(
  [
    {
      element: <CustomerLayout />,
      children: [
        {
          path: '/',
          element: <HomePage />,
        },

        {
          path: '/menu',
          element: <MenuPage />,
        },

        {
          path: '/checkout',
          element: <CheckoutPage />,
        },

        {
          path: '/login',
          element: <LoginPage />,
        },

        {
          path: '/account',
          element: (
            <RequireAuth>
              <AccountPage />
            </RequireAuth>
          ),
        },

        ...(import.meta.env.DEV
          ? [
              {
                path: '/design',
                element: wait(<DesignSystemPage />),
              },
            ]
          : []),

        {
          path: '*',
          element: <NotFound />,
        },
      ],
    },

    {
      path: '/admin/login',
      element: <AdminLoginPage />,
    },

    {
      path: '/admin',
      element: (
        <RequireAdmin>
          <AdminLayout />
        </RequireAdmin>
      ),
      children: [
        {
          index: true,
          element: wait(<AdminDashboard />),
        },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
    },
  }
)