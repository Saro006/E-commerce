import { useEffect, useState } from 'react'
import { api } from '../services/api'

export default function AccountSettingsPage() {
  const [me, setMe] = useState(null)
  const [form, setForm] = useState({ username: '', email: '' })
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    api.me().then((data) => { setMe(data); setForm({ username: data.username || '', email: data.email || '' }) }).catch(e => setError(e.message))
  }, [])

  if (error) return <div className="max-w-xl mx-auto bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">{error}</div>
  if (!me) return <div className="max-w-xl mx-auto">Loading...</div>

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-600">Update your profile information.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input className="input mt-1" value={form.username} onChange={e=>setForm(f=>({...f, username:e.target.value}))} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" className="input mt-1" value={form.email} onChange={e=>setForm(f=>({...f, email:e.target.value}))} />
        </div>
        <div className="flex items-center gap-3">
          <button className="btn" disabled={saving} onClick={async ()=>{
            try { setSaving(true); setStatus(''); setError(''); await api.updateMe(form); setStatus('Saved'); }
            catch(e){ setError(e.message) } finally { setSaving(false) }
          }}>{saving ? 'Saving...' : 'Save Changes'}</button>
          {status && <span className="text-green-600 text-sm">{status}</span>}
          {error && <span className="text-red-600 text-sm">{error}</span>}
        </div>
      </div>
    </div>
  )
}


