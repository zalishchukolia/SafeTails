import { useEffect, useRef, useState } from 'react'

// ─── Точніший полігон для UkraineMap (спрощений — одна зона) ─────────────
// Якщо потрібні всі 5 зон — використовуй AnimalsPage.jsx як референс
const DANGER_ZONE = [
  [49.60, 38.10], [49.90, 38.60], [50.40, 39.20], [50.80, 39.80],
  [51.40, 39.30], [51.50, 38.40], [51.00, 38.00], [50.60, 37.60],
  [50.20, 37.20], [49.70, 37.40], [49.40, 37.90], [49.60, 38.10],
  // Донецька
  [48.10, 37.00], [48.60, 37.50], [49.00, 38.00], [49.40, 38.20],
  [49.20, 38.80], [48.70, 39.20], [48.20, 39.00], [47.70, 38.40],
  [47.40, 37.90], [47.20, 37.20], [47.50, 36.80], [48.00, 36.90],
]

export default function UkraineMap({ pins, selectedId, onPinClick, showDangerZone }) {
  const mapRef      = useRef(null)
  const instanceRef = useRef(null)
  const markersRef  = useRef([])
  const dangerRef   = useRef(null)
  const [mapReady, setMapReady] = useState(false)

  // Ініціалізація карти (один раз)
  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'; link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    const loadLeaflet = () => new Promise(resolve => {
      if (window.L) return resolve(window.L)
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload = () => resolve(window.L)
      document.head.appendChild(script)
    })

    loadLeaflet().then(L => {
      if (!instanceRef.current && mapRef.current) {
        const map = L.map(mapRef.current, {
          center: [49.0, 31.5], zoom: 6,
          zoomControl: false, attributionControl: false,
        })
        instanceRef.current = map

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
        }).addTo(map)

        setMapReady(true)
      }
    })

    return () => {
      if (instanceRef.current) {
        instanceRef.current.remove()
        instanceRef.current = null
        markersRef.current  = []
        dangerRef.current   = null
        setMapReady(false)
      }
    }
  }, [])

  // Оновлення маркерів при зміні pins
  useEffect(() => {
    if (!mapReady || !instanceRef.current || !window.L) return
    const L = window.L

    markersRef.current.forEach(({ marker }) => marker.remove())
    markersRef.current = []

    pins.forEach(pin => {
      const c = pin.urgency === 'critical' ? '#ff3333'
              : pin.urgency === 'stable'   ? '#22c55e'
              : '#ff8c00'

      const icon = L.divIcon({
        className: '',
        html: `
          <div style="position:relative;width:20px;height:20px;">
            ${pin.urgency === 'critical' ? `
              <div style="position:absolute;inset:-8px;border-radius:50%;
                background:${c};opacity:0.3;animation:pulse 2s ease-in-out infinite;"></div>` : ''}
            <div style="position:absolute;inset:3px;border-radius:50%;background:${c};opacity:0.25;"></div>
            <div style="position:absolute;inset:6px;border-radius:50%;background:${c};
              border:1.5px solid rgba(255,255,255,0.5);box-shadow:0 0 6px ${c}88;"></div>
          </div>`,
        iconSize: [20, 20], iconAnchor: [10, 10],
      })

      const marker = L.marker([pin.coords[1], pin.coords[0]], { icon })
      marker.on('click', () => onPinClick(pin))
      marker.addTo(instanceRef.current)
      markersRef.current.push({ id: pin.id, marker })
    })
  }, [pins, mapReady])

  // Danger Zone
  useEffect(() => {
    if (!mapReady || !instanceRef.current || !window.L) return
    const L = window.L

    if (showDangerZone) {
      if (!dangerRef.current) {
        // DANGER_ZONE вже у форматі [lat, lng] — передаємо напряму
        dangerRef.current = L.polygon(
          DANGER_ZONE,
          {
            color: '#ff6600',
            fillColor: '#ff4400',
            fillOpacity: 0.18,
            weight: 1.5,
            dashArray: '8 5',
            opacity: 0.65,
          }
        ).addTo(instanceRef.current)
      }
    } else {
      if (dangerRef.current) {
        dangerRef.current.remove()
        dangerRef.current = null
      }
    }
  }, [showDangerZone, mapReady])

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%,100% { transform: scale(1); opacity: 0.3; }
          50%      { transform: scale(1.8); opacity: 0; }
        }
        .leaflet-container { background: #07070f !important; }
      `}</style>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </>
  )
}