import { useState, useEffect, useRef } from 'react'

const font = "'DM Sans', 'Inter', sans-serif"
const mono = "'DM Mono', 'Courier New', monospace"

const getUrgency = s => s === 'needs rescue' ? 'critical' : s === 'rescued' ? 'stable' : s === 'in recovery' ? 'progress' : 'stable'
const getColor   = u => u === 'critical' ? '#ff3333' : u === 'stable' ? '#22c55e' : '#ff8c00'
const getLabel   = s => s === 'needs rescue' ? 'URGENT' : s === 'rescued' ? 'RESCUED' : s === 'in recovery' ? 'IN CARE' : 'AVAILABLE'
const speciesIcon = s => s === 'кіт' ? '🐈' : '🐕'

// ─── Реальні координати міст України [lng, lat] ───────────────────────────
const BASE_COORDS = [
  [30.52, 50.45],  // Київ
  [36.23, 49.99],  // Харків
  [34.98, 48.46],  // Дніпро
  [37.80, 47.97],  // Маріуполь
  [24.02, 49.84],  // Львів
  [28.47, 49.23],  // Вінниця
  [33.39, 47.91],  // Кривий Ріг
  [26.23, 50.61],  // Луцьк
  [31.99, 51.49],  // Чернігів
  [30.73, 46.48],  // Миколаїв
  [25.34, 48.92],  // Тернопіль
  [29.10, 46.48],  // Одеса
  [22.30, 49.83],  // Ужгород
  [32.05, 49.43],  // Черкаси
  [35.14, 47.84],  // Запоріжжя
  [38.01, 47.10],  // Бердянськ
]

const MOCK_ANIMALS = [
  { _id: '0001', name: 'Buddy',   species: 'пес', age: 2, status: 'needs rescue',  description: 'Found roaming Highway 101. Malnourished but friendly.', imageUrl: null },
  { _id: '0002', name: 'Luna',    species: 'кіт', age: 1, status: 'rescued',       description: 'Rescued feline, safely arrived at Shelter Alpha.', imageUrl: null },
  { _id: '0003', name: 'Rex',     species: 'пес', age: 4, status: 'needs rescue',  description: 'Injured stray near Industrial Zone. Possible dehydration.', imageUrl: null },
  { _id: '0004', name: 'Murzyk',  species: 'кіт', age: 3, status: 'in recovery',  description: 'In care at Medical Hub South. Recovering from injury.', imageUrl: null },
  { _id: '0005', name: 'Bars',    species: 'пес', age: 5, status: 'needs rescue',  description: 'Spotted near Warehouse A4. Appears frightened.', imageUrl: null },
  { _id: '0006', name: 'Сніжка', species: 'кіт', age: 2, status: 'rescued',       description: 'Rescued from flooded area. Now safe at Shelter Beta.', imageUrl: null },
  { _id: '0007', name: 'Зірка',  species: 'пес', age: 6, status: 'in recovery',   description: 'Under veterinary observation. Expected full recovery.', imageUrl: null },
  { _id: '0008', name: 'Тигр',   species: 'кіт', age: 1, status: 'needs rescue',  description: 'Kitten found alone near train station. Very young.', imageUrl: null },
]

const FEED = [
  { type:'critical', time:'2m ago',  title:'Injured stray – Industrial Zone', desc:'German Shepherd near Warehouse A4. Possible dehydration.', action:'Dispatch Unit' },
  { type:'progress', time:'12m ago', title:'Transport: Unit RR-02', desc:'Heading to: Medical Hub South' },
  { type:'stable',   time:'28m ago', title:'SUCCESS', desc:'Rescued feline "Luna" safely arrived at Shelter Alpha.' },
]

