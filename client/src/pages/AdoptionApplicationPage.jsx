import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const font = "'Inter', sans-serif"
const mono = "'Inter', monospace"

function FooterColumn({ title, links }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: '#555', letterSpacing: 2, fontFamily: mono, marginBottom: 16 }}>{title}</div>
      {links.map((link) => (
        <div key={link} style={{ fontSize: 13, color: '#8a8a8a', marginBottom: 12, cursor: 'pointer' }}>{link}</div>
      ))}
    </div>
  )
}

function Footer() {
  return (
    <footer style={{ background: '#0d0d0d', fontFamily: font, borderTop: '1px solid #1e1e1e', marginTop: 'auto' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '42px 40px 26px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 34, marginBottom: 30 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, fontStyle: 'italic', background: 'linear-gradient(90deg,#ff6b2b,#ff4500)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 14 }}>
              SafeTails
            </div>
            <p style={{ fontSize: 13, color: '#717171', lineHeight: 1.8, maxWidth: 290, margin: 0 }}>
              Допомагаємо тваринам знайти безпеку, турботу та новий дім. Разом ми можемо змінити їхнє майбутнє.
            </p>
          </div>
          <FooterColumn title="НАВІГАЦІЯ" links={['Панель', 'Тварини', 'Відправка']} />
          <FooterColumn title="ДОПОМОГА" links={['Прихисток', 'Медична карта', 'Архів']} />
          <FooterColumn title="ПІДТРИМКА" links={['Довідка', 'Донат', 'Волонтерство']} />
          <FooterColumn title="ПРАВОВА" links={['Конфіденційність', 'Умови']} />
        </div>
        <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: 18, display: 'flex', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#4d4d4d' }}>© 2026 SafeTails. Всі права захищені.</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 14, color: '#4d4d4d', cursor: 'pointer' }}>↗</span>
            <span style={{ fontSize: 14, color: '#4d4d4d', cursor: 'pointer' }}>✦</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function AdoptionApplicationPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const prefilledAnimal = location.state?.animalName || ''

  const [form, setForm] = useState({
    applicantName: '',
    email: '',
    phone: '',
    animalName: '',
    message: '',
  })

  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (prefilledAnimal) {
      setForm(prev => ({ ...prev, animalName: prefilledAnimal }))
    }
  }, [prefilledAnimal])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    if (!form.applicantName || !form.email || !form.animalName) {
      alert("Будь ласка, заповніть обов'язкові поля")
      return
    }
    try {
      setSending(true)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/adoptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(form),
      })
      let data = null
      try { data = await response.json() } catch { data = null }
      if (!response.ok) throw new Error(data?.message || 'Помилка при відправці')
      setSubmitted(true)
    } catch (error) {
      alert(error.message || 'Помилка при відправці')
    } finally {
      setSending(false)
    }
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: '#0d0d0d', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: "'Inter', sans-serif" }}>
        <div style={{ background: '#1a1a1a', borderRadius: 20, padding: '48px 56px', textAlign: 'center', border: '1px solid #222', maxWidth: 420, width: '100%' }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🐾</div>
          <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 700, margin: '0 0 12px', fontFamily: "'Merriweather', serif" }}>Дякуємо за заявку!</h1>
          <p style={{ color: '#666', margin: '0 0 28px', lineHeight: 1.6 }}>Ми зв'яжемося з вами найближчим часом.</p>
          <button
            onClick={() => navigate('/adoption-form')}
            style={{ background: '#ff6b2b', border: 'none', borderRadius: 10, padding: '12px 28px', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            ← Повернутися до тварин
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0d0d0d', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, padding: '48px 24px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <button
            onClick={() => navigate('/adoption-form')}
            style={{ background: 'none', border: 'none', color: '#666', fontSize: 14, cursor: 'pointer', marginBottom: 32, padding: 0, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#666' }}
          >
            ← Назад
          </button>

          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, margin: '0 0 10px', color: '#fff', lineHeight: 1.15, fontFamily: "'Merriweather', serif", textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Заявка на <span style={{ color: '#ff6b2b' }}>прихисток</span>
            </h1>
            <p style={{ color: '#666', fontSize: 15, margin: 0, lineHeight: 1.6 }}>
              Заповніть форму нижче, і ми розглянемо вашу заявку, щоб знайти найкращу домівку для врятованої тварини.
            </p>
          </div>

          <div style={{ background: '#1a1a1a', borderRadius: 20, padding: '32px', border: '1px solid #222' }}>
            <h2 style={{ color: '#fff', fontSize: 16, fontWeight: 600, margin: '0 0 24px', fontFamily: "'Merriweather', serif" }}>
              Особисті дані
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Field label="Ваше ім'я *">
                <input type="text" name="applicantName" value={form.applicantName} onChange={handleChange} placeholder="Введіть ім'я" />
              </Field>
              <Field label="Email *">
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" />
              </Field>
              <Field label="Телефон">
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+38 (0__) ___ __ __" />
              </Field>
              <Field label="Ім'я тварини *">
                <input type="text" name="animalName" value={form.animalName} onChange={handleChange} placeholder="Яку тварину хочете прихистити?" />
              </Field>
              <Field label="Чому ви хочете дати прихисток цій тварині?">
                <textarea name="message" value={form.message} onChange={handleChange} rows={4} placeholder="Коротко розкажіть про себе та чому хочете подарувати дім цій тварині..." style={{ resize: 'none' }} />
              </Field>

              <button
                onClick={handleSubmit}
                disabled={sending}
                style={{ width: '100%', background: sending ? '#a14a24' : '#ff6b2b', border: 'none', borderRadius: 12, padding: '16px', color: '#fff', fontSize: 16, fontWeight: 700, cursor: sending ? 'not-allowed' : 'pointer', fontFamily: 'inherit', marginTop: 8, transition: 'background 0.2s', opacity: sending ? 0.8 : 1 }}
                onMouseEnter={e => { if (!sending) e.currentTarget.style.background = '#e55a1f' }}
                onMouseLeave={e => { if (!sending) e.currentTarget.style.background = '#ff6b2b' }}
              >
                {sending ? 'Відправка...' : 'Подати заявку'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700;900&family=Inter:wght@400;500;600;700&display=swap');
        input, textarea {
          width: 100%;
          box-sizing: border-box;
          background: #0d0d0d;
          border: 1px solid #2a2a2a;
          border-radius: 10px;
          padding: 12px 16px;
          color: #fff;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: border-color 0.2s;
        }
        input:focus, textarea:focus { border-color: #ff6b2b; }
        input::placeholder, textarea::placeholder { color: #444; }
      `}</style>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ display: 'block', color: '#666', fontSize: 13, marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  )
}