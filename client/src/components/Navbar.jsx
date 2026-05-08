import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import AuthModal from './AuthModal'

const font = "'DM Sans', 'Inter', sans-serif"

function Navbar() {
  const location = useLocation()
  const [showAuth, setShowAuth] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const handleSuccess = (userData) => setUser(userData)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const links = [
    { path: '/', label: 'МІСІЇ' },
    { path: '/animals', label: 'МАПА ПОРЯТУНКУ' },
    { path: '/finding-new-beginnings', label: 'ВОЛОНТЕРУ' },
    { path: '/adoption-form', label: 'ВСИНОВЛЕННЯ' },
  ]

  return (
    <>
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 28px', height: 60, background: '#111111',
        borderBottom: '1px solid #232323', fontFamily: font,
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <Link to="/" style={{
          fontWeight: 700, fontSize: 20, fontStyle: 'italic',
          background: 'linear-gradient(90deg, #ff6b2b, #ff4500)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.3px', textDecoration: 'none',
        }}>SafeTails</Link>

        <div style={{ display: 'flex', gap: 64, alignItems: 'center' }}>
          {links.map(link => {
            const active = location.pathname === link.path
            return (
              <Link key={link.path} to={link.path} style={{
                fontSize: 13,
                fontWeight: active ? 700 : 500,
                color: active ? '#ffffff' : '#888',
                textDecoration: 'none',
                paddingBottom: 4,
                borderBottom: active ? '2px solid #ff6b2b' : '2px solid transparent',
                transition: 'color 0.15s',
                letterSpacing: '0.06em',
                fontFamily: "'Merriweather', serif",
              }}>{link.label}</Link>
            )
          })}
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {user ? (
            <>
              <span style={{ fontSize: 13, color: '#888' }}>{user.name}</span>
              <button onClick={handleLogout} style={{
                background: 'transparent', border: '1px solid #333',
                borderRadius: 8, padding: '5px 12px', color: '#888',
                fontSize: 12, cursor: 'pointer', fontFamily: font,
              }}>Вийти</button>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'linear-gradient(135deg, #ff6b2b, #c0392b)',
                border: '2px solid #ff6b2b44',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 700, color: '#fff',
              }}>
                {user.name?.[0]?.toUpperCase() || 'U'}
              </div>
            </>
          ) : (
            <div onClick={() => setShowAuth(true)} style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff6b2b, #c0392b)',
              border: '2px solid #ff6b2b44',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, fontWeight: 700, color: '#fff', cursor: 'pointer',
            }}>V</div>
          )}
        </div>
      </nav>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={handleSuccess} />}
    </>
  )
}

export default Navbar