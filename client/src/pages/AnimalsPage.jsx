import { useState, useEffect, useRef } from 'react'

const font = "'DM Sans', 'Inter', sans-serif"
const mono = "'DM Mono', 'Courier New', monospace"

const PINS = [
  { id: 1,  coords: [30.52, 50.45], name: 'Cooper', species: 'Dog', status: 'CRITICAL', urgency: 'critical', age: '2y', desc: 'Severe dehydration near industrial zone, Kyiv region' },
  { id: 2,  coords: [24.02, 49.84], name: 'Luna',   species: 'Cat', status: 'STABLE',   urgency: 'stable',   age: '4y', desc: 'Safe haven post-op recovery, Lviv shelter' },
  { id: 3,  coords: [36.23, 49.99], name: 'Buddy',  species: 'Dog', status: 'URGENT',   urgency: 'critical', age: '3y', desc: 'Found on highway malnourished, Kharkiv area' },
  { id: 4,  coords: [34.98, 48.46], name: 'Rex',    species: 'Dog', status: 'URGENT',   urgency: 'critical', age: '5y', desc: 'Trapped near flood zone, Dnipro oblast' },
  { id: 5,  coords: [33.39, 47.91], name: 'Sonya',  species: 'Cat', status: 'STABLE',   urgency: 'stable',   age: '2y', desc: 'Rescued, awaiting shelter transfer' },
  { id: 6,  coords: [28.47, 49.23], name: 'Mriya',  species: 'Cat', status: 'STABLE',   urgency: 'stable',   age: '1y', desc: 'Found in forest, mild injury, Rivne region' },
  { id: 7,  coords: [32.05, 49.43], name: 'Zhora',  species: 'Dog', status: 'CRITICAL', urgency: 'critical', age: '3y', desc: 'Abandoned near river crossing, Vinnytsia' },
  { id: 8,  coords: [38.99, 47.83], name: 'Dasha',  species: 'Dog', status: 'IN CARE',  urgency: 'progress', age: '1y', desc: 'Unit RR-02 heading to Medical Hub South' },
  { id: 9,  coords: [26.23, 50.61], name: 'Bars',   species: 'Dog', status: 'CRITICAL', urgency: 'critical', age: '4y', desc: 'Critical injury, needs immediate vet, Lutsk' },
  { id: 10, coords: [31.99, 51.49], name: 'Buket',  species: 'Cat', status: 'URGENT',   urgency: 'critical', age: '6m', desc: 'Multiple animals reported, Chernihiv area' },
  { id: 11, coords: [35.0,  48.45], name: 'Mila',   species: 'Cat', status: 'IN CARE',  urgency: 'progress', age: '1y', desc: 'Transport en route to medical hub south' },
  { id: 12, coords: [30.73, 46.48], name: 'Ghost',  species: 'Dog', status: 'CRITICAL', urgency: 'critical', age: '3y', desc: 'Injured stray near Odesa warehouse district' },
]

const UC = { critical: '#ff3333', stable: '#22c55e', progress: '#ff8c00' }

const FEED = [
  { type: 'critical', time: '2m ago',  title: 'Injured stray – Industrial Zone', desc: 'German Shepherd near Warehouse A4. Possible dehydration.', action: 'Dispatch Unit' },
  { type: 'progress', time: '12m ago', title: 'Transport: Unit RR-02', desc: 'Heading to: Medical Hub South', img: '🐕' },
  { type: 'stable',   time: '28m ago', title: 'SUCCESS', desc: 'Rescued feline "Luna" safely arrived at Shelter Alpha.' },
]

