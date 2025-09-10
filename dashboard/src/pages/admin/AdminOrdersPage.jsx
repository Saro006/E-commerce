import { useEffect, useState } from 'react'
import { api } from '../../services/api'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')

  useEffect(() => { api.listOrders().then(setOrders).catch(e => setError(e.message)) }, [])

  if (error) return <div className='container'>Error: {error}</div>

  return (
    <div className='container space-y-4'>
      <h1 className='text-2xl font-semibold'>Orders</h1>
      {orders.map(o => (
        <div key={o.id} className='card'>
          <div className='flex items-center justify-between'>
            <div className='font-medium'>Order #{o.id} • {o.status}</div>
            <div className='text-sm'>$ {Number(o.total_amount).toFixed(2)}</div>
          </div>
          <div className='text-xs text-gray-500'>Payment: {o.payment_reference || '—'}</div>
          <div className='mt-3 space-y-2'>
            {(o.items || []).map(i => (
              <div key={i.id} className='flex items-center gap-3 text-sm'>
                <div className='flex items-center gap-3 flex-1'>
                  {i.product_image_url && (
                    <img src={i.product_image_url} alt={i.product_name} className='h-10 w-10 rounded object-cover border border-gray-200' />
                  )}
                  <div>
                    <div className='font-medium'>{i.product_name || `Product #${i.product}`}</div>
                    <div className='text-xs text-gray-500'>$ {Number(i.product_price || i.unit_price || 0).toFixed(2)} × {i.quantity}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