// ─── DANGER ZONES: точні полігони по межах областей [lat, lng] ───────────
const DANGER_ZONES = [
  // Луганська область (схід)
  [
    [49.60, 38.10], [49.90, 38.60], [50.40, 39.20], [50.80, 39.80],
    [51.40, 39.30], [51.50, 38.40], [51.00, 38.00], [50.60, 37.60],
    [50.20, 37.20], [49.70, 37.40], [49.40, 37.90], [49.60, 38.10],
  ],
  // Донецька область
  [
    [48.10, 37.00], [48.60, 37.50], [49.00, 38.00], [49.40, 38.20],
    [49.20, 38.80], [48.70, 39.20], [48.20, 39.00], [47.70, 38.40],
    [47.40, 37.90], [47.20, 37.20], [47.50, 36.80], [48.00, 36.90],
    [48.10, 37.00],
  ],
  // Запорізька область (прифронтова смуга)
  [
    [47.30, 35.10], [47.70, 35.70], [47.90, 36.40], [47.60, 37.00],
    [47.10, 36.80], [46.80, 36.20], [46.60, 35.60], [46.90, 35.00],
    [47.30, 35.10],
  ],
  // Херсонська область (Лівобережжя + частина правого)
  [
    [46.60, 32.40], [47.00, 32.90], [47.30, 33.60], [47.50, 34.40],
    [47.30, 35.00], [46.80, 34.80], [46.40, 34.20], [46.20, 33.40],
    [46.00, 32.80], [46.30, 32.20], [46.60, 32.40],
  ],
  // Харківська область (прикордонна частина)
  [
    [49.80, 36.20], [50.20, 36.80], [50.40, 37.50], [50.10, 38.00],
    [49.70, 37.60], [49.40, 37.00], [49.60, 36.50], [49.80, 36.20],
  ],
]

const LAYER_URGENCY_MAP = {
  'Rescue Units': 'critical',
  'Shelter Hubs': 'stable',
}

