import { useState, useEffect, useRef } from 'react'

const font = "'DM Sans', 'Inter', sans-serif"
const mono = "'DM Mono', 'Courier New', monospace"

const getUrgency  = s => s === 'needs rescue' ? 'critical' : s === 'in rescue' ? 'progress' : s === 'rescued' ? 'stable' : s === 'in recovery' ? 'progress' : 'stable'
const getColor    = u => u === 'critical' ? '#ff3333' : u === 'stable' ? '#22c55e' : '#ff8c00'
const getLabel    = s => s === 'needs rescue' ? 'URGENT' : s === 'in rescue' ? 'IN RESCUE' : s === 'rescued' ? 'RESCUED' : s === 'in recovery' ? 'IN CARE' : 'AVAILABLE'
const speciesIcon = s => s === 'кіт' ? '🐈' : '🐕'

const BASE_COORDS = [
  [30.52, 50.45], [36.23, 49.99], [34.98, 48.46], [37.80, 47.97],
  [24.02, 49.84], [28.47, 49.23], [33.39, 47.91], [26.23, 50.61],
  [31.99, 51.49], [30.73, 46.48], [25.34, 48.92], [29.10, 46.48],
  [22.30, 49.83], [32.05, 49.43], [35.14, 47.84], [38.01, 47.10],
]

const MOCK_ANIMALS = [
  { _id: '0001', name: 'Buddy',  species: 'пес', gender: 'male',   age: 2, status: 'needs rescue', description: 'Found roaming Highway 101. Malnourished but friendly.',     imageUrl: null },
  { _id: '0002', name: 'Luna',   species: 'кіт', gender: 'female', age: 1, status: 'rescued',      description: 'Rescued feline, safely arrived at Shelter Alpha.',          imageUrl: null },
  { _id: '0003', name: 'Rex',    species: 'пес', gender: 'male',   age: 4, status: 'needs rescue', description: 'Injured stray near Industrial Zone. Possible dehydration.', imageUrl: null },
  { _id: '0004', name: 'Murzyk', species: 'кіт', gender: 'male',   age: 3, status: 'in rescue',    description: 'In care at Medical Hub South. Recovering from injury.',      imageUrl: null },
  { _id: '0005', name: 'Bars',   species: 'пес', gender: 'male',   age: 5, status: 'needs rescue', description: 'Spotted near Warehouse A4. Appears frightened.',            imageUrl: null },
  { _id: '0006', name: 'Сніжка', species: 'кіт', gender: 'female', age: 2, status: 'rescued',      description: 'Rescued from flooded area. Now safe at Shelter Beta.',      imageUrl: null },
  { _id: '0007', name: 'Зірка',  species: 'пес', gender: 'female', age: 6, status: 'in rescue',    description: 'Under veterinary observation. Expected full recovery.',      imageUrl: null },
  { _id: '0008', name: 'Тигр',   species: 'кіт', gender: 'male',   age: 1, status: 'needs rescue', description: 'Kitten found alone near train station. Very young.',        imageUrl: null },
]

const ALL_LAYERS = [
  { l: 'Critical Units', c: '#ff3333', ua: 'Критичні місії'       },
  { l: 'Rescue Units',   c: '#ff8c00', ua: 'В процесі виконання'  },
  { l: 'Shelter Hubs',   c: '#22c55e', ua: 'Врятовані пухнастики' },
]

const LAYER_URGENCY_MAP = {
  'Critical Units': 'critical',
  'Rescue Units':   'progress',
  'Shelter Hubs':   'stable',
}

const DANGER_NAMES = ['Луганська', 'Донецька', 'Запорізька', 'Херсонська', 'Харківська']

