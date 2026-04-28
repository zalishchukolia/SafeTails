import { Link, useLocation } from 'react-router-dom'

const font = "'DM Sans', 'Inter', sans-serif"

function Navbar() {
  const location = useLocation()

  const links = [
    { path: '/', label: 'Missions' },
    { path: '/animals', label: 'Crisis Feed' },
    { path: '/finding-new-beginnings', label: 'Volunteer Hub' },
    { path: '/adoption-form', label: 'Adoptions' },
  ]

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      height: 60,
      background: '#111111',
      borderBottom: '1px solid #232323',
      fontFamily: font,
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <span style={{
        fontWeight: 700,
        fontSize: 20,
        fontStyle: 'italic',
        background: 'linear-gradient(90deg, #ff6b2b, #ff4500)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        letterSpacing: '-0.3px',
      }}>
        SafeTails
      </span>

      {/* Nav links */}
      <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
        {links.map(link => {
          const active = location.pathname === link.path
          return (
            <Link key={link.path} to={link.path} style={{
              fontSize: 14,
              fontWeight: active ? 600 : 400,
              color: active ? '#ffffff' : '#888',
              textDecoration: 'none',
              paddingBottom: 4,
              borderBottom: active ? '2px solid #ff6b2b' : '2px solid transparent',
              transition: 'color 0.15s',
            }}>
              {link.label}
            </Link>
          )
        })}
      </div>

      {/* Right icons */}
      <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
        {/* Avatar */}
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(135deg, #ff6b2b, #c0392b)',
          border: '2px solid #ff6b2b44',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer',
        }}>V</div>
      </div>
    </nav>
  )
}

export default Navbar