function useLeaflet(mapRef, pins, onPinClick) {
  const instanceRef = useRef(null)

  useEffect(() => {
    if (!mapRef.current || instanceRef.current) return

    // Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    const init = (L) => {
      if (instanceRef.current || !mapRef.current) return

      const map = L.map(mapRef.current, {
        center: [49.0, 31.5],
        zoom: 6,
        zoomControl: false,
        attributionControl: false,
      })
      instanceRef.current = map

      // Темні тайли CartoDB
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(map)

      // Кастомний zoom control
      L.control.zoom({ position: 'topright' }).addTo(map)

      // Піни
      pins.forEach(pin => {
        const c = UC[pin.urgency]
        const icon = L.divIcon({
          className: '',
          html: `<div class="pin-wrap" data-urgency="${pin.urgency}" style="--c:${c}">
            ${pin.urgency === 'critical' ? '<div class="pin-pulse"></div>' : ''}
            <div class="pin-outer"></div>
            <div class="pin-inner"></div>
          </div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        })
        const marker = L.marker([pin.coords[1], pin.coords[0]], { icon })
        marker.on('click', () => onPinClick(pin))
        marker.addTo(map)
      })
    }

    if (window.L) {
      init(window.L)
    } else {
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload = () => init(window.L)
      document.head.appendChild(script)
    }

    return () => {
      if (instanceRef.current) {
        instanceRef.current.remove()
        instanceRef.current = null
      }
    }
  }, [])
}

function MapView({ pins, onPinClick }) {
  const mapRef = useRef(null)
  useLeaflet(mapRef, pins, onPinClick)

  return (
    <>
      <style>{`
        @keyframes pinPulse {
          0%,100% { transform:scale(1); opacity:0.5; }
          50%      { transform:scale(2.5); opacity:0; }
        }
        .pin-wrap {
          position: relative;
          width: 24px; height: 24px;
        }
        .pin-pulse {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: var(--c);
          opacity: 0.4;
          animation: pinPulse 2s ease-in-out infinite;
        }
        .pin-outer {
          position: absolute;
          inset: 2px;
          border-radius: 50%;
          background: var(--c);
          opacity: 0.22;
        }
        .pin-inner {
          position: absolute;
          inset: 7px;
          border-radius: 50%;
          background: var(--c);
          border: 1.5px solid rgba(255,255,255,0.45);
          box-shadow: 0 0 8px var(--c);
        }
        .leaflet-container { background: #07070f !important; cursor: grab !important; }
        .leaflet-container:active { cursor: grabbing !important; }
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: none !important;
          margin-top: 16px !important;
          margin-right: 16px !important;
        }
        .leaflet-control-zoom a {
          width: 36px !important; height: 36px !important;
          line-height: 36px !important;
          background: rgba(10,10,20,0.92) !important;
          backdrop-filter: blur(12px) !important;
          border: 1px solid #1e1e30 !important;
          color: #aaa !important;
          font-size: 18px !important;
          font-weight: 700 !important;
          border-radius: 10px !important;
          margin-bottom: 6px !important;
          display: block !important;
        }
        .leaflet-control-zoom a:hover { background: rgba(20,20,35,0.95) !important; color: #fff !important; }
        .leaflet-tile-pane { filter: saturate(0.9) brightness(0.95); }
      `}</style>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </>
  )
}

export default function AnimalsPage() {
  const [sel, setSel] = useState(null)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }
        @keyframes pop {
          from { opacity:0; transform:scale(0.93) translateY(14px); }
          to   { opacity:1; transform:none; }
        }
      `}</style>

      <div style={{ display:'flex', height:'calc(100vh - 60px)', fontFamily:font, background:'#08080e', color:'#e0e0e0', overflow:'hidden' }}>

        {/* ══ SIDEBAR ══ */}
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
                  {item.img && <div style={{ fontSize:22, marginBottom:4 }}>{item.img}</div>}
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

        {/* ══ MAP AREA ══ */}
        <div style={{ flex:1, position:'relative', overflow:'hidden' }} onClick={() => setSel(null)}>

          {/* Top bar */}
          <div style={{ position:'absolute', top:16, left:16, zIndex:1000, display:'flex', gap:10 }}>
            <div style={{ background:'rgba(10,10,20,0.92)', backdropFilter:'blur(12px)', border:'1px solid #1e1e30', borderRadius:12, padding:'10px 16px', display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ width:8, height:8, borderRadius:'50%', background:'#22c55e', display:'inline-block', boxShadow:'0 0 8px #22c55e88' }}/>
              <span style={{ fontSize:13, fontWeight:600, color:'#fff' }}>Live Operation</span>
            </div>
            {[{ l:'RESCUES TODAY', v:'24' },{ l:'ACTIVE UNITS', v:'08' }].map(({ l, v }) => (
              <div key={l} style={{ background:'rgba(10,10,20,0.92)', backdropFilter:'blur(12px)', border:'1px solid #1e1e30', borderRadius:12, padding:'10px 16px' }}>
                <div style={{ fontSize:8, color:'#555', letterSpacing:1.5, fontFamily:mono }}>{l}</div>
                <div style={{ fontSize:20, fontWeight:700, color:'#ff6b2b', fontFamily:mono }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Layers panel */}
          <div style={{ position:'absolute', bottom:sel?230:16, right:16, zIndex:1000, background:'rgba(10,10,20,0.92)', backdropFilter:'blur(12px)', border:'1px solid #1e1e30', borderRadius:12, padding:'12px 14px', transition:'bottom 0.3s ease' }}>
            <div style={{ fontSize:8, color:'#555', letterSpacing:2, fontFamily:mono, marginBottom:10 }}>MAP LAYERS</div>
            {[
              { l:'Rescue Units',    c:'#ff8c00', on:true  },
              { l:'Shelter Hubs',   c:'#888',    on:false },
              { l:'Danger Zones',   c:'#ff4444', on:true  },
              { l:'Volunteer Grid', c:'#888',    on:false },
            ].map(({ l, c, on }) => (
              <div key={l} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                <div style={{ width:14, height:14, borderRadius:4, background:on?`${c}33`:'transparent', border:`2px solid ${on?c:'#333'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {on && <span style={{ color:c, fontSize:9 }}>✓</span>}
                </div>
                <span style={{ fontSize:11, color:'#777' }}>{l}</span>
              </div>
            ))}
          </div>

          {/* Leaflet map */}
          <MapView pins={PINS} onPinClick={p => setSel(p)} />

          {/* Popup */}
          {sel && (
            <div onClick={e => e.stopPropagation()} style={{ position:'absolute', bottom:16, right:60, width:360, background:'#f5f0e4', borderRadius:20, overflow:'hidden', boxShadow:'0 20px 60px #000c', display:'flex', animation:'pop .22s cubic-bezier(.34,1.56,.64,1)', zIndex:2000 }}>
              <div style={{ width:130, flexShrink:0, background:sel.species==='Cat'?'linear-gradient(160deg,#071510,#0e2a1a)':'linear-gradient(160deg,#2a1508,#5a3010)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:64 }}>
                {sel.species==='Cat'?'🐈':'🐕'}
              </div>
              <div style={{ flex:1, padding:'14px 16px 16px', position:'relative' }}>
                <button onClick={() => setSel(null)} style={{ position:'absolute', top:10, right:10, background:'#0001', border:'none', borderRadius:'50%', width:24, height:24, color:'#888', fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3, flexWrap:'wrap' }}>
                  <span style={{ fontSize:20, fontWeight:700, color:'#1a1a1a' }}>{sel.name}</span>
                  <span style={{ fontSize:8, fontWeight:700, color:'#fff', background:UC[sel.urgency]+'cc', padding:'2px 8px', borderRadius:20 }}>{sel.status}</span>
                </div>
                <div style={{ fontSize:10, color:'#999', fontFamily:mono, marginBottom:8 }}>ID: #RC-{900+sel.id} • {sel.species} • {sel.age}</div>
                <p style={{ fontSize:11, color:'#5a4535', lineHeight:1.6, marginBottom:12 }}>{sel.desc}</p>
                <div style={{ display:'flex', gap:8 }}>
                  <button style={{ flex:1, background:'#ff4444', color:'#fff', border:'none', borderRadius:10, padding:'9px 0', fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:font }}>Assign Dispatch</button>
                  <button style={{ width:36, height:36, background:'#e8d8be', border:'none', borderRadius:10, cursor:'pointer', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center' }}>⚙</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}