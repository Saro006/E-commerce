import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const orderNo = (id) => `SK-${String(id).padStart(4,'0')}`

  useEffect(() => {
    setLoading(true)
    api.listOrders()
      .then(setOrders)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (error) return <div className='text-red-600'>Error: {error}</div>
  if (loading) return <div>Loading...</div>

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>My Orders</h1>
        <Link className='nav-link' to='/products'>&larr; Continue shopping</Link>
      </div>

      {orders.length === 0 && (
        <div className='card'>No orders yet.</div>
      )}

      <div className='grid gap-4'>
        {orders.map(order => (
          <div key={order.id} className='card'>
            <div className='flex items-center justify-between'>
              <div className='font-medium'>{orderNo(order.id)} • {order.status}</div>
              <div className='text-sm'>$ {Number(order.total_amount).toFixed(2)}</div>
            </div>
            <div className='text-xs text-gray-500'>
              Placed on {order.created_at ? new Date(order.created_at).toLocaleString() : '—'} • Payment: {order.payment_reference || '—'}
            </div>
            <div className='mt-3 space-y-2'>
              {(order.items || []).map(i => (
                <div key={i.id} className='flex items-center gap-3 text-sm'>
                  {i.product_image_url && (
                    <img src={i.product_image_url} alt={i.product_name} className='h-10 w-10 rounded object-cover border border-gray-200' />
                  )}
                  <div className='flex-1'>
                    <div className='font-medium'>{i.product_name || `Product #${i.product}`}</div>
                    <div className='text-xs text-gray-500'>$ {Number(i.product_price || i.unit_price || 0).toFixed(2)} × {i.quantity}</div>
                  </div>
                  <div className='text-sm'>$ {Number(i.subtotal).toFixed(2)}</div>
                </div>
              ))}
            </div>
            <div className='mt-3'>
              <Link className='btn btn-secondary' to={`/order-confirmation/${order.id}`}>View details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


