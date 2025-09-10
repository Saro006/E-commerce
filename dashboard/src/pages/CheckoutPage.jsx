import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../services/api'

export default function CheckoutPage() {
  const [address, setAddress] = useState('')
  const [payment, setPayment] = useState('cod')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function place() {
    try {
      const order = await api.placeOrder({ shipping_address: address })
      navigate(`/order-confirmation/${order.id}`)
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>Checkout</h1>
        <Link className='nav-link' to='/cart'>&larr; Back to Cart</Link>
      </div>
      {error && <div className='card border-red-300 text-red-700'>{error}</div>}
      <div className='card grid gap-4 max-w-xl'>
        <label className='text-sm text-gray-600'>Shipping address</label>
        <textarea className='input' rows={4} placeholder='Shipping address' value={address} onChange={e => setAddress(e.target.value)} />
        <div className='mt-2'>
          <div className='text-sm text-gray-600 mb-2'>Payment method</div>
          <div className='grid gap-2'>
            <label className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition ${payment==='cod' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
              <input type='radio' name='payment' className='h-4 w-4' checked={payment==='cod'} onChange={() => setPayment('cod')} />
              <div>
                <div className='font-medium text-sm'>Cash on Delivery</div>
                <div className='text-xs text-gray-500'>Pay with cash when your order arrives.</div>
              </div>
            </label>
            <label className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition ${payment==='online' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
              <input type='radio' name='payment' className='h-4 w-4' checked={payment==='online'} onChange={() => setPayment('online')} />
              <div>
                <div className='font-medium text-sm'>Online Payment</div>
                <div className='text-xs text-gray-500'>Pay securely with your card or UPI. (Preview only)</div>
              </div>
            </label>
          </div>
        </div>
        <div>
          <button className='btn' onClick={place}>Place Order</button>
        </div>
      </div>
    </div>
  )
}
