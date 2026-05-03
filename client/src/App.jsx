import { useState, useRef, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import AnimalsPage from './pages/AnimalsPage'
import AnimalDetailPage from './pages/AnimalDetailPage'
import FindingNewBeginningsPage from './pages/FindingNewBeginningsPage'
import SuccessStoriesPage from './pages/SuccessStoriesPage'
import AdoptionFormPage from './pages/AdoptionFormPage'
import AdoptionApplicationPage from './pages/AdoptionApplicationPage'
import AuthPage from './pages/AuthPage'

const font = "'DM Sans', 'Inter', sans-serif"
const mono = "'DM Mono', 'Courier New', monospace"

const RIGHT_NAV = [
  { icon: '▦', path: '/', tip: 'Dashboard' },
  { icon: '✦', path: '/animals', tip: 'Active Rescues' },
  { icon: '⊹', path: '#', tip: 'Dispatch' },
  { icon: '♥', path: '#', tip: 'Medical Log' },
  { icon: '▤', path: '/finding-new-beginnings', tip: 'Archive' },
]

function RightMiniSidebar() {
  const location = useLocation()
  if (location.pathname === '/') return null

  return (
    <div style={{
      position: 'fixed', right: 0, top: '50%', transform: 'translateY(-50%)',
      background: '#111', border: '1px solid #222',
      borderRadius: '12px 0 0 12px',
      display: 'flex', flexDirection: 'column', gap: 2,
      padding: '8px 4px', zIndex: 200,
      boxShadow: '-4px 0 20px #0006',
    }}>
      {RIGHT_NAV.map(({ icon, path, tip }) => {
        const active = location.pathname === path
        return (
          <Link
            key={tip}
            to={path}
            title={tip}
            style={{
              width: 36, height: 36, borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16,
              color: active ? '#ff6b2b' : '#555',
              background: active ? '#1e1e1e' : 'transparent',
              textDecoration: 'none',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#555' }}
          >
            {icon}
          </Link>
        )
      })}
    </div>
  )
}

function FloatingChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Привіт! Я помічник SafeTails 🐾 Допоможу знайти тварину або відповім на питання про адопцію!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMsg = { role: 'user', text: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Щось пішло не так 😢 Спробуй ще раз.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {open && (
        <div style={{
          position: 'fixed',
          bottom: 84,
          right: 20,
          zIndex: 400,
          width: 340,
          background: '#161616',
          border: '1px solid #272727',
          borderRadius: 20,
          boxShadow: '0 16px 60px #000c',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          fontFamily: font,
          animation: 'chatSlideUp 0.22s cubic-bezier(0.34,1.56,0.64,1)',
        }}>
          <style>{`
            @keyframes chatSlideUp {
              from { opacity: 0; transform: translateY(20px) scale(0.97); }
              to   { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}</style>

          {/* Header */}
          <div style={{
            padding: '18px 18px 14px',
            borderBottom: '1px solid #222',
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 3 }}>SafeTails AI 🐾</div>
              <div style={{ fontSize: 10, color: '#555', fontFamily: mono, letterSpacing: 0.5 }}>
                Помічник з адопції тварин
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{
              background: '#222', border: 'none', color: '#888',
              width: 28, height: 28, borderRadius: '50%',
              fontSize: 14, cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              lineHeight: 1, flexShrink: 0,
            }}>×</button>
          </div>

          {/* Messages */}
          <div style={{
            padding: '18px 16px',
            display: 'flex', flexDirection: 'column', gap: 16,
            maxHeight: 340, overflowY: 'auto',
            background: '#141414',
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                display: 'flex',
                flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
                gap: 8
              }}>
                <div style={{
                  maxWidth: '82%',
                  background: m.role === 'user' ? '#2d1a0e' : '#222',
                  border: `1px solid ${m.role === 'user' ? '#ff6b2b22' : '#2e2e2e'}`,
                  borderRadius: m.role === 'user' ? '14px 4px 14px 14px' : '4px 14px 14px 14px',
                  padding: '11px 14px',
                  fontSize: 13,
                  color: m.role === 'user' ? '#e8c4a0' : '#bbb',
                  lineHeight: 1.6,
                }}>{m.text}</div>
              </div>
            ))}
            {loading && (
              <div style={{ color: '#555', fontSize: 13 }}>⏳ Печатає...</div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '14px 16px', background: '#161616', borderTop: '1px solid #1e1e1e' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
              <span style={{ fontSize: 9, color: '#555', letterSpacing: 2, fontFamily: mono }}>AI ASSISTANT ONLINE</span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Запитай про тварин..."
                style={{
                  flex: 1, background: '#1e1e1e', border: '1px solid #2a2a2a',
                  borderRadius: 10, padding: '10px 14px', fontSize: 13,
                  color: '#ccc', outline: 'none', fontFamily: font,
                }}
              />
              <button onClick={sendMessage} style={{
                width: 42, height: 42, borderRadius: 10,
                background: 'linear-gradient(135deg,#ff8c00,#ff5500)',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 15, color: '#fff', flexShrink: 0,
              }}>➤</button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(p => !p)}
        title="SafeTails AI"
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 400,
          width: 56, height: 56,
          borderRadius: 16,
          background: open ? 'linear-gradient(135deg,#e06000,#c04400)' : 'linear-gradient(135deg,#ff8c00,#ff5500)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: open ? '0 2px 12px #ff660044' : '0 6px 24px #ff660066',
          transition: 'all 0.2s',
        }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.48 2 2 6.03 2 11c0 2.7 1.23 5.12 3.2 6.8L4 22l4.5-2.25C9.6 20.25 10.78 20.5 12 20.5c5.52 0 10-4.03 10-9S17.52 2 12 2z" fill="#7a3500"/>
        </svg>
      </button>
    </>
  )
}

function AppInner() {
  return (
    <div style={{ minHeight: '100vh', background: '#141414', color: '#fff' }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/animals" element={<AnimalsPage />} />
        <Route path="/animals/:id" element={<AnimalDetailPage />} />
        <Route path="/finding-new-beginnings" element={<FindingNewBeginningsPage />} />
        <Route path="/success-stories" element={<SuccessStoriesPage />} />
        <Route path="/adoption-form" element={<AdoptionFormPage />} />
        <Route path="/adoption-application" element={<AdoptionApplicationPage />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
      <RightMiniSidebar />
      <FloatingChat />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  )
}