function AnimalCard({ animal, onClose, isHover }) {
  const urgency  = getUrgency(animal.status)
  const color    = getColor(urgency)
  const label    = getLabel(animal.status)
  const idStr    = String(animal._id || '0001').slice(-4).toUpperCase()
  const isCat    = animal.species === 'кіт'
  const age      = animal.age
  const ageLabel = age === 1 ? 'рік' : age < 5 ? 'роки' : 'років'

  return (
    <div
      onClick={e => e.stopPropagation()}
      style={{
        position: 'absolute', bottom: 24, left: '50%',
        transform: 'translateX(-50%)',
        width: 500, zIndex: 9999,
        background: '#f0e8d4', borderRadius: 18,
        overflow: 'hidden', display: 'flex',
        boxShadow: '0 28px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06)',
        animation: 'cardIn .26s cubic-bezier(.34,1.56,.64,1) both',
        opacity: isHover ? 0.92 : 1,
        pointerEvents: isHover ? 'none' : 'auto',
      }}
    >
      <div style={{
        width: 170, flexShrink: 0,
        background: isCat
          ? 'linear-gradient(145deg,#081410,#0c2018)'
          : 'linear-gradient(145deg,#180e04,#301c08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {animal.imageUrl
          ? <img src={animal.imageUrl} alt={animal.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          : <span style={{ fontSize: 88 }}>{speciesIcon(animal.species)}</span>
        }
      </div>

      <div style={{ flex: 1, padding: '16px 18px', position: 'relative' }}>
        {!isHover && (
          <button onClick={onClose} style={{
            position: 'absolute', top: 10, right: 10,
            width: 26, height: 26, borderRadius: '50%',
            background: 'rgba(0,0,0,0.07)', border: 'none',
            color: '#999', fontSize: 16, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>×</button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, paddingRight: 32 }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: '#1a1010', fontFamily: font }}>{animal.name}</span>
          <span style={{
            fontSize: 9, fontWeight: 800, letterSpacing: 1,
            color: '#fff', background: color,
            padding: '3px 10px', borderRadius: 6, flexShrink: 0,
          }}>{label}</span>
        </div>

        <div style={{ fontSize: 11, color: '#a09070', fontFamily: mono, marginBottom: 10 }}>
          ID: #RC-{idStr} • {isCat ? 'Cat' : 'Dog'} • {age} {ageLabel}
        </div>

        <p style={{ fontSize: 12, color: '#5a4030', lineHeight: 1.65, marginBottom: 14 }}>
          {animal.description}
        </p>

        {!isHover && (
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={{
              flex: 1, height: 40, background: '#ff5555', color: '#fff',
              border: 'none', borderRadius: 12, fontSize: 13, fontWeight: 700,
              cursor: 'pointer', fontFamily: font,
              boxShadow: '0 4px 16px rgba(255,60,60,0.4)',
            }}>Assign Dispatch</button>
            <button
              onClick={() => window.location.href = `/animals/${animal._id}`}
              style={{
                width: 40, height: 40, borderRadius: 12,
                background: '#ddd0b8', border: 'none',
                color: '#888', fontSize: 16, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>ℹ</button>
          </div>
        )}

        {isHover && (
          <div style={{ fontSize: 11, color: '#a09070', fontStyle: 'italic' }}>
            Клікни щоб закріпити
          </div>
        )}
      </div>
    </div>
  )
}

// ─── LeafletMap ───────────────────────────────────────────────────────────────
function LeafletMap({ animals, activeLayers, showDangerZone, onHover, onHoverOut, onClick }) {
  const divRef             = useRef(null)
  const mapRef             = useRef(null)
  const dangerLayerGroupRef = useRef(null)
  const [ready, setReady]  = useState(false)

  // Ініціалізація карти — тільки один раз
  useEffect(() => {
    if (!document.getElementById('lf-css')) {
      const l = document.createElement('link')
      l.id = 'lf-css'; l.rel = 'stylesheet'
      l.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(l)
    }

    const load = () => new Promise(res => {
      if (window.L) return res()
      const s = document.createElement('script')
      s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      s.onload = res
      document.head.appendChild(s)
    })

    load().then(() => {
      if (mapRef.current || !divRef.current) return
      const L = window.L
      const map = L.map(divRef.current, {
        center: [49.0, 31.5], zoom: 6,
        zoomControl: false, attributionControl: false,
      })
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map)
      L.control.zoom({ position: 'topright' }).addTo(map)
      mapRef.current = map
      setReady(true)
    })

    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }
      dangerLayerGroupRef.current = null
      setReady(false)
    }
  }, [])

  // Маркери
  useEffect(() => {
    if (!ready || !mapRef.current) return
    const L = window.L
    const map = mapRef.current

    map.eachLayer(layer => {
      if (layer instanceof L.Marker) layer.remove()
    })

    // Використовуємо Set для надійної перевірки
    const activeUrgencies = new Set(
      Object.entries(LAYER_URGENCY_MAP)
        .filter(([layer]) => activeLayers.includes(layer))
        .map(([, u]) => u)
    )

    animals.forEach((animal, i) => {
      const coords = BASE_COORDS[i % BASE_COORDS.length]
      if (!coords) return

      const urgency = getUrgency(animal.status)
      if (!activeUrgencies.has(urgency)) return

      const c = getColor(urgency)
      const isCrit = urgency === 'critical'

      const icon = L.divIcon({
        className: '',
        html: `<div style="position:relative;width:28px;height:28px;cursor:pointer">
          ${isCrit ? `
            <div style="position:absolute;inset:-14px;border-radius:50%;background:${c};opacity:0.18;animation:lp 2.5s ease-in-out infinite"></div>
            <div style="position:absolute;inset:-5px;border-radius:50%;background:${c};opacity:0.12;animation:lp 2.5s ease-in-out infinite .6s"></div>
          ` : ''}
          <div style="position:absolute;inset:3px;border-radius:50%;background:${c};opacity:0.2"></div>
          <div style="position:absolute;inset:8px;border-radius:50%;background:${c};border:2px solid rgba(255,255,255,0.65);box-shadow:0 0 12px ${c}cc,0 0 28px ${c}55"></div>
        </div>`,
        iconSize: [28, 28], iconAnchor: [14, 14],
      })

      const marker = L.marker([coords[1], coords[0]], { icon })
      marker.on('mouseover', () => onHover(animal))
      marker.on('mouseout', () => onHoverOut())
      marker.on('click', e => { e.originalEvent.stopPropagation(); onClick(animal) })
      marker.addTo(map)
    })
  }, [animals, activeLayers, ready])

  // ─── Danger Zones ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!ready || !mapRef.current || !window.L) return
    const L = window.L

    if (dangerLayerGroupRef.current) {
      dangerLayerGroupRef.current.remove()
      dangerLayerGroupRef.current = null
    }

    if (showDangerZone) {
      const group = L.layerGroup()

      DANGER_ZONES.forEach(coords => {
        // coords вже у форматі [lat, lng] — передаємо як є
        L.polygon(coords, {
          color: '#ff4400',
          fillColor: '#ff2200',
          fillOpacity: 0.18,
          weight: 1.5,
          dashArray: '8 5',
          opacity: 0.65,
        }).addTo(group)
      })

      group.addTo(mapRef.current)
      dangerLayerGroupRef.current = group
    }
  }, [showDangerZone, ready])

  return (
    <>
      <style>{`
        @keyframes lp { 0%,100%{transform:scale(1);opacity:0.18} 50%{transform:scale(1.8);opacity:0} }
        .leaflet-container{background:#07070f!important;cursor:grab!important}
        .leaflet-container:active{cursor:grabbing!important}
        .leaflet-control-zoom{border:none!important;box-shadow:none!important;margin-top:72px!important;margin-right:14px!important}
        .leaflet-control-zoom a{
          width:36px!important;height:36px!important;line-height:36px!important;
          background:rgba(8,8,20,0.93)!important;backdrop-filter:blur(12px)!important;
          border:1px solid #1e1e30!important;color:#aaa!important;
          font-size:18px!important;font-weight:700!important;
          border-radius:10px!important;margin-bottom:6px!important;display:block!important;
        }
        .leaflet-control-zoom a:hover{color:#fff!important}
        @keyframes cardIn{
          from{opacity:0;transform:translateX(-50%) translateY(20px) scale(0.95)}
          to  {opacity:1;transform:translateX(-50%) translateY(0) scale(1)}
        }
      `}</style>
      <div ref={divRef} style={{ width: '100%', height: '100%' }} />
    </>
  )
}

