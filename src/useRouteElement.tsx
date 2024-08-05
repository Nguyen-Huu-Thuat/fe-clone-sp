import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import Register from './pages/Register'
import ProductList from './pages/ProductList'
// import Login from './pages/Login'
import RegisterLayout from './layouts/RegisterLayout'
import MainLayout from './layouts/MainLayout/MainLayout'
import { lazy, Suspense, useContext } from 'react'
import { AppContext } from './contexts/app.context'
import { path } from './constants/path'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import CartLayout from './layouts/CartLayout'
import UserLayout from './pages/User/layouts/UserLayout'
import ChangPassword from './pages/User/pages/ChangPassword'
import HistoryPurchase from './pages/User/pages/HistoryPurchase'
import Profile from './pages/User/pages/Profile'
import PageNotFound from './pages/PageNotFound'

const Login = lazy(() => import('./pages/Login'))

function ProtectedRoutes() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

function RejectedRoutes() {
  const { isAuthenticated } = useContext(AppContext)

  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

export default function useRouteElement() {
  const routeElement = useRoutes([
    {
      path: '/',
      element: (
        <MainLayout>
          <ProductList />
        </MainLayout>
      )
    },
    {
      path: path.productDetail,
      element: (
        <MainLayout>
          <ProductDetail />
        </MainLayout>
      )
    },
    {
      path: '',
      element: <ProtectedRoutes />,
      children: [
        {
          path: path.cart,
          element: (
            <CartLayout>
              <Cart />
            </CartLayout>
          )
        },
        {
          path: path.user,
          element: (
            <MainLayout>
              <UserLayout />
            </MainLayout>
          ),
          children: [
            {
              path: path.profile,
              element: <Profile />
            },
            {
              path: path.changPassword,
              element: <ChangPassword />
            },
            {
              path: path.historyPurchase,
              element: <HistoryPurchase />
            }
          ]
        }
      ]
    },
    {
      path: '',
      element: <RejectedRoutes />,
      children: [
        {
          path: path.register,
          element: (
            <RegisterLayout>
              <Register />
            </RegisterLayout>
          )
        },
        {
          path: path.login,
          element: (
            <RegisterLayout>
              <Suspense>
                <Login />
              </Suspense>
            </RegisterLayout>
          )
        }
      ]
    },
    {
      path: '*',
      element: (
        <MainLayout>
          <PageNotFound />
        </MainLayout>
      )
    }
  ])
  return routeElement
}
