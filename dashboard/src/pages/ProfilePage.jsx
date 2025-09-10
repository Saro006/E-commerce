import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

export default function ProfilePage() {
  const [me, setMe] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    api.me()
      .then(setMe)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (error) return (
    <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
      <div className="flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Error: {error}</span>
      </div>
    </div>
  )
  
  if (loading) return (
    <div className="max-w-2xl mx-auto">
      <div className="animate-pulse space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-gray-200"></div>
            <div className="flex-1 space-y-2">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  )

  return (
    <div className='max-w-2xl mx-auto space-y-6'>
      {/* Header Section */}
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold text-gray-900'>My Profile</h1>
        <button
          className='flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors px-4 py-2 rounded-lg border border-gray-300 hover:border-red-200 hover:bg-red-50'
          onClick={() => { api.logout(); navigate('/login') }}
          title='Logout'
        >
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out-icon lucide-log-out"><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/></svg>
          Logout
        </button>
      </div>

      {/* Profile Card */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
        <div className='flex flex-col sm:flex-row items-center gap-6'>
          <div className='h-20 w-20 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 text-white flex items-center justify-center text-2xl font-bold'>
            {me.username?.slice(0,2)?.toUpperCase()}
          </div>
          <div className='flex-1 text-center sm:text-left'>
            <h2 className='text-xl font-bold text-gray-900'>{me.username}</h2>
            <p className='text-gray-600 mt-1'>{me.email || 'No email set'}</p>
            <p className='text-sm text-gray-500 mt-2'>
              Member since {new Date(me.date_joined).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Account Details */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
        <div className='border-b border-gray-200 px-6 py-4'>
          <h3 className='text-lg font-semibold text-gray-900'>Account Details</h3>
        </div>
        
        <div className='divide-y divide-gray-100'>
          <div className='px-6 py-4'>
            <div className='flex items-center gap-4'>
              <div className='p-2 bg-teal-50 rounded-lg'>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='h-5 w-5 text-teal-600'>
                  <path d='M12 12c2.485 0 4.5-2.015 4.5-4.5S14.485 3 12 3 7.5 5.015 7.5 7.5 9.515 12 12 12z' />
                  <path fillRule='evenodd' d='M3.75 20.1a8.25 8.25 0 0116.5 0 .9.9 0 01-.9.9H4.65a.9.9 0 01-.9-.9z' clipRule='evenodd' />
                </svg>
              </div>
              <div className='flex-1'>
                <div className='text-sm text-gray-500'>Username</div>
                <div className='font-medium text-gray-900'>{me.username}</div>
              </div>
            </div>
          </div>
          
          <div className='px-6 py-4'>
            <div className='flex items-center gap-4'>
              <div className='p-2 bg-teal-50 rounded-lg'>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='h-5 w-5 text-teal-600'>
                  <path d='M1.5 8.25A2.25 2.25 0 013.75 6h16.5A2.25 2.25 0 0122.5 8.25V9l-10.5 6L1.5 9v-.75z' />
                  <path d='M1.5 10.486l9.614 5.768a1.5 1.5 0 001.572 0L22.5 10.486V15.75A2.25 2.25 0 0120.25 18H3.75A2.25 2.25 0 011.5 15.75v-5.264z' />
                </svg>
              </div>
              <div className='flex-1'>
                <div className='text-sm text-gray-500'>Email Address</div>
                <div className='font-medium text-gray-900'>{me.email || '—'}</div>
              </div>
            </div>
          </div>
          
          <div className='px-6 py-4'>
            <div className='flex items-center gap-4'>
              <div className='p-2 bg-teal-50 rounded-lg'>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='h-5 w-5 text-teal-600'>
                  <path fillRule='evenodd' d='M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75H15a.75.75 0 000-1.5h-2.25V6z' clipRule='evenodd' />
                </svg>
              </div>
              <div className='flex-1'>
                <div className='text-sm text-gray-500'>Member Since</div>
                <div className='font-medium text-gray-900'>
                  {new Date(me.date_joined).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
        <div className='border-b border-gray-200 px-6 py-4'>
          <h3 className='text-lg font-semibold text-gray-900'>Quick Actions</h3>
        </div>
        <div className='p-6 grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <button 
            className='flex items-center gap-3 p-4 text-left rounded-lg border border-gray-200 hover:border-teal-300 hover:bg-teal-50 transition-colors'
            onClick={() => navigate('/orders')}
          >
            <div className='p-2 bg-blue-50 rounded-lg'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <div className='font-medium text-gray-900'>Order History</div>
              <div className='text-sm text-gray-500'>View your past orders</div>
            </div>
          </button>
          
          <button 
            className='flex items-center gap-3 p-4 text-left rounded-lg border border-gray-200 hover:border-teal-300 hover:bg-teal-50 transition-colors'
            onClick={() => navigate('/settings')}
          >
            <div className='p-2 bg-green-50 rounded-lg'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <div className='font-medium text-gray-900'>Account Settings</div>
              <div className='text-sm text-gray-500'>Update your preferences</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}


