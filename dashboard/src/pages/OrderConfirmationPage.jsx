import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../services/api'

export default function OrderConfirmationPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => { api.getOrder(id).then(setOrder).catch(e => setError(e.message)) }, [id])

  if (error) return <div className='text-red-600'>Error: {error}</div>
  if (!order) return <div>Loading...</div>

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>Order Confirmation</h1>
        <Link className='nav-link' to='/products'>Continue shopping</Link>
      </div>
      <div className='card'>
        <div className='text-lg font-medium'>SK-{String(order.id).padStart(4,'0')} • {order.status}</div>
        <div className='text-sm text-gray-600'>Placed on {order.created_at ? new Date(order.created_at).toLocaleString() : '—'} • Payment ref: {order.payment_reference}</div>
        <div className='mt-3 space-y-2'>
          {order.items.map(i => (
            <div key={i.id} className='flex items-center justify-between gap-3 text-sm'>
              <div className='flex items-center gap-3'>
                {i.product_image_url && (
                  <img src={i.product_image_url} alt={i.product_name} className='h-10 w-10 rounded object-cover border border-gray-200' />
                )}
                <div>
                  <div className='font-medium'>{i.product_name || `Product #${i.product}`}</div>
                  <div className='text-xs text-gray-500'>$ {Number(i.product_price || i.unit_price || 0).toFixed(2)} × {i.quantity}</div>
                </div>
              </div>
              <div>$ {Number(i.subtotal).toFixed(2)}</div>
            </div>
          ))}
        </div>
        <div className='mt-3 border-t pt-3 flex justify-between font-medium'>
          <div>Total</div>
          <div>$ {Number(order.total_amount).toFixed(2)}</div>
        </div>
      </div>
    </div>
  )
}
