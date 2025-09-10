import { useEffect, useState } from 'react'
import { api } from '../../services/api'

export default function AdminProductsPage() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ name: '', slug: '', image_url: '', price: '', stock: '', description: '', category: '' })
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)

  function slugify(value) {
    return (value || '')
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_\-\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }

  async function load() {
    try {
      const [prods, cats] = await Promise.all([api.listProducts(), api.listCategories()])
      setItems(prods); setCategories(cats)
    } catch (e) { setError(e.message) }
  }

  useEffect(() => { load() }, [])

  async function create() {
    try {
      await api.createProduct({ ...form, price: parseFloat(form.price || '0'), stock: parseInt(form.stock || '0') })
      setForm({ name: '', slug: '', image_url: '', price: '', stock: '', description: '', category: '' })
      load()
    } catch (e) { setError(e.message) }
  }

  async function remove(id) { try { await api.deleteProduct(id); load() } catch (e) { setError(e.message) } }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>Admin Products</h1>
      </div>
      {error && <div className='card border-red-300 text-red-700'>{error}</div>}

      <div className='card grid gap-6 md:grid-cols-2'>
        <div className='grid gap-3'>
          <div className='grid gap-1'>
            <label className='text-sm text-gray-600'>Name</label>
            <input
              className='input'
              placeholder='e.g. Smartphone X'
              value={form.name}
              onChange={e => {
                const name = e.target.value
                setForm(prev => ({
                  ...prev,
                  name,
                  slug: slugTouched ? prev.slug : slugify(name),
                }))
              }}
            />
          </div>
          <div className='grid gap-1'>
            <label className='text-sm text-gray-600'>Slug</label>
            <input
              className='input'
              placeholder='e.g. smartphone-x'
              value={form.slug}
              onChange={e => { setSlugTouched(true); setForm({ ...form, slug: slugify(e.target.value) }) }}
              onBlur={() => setForm(prev => ({ ...prev, slug: slugify(prev.slug) }))}
            />
            <div className='text-xs text-gray-500'>Only letters, numbers, underscores, and hyphens are allowed.</div>
          </div>
          <select className='input' value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
            <option value=''>Select category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <div className='grid gap-1'>
            <label className='text-sm text-gray-600'>Image URL</label>
            <input className='input' placeholder='https://...' value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} />
          </div>
          <div className='grid gap-3'>
            <div className='grid gap-1'>
              <label className='text-sm text-gray-600'>Price</label>
              <input className='input' placeholder='e.g. 599.99' type='number' step='0.01' min='0' value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            </div>
            <div className='grid gap-1'>
              <label className='text-sm text-gray-600'>Stock</label>
              <input className='input' placeholder='e.g. 25' type='number' min='0' value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
            </div>
          </div>
          <div className='grid gap-1'>
            <label className='text-sm text-gray-600'>Description</label>
            <textarea className='input' placeholder='Short description' value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <button className='btn' onClick={create}>Create</button>
        </div>
        <div className='flex items-start justify-center'>
          {form.image_url ? (
            <img src={form.image_url} alt='preview' className='rounded-lg border border-gray-200 shadow-sm w-full max-w-sm aspect-square object-cover transition-transform duration-200 hover:scale-[1.02]' />
          ) : (
            <div className='w-full max-w-sm aspect-square rounded-lg bg-gray-100 grid place-items-center text-gray-500'>Image preview</div>
          )}
        </div>
      </div>

      <h2 className='text-xl font-semibold'>Existing</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {items.map(p => (
          <div key={p.id} className='card group transition-shadow duration-200 hover:shadow-md'>
            <div className='aspect-square rounded-md overflow-hidden bg-gray-100'>
              {p.image_url ? (
                <img src={p.image_url} alt={p.name} className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]' />
              ) : null}
            </div>
            <div className='mt-3 flex items-start justify-between gap-2'>
              <div>
                <div className='font-medium'>{p.name}</div>
                <div className='text-sm text-gray-500'>$ {Number(p.price).toFixed(2)} • stock {p.stock}</div>
              </div>
              <button className='btn btn-secondary' onClick={() => remove(p.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