function AnimalCard({ animal, onClose, isHover }) {
  const urgency  = getUrgency(animal.status)
  const color    = getColor(urgency)
  const label    = getLabel(animal.status)
  const idStr    = String(animal._id || '0001').slice(-4).toUpperCase()
  const isCat    = animal.species === 'кіт'
  const age      = animal.age
  const ageLabel = age === 1 ? 'рік' : age < 5 ? 'роки' : 'років'
  const isFemale     = ['female','f','Female','жіноча','дівчинка'].includes(animal.gender) || ['female','f'].includes(animal.sex)
  const genderSymbol = isFemale ? '♀' : '♂'
  const genderLabel  = isFemale ? 'Female' : 'Male'

  return (
    <div
      onClick={e => e.stopPropagation()}
      style={{
        position: 'absolute', bottom: 24, left: '50%',
        transform: 'translateX(-50%)',
        width: 520, zIndex: 9999,
        background: '#f5f0e8',
        border: '1px solid #e0d8cc',
        borderRadius: 20,
        overflow: 'hidden', display: 'flex',
        boxShadow: '0 28px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.04)',
        animation: 'cardIn .26s cubic-bezier(.34,1.56,.64,1) both',
        opacity: isHover ? 0.92 : 1,
        pointerEvents: isHover ? 'none' : 'auto',
      }}
    >
      <div style={{
        width: 180, flexShrink: 0,
        background: isCat
          ? 'linear-gradient(145deg,#f5f0e8,#ede8dc)'
          : 'linear-gradient(145deg,#f5f0e8,#ede8dc)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', position: 'relative',
      }}>
        {animal.imageUrl
          ? <img src={animal.imageUrl} alt={animal.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ fontSize: 90, lineHeight: 1 }}>{speciesIcon(animal.species)}</span>
        }
        <div style={{
          position: 'absolute', top: 10, left: 10,
          background: 'rgba(0,0,0,0.15)', border: '1px solid rgba(0,0,0,0.15)',
          borderRadius: 8, padding: '3px 8px',
          fontSize: 10, color: '#444', fontFamily: mono,
        }}>{genderSymbol} {genderLabel}</div>
      </div>

      <div style={{ flex: 1, padding: '18px 20px', position: 'relative' }}>
        {!isHover && (
          <button onClick={onClose} style={{
            position: 'absolute', top: 12, right: 12,
            width: 26, height: 26, borderRadius: '50%',
            background: 'rgba(0,0,0,0.08)', border: 'none',
            color: '#888', fontSize: 16, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>×</button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, paddingRight: 32 }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', fontFamily: font }}>{animal.name}</span>
          <span style={{
            fontSize: 9, fontWeight: 800, letterSpacing: 1,
            color: '#fff', background: color,
            padding: '3px 10px', borderRadius: 6, flexShrink: 0,
          }}>{label}</span>
        </div>

        <div style={{ fontSize: 11, color: '#777', fontFamily: mono, marginBottom: 12 }}>
          ID: #RC-{idStr} • {isCat ? 'Cat' : 'Dog'} • {age} {ageLabel}
          {animal.city && ` • 📍 ${animal.city}`}
        </div>

        <p style={{ fontSize: 12, color: '#555', lineHeight: 1.65, marginBottom: 16 }}>
          {animal.description}
        </p>

        {!isHover && (
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => window.location.href = `/animals/${animal._id}`}
              style={{
                flex: 1, height: 42,
                background: 'rgba(255,255,255,0.07)',
                color: '#ccc', border: '1px solid #2a2a3a', borderRadius: 12,
                fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: font,
              }}>
              Переглянути інформацію
            </button>

          </div>
        )}

        {isHover && (
          <div style={{ fontSize: 11, color: '#888', fontStyle: 'italic' }}>
            Клікни щоб закріпити
          </div>
        )}
      </div>
    </div>
  )
}

function LeafletMap({ animals, activeLayers, showDangerZone, onHover, onHoverOut, onClick }) {
  const divRef              = useRef(null)
  const mapRef              = useRef(null)
  const dangerLayerGroupRef = useRef(null)
  const [ready, setReady]   = useState(false)

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

  useEffect(() => {
    if (!ready || !mapRef.current) return
    const L = window.L
    const map = mapRef.current
    map.eachLayer(layer => { if (layer instanceof L.Marker) layer.remove() })
    const activeUrgencies = new Set(
      Object.entries(LAYER_URGENCY_MAP)
        .filter(([layer]) => activeLayers.includes(layer))
        .map(([, u]) => u)
    )
    animals.forEach((animal, i) => {
      const urgency = getUrgency(animal.status)
      if (!activeUrgencies.has(urgency)) return
      let lat, lng
      if (animal.lat != null && animal.lng != null) {
        lat = animal.lat; lng = animal.lng
      } else {
        const fallback = BASE_COORDS[i % BASE_COORDS.length]
        lng = fallback[0]; lat = fallback[1]
      }
      const c      = getColor(urgency)
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
      const marker = L.marker([lat, lng], { icon })
      marker.on('mouseover', () => onHover(animal))
      marker.on('mouseout',  () => onHoverOut())
      marker.on('click', e => { e.originalEvent.stopPropagation(); onClick(animal) })
      marker.addTo(map)
    })
  }, [animals, activeLayers, ready])

  useEffect(() => {
    if (!ready || !mapRef.current || !window.L) return
    const L = window.L
    if (dangerLayerGroupRef.current) {
      dangerLayerGroupRef.current.remove()
      dangerLayerGroupRef.current = null
    }
    if (!showDangerZone) return
    fetch('https://raw.githubusercontent.com/EugeneBorshch/ukraine_geojson/master/UA_FULL.json')
      .then(r => r.json())
      .then(geojson => {
        if (!mapRef.current) return
        const group = L.layerGroup()
        L.geoJSON(geojson, {
          filter: feature => {
            const name = feature.properties?.name || feature.properties?.NAME_1 || ''
            return DANGER_NAMES.some(n => name.includes(n))
          },
          style: { color: '#cc3300', fillColor: '#cc2200', fillOpacity: 0.45, weight: 1.5, opacity: 0.9 },
          onEachFeature: (_, layer) => { layer.on('click', e => e.originalEvent.stopPropagation()) },
        }).addTo(group)
        group.addTo(mapRef.current)
        dangerLayerGroupRef.current = group
      })
      .catch(() => {})
  }, [showDangerZone, ready])

  return (
    <>
      <style>{`
        @keyframes lp { 0%,100%{transform:scale(1);opacity:0.18} 50%{transform:scale(1.8);opacity:0} }
        .leaflet-container{background:#07070f!important;cursor:grab!important}
        .leaflet-container:active{cursor:grabbing!important}
        .leaflet-control-zoom{border:none!important;box-shadow:none!important;margin-top:16px!important;margin-right:14px!important}
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

export default function AnimalsPage() {
  const [animals, setAnimals]           = useState(MOCK_ANIMALS)
  const [sel, setSel]                   = useState(null)
  const [hovered, setHovered]           = useState(null)
  // Danger Zones removed from default active layers
  const [activeLayers, setActiveLayers] = useState(['Critical Units', 'Rescue Units', 'Shelter Hubs'])

  useEffect(() => {
    fetch('https://safetails-production-8790.up.railway.app/api/animals')
      .then(r => r.json())
      .then(d => { if (d && d.length) setAnimals(d) })
      .catch(() => {})
  }, [])

  const toggleLayer    = layer => setActiveLayers(prev =>
    prev.includes(layer) ? prev.filter(l => l !== layer) : [...prev, layer]
  )
  const handleHover    = animal => { if (!sel) setHovered(animal) }
  const handleHoverOut = () => { if (!sel) setHovered(null) }
  const handleClick    = animal => { setSel(animal); setHovered(null) }
  const showDangerZone = false // Danger Zones layer removed

  const criticalAnimals   = animals.filter(a => a.status === 'needs rescue')
  const inProgressAnimals = animals.filter(a => a.status === 'in rescue')
  const successAnimals    = animals.filter(a => a.status === 'rescued')

  const panel = {
    background: 'rgba(8,8,20,0.88)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid #1e1e2e',
    borderRadius: 16,
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:#252535;border-radius:2px}
        button:hover{filter:brightness(1.1)}
      `}</style>

      <div
        style={{
          position: 'relative', width: '100%',
          height: 'calc(100vh - 60px)',
          fontFamily: font, overflow: 'hidden',
        }}
        onClick={() => { setSel(null); setHovered(null) }}
      >
        <LeafletMap
          animals={animals}
          activeLayers={activeLayers}
          showDangerZone={showDangerZone}
          onHover={handleHover}
          onHoverOut={handleHoverOut}
          onClick={handleClick}
        />

        <div
          onClick={e => e.stopPropagation()}
          style={{
            position: 'absolute', top: 14, left: 14, zIndex: 1000,
            display: 'flex', flexDirection: 'column', gap: 10,
            width: 250,
          }}
        >
          {/* ① LIVE OPERATION */}
          <div style={{ ...panel, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: '#22c55e', flexShrink: 0,
                boxShadow: '0 0 8px #22c55e99',
              }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Активна операція</span>
            </div>
            <div style={{ display: 'flex', gap: 0 }}>
              {[
                { val: successAnimals.length,  label: 'ВРЯТОВАНО СЬОГОДНІ' },
                { val: criticalAnimals.length, label: 'АКТИВНІ ОДИНИЦІ'  },
              ].map(({ val, label }, i) => (
                <div key={label} style={{
                  flex: 1,
                  borderLeft: i === 1 ? '1px solid #1e1e2e' : 'none',
                  paddingLeft: i === 1 ? 14 : 0,
                }}>
                  <div style={{ fontSize: 26, fontWeight: 700, color: '#fff', fontFamily: mono, lineHeight: 1 }}>
                    {String(val).padStart(2, '0')}
                  </div>
                  <div style={{ fontSize: 8, color: '#444', letterSpacing: 1.5, fontFamily: mono, marginTop: 3 }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, color: '#555', fontFamily: mono, letterSpacing: 2, padding: '0 4px' }}>
            Термінова стрічка
          </div>

          {/* ② CRITICAL */}
          <div style={{ ...panel, borderColor: '#ff333360', padding: '14px 14px', background: 'linear-gradient(135deg, rgba(180,20,20,0.45) 0%, rgba(120,10,10,0.35) 100%)', backdropFilter: 'blur(16px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{
                fontSize: 9, fontWeight: 800, letterSpacing: 1.5, fontFamily: mono,
                color: '#fff', background: 'rgba(255,60,60,0.5)', padding: '3px 10px', borderRadius: 20,
              }}>КРИТИЧНО</span>
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', fontFamily: mono }}>
                {criticalAnimals.length > 0 ? `${criticalAnimals.length} на карті` : 'спокійно'}
              </span>
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)', lineHeight: 1.7, fontWeight: 500 }}>
              {criticalAnimals.length > 0
                ? `На карті ${criticalAnimals.length} тварин, яким зараз потрібна допомога. Вони самотні, злякані або поранені — і кожна хвилина на рахунку. Волонтери вже сповіщені.`
                : `Наразі критичних випадків немає. Всі відомі тварини під наглядом або вже в безпеці. Нові сигнали з'являться тут автоматично.`
              }
            </div>
          </div>

          {/* ③ IN PROGRESS */}
          <div style={{ ...panel, borderColor: '#ff8c0060', padding: '14px 14px', background: 'linear-gradient(135deg, rgba(180,90,0,0.45) 0%, rgba(120,55,0,0.35) 100%)', backdropFilter: 'blur(16px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{
                fontSize: 9, fontWeight: 800, letterSpacing: 1.5, fontFamily: mono,
                color: '#fff', background: 'rgba(255,140,0,0.5)', padding: '3px 10px', borderRadius: 20,
              }}>В ПРОЦЕСІ</span>
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', fontFamily: mono }}>
                {inProgressAnimals.length > 0 ? `${inProgressAnimals.length} у дорозі` : 'в очікуванні'}
              </span>
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)', lineHeight: 1.7, fontWeight: 500 }}>
              {inProgressAnimals.length > 0
                ? `${inProgressAnimals.length} рятувальних місій зараз активні. Групи волонтерів у дорозі — тварини отримують допомогу прямо зараз.`
                : 'Усі рятувальні групи вільні. Чергові волонтери готові до виїзду — очікують підтвердження нових координат.'
              }
            </div>
          </div>

          {/* ④ SUCCESS */}
          <div style={{ ...panel, borderColor: '#22c55e60', padding: '14px 14px', background: 'linear-gradient(135deg, rgba(20,120,60,0.45) 0%, rgba(10,80,35,0.35) 100%)', backdropFilter: 'blur(16px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <span style={{
                width: 17, height: 17, borderRadius: '50%', background: '#22c55e',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, color: '#fff', fontWeight: 700, flexShrink: 0,
              }}>✓</span>
              <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.5, fontFamily: mono, color: '#fff' }}>
                УСПІШНО
              </span>
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', marginLeft: 'auto', fontFamily: mono }}>
                {successAnimals.length > 0 ? `${successAnimals.length} сьогодні` : 'очікуємо'}
              </span>
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)', lineHeight: 1.7, fontWeight: 500 }}>
              {successAnimals.length > 0
                ? `Сьогодні ${successAnimals.length} пухнастиків знайшли безпечне місце. Вони нагодовані, оглянуті ветеринаром і оточені турботою — попереду нове життя.`
                : 'Сьогоднішніх порятунків ще не зафіксовано. Але щойно перший пухнастик опиниться в безпеці — ця стрічка стане зеленіти.'
              }
            </div>
          </div>

          {/* ⑤ MAP LAYERS */}
          <div style={{ ...panel, padding: '14px 14px' }}>
            <div style={{ fontSize: 9, color: '#444', letterSpacing: 2, fontFamily: mono, marginBottom: 10 }}>
              ШАР КАРТИ
            </div>
            {ALL_LAYERS.map(({ l, c, ua }) => {
              const on = activeLayers.includes(l)
              const labelUa = ua
              return (
                <div
                  key={l}
                  onClick={e => { e.stopPropagation(); toggleLayer(l) }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 10px', marginBottom: 5,
                    borderRadius: 10, cursor: 'pointer',
                    background: on ? `${c}0e` : 'transparent',
                    border: `1px solid ${on ? c + '28' : '#1e1e2a'}`,
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{
                    width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                    background: on ? `${c}25` : 'transparent',
                    border: `2px solid ${on ? c : '#2e2e3e'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s',
                  }}>
                    {on && <span style={{ color: c, fontSize: 10, fontWeight: 700, lineHeight: 1 }}>✓</span>}
                  </div>
                  <span style={{
                    fontSize: 12, color: on ? '#ccc' : '#444',
                    fontWeight: on ? 600 : 400, transition: 'color 0.15s', flex: 1,
                  }}>{labelUa}</span>
                  <div style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: on ? c : '#2a2a3a',
                    boxShadow: on ? `0 0 6px ${c}88` : 'none',
                    transition: 'all 0.15s',
                  }} />
                </div>
              )
            })}
          </div>
        </div>

        {hovered && !sel && <AnimalCard animal={hovered} onClose={() => {}} isHover={true} />}
        {sel      && <AnimalCard animal={sel}    onClose={() => setSel(null)} isHover={false} />}
      </div>
    </>
  )
}