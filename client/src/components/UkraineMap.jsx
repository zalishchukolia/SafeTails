import { useEffect, useRef } from 'react'

export default function UkraineMap({ pins, selectedId, onPinClick }) {
  const mapRef = useRef(null)
  const instanceRef = useRef(null)
  const markersRef = useRef([])

  useEffect(() => {
    // Підвантажуємо Leaflet CSS і JS динамічно
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
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
      if (instanceRef.current) return

      const map = L.map(mapRef.current, {
        center: [49.0, 31.5],
        zoom: 6,
        zoomControl: false,
        attributionControl: false,
      })
      instanceRef.current = map

      // Темна тайл-тема (як на референсі)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(map)

      // Додаємо піни
      pins.forEach(pin => {
        const c = pin.urgency === 'critical' ? '#ff3333'
                : pin.urgency === 'stable'   ? '#22c55e'
                : '#ff8c00'

        const icon = L.divIcon({
          className: '',
          html: `
            <div style="position:relative;width:20px;height:20px;">
              ${pin.urgency === 'critical' ? `
                <div style="
                  position:absolute;inset:-8px;border-radius:50%;
                  background:${c};opacity:0.3;
                  animation:pulse 2s ease-in-out infinite;
                "></div>` : ''}
              <div style="
                position:absolute;inset:3px;border-radius:50%;
                background:${c};opacity:0.25;
              "></div>
              <div style="
                position:absolute;inset:6px;border-radius:50%;
                background:${c};
                border:1.5px solid rgba(255,255,255,0.5);
                box-shadow:0 0 6px ${c}88;
              "></div>
            </div>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        })

        const marker = L.marker([pin.coords[1], pin.coords[0]], { icon })
        marker.on('click', () => onPinClick(pin))
        marker.addTo(map)
        markersRef.current.push({ id: pin.id, marker })
      })
    })

    return () => {
      if (instanceRef.current) {
        instanceRef.current.remove()
        instanceRef.current = null
        markersRef.current = []
      }
    }
  }, [])

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