const ALL_LAYERS = [
  { l:'Rescue Units', c:'#ff8c00' },
  { l:'Shelter Hubs', c:'#888'    },
  { l:'Danger Zones', c:'#ff4444' },
]

export default function AnimalsPage() {
  const [animals, setAnimals]           = useState(MOCK_ANIMALS)
  const [sel, setSel]                   = useState(null)
  const [hovered, setHovered]           = useState(null)
  const [activeLayers, setActiveLayers] = useState(['Rescue Units', 'Danger Zones'])

  useEffect(() => {
    fetch('https://safetails-production-8790.up.railway.app/api/animals')
      .then(r => r.json())
      .then(d => { if (d && d.length) setAnimals(d) })
      .catch(() => {})
  }, [])

  const toggleLayer = (layer) => {
    setActiveLayers(prev =>
      prev.includes(layer) ? prev.filter(l => l !== layer) : [...prev, layer]
    )
  }

  const handleHover   = (animal) => { if (!sel) setHovered(animal) }
  const handleHoverOut = () => { if (!sel) setHovered(null) }
  const handleClick   = (animal) => { setSel(animal); setHovered(null) }

  const showDangerZone = activeLayers.includes('Danger Zones')

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:#252525;border-radius:2px}
      `}</style>

      <div style={{ display:'flex', height:'calc(100vh - 60px)', fontFamily:font, background:'#08080e', color:'#e0e0e0', overflow:'hidden' }}>

        {/* ── Sidebar ── */}
        <aside style={{ width:230, background:'#0d0d14', borderRight:'1px solid #1a1a28', display:'flex', flexDirection:'column', flexShrink:0 }}>
          <div style={{ padding:'16px 14px', borderBottom:'1px solid #1a1a28' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, background:'#1a1a28', border:'1px solid #2a2a40', borderRadius:10, padding:'10px 12px' }}>
              <div style={{ width:32, height:32, borderRadius:8, background:'linear-gradient(135deg,#ff6b2b,#ff4500)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <span style={{ fontSize:14, color:'#fff' }}>✦</span>
              </div>
              <div>
                <div style={{ fontSize:11, fontWeight:600, color:'#fff' }}>Command Center</div>
                <div style={{ fontSize:9, color:'#555', fontFamily:mono, letterSpacing:1 }}>SECTOR 7 DELTA</div>
              </div>
            </div>
          </div>

          <nav style={{ borderBottom:'1px solid #1a1a28' }}>
            {[
              { label:'Dashboard',      icon:'▦', path:'/',        act:false },
              { label:'Active Rescues', icon:'✦', path:'/animals', act:true  },
              { label:'Dispatch',       icon:'⊹', path:'#',        act:false },
              { label:'Medical Log',    icon:'♥', path:'#',        act:false },
              { label:'Archive',        icon:'▤', path:'#',        act:false },
            ].map(({ label, icon, path, act }) => (
              <a key={label} href={path} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 16px', background:act?'#1a1a28':'transparent', color:act?'#ff6b2b':'#555', fontSize:12, textDecoration:'none', borderLeft:act?'2px solid #ff6b2b':'2px solid transparent', fontWeight:act?600:400 }}>
                <span style={{ fontSize:14 }}>{icon}</span>{label}
              </a>
            ))}
          </nav>

          <div style={{ flex:1, overflowY:'auto', padding:'12px' }}>
            <div style={{ fontSize:9, color:'#555', letterSpacing:2, fontFamily:mono, marginBottom:10 }}>URGENT FEED</div>
            {FEED.map((item, i) => {
              const c = item.type==='critical'?'#ff4444':item.type==='stable'?'#22c55e':'#ff8c00'
              return (
                <div key={i} style={{ background:item.type==='critical'?'#180808':item.type==='stable'?'#081808':'#181008', border:`1px solid ${c}28`, borderRadius:10, padding:'11px 12px', marginBottom:10 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                    <span style={{ fontSize:8, fontWeight:700, letterSpacing:1.5, fontFamily:mono, color:c, background:`${c}18`, padding:'2px 8px', borderRadius:20 }}>{item.type.toUpperCase()}</span>
                    <span style={{ fontSize:9, color:'#444' }}>{item.time}</span>
                  </div>
                  <div style={{ fontSize:11, fontWeight:600, color:'#ddd', marginBottom:4 }}>{item.title}</div>
                  <div style={{ fontSize:10, color:'#666', lineHeight:1.5, marginBottom:item.action?10:0 }}>{item.desc}</div>
                  {item.action && (
                    <button style={{ width:'100%', background:`${c}18`, color:c, border:`1px solid ${c}40`, borderRadius:8, padding:'7px 0', fontSize:10, fontWeight:600, cursor:'pointer', fontFamily:font }}>
                      {item.action}
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          <div style={{ padding:'12px 14px', borderTop:'1px solid #1a1a28' }}>
            <button style={{ width:'100%', background:'linear-gradient(90deg,#ff6b2b,#e55a1f)', color:'#fff', border:'none', borderRadius:22, padding:'10px 0', fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:font }}>
              New Mission
            </button>
            <div style={{ marginTop:10, display:'flex', flexDirection:'column', gap:6 }}>
              {['? Support','→ Sign Out'].map(l => <div key={l} style={{ fontSize:11, color:'#555', cursor:'pointer' }}>{l}</div>)}
            </div>
          </div>
        </aside>

        {/* ── Map area ── */}
        <div style={{ flex:1, position:'relative', overflow:'hidden' }} onClick={() => { setSel(null); setHovered(null) }}>

          {/* Top bar */}
          <div style={{ position:'absolute', top:14, left:14, zIndex:1000, display:'flex', gap:10 }}>
            <div style={{ background:'rgba(8,8,20,0.92)', backdropFilter:'blur(12px)', border:'1px solid #1e1e30', borderRadius:12, padding:'10px 16px', display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ width:8, height:8, borderRadius:'50%', background:'#22c55e', display:'inline-block', boxShadow:'0 0 8px #22c55e88' }}/>
              <span style={{ fontSize:13, fontWeight:600, color:'#fff' }}>Live Operation</span>
            </div>
            {[
              { l:'RESCUES TODAY', v: animals.filter(a => a.status === 'rescued').length.toString().padStart(2,'0') },
              { l:'ACTIVE UNITS',  v: animals.filter(a => a.status === 'needs rescue').length.toString().padStart(2,'0') },
            ].map(({l,v}) => (
              <div key={l} style={{ background:'rgba(8,8,20,0.92)', backdropFilter:'blur(12px)', border:'1px solid #1e1e30', borderRadius:12, padding:'10px 16px' }}>
                <div style={{ fontSize:8, color:'#555', letterSpacing:1.5, fontFamily:mono }}>{l}</div>
                <div style={{ fontSize:20, fontWeight:700, color:'#ff6b2b', fontFamily:mono }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Layer controls */}
          <div style={{ position:'absolute', bottom:14, left:14, zIndex:1000, background:'rgba(8,8,20,0.92)', backdropFilter:'blur(12px)', border:'1px solid #1e1e30', borderRadius:12, padding:'12px 14px' }}>
            <div style={{ fontSize:8, color:'#555', letterSpacing:2, fontFamily:mono, marginBottom:10 }}>MAP LAYERS</div>
            {ALL_LAYERS.map(({l, c}) => {
              const on = activeLayers.includes(l)
              return (
                <div key={l} onClick={e => { e.stopPropagation(); toggleLayer(l) }}
                  style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8, cursor:'pointer' }}>
                  <div style={{ width:14, height:14, borderRadius:4, background:on?`${c}33`:'transparent', border:`2px solid ${on?c:'#333'}`, display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s' }}>
                    {on && <span style={{ color:c, fontSize:9 }}>✓</span>}
                  </div>
                  <span style={{ fontSize:11, color: on ? '#ccc' : '#555', transition:'color 0.15s' }}>{l}</span>
                </div>
              )
            })}
          </div>

          <LeafletMap
            animals={animals}
            activeLayers={activeLayers}
            showDangerZone={showDangerZone}
            onHover={handleHover}
            onHoverOut={handleHoverOut}
            onClick={handleClick}
          />

          {hovered && !sel && <AnimalCard animal={hovered} onClose={() => {}} isHover={true} />}
          {sel && <AnimalCard animal={sel} onClose={() => setSel(null)} isHover={false} />}
        </div>
      </div>
    </>
  )
}