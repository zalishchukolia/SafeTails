import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import AnimalsPage from './pages/AnimalsPage'
import AnimalDetailPage from './pages/AnimalDetailPage'
import FindingNewBeginningsPage from './pages/FindingNewBeginningsPage'
import SuccessStoriesPage from './pages/SuccessStoriesPage'
import AdoptionFormPage from './pages/AdoptionFormPage'

const font = "'DM Sans', 'Inter', sans-serif"
const mono = "'DM Mono', 'Courier New', monospace"

/* ══ RIGHT MINI SIDEBAR (non-home pages) ══ */
const RIGHT_NAV = [
  { icon: '▦', path: '/',                       tip: 'Dashboard' },
  { icon: '✦', path: '/animals',                tip: 'Active Rescues' },
  { icon: '⊹', path: '#',                       tip: 'Dispatch' },
  { icon: '♥', path: '#',                       tip: 'Medical Log' },
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
          <Link key={tip} to={path} title={tip} style={{
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
          >{icon}</Link>
        )
      })}
    </div>
  )
}

/* ══ COMMS DATA ══ */
const COMMS = [
  { name: 'Mark (Dispatch)', initials: 'MD', time: '12:45', color: '#c0392b',
    msg: "Cooper's location confirmed. I'm 2 mins out. Perimeter is clear of traffic.", self: false },
  { name: 'You', initials: 'YO', time: '12:47', color: '#ff6b2b',
    msg: 'Copy that Mark. Medical is on standby at Sector 7.', self: true },
  { name: 'Sarah (Vet)', initials: 'SV', time: '12:50', color: '#8b5cf6',
    msg: 'Preparing the fluids now. @Mark, check for signs of shock on arrival.', self: false },
]

function Avatar({ initials, color, size = 38 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.36, fontWeight: 700, color: '#fff', flexShrink: 0,
    }}>{initials}</div>
  )
}

/* ══ FLOATING CHAT ══ */
function FloatingChat() {
  const [open, setOpen] = useState(false)
  const [msg, setMsg] = useState('')

  return (
    <>
      {/* Chat panel — slides up from bottom-right */}
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
              to   { opacity: 1; transform: translateY(0)   scale(1); }
            }
          `}</style>

          {/* Header */}
          <div style={{
            padding: '18px 18px 14px',
            borderBottom: '1px solid #222',
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 3 }}>Mission Comms</div>
              <div style={{ fontSize: 10, color: '#555', fontFamily: mono, letterSpacing: 0.5 }}>
                Live Team Frequency: 142.8 MHz
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
            display: 'flex', flexDirection: 'column', gap: 20,
            maxHeight: 340, overflowY: 'auto',
            background: '#141414',
          }}>
            {COMMS.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, flexDirection: m.self ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
                {!m.self && <Avatar initials={m.initials} color={m.color} size={38} />}
                <div style={{ maxWidth: '78%' }}>
                  <div style={{
                    display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 6,
                    justifyContent: m.self ? 'flex-end' : 'flex-start',
                  }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: m.self ? '#ff6b2b' : '#ddd' }}>
                      {m.self ? 'You' : m.name}
                    </span>
                    <span style={{ fontSize: 10, color: '#444' }}>{m.time}</span>
                  </div>
                  <div style={{
                    background: m.self ? '#2d1a0e' : '#222',
                    border: `1px solid ${m.self ? '#ff6b2b22' : '#2e2e2e'}`,
                    borderRadius: m.self ? '14px 4px 14px 14px' : '4px 14px 14px 14px',
                    padding: '11px 14px',
                    fontSize: 13, color: m.self ? '#e8c4a0' : '#bbb',
                    lineHeight: 1.6,
                  }}>{m.msg}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: '14px 16px', background: '#161616', borderTop: '1px solid #1e1e1e' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
              <span style={{ fontSize: 9, color: '#555', letterSpacing: 2, fontFamily: mono }}>BROADCAST CHANNEL</span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                value={msg}
                onChange={e => setMsg(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && setMsg('')}
                placeholder="Send update..."
                style={{
                  flex: 1, background: '#1e1e1e', border: '1px solid #2a2a2a',
                  borderRadius: 10, padding: '10px 14px', fontSize: 13,
                  color: '#ccc', outline: 'none', fontFamily: font,
                }}
              />
              <button onClick={() => setMsg('')} style={{
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

      {/* ── Floating button — bottom RIGHT, orange with heart+hand icon ── */}
      <button
        onClick={() => setOpen(p => !p)}
        title="Mission Comms"
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 400,
          width: 56, height: 56,
          borderRadius: 16,
          background: open
            ? 'linear-gradient(135deg,#e06000,#c04400)'
            : 'linear-gradient(135deg,#ff8c00,#ff5500)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: open ? '0 2px 12px #ff660044' : '0 6px 24px #ff660066',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.07)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
      >
        {/* Heart in hand SVG — matches reference icon */}
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          {/* Hand */}
          <path
            d="M4 20h5l2.5 2.5h7l6-2.5c1.2-.5 1.5-1.8.5-2.5s-2.5-.3-3.5.3L19 19h-4.5"
            stroke="#7a3500" strokeWidth="1.8" strokeLinecap="round" fill="none"
          />
          <rect x="3" y="20" width="5" height="7" rx="1.5" fill="#7a3500" />
          {/* Heart */}
          <path
            d="M16 15l-5-5c-1.5-1.5-1.5-4 0-5.5S15 3 16 5c1-2 3.5-2.5 5-1s1.5 4 0 5.5L16 15z"
            fill="#7a3500"
          />
        </svg>
      </button>
    </>
  )
}

/* ══ APP ══ */
function AppInner() {
  return (
    <div style={{ minHeight: '100vh', background: '#141414', color: '#fff' }}>
      <Navbar />
      <Routes>
        <Route path="/"                        element={<HomePage />} />
        <Route path="/animals"                 element={<AnimalsPage />} />
        <Route path="/animals/:id"             element={<AnimalDetailPage />} />
        <Route path="/finding-new-beginnings"  element={<FindingNewBeginningsPage />} />
        <Route path="/success-stories"         element={<SuccessStoriesPage />} />
        <Route path="/adoption-form"           element={<AdoptionFormPage />} />
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