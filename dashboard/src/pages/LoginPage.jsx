import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../services/api'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    try {
      await api.login(username, password)
      // Redirect admin to admin page, others to products
      if (api.isAdmin()) {
        navigate('/admin/products')
      } else {
        navigate('/products')
      }
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center px-4'>
      <div className='max-w-md w-full space-y-8'>
        <div className='text-center'>
          <div className='mx-auto h-12 w-12 bg-teal-600 rounded-full flex items-center justify-center mb-4'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className='text-3xl font-bold text-gray-900'>Welcome to SK Mart</h1>
          <p className='mt-2 text-gray-600'>Sign in to your account</p>
        </div>
        
        <div className='bg-white rounded-xl shadow-lg p-8'>
          {error && <div className='mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm'>{error}</div>}
          <form onSubmit={submit} className='space-y-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Username</label>
              <input 
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200' 
                placeholder='Enter your username' 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Password</label>
              <input 
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200' 
                type='password' 
                placeholder='Enter your password' 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required
              />
            </div>
            <button 
              className='w-full bg-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200' 
              type='submit'
            >
              Sign In
            </button>
          </form>
          <p className='mt-6 text-center text-sm text-gray-600'>
            New user? <Link className='text-teal-600 hover:text-teal-500 font-medium' to='/signup'>Create an account</Link>
          </p>
        </div>
        
        <div className='text-center text-xs text-gray-500'>
          <p>Default accounts:</p>
          <p>Admin: admin / admin</p>
          <p>User: user / user</p>
        </div>
      </div>
    </div>
  )
}
