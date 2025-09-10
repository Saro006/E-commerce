import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api'

export default function CartPage() {
  const [cart, setCart] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function load() {
    try { setCart(await api.getCart()) } catch (e) { setError(e.message) }
  }

  useEffect(() => { load() }, [])

  if (error) return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      Error: {error}
    </div>
  )
  
  if (!cart) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
    </div>
  )

  return (
    <div className='max-w-4xl mx-auto space-y-8'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        <h1 className='text-3xl font-bold text-gray-900'>Your Shopping Cart</h1>
        <Link 
          className='text-teal-600 hover:text-teal-800 font-medium flex items-center gap-2' 
          to='/products'
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          Continue Shopping
        </Link>
      </div>

      {!cart.items.length ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
          <Link 
            to="/products" 
            className="inline-flex items-center justify-center bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
            {/* Desktop table header (hidden on mobile) */}
            <div className='hidden md:grid grid-cols-12 gap-4 bg-gray-50 px-6 py-3 text-sm font-medium text-gray-700 uppercase tracking-wider'>
              <div className='col-span-5'>Product</div>
              <div className='col-span-2 text-center'>Price</div>
              <div className='col-span-3 text-center'>Quantity</div>
              <div className='col-span-2 text-right'>Subtotal</div>
            </div>
            
            {/* Cart items */}
            <div className='divide-y divide-gray-200'>
              {cart.items.map(ci => (
                <div key={ci.id} className='grid grid-cols-1 md:grid-cols-12 gap-4 p-6 items-center'>
                  {/* Product info */}
                  <div className='md:col-span-5 flex items-center gap-4'>
                    <div className='h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-200'>
                      {ci.product_image_url ? (
                        <img 
                          src={ci.product_image_url} 
                          alt={ci.product_name} 
                          className='h-full w-full object-cover' 
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className='text-lg font-medium text-gray-900'>{ci.product_name || `Product #${ci.product}`}</h3>
                      <button 
                        onClick={async () => { 
                          await api.removeFromCart(ci.product); 
                          load(); 
                        }}
                        className="mt-1 text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div className='md:col-span-2 flex md:block justify-between md:text-center'>
                    <span className='md:hidden text-sm font-medium text-gray-700'>Price:</span>
                    <span className='text-lg font-medium text-gray-900'>${Number(ci.product_price || 0).toFixed(2)}</span>
                  </div>
                  
                  {/* Quantity */}
                  <div className='md:col-span-3 flex md:block justify-between items-center'>
                    <span className='md:hidden text-sm font-medium text-gray-700'>Quantity:</span>
                    <div className="flex items-center">
                      <button 
                        className="h-10 w-10 rounded-l-md border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                        onClick={async () => { 
                          if (ci.quantity > 1) {
                            await api.updateCart(ci.product, ci.quantity - 1); 
                            load(); 
                          }
                        }}
                        disabled={ci.quantity <= 1}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <input 
                        className="h-10 w-12 border-y border-gray-300 text-center" 
                        type="number" 
                        min="1" 
                        value={ci.quantity}
                        onChange={async (e) => { 
                          const newQuantity = parseInt(e.target.value || '1');
                          if (newQuantity > 0) {
                            await api.updateCart(ci.product, newQuantity); 
                            load(); 
                          }
                        }} 
                      />
                      <button 
                        className="h-10 w-10 rounded-r-md border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                        onClick={async () => { 
                          await api.updateCart(ci.product, ci.quantity + 1); 
                          load(); 
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* Subtotal */}
                  <div className='md:col-span-2 flex md:block justify-between md:text-right'>
                    <span className='md:hidden text-sm font-medium text-gray-700'>Subtotal:</span>
                    <span className='text-lg font-bold text-teal-600'>
                      ${Number((ci.product_price || 0) * ci.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order summary */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
            <h2 className='text-xl font-bold text-gray-900 mb-4'>Order Summary</h2>
            
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Subtotal</span>
                <span className='font-medium'>${Number(cart.total_amount || 0).toFixed(2)}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Shipping</span>
                <span className='font-medium'>Free</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Tax</span>
                <span className='font-medium'>Calculated at checkout</span>
              </div>
              <div className='border-t border-gray-200 pt-3 flex justify-between text-lg font-bold'>
                <span>Total</span>
                <span className='text-teal-600'>${Number(cart.total_amount || 0).toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              className='w-full bg-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-teal-700 transition-colors mt-6 flex items-center justify-center gap-2'
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
