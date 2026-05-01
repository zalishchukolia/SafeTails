import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const font = "'DM Sans', 'Inter', sans-serif"
const mono = "'DM Mono', 'Courier New', monospace"

const AGE_FILTERS = ['Puppy / Kitten', 'Young Adult', 'Senior']
const TEMP_FILTERS = ['Energetic', 'Couch Potato', 'Kid Friendly', 'Protective', 'Independent']

const getStatusColor = (status) => {
  if (status === 'needs rescue') return { color: '#ff4444', bg: '#ff444422', label: 'NEEDS RESCUE' }
  if (status === 'rescued') return { color: '#22c55e', bg: '#22c55e22', label: 'RESCUED' }
  return { color: '#ff8c00', bg: '#ff8c0022', label: 'IN CARE' }
}

const speciesEmoji = (species) => species === 'кіт' ? '🐈' : '🐕'

const CARD_STYLES = [
  { cardBg: '#f0e6d0', textColor: '#1a1a1a', subColor: '#7a6a55', photoBg: 'linear-gradient(160deg,#e8956d,#d4734a)' },
  { cardBg: '#f5f0e8', textColor: '#1a1a1a', subColor: '#7a6a55', photoBg: 'linear-gradient(160deg,#0a0a0a,#1a1a2e)' },
  { cardBg: '#f5f0e8', textColor: '#1a1a1a', subColor: '#7a6a55', photoBg: 'linear-gradient(160deg,#c8a050,#a07030)' },
  { cardBg: '#f5f0e8', textColor: '#1a1a1a', subColor: '#7a6a55', photoBg: 'linear-gradient(160deg,#3a4a4a,#2a3a3a)' },
  { cardBg: '#f5f0e8', textColor: '#1a1a1a', subColor: '#7a6a55', photoBg: 'linear-gradient(160deg,#c87040,#a05030)' },
  { cardBg: '#f5f0e8', textColor: '#1a1a1a', subColor: '#7a6a55', photoBg: 'linear-gradient(160deg,#6a9a40,#4a7a30)' },
]

function Stars({ count = 3 }) {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= count ? '#ff6b2b' : '#d4c4a8', fontSize: 13 }}>★</span>
      ))}
    </div>
  )
}

