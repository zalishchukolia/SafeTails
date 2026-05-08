import { useState, useRef } from 'react'

const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET
const API_URL = 'https://safetails-production-8790.up.railway.app/api/animals'

const FIELD = (label, name, type = 'text', opts = {}) => ({ label, name, type, ...opts })

const FIELDS = [
  FIELD("Ім'я тварини", 'name'),
  FIELD('Вид', 'species', 'select', { options: ['пес', 'кіт'] }),
  FIELD('Стать', 'gender', 'select', { options: ['male', 'female'] }),
  FIELD('Вік (років)', 'age', 'number'),
  FIELD('Вага (кг)', 'weight', 'number'),
  FIELD('Місто', 'city'),
  FIELD('Темперамент', 'temperament', 'select', {
    options: ['спокійний', 'активний', 'грайливий', 'лагідний', 'незалежний'],
  }),
  FIELD('Статус', 'status', 'select', {
    options: ['needs rescue', 'in rescue', 'in recovery', 'rescued'],
  }),
  FIELD('Опис', 'description', 'textarea'),
]

function PhotoUpload({ label, id, preview, onChange, multiple = false }) {
  const inputRef = useRef()
  return (
    <div>
      <div style={{ fontSize: 11, color: '#888', letterSpacing: 1.5, marginBottom: 8, textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {(Array.isArray(preview) ? preview : preview ? [preview] : []).map((src, i) => (
          <div key={i} style={{
            width: 100, height: 100, borderRadius: 12, overflow: 'hidden',
            border: '2px solid #ff6b2b', position: 'relative',
          }}>
            <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ))}
        <div
          onClick={() => inputRef.current.click()}
          style={{
            width: 100, height: 100, borderRadius: 12,
            border: '2px dashed #333', display: 'flex',
            flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#555', fontSize: 28, gap: 4,
            transition: 'border-color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#ff6b2b'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#333'}
        >
          <span>+</span>
          <span style={{ fontSize: 10, color: '#444' }}>фото</span>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        id={id}
        accept="image/*"
        multiple={multiple}
        style={{ display: 'none' }}
        onChange={onChange}
      />
    </div>
  )
}

export default function AdminPage() {
  const [form, setForm] = useState({
    name: '', species: 'пес', gender: 'male', age: '',
    weight: '', city: '', temperament: 'спокійний',
    status: 'needs rescue', description: '',
  })
  const [mainImage, setMainImage]     = useState(null)
  const [mainPreview, setMainPreview] = useState(null)
  const [gallery, setGallery]         = useState([])
  const [galleryPreviews, setGalleryPreviews] = useState([])
  const [loading, setLoading]         = useState(false)
  const [success, setSuccess]         = useState(false)
  const [error, setError]             = useState('')

  const handleField = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleMainImage = e => {
    const file = e.target.files[0]
    if (!file) return
    setMainImage(file)
    setMainPreview(URL.createObjectURL(file))
  }

  const handleGallery = e => {
    const files = Array.from(e.target.files).slice(0, 3)
    setGallery(files)
    setGalleryPreviews(files.map(f => URL.createObjectURL(f)))
  }

  const handleSubmit = async () => {
    if (!form.name || !form.species) {
      setError("Заповни мінімум ім'я та вид тварини")
      return
    }
    setLoading(true)
    setError('')

    try {
      const data = new FormData()
      Object.entries(form).forEach(([k, v]) => { if (v !== '') data.append(k, v) })
      if (mainImage) data.append('mainImage', mainImage)
      gallery.forEach(f => data.append('gallery', f))

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'x-admin-secret': ADMIN_SECRET },
        body: data,
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Помилка сервера')
      }

      setSuccess(true)
      setForm({
        name: '', species: 'пес', gender: 'male', age: '',
        weight: '', city: '', temperament: 'спокійний',
        status: 'needs rescue', description: '',
      })
      setMainImage(null)
      setMainPreview(null)
      setGallery([])
      setGalleryPreviews([])
      setTimeout(() => setSuccess(false), 4000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0f0f10', color: '#fff',
      fontFamily: "'DM Sans', sans-serif", padding: '40px 20px',
    }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>

        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, color: '#ff6b2b', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>
            SafeTails Admin
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0 }}>Додати тварину</h1>
        </div>

        <div style={{
          background: '#151517', border: '1px solid #1e1e1e',
          borderRadius: 24, padding: 32, display: 'flex', flexDirection: 'column', gap: 20,
        }}>

          {/* Фото */}
          <PhotoUpload
            label="Головне фото"
            id="mainImage"
            preview={mainPreview}
            onChange={handleMainImage}
          />
          <PhotoUpload
            label="Галерея (до 3 фото)"
            id="gallery"
            preview={galleryPreviews}
            onChange={handleGallery}
            multiple
          />

          <div style={{ height: 1, background: '#1e1e1e' }} />

          {/* Поля форми */}
          {FIELDS.map(({ label, name, type, options }) => (
            <div key={name}>
              <div style={{ fontSize: 11, color: '#888', letterSpacing: 1.5, marginBottom: 8, textTransform: 'uppercase' }}>
                {label}
              </div>
              {type === 'select' ? (
                <select
                  name={name}
                  value={form[name]}
                  onChange={handleField}
                  style={{
                    width: '100%', background: '#1e1e20', border: '1px solid #2a2a2a',
                    borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: 14,
                    outline: 'none', cursor: 'pointer',
                  }}
                >
                  {options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : type === 'textarea' ? (
                <textarea
                  name={name}
                  value={form[name]}
                  onChange={handleField}
                  rows={4}
                  style={{
                    width: '100%', background: '#1e1e20', border: '1px solid #2a2a2a',
                    borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: 14,
                    outline: 'none', resize: 'vertical', fontFamily: 'inherit',
                  }}
                />
              ) : (
                <input
                  name={name}
                  type={type}
                  value={form[name]}
                  onChange={handleField}
                  style={{
                    width: '100%', background: '#1e1e20', border: '1px solid #2a2a2a',
                    borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: 14,
                    outline: 'none',
                  }}
                />
              )}
            </div>
          ))}

          {error && (
            <div style={{
              background: 'rgba(255,50,50,0.1)', border: '1px solid rgba(255,50,50,0.3)',
              borderRadius: 12, padding: '12px 16px', color: '#ff6b6b', fontSize: 14,
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
              borderRadius: 12, padding: '12px 16px', color: '#22c55e', fontSize: 14,
            }}>
              ✓ Тварину успішно додано!
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%', padding: '16px', borderRadius: 16,
              background: loading ? '#333' : '#ff6b2b',
              border: 'none', color: '#fff', fontSize: 16,
              fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {loading ? 'Завантаження...' : 'Додати тварину'}
          </button>
        </div>
      </div>
    </div>
  )
}