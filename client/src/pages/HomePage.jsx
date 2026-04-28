import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const font = "'DM Sans', 'Inter', sans-serif"
const mono = "'DM Mono', 'Courier New', monospace"

function Avatar({ initials, color = '#ff6b2b', size = 30 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.36, fontWeight: 700, color: '#fff', flexShrink: 0,
    }}>{initials}</div>
  )
}

function StatusBadge({ label, color, bg }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: bg, color, fontSize: 10, fontWeight: 700,
      letterSpacing: 1, padding: '3px 10px', borderRadius: 20,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }} />
      {label}
    </span>
  )
}

function StatCard({ label, value, sub, accentColor, isBar, delay }) {
  const [barW, setBarW] = useState(0)
  useEffect(() => { if (isBar) setTimeout(() => setBarW(84), 200) }, [isBar])
  return (
    <div style={{
      background: '#1a1a1a', border: '1px solid #252525',
      borderLeft: `3px solid ${accentColor}`, borderRadius: 10,
      padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 4,
      animation: `fadeUp 0.4s ease ${delay}s both`,
    }}>
      <div style={{ fontSize: 9, color: '#666', letterSpacing: 1.5, fontFamily: mono, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: accentColor, lineHeight: 1, fontFamily: mono }}>{value}</div>
      {isBar ? (
        <div style={{ marginTop: 6, background: '#333', borderRadius: 3, height: 4 }}>
          <div style={{ width: `${barW}%`, height: '100%', background: '#fff', borderRadius: 3, transition: 'width 1.2s ease' }} />
        </div>
      ) : (
        <div style={{ fontSize: 9, color: '#555', lineHeight: 1.4 }}>{sub}</div>
      )}
    </div>
  )
}

const NAV_ITEMS = [
  { icon: <GridIcon />, label: 'Dashboard',      active: true,  path: '/' },
  { icon: <StarIcon />, label: 'Active Rescues', active: false, path: '/animals' },
  { icon: <DispIcon />, label: 'Dispatch',       active: false, path: '#' },
  { icon: <MedIcon />,  label: 'Medical Log',    active: false, path: '#' },
  { icon: <ArchIcon />, label: 'Archive',        active: false, path: '#' },
]

