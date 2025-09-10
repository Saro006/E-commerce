import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useToast } from '../components/ToastProvider'
import { api } from '../services/api'

export default function ProductsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [filter, setFilter] = useState('')
  const toast = useToast()

  useEffect(() => {
    api.listProducts()
      .then(products => {
        setItems(products);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  // Filter and sort products
  const filteredAndSortedItems = items
    .filter(item => 
      item.name.toLowerCase().includes(filter.toLowerCase()) ||
      item.description?.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0;
    });

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
    </div>
  )
  
  if (error) return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      Error: {error}
    </div>
  )

  return (
    <div className='space-y-6'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        <h1 className='text-3xl font-bold text-gray-900'>Our Products</h1>
        <Link 
          className='bg-teal-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center justify-center gap-2' 
          to='/cart'
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          View Cart
        </Link>
      </div>

      {/* Filters and sorting */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              id="search"
              placeholder="Search products..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
            <select
              id="sort"
              className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Name (A-Z)</option>
              <option value="price-low">Price (Low to High)</option>
              <option value="price-high">Price (High to Low)</option>
            </select>
          </div>
        </div>
      </div>

      {filteredAndSortedItems.length === 0 ? (
        <div className="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
          <p className="mt-2 text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {filteredAndSortedItems.map(product => (
            <div key={product.id} className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300'>
              <Link to={`/products/${product.id}`} className='block'>
                <div className='aspect-square overflow-hidden bg-gray-100 relative'>
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className='w-full h-full object-cover transition-transform duration-500 hover:scale-105' 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-teal-600 text-white text-xs font-semibold px-2 py-1 rounded">
                    ${Number(product.price).toFixed(2)}
                  </div>
                </div>
                <div className='p-4'>
                  <h3 className='text-lg font-semibold text-gray-900 mb-1 line-clamp-1'>{product.name}</h3>
                  {product.description && (
                    <p className='text-gray-600 text-sm mb-3 line-clamp-2'>{product.description}</p>
                  )}
                  <div className='flex items-center gap-2'>
                    <Link 
                      className='flex-1 text-center text-teal-600 border border-teal-600 px-3 py-2 rounded-lg font-medium hover:bg-teal-50 transition-colors' 
                      to={`/products/${product.id}`}
                    >
                      Details
                    </Link>
                    <button 
                      className='flex-1 bg-teal-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center justify-center gap-1'
                      onClick={async (e) => { 
                        e.preventDefault();
                        await api.addToCart(product.id, 1); 
                        toast.show('Added to cart', 'success');
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