function PetCard({ pet, index }) {
  const [hovered, setHovered] = useState(false)
  const style = CARD_STYLES[index % CARD_STYLES.length]
  const { color, bg, label } = getStatusColor(pet.status)
  const gender = pet.species === 'кіт' ? 'HER' : 'HIM'
  const ageLabel = `${pet.age} ${pet.age === 1 ? 'YEAR' : 'YEARS'}`

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: style.cardBg,
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: hovered ? '0 12px 40px #0005' : '0 4px 20px #0003',
        transition: 'box-shadow 0.2s, transform 0.2s',
        transform: hovered ? 'translateY(-4px)' : 'none',
        cursor: 'pointer',
      }}
    >
      {/* Photo */}
      <div style={{ position: 'relative', height: 220, background: style.photoBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 90 }}>
        {speciesEmoji(pet.species)}
        <div style={{
          position: 'absolute', bottom: 14, left: 14,
          background: bg, color: color,
          backdropFilter: 'blur(8px)',
          border: `1px solid ${color}44`,
          borderRadius: 20, padding: '4px 12px',
          fontSize: 10, fontWeight: 700, letterSpacing: 1,
        }}>{label}</div>
      </div>

      {/* Body */}
      <div style={{ padding: '16px 18px 20px', background: style.cardBg }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: style.textColor }}>{pet.name}</span>
          <span style={{ fontSize: 10, fontWeight: 600, color: style.subColor, letterSpacing: 1, fontFamily: mono }}>{ageLabel}</span>
        </div>
        <p style={{ fontSize: 12, color: style.subColor, lineHeight: 1.6, marginBottom: 16, fontStyle: 'italic' }}>
          "{pet.description}"
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Stars count={3} />
          <Link to={`/animals/${pet._id}`} style={{
            background: '#1a1a1a', color: '#fff',
            border: 'none', borderRadius: 22,
            padding: '8px 18px', fontSize: 11, fontWeight: 700,
            textDecoration: 'none', letterSpacing: 0.5,
          }}>MEET {gender}</Link>
        </div>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer style={{ background: '#0d0d0d', fontFamily: font }}>
      <div style={{ padding: '60px 40px', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          maxWidth: 700, width: '100%',
          background: 'linear-gradient(135deg,#1e1a18,#2a1e1a)',
          borderRadius: 24, padding: '52px 48px', textAlign: 'center',
          boxShadow: '0 8px 48px #0008',
        }}>
          <div style={{
            display: 'inline-block', border: '1px solid #444',
            borderRadius: 20, padding: '4px 16px', fontSize: 10,
            color: '#888', letterSpacing: 2, marginBottom: 24, fontFamily: mono,
          }}>TAKE ACTION</div>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: '#fff', marginBottom: 18, lineHeight: 1.2 }}>Support Our Missions</h2>
          <p style={{ fontSize: 14, color: '#999', lineHeight: 1.8, maxWidth: 500, margin: '0 auto 36px' }}>
            Every adoption story starts with a rescue mission. Your contributions fund the tactical transport, medical care, and safe housing for animals in transition.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button style={{
              background: 'linear-gradient(90deg,#ff6b2b,#ff4500)',
              color: '#fff', border: 'none', borderRadius: 30,
              padding: '14px 32px', fontSize: 14, fontWeight: 700,
              cursor: 'pointer', fontFamily: font,
            }}>Donate to Rescues</button>
            <button style={{
              background: '#2a2a2a', color: '#fff',
              border: '1px solid #3a3a3a', borderRadius: 30,
              padding: '14px 32px', fontSize: 14, fontWeight: 600,
              cursor: 'pointer', fontFamily: font,
            }}>Apply to Foster</button>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #1e1e1e', padding: '48px 60px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 40, marginBottom: 48 }}>
          <div>
            <div style={{
              fontSize: 18, fontWeight: 700, fontStyle: 'italic',
              background: 'linear-gradient(90deg,#ff6b2b,#ff4500)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              marginBottom: 14,
            }}>SafeTails</div>
            <p style={{ fontSize: 12, color: '#666', lineHeight: 1.8, maxWidth: 260 }}>
              A tactical approach to animal welfare. Precision logistics meets radical empathy for the voiceless. Sector 7 Delta Ops.
            </p>
          </div>
          {[
            { title: 'COMMAND', links: ['Dashboard', 'Active Feed', 'Dispatch'] },
            { title: 'IMPACT', links: ['Adoptions', 'Medical Log', 'Archive'] },
            { title: 'SUPPORT', links: ['Help Center', 'Donate', 'Volunteer'] },
            { title: 'LEGAL', links: ['Privacy', 'Terms'] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 10, color: '#555', letterSpacing: 2, fontFamily: mono, marginBottom: 16 }}>{col.title}</div>
              {col.links.map(l => (
                <div key={l} style={{ fontSize: 13, color: '#888', marginBottom: 10, cursor: 'pointer' }}
                  onMouseEnter={e => e.target.style.color = '#fff'}
                  onMouseLeave={e => e.target.style.color = '#888'}
                >{l}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#444' }}>© 2024 Command Center Delta. Operative Network. All rights reserved.</span>
          <div style={{ display: 'flex', gap: 16 }}>
            <span style={{ fontSize: 16, color: '#444', cursor: 'pointer' }}>↗</span>
            <span style={{ fontSize: 16, color: '#444', cursor: 'pointer' }}>🌐</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function FindingNewBeginningsPage() {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [ageFilters, setAgeFilters] = useState([])
  const [tempFilters, setTempFilters] = useState(['Kid Friendly'])
  const [urgency, setUrgency] = useState(null)
  const [sort, setSort] = useState('Newest Arrivals')

  useEffect(() => {
    fetch('https://safetails-production-8790.up.railway.app/api/animals')
      .then(r => r.json())
      .then(data => { setPets(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const toggleAge = f => setAgeFilters(p => p.includes(f) ? p.filter(x => x !== f) : [...p, f])
  const toggleTemp = f => setTempFilters(p => p.includes(f) ? p.filter(x => x !== f) : [...p, f])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 60px)', fontFamily: font, background: '#0f0f0f' }}>

        <aside style={{
          width: 200, flexShrink: 0,
          background: '#0f0f0f',
          borderRight: '1px solid #1e1e1e',
          padding: '24px 18px',
          position: 'sticky', top: 60, height: 'calc(100vh - 60px)', overflowY: 'auto',
        }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 24 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg,#ff6b2b,#ff4500)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
            }}>🐾</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>Catalog Filter</div>
              <div style={{ fontSize: 9, color: '#555', fontFamily: mono }}>{pets.length} SURVIVORS</div>
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 9, color: '#555', letterSpacing: 2, fontFamily: mono, marginBottom: 12 }}>AGE CATEGORY</div>
            {AGE_FILTERS.map(f => (
              <label key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, cursor: 'pointer' }}>
                <div onClick={() => toggleAge(f)} style={{
                  width: 16, height: 16, borderRadius: 4,
                  border: `2px solid ${ageFilters.includes(f) ? '#ff6b2b' : '#333'}`,
                  background: ageFilters.includes(f) ? '#ff6b2b' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, cursor: 'pointer', transition: 'all 0.15s',
                }}>
                  {ageFilters.includes(f) && <span style={{ color: '#fff', fontSize: 10, lineHeight: 1 }}>✓</span>}
                </div>
                <span style={{ fontSize: 12, color: ageFilters.includes(f) ? '#fff' : '#888' }}>{f}</span>
              </label>
            ))}
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 9, color: '#555', letterSpacing: 2, fontFamily: mono, marginBottom: 12 }}>TEMPERAMENT</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {TEMP_FILTERS.map(f => (
                <button key={f} onClick={() => toggleTemp(f)} style={{
                  background: tempFilters.includes(f) ? '#ff6b2b' : '#1a1a1a',
                  color: tempFilters.includes(f) ? '#fff' : '#777',
                  border: `1px solid ${tempFilters.includes(f) ? '#ff6b2b' : '#2a2a2a'}`,
                  borderRadius: 20, padding: '5px 10px', fontSize: 11,
                  cursor: 'pointer', fontFamily: font, transition: 'all 0.15s',
                }}>{f}</button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 9, color: '#555', letterSpacing: 2, fontFamily: mono, marginBottom: 12 }}>RESCUE URGENCY</div>
            {[
              { label: 'Crisis Case', sub: 'Requires immediate specialized medical foster.', dot: '#ff4444' },
              { label: 'Ready for Home', sub: 'Fully vetted, behavior tested, and socialized.', dot: '#22c55e' },
            ].map(u => (
              <div key={u.label} onClick={() => setUrgency(urgency === u.label ? null : u.label)} style={{
                background: urgency === u.label ? '#1e1e1e' : '#161616',
                border: `1px solid ${urgency === u.label ? '#333' : '#1e1e1e'}`,
                borderRadius: 10, padding: '10px 12px', marginBottom: 8, cursor: 'pointer',
                transition: 'all 0.15s',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: u.dot, display: 'inline-block' }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#ccc' }}>{u.label}</span>
                </div>
                <p style={{ fontSize: 9, color: '#555', lineHeight: 1.5, margin: 0 }}>{u.sub}</p>
              </div>
            ))}
          </div>
        </aside>

        <main style={{ flex: 1, padding: '40px 40px 0', minWidth: 0 }}>
          <div style={{ maxWidth: 560, marginBottom: 32 }}>
            <h1 style={{ fontSize: 48, fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: 16 }}>
              Finding New<br />
              <span style={{ color: '#ff6b2b' }}>Beginnings</span>
            </h1>
            <p style={{ fontSize: 15, color: '#888', lineHeight: 1.8 }}>
              Every animal below has survived a crisis. They aren't just pets; they are survivors waiting for their next mission:{' '}
              <strong style={{ color: '#ccc' }}>becoming part of your family.</strong>
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 11, color: '#555', fontFamily: mono, letterSpacing: 1 }}>SORT:</span>
              <select value={sort} onChange={e => setSort(e.target.value)} style={{
                background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#ccc',
                borderRadius: 8, padding: '7px 12px', fontSize: 12,
                outline: 'none', cursor: 'pointer', fontFamily: font,
              }}>
                <option>Newest Arrivals</option>
                <option>Urgent First</option>
                <option>Youngest First</option>
                <option>Most Active</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div style={{ color: '#555', textAlign: 'center', padding: 60 }}>Завантаження...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginBottom: 60 }}>
              {pets.map((pet, i) => <PetCard key={pet._id} pet={pet} index={i} />)}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </>
  )
}