function GridIcon() { return <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg> }
function StarIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> }
function DispIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> }
function MedIcon()  { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> }
function ArchIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg> }

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:none } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
      `}</style>

      <div style={{ display: 'flex', height: 'calc(100vh - 60px)', fontFamily: font, background: '#141414', color: '#e0e0e0', overflow: 'hidden', position: 'relative' }}>

        {/* SIDEBAR */}
        <aside style={{
          width: sidebarOpen ? 190 : 0, minWidth: sidebarOpen ? 190 : 0,
          background: '#111', borderRight: sidebarOpen ? '1px solid #222' : 'none',
          display: 'flex', flexDirection: 'column', flexShrink: 0,
          overflow: 'hidden', transition: 'width 0.25s ease, min-width 0.25s ease',
        }}>
          <div style={{ padding: '18px 14px 16px', borderBottom: '1px solid #1e1e1e', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#1a1a1a', border: '1px solid #272727', borderRadius: 10, padding: '10px 12px' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#ff6b2b22,#ff6b2b44)', border: '1px solid #ff6b2b44', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 16 }}>✦</span>
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap' }}>Command Center</div>
                <div style={{ fontSize: 10, color: '#555', whiteSpace: 'nowrap' }}>Sector 7 Delta</div>
              </div>
            </div>
          </div>

          <nav style={{ flex: 1, padding: '8px 0', overflow: 'hidden' }}>
            {NAV_ITEMS.map(({ icon, label, active, path }) => (
              <Link key={label} to={path} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px',
                background: active ? '#1e1e1e' : 'transparent',
                color: active ? '#fff' : '#555', fontSize: 13, textDecoration: 'none',
                borderLeft: active ? '2px solid #ff6b2b' : '2px solid transparent',
                fontWeight: active ? 600 : 400, whiteSpace: 'nowrap', transition: 'all 0.15s',
              }}>{icon}{label}</Link>
            ))}
          </nav>

          <div style={{ padding: '14px', borderTop: '1px solid #1e1e1e', flexShrink: 0 }}>
            <button style={{
              width: '100%', background: 'linear-gradient(90deg,#ff6b2b,#e55a1f)',
              color: '#fff', border: 'none', borderRadius: 22, padding: '10px 0',
              fontSize: 12, fontWeight: 700, cursor: 'pointer', letterSpacing: 0.5, fontFamily: font, whiteSpace: 'nowrap',
            }}>NEW MISSION</button>
            {[{ icon: '?', label: 'Support' }, { icon: '→', label: 'Sign Out' }].map(({ icon, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#555', fontSize: 12, cursor: 'pointer', padding: '6px 2px', whiteSpace: 'nowrap' }}>
                <span style={{ fontSize: 13 }}>{icon}</span>{label}
              </div>
            ))}
          </div>
        </aside>

        {/* Sidebar collapse tab */}
        <div style={{ position: 'relative', width: 0, flexShrink: 0, zIndex: 20 }}>
          <button onClick={() => setSidebarOpen(p => !p)} style={{
            position: 'absolute', top: '50%', transform: 'translateY(-50%)',
            left: sidebarOpen ? -1 : 0,
            width: 20, height: 48,
            background: '#1e1e1e', border: '1px solid #2e2e2e',
            borderRadius: sidebarOpen ? '0 8px 8px 0' : '0 8px 8px 0',
            color: '#555', fontSize: 10, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
            padding: 0,
          }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = '#2a2a2a' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.background = '#1e1e1e' }}
          >{sidebarOpen ? '‹' : '›'}</button>
        </div>

        {/* MAIN */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '20px 22px', minWidth: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 28 }}>
            <StatCard label="Active Alerts"  value="04" sub="High Priority Rescues"    accentColor="#ff4444" delay={0} />
            <StatCard label="In Transit"     value="12" sub="Units En Route"            accentColor="#ff6b2b" delay={0.07} />
            <StatCard label="Safe Today"     value="28" sub="Successful Extractions"    accentColor="#22c55e" delay={0.14} />
            <StatCard label="Capacity"       value="84%" isBar                          accentColor="#ffffff" delay={0.21} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#fff' }}>Active Mission Stream</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Filter: All', 'Sort: Priority'].map(t => (
                <button key={t} style={{ background: '#1e1e1e', border: '1px solid #2e2e2e', color: '#888', borderRadius: 20, padding: '6px 14px', fontSize: 11, cursor: 'pointer', fontFamily: font }}>{t}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
            {/* Cooper */}
            <div style={{ background: '#f0e6d0', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 24px #0008', animation: 'fadeUp 0.5s ease 0.1s both' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: '100%', height: 200, background: 'linear-gradient(160deg,#3a2010,#7a4020)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 90 }}>🐕</div>
                <div style={{ position: 'absolute', top: 12, left: 12 }}><StatusBadge label="CRITICAL" color="#fff" bg="#cc2222dd" /></div>
              </div>
              <div style={{ padding: '16px 18px 18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.2 }}>Case #7712:<br />"Cooper"</div>
                    <div style={{ fontSize: 11, color: '#7a6a55', marginTop: 4 }}>Industrial Zone – Terminal B</div>
                  </div>
                  <span style={{ background: '#e0d0b8', border: '1px solid #c8b89a', borderRadius: 8, padding: '5px 10px', fontSize: 10, color: '#5a4a35', fontWeight: 500, whiteSpace: 'nowrap' }}>2.4km Away</span>
                </div>
                {[{ icon: '🏥', text: 'Severe dehydration, left limb trauma suspected.' }, { icon: '📍', text: 'Secure Perimeter established. Dispatch arriving 4m.' }].map(({ icon, text }) => (
                  <div key={text} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: '#e8d8be', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 14 }}>{icon}</div>
                    <span style={{ fontSize: 12, color: '#3a2a1a', lineHeight: 1.5 }}>{text}</span>
                  </div>
                ))}
                <button style={{ width: '100%', background: 'linear-gradient(90deg,#ff4444,#cc2222)', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 0', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: font, marginTop: 8 }}>Accept Mission</button>
              </div>
            </div>

            {/* Luna */}
            <div style={{ background: '#1a1a1a', border: '1px solid #272727', borderRadius: 16, overflow: 'hidden', animation: 'fadeUp 0.5s ease 0.18s both' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: '100%', height: 200, background: 'linear-gradient(160deg,#071510,#0e2a1a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 90 }}>🐈</div>
                <div style={{ position: 'absolute', top: 12, left: 12 }}><StatusBadge label="STABLE" color="#22c55e" bg="#22c55e22" /></div>
              </div>
              <div style={{ padding: '16px 18px 18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>Case #7690:<br />"Luna"</div>
                    <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>Residential Transfer – Sector 4</div>
                  </div>
                  <span style={{ background: '#252525', border: '1px solid #333', borderRadius: 8, padding: '5px 10px', fontSize: 10, color: '#888', whiteSpace: 'nowrap' }}>Post-Op Recovery</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <Avatar initials="DA" color="#ff6b2b" size={26} />
                  <Avatar initials="+2" color="#555" size={26} />
                  <span style={{ fontSize: 11, color: '#666' }}>Team: Dr. Aris + 2 Others</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[{ label: 'HEART RATE', value: '112 BPM', color: '#22c55e' }, { label: 'LAST FEED', value: '14:20', color: '#ccc' }].map(({ label, value, color }) => (
                    <div key={label} style={{ background: '#222', border: '1px solid #2e2e2e', borderRadius: 10, padding: '11px 14px' }}>
                      <div style={{ fontSize: 8, color: '#555', letterSpacing: 1.5, fontFamily: mono, marginBottom: 6 }}>{label}</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color, fontFamily: mono }}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ fontSize: 10, color: '#555', letterSpacing: 2, fontFamily: mono, marginBottom: 12 }}>SECONDARY LOGISTICS</div>
          {[
            { icon: '📋', title: 'Supply Run: Medical Grade Alpha', sub: 'Courier needed for central clinic resupply', eta: 'ETA 45m', priority: 'Low Priority', etaColor: '#ff6b2b' },
            { icon: '🏠', title: 'Shelter Maintenance – Kennel A', sub: 'Routine sanitation and water check', eta: 'NOW', priority: 'Scheduled', etaColor: '#fff' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#1a1a1a', border: '1px solid #252525', borderRadius: 12, padding: '14px 16px', marginBottom: 10, cursor: 'pointer' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#222', border: '1px solid #2e2e2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{item.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: '#ddd', fontWeight: 500 }}>{item.title}</div>
                <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>{item.sub}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: item.etaColor, fontFamily: mono }}>{item.eta}</div>
                <div style={{ fontSize: 10, color: '#555', marginTop: 2 }}>{item.priority}</div>
              </div>
              <span style={{ color: '#444', fontSize: 18, marginLeft: 4 }}>›</span>
            </div>
          ))}
        </main>
      </div>
    </>
  )
}