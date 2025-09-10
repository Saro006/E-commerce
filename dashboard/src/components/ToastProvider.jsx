import { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react'

const ToastContext = createContext({ show: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const show = useCallback((message, opts = {}) => {
    const id = Math.random().toString(36).slice(2)
    const duration = opts.duration ?? 2000
    setToasts((prev) => [...prev, { id, message }])
    if (duration > 0) {
      setTimeout(() => remove(id), duration)
    }
  }, [remove])

  const value = useMemo(() => ({ show }), [show])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setToasts([])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="flex max-w-md flex-col items-center gap-3">
          {toasts.map((t) => (
            <div key={t.id} className="pointer-events-auto animate-pop rounded-lg bg-black px-4 py-3 text-sm font-medium text-white shadow-xl ring-1 ring-inset ring-black/40">
              {t.message}
            </div>
          ))}
        </div>
      </div>
      <style>
        {`
        @keyframes pop { 0% { transform: scale(.98); opacity: 0 } 100% { transform: scale(1); opacity: 1 } }
        .animate-pop { animation: pop .18s ease-out both }
      `}
      </style>
    </ToastContext.Provider>
  )
}


