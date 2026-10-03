import { RouterProvider } from 'react-router-dom'
import { router } from './router.jsx'
import { AuthProvider } from '../features/auth/AuthProvider.jsx'
import { MenuProvider } from '../features/menu/MenuProvider.jsx'
import { CartProvider } from '../features/cart/CartProvider.jsx'

export default function App() {
  return (
    <AuthProvider>
      <MenuProvider>
        <CartProvider>
        <RouterProvider router={router} future={{ v7_startTransition: true }} />
        </CartProvider>
      </MenuProvider>
    </AuthProvider>
  )
}
