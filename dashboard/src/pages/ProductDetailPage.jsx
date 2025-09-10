import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { useToast } from '../components/ToastProvider'

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [qty, setQty] = useState(1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [imageLoading, setImageLoading] = useState(true)
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    api.getProduct(id)
      .then(setProduct)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = async () => {
    try {
      await api.addToCart(product.id, qty)
      toast.show(`Added ${qty} ${qty === 1 ? 'item' : 'items'} to cart`, 'success')
    } catch (error) {
      toast.show('Failed to add item to cart', 'error')
    }
  }

  const handleBuyNow = async () => {
    try {
      await api.addToCart(product.id, qty)
      navigate('/cart')
    } catch (error) {
      toast.show('Failed to add item to cart', 'error')
    }
  }

  if (error) return (
    <div className="max-w-4xl mx-auto bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
      <div className="flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Error: {error}</span>
      </div>
      <Link 
        to="/products" 
        className="inline-block mt-4 text-teal-600 hover:text-teal-800 font-medium"
      >
        &larr; Back to Products
      </Link>
    </div>
  )
  
  if (loading) return (
    <div className="max-w-4xl mx-auto">
      <div className="animate-pulse">
        <div className="h-6 w-48 bg-gray-200 rounded mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-200 rounded-xl"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            <div className="h-12 bg-gray-200 rounded w-48 mt-8"></div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className='max-w-4xl mx-auto'>
      {/* Breadcrumb Navigation */}
      <nav className='flex mb-6' aria-label="Breadcrumb">
        <ol className='flex items-center space-x-2 text-sm text-gray-600'>
          <li>
            <Link to='/products' className='hover:text-teal-600 transition-colors'>Products</Link>
          </li>
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </li>
          <li className='truncate' aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-start'>
        {/* Product Image */}
        <div className='relative'>
          <div className='sticky top-6'>
            <div className='rounded-2xl overflow-hidden bg-gray-100 shadow-sm border border-gray-200'>
              {product.image_url ? (
                <>
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
                    </div>
                  )}
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                    onLoad={() => setImageLoading(false)}
                  />
                </>
              ) : (
                <div className='aspect-square flex items-center justify-center text-gray-400'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className='space-y-6'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>{product.name}</h1>
            <div className='mt-2 text-2xl font-bold text-teal-600'>${Number(product.price).toFixed(2)}</div>
          </div>

          {product.description && (
            <div>
              <h2 className='text-lg font-semibold text-gray-900 mb-2'>Description</h2>
              <p className='text-gray-700 leading-relaxed'>{product.description}</p>
            </div>
          )}

          <div className='pt-4 border-t border-gray-200'>
            <div className='flex items-center gap-4 mb-4'>
              <label htmlFor="quantity" className='text-sm font-medium text-gray-700'>Quantity:</label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button 
                  className="h-10 w-10 flex items-center justify-center bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                  onClick={() => setQty(prev => Math.max(1, prev - 1))}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <input 
                  id="quantity"
                  className="h-10 w-12 text-center border-x border-gray-300" 
                  type='number' 
                  min='1' 
                  value={qty} 
                  onChange={e => setQty(Math.max(1, parseInt(e.target.value || '1')))} 
                />
                <button 
                  className="h-10 w-10 flex items-center justify-center bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                  onClick={() => setQty(prev => prev + 1)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            <div className='flex flex-col sm:flex-row gap-3'>
              <button 
                className='flex-1 bg-teal-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center justify-center gap-2'
                onClick={handleBuyNow}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Buy Now
              </button>
              <button 
                className='flex-1 border border-teal-600 text-teal-600 py-3 px-6 rounded-lg font-medium hover:bg-teal-50 transition-colors flex items-center justify-center gap-2'
                onClick={handleAddToCart}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add to Cart
              </button>
            </div>
          </div>

          <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
            <div className='flex items-center gap-3 text-sm text-gray-600'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Free shipping on all orders</span>
            </div>
            <div className='flex items-center gap-3 text-sm text-gray-600 mt-2'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>30-day money-back guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
