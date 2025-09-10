import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import { api } from './services/api'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import AdminProductsPage from './pages/admin/AdminProductsPage'
import AdminOrdersPage from './pages/admin/AdminOrdersPage'
import ProfilePage from './pages/ProfilePage'
import OrdersPage from './pages/OrdersPage'
import AccountSettingsPage from './pages/AccountSettingsPage'

function Layout({ children }) {
  const isLoggedIn = !!localStorage.getItem('token')
  const isAdmin = api.isAdmin()
  const [elevated, setElevated] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  function handleLogout() {
    api.logout()
    window.location.href = '/'
  }

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 0)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

    // Close mobile menu when route changes
    useEffect(() => {
      setMobileMenuOpen(false)
    }, [location])

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col'>
      <header className={`bg-white transition-all duration-300 sticky top-0 shadow-sm z-50 ${elevated ? 'shadow-md' : ''}`}>
        <div className='container mx-auto px-4 py-3 flex items-center justify-between'>
          <Link to='/products' className='text-2xl font-bold text-teal-600 flex items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            SK Mart
          </Link>
          
          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center gap-6'>
            <Link className={`nav-link ${location.pathname === '/products' ? 'text-teal-600 bg-teal-100 p-3 rounded-lg font-medium' : 'text-gray-600 hover:text-teal-500 hover:scale-110 transition-all duration-300'}`} to='/products'>Products</Link>
            {isLoggedIn && <Link className={`nav-link ${location.pathname === '/cart' ? 'text-teal-600 bg-teal-100 p-3 rounded-lg font-medium' : 'text-gray-600 hover:text-teal-500 hover:scale-110 transition-all duration-300'}`} to='/cart'>Cart</Link>}
            {isAdmin && (
              <>
                <Link className={`nav-link ${location.pathname === '/admin/products' ? 'text-teal-600 bg-teal-100 p-3 rounded-lg font-medium' : 'text-gray-600 hover:text-teal-500 hover:scale-110 transition-all duration-300'}`} to='/admin/products'>Admin Products</Link>
                <Link className={`nav-link ${location.pathname === '/admin/orders' ? 'text-teal-600 bg-teal-100 p-3 rounded-lg font-medium' : 'text-gray-600 hover:text-teal-500 hover:scale-110 transition-all duration-300'}`} to='/admin/orders'>Admin Orders</Link>
                <Link className={`nav-link ${location.pathname === '/profile' ? 'text-teal-600 font-medium bg-teal-100 p-3 rounded-lg' : 'text-gray-600 hover:text-teal-500 hover:scale-110 transition-all duration-300'}`} to='/profile'>Profile</Link>
              </>
            )}
            {!isAdmin && isLoggedIn && (
              <Link className={`nav-link ${location.pathname === '/profile' ? 'text-teal-600 font-medium bg-teal-100 p-3 rounded-lg' : 'text-gray-600 hover:text-teal-500 hover:scale-110 transition-all duration-300'}`} to='/profile'>Profile</Link>
            )}
            {isLoggedIn ? (
              <button className='bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium hover:bg-red-200 transition-colors' onClick={handleLogout}>Logout</button>
            ) : (
              <div className='flex gap-2'>
                <Link className='text-gray-600 px-3 py-1 rounded-lg hover:text-teal-500 transition-colors' to='/login'>Login</Link>
                <Link className='bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors' to='/signup'>Sign Up</Link>
              </div>
            )}
          </nav>
          
          {/* Mobile menu button */}
          <button 
            className='md:hidden p-2 rounded-md text-gray-600'
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className='md:hidden bg-white border-t py-4 px-4'>
            <div className='flex flex-col space-y-3'>
              <Link className={`py-2 px-4 rounded-lg ${location.pathname === '/products' ? 'bg-indigo-100 text-indigo-600 font-medium' : 'text-gray-600'}`} to='/products'>Products</Link>
              {isLoggedIn && <Link className={`py-2 px-4 rounded-lg ${location.pathname === '/cart' ? 'bg-indigo-100 text-indigo-600 font-medium' : 'text-gray-600'}`} to='/cart'>Cart</Link>}
              {isAdmin && (
                <>
                  <Link className={`py-2 px-4 rounded-lg ${location.pathname === '/admin/products' ? 'bg-indigo-100 text-indigo-600 font-medium' : 'text-gray-600'}`} to='/admin/products'>Admin Products</Link>
                  <Link className={`py-2 px-4 rounded-lg ${location.pathname === '/admin/orders' ? 'bg-indigo-100 text-indigo-600 font-medium' : 'text-gray-600'}`} to='/admin/orders'>Admin Orders</Link>
                </>
              )}
              {!isAdmin && isLoggedIn && (
                <Link className={`py-2 px-4 rounded-lg ${location.pathname === '/profile' ? 'bg-indigo-100 text-indigo-600 font-medium' : 'text-gray-600'}`} to='/profile'>Profile</Link>
              )}
              {isLoggedIn ? (
                <button className='text-left py-2 px-4 rounded-lg text-gray-600' onClick={handleLogout}>Logout</button>
              ) : (
                <>
                  <Link className='py-2 px-4 rounded-lg text-gray-600' to='/login'>Login</Link>
                  <Link className='bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium' to='/signup'>Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
      
      <main className='flex-1 container mx-auto px-4 py-8'>
        {children}
      </main>
      
      <footer className='bg-teal-800 text-white py-12'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div>
              <h3 className='text-xl font-bold mb-4'>SK Mart</h3>
              <p className='text-gray-300'>Your one-stop shop for all your needs. Quality products at affordable prices.</p>
            </div>
            <div>
              <h4 className='text-lg font-semibold mb-4'>Quick Links</h4>
              <ul className='space-y-2'>
                <li><Link to='/products' className='text-gray-300 hover:text-white'>Products</Link></li>
                {isLoggedIn && <li><Link to='/cart' className='text-gray-300 hover:text-white'>Cart</Link></li>}
                <li><Link to='/login' className='text-gray-300 hover:text-white'>Account</Link></li>
              </ul>
            </div>
            <div>
              <h4 className='text-lg font-semibold mb-4'>Contact Us</h4>
              <address className='text-gray-300 not-italic'>
                <p>123 Shopping Street</p>
                <p>Retail City, RC 10001</p>
                <p className='mt-2'>Email: info@skmart.com</p>
                <p>Phone: (555) 123-4567</p>
              </address>
            </div>
          </div>
          <div className='border-t border-gray-700 mt-8 pt-8 text-center text-gray-400'>
            <p>&copy; {new Date().getFullYear()} SK Mart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to='/login' replace />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/*' element={
          <Layout>
            <Routes>
              <Route path='/products' element={<ProductsPage />} />
              <Route path='/products/:id' element={<ProductDetailPage />} />
              <Route path='/cart' element={<CartPage />} />
              <Route path='/checkout' element={<CheckoutPage />} />
              <Route path='/order-confirmation/:id' element={<OrderConfirmationPage />} />
              <Route path='/admin/products' element={<AdminProductsPage />} />
              <Route path='/admin/orders' element={<AdminOrdersPage />} />
              <Route path='/profile' element={<ProfilePage />} />
              <Route path='/orders' element={<OrdersPage />} />
              <Route path='/settings' element={<AccountSettingsPage />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
  