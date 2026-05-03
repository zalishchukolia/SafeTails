import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const font = "'DM Sans', 'Inter', sans-serif"
const API = import.meta.env.VITE_API_URL

export default function AuthPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async () => {
    setError('')
    if (!form.email || !form.password) return setError('Заповніть всі поля')
    if (mode === 'register' && !form.name) return setError('Введіть імʼя')

    try {
      setLoading(true)
      const res = await fetch(`${API}/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) return setError(data.message || 'Помилка')

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/')
    } catch {
      setError('Помилка сервера')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0d0d0d',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: font, padding: 24,
    }}>
      <div style={{
        width: '100%', maxWidth: 420,
        background: '#1a1a1a', borderRadius: 20,
        border: '1px solid #222', padding: '40px 36px',
      }}>
        {/* Logo */}
        <div style={{
          fontSize: 22, fontWeight: 700, fontStyle: 'italic',
          background: 'linear-gradient(90deg,#ff6b2b,#ff4500)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: 28, textAlign: 'center',
        }}>SafeTails</div>

        {/* Toggle */}
        <div style={{
          display: 'flex', background: '#111', borderRadius: 10,
          padding: 4, marginBottom: 28,
        }}>
          {['login', 'register'].map(m => (
            <button key={m} onClick={() => { setMode(m); setError('') }} style={{
              flex: 1, padding: '9px 0', borderRadius: 8, border: 'none',
              background: mode === m ? '#ff6b2b' : 'transparent',
              color: mode === m ? '#fff' : '#666',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              fontFamily: font, transition: 'all 0.15s',
            }}>
              {m === 'login' ? 'Увійти' : 'Реєстрація'}
            </button>
          ))}
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {mode === 'register' && (
            <input
              name="name" value={form.name} onChange={handleChange}
              placeholder="Ваше імʼя"
              style={inputStyle}
            />
          )}
          <input
            name="email" value={form.email} onChange={handleChange}
            placeholder="Email" type="email"
            style={inputStyle}
          />
          <input
            name="password" value={form.password} onChange={handleChange}
            placeholder="Пароль" type="password"
            style={inputStyle}
          />

          {error && <div style={{ color: '#ff4444', fontSize: 13 }}>{error}</div>}

          <button onClick={handleSubmit} disabled={loading} style={{
            background: loading ? '#a14a24' : '#ff6b2b',
            border: 'none', borderRadius: 12, padding: '14px 0',
            color: '#fff', fontSize: 15, fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: font, marginTop: 4, transition: 'background 0.2s',
          }}>
            {loading ? 'Завантаження...' : mode === 'login' ? 'Увійти' : 'Зареєструватись'}
          </button>
        </div>
      </div>

      <style>{`
        input { outline: none; }
        input:focus { border-color: #ff6b2b !important; }
      `}</style>
    </div>
  )
}

const inputStyle = {
  background: '#0d0d0d', border: '1px solid #2a2a2a',
  borderRadius: 10, padding: '12px 16px',
  color: '#fff', fontSize: 14, fontFamily: "'DM Sans', sans-serif",
  width: '100%', boxSizing: 'border-box',
}