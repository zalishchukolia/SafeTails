import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginPromptModal from '../components/LoginPromptModal'
import AuthModal from '../components/AuthModal'

const API = 'https://safetails-production-8790.up.railway.app'
const mono = "'Inter', monospace"

const logisticsSeed = [
  { id: 1, icon: '📦', title: 'Поповнення запасів', detail: 'Поповнення медичного набору для центральної клініки', eta: '45 хв', type: 'Низький' },
  { id: 2, icon: '🧼', title: 'Технічне обслуговування притулку', detail: 'Перевірка водопостачання і санітарії у вольєрі А', eta: 'Зараз', type: 'Заплановано' },
  { id: 3, icon: '🚑', title: 'Транспортне забезпечення', detail: 'Потрібна клітка та машина швидкої допомоги на Док 2', eta: '15 хв', type: 'Високий' },
]

const medicalSeed = [
  { id: 1, patient: '🐕 Бруно', treatment: 'Внутрішньовенні рідини', doctor: 'Лікар Аріс', status: 'Urgent' },
  { id: 2, patient: '🐈 Міла', treatment: 'Спостереження після операції', doctor: 'Медсестра Мілла', status: 'Stable' },
  { id: 3, patient: '🐇 Сніжок', treatment: 'Обробка рани', doctor: 'Швидка команда А', status: 'Critical' },
]

const navItems = [
  { id: 'dashboard', label: 'Дашборд', icon: '◌' },
  { id: 'rescues', label: 'Активні порятунки', icon: '◌' },
  { id: 'dispatch', label: 'Диспетчер', icon: '◌' },
  { id: 'medical', label: 'Медичний журнал', icon: '◌' },
  { id: 'archive', label: 'Архів', icon: '◌' },
]

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

function Footer({ sidebarOpen }) {
  return (
    <footer
      style={{
        background: '#0d0d0d',
        fontFamily: "'Inter', sans-serif",
        borderTop: '1px solid #1e1e1e',
        marginTop: 'auto',
        paddingLeft: sidebarOpen ? 188 : 0,
        transition: 'padding-left 0.25s ease',
      }}
    >
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '42px 40px 26px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 34, marginBottom: 30 }}>
          <div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                fontStyle: 'italic',
                background: 'linear-gradient(90deg,#ff6b2b,#ff4500)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: 14,
              }}
            >
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
        <div
          style={{
            borderTop: '1px solid #1a1a1a',
            paddingTop: 18,
            display: 'flex',
            justifyContent: 'space-between',
            gap: 20,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
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

function statusTone(status) {
  if (status === 'needs rescue') return { fg: '#fff1f1', bg: '#8f1d1d', dot: '#ff6b6b' }
  if (status === 'rescued') return { fg: '#dcfce7', bg: '#143220', dot: '#4ade80' }
  if (status === 'archived') return { fg: '#e5e7eb', bg: '#374151', dot: '#9ca3af' }
  if (status === 'Critical') return { fg: '#fff1f1', bg: '#8f1d1d', dot: '#ff6b6b' }
  if (status === 'Stable') return { fg: '#dcfce7', bg: '#143220', dot: '#4ade80' }
  if (status === 'Urgent') return { fg: '#fff7ed', bg: '#7c2d12', dot: '#fb923c' }
  return { fg: '#fef3c7', bg: '#3d2f12', dot: '#fbbf24' }
}

function statusLabel(status) {
  if (status === 'needs rescue') return 'Потребує порятунку'
  if (status === 'rescued') return 'Врятовано'
  if (status === 'archived') return 'В архіві'
  if (status === 'Critical') return 'Критичний'
  if (status === 'Stable') return 'Стабільний'
  if (status === 'Urgent') return 'Терміновий'
  return status
}

function themeFromStatus(status) {
  if (status === 'needs rescue' || status === 'Critical') return 'danger'
  if (status === 'rescued' || status === 'Stable') return 'calm'
  if (status === 'archived') return 'archive'
  return 'watch'
}

function emojiFromSpecies(species) {
  if (!species) return '🐾'
  const s = species.toLowerCase()
  if (s.includes('cat') || s.includes('кіш')) return '🐈'
  if (s.includes('dog') || s.includes('пес') || s.includes('соб')) return '🐕'
  if (s.includes('rabbit') || s.includes('крол')) return '🐇'
  if (s.includes('bird') || s.includes('птах')) return '🕊️'
  return '🐾'
}

function StatCard({ label, value, meta }) {
  return (
    <section className="stat-card">
      <span className="eyebrow">{label}</span>
      <strong>{value}</strong>
      <p>{meta}</p>
    </section>
  )
}

function StatusPill({ status }) {
  const tone = statusTone(status)
  return (
    <span className="status-pill" style={{ color: tone.fg, background: tone.bg }}>
      <span className="status-dot" style={{ background: tone.dot }} />
      {statusLabel(status)}
    </span>
  )
}

function MissionRow({ mission, active, onSelect }) {
  return (
    <button
      type="button"
      className={`mission-row ${active ? 'active' : ''}`}
      onClick={() => onSelect(mission.id)}
    >
      <div className={`mission-thumb ${mission.theme}`}>
        {mission.imageUrl ? (
          <img
            src={mission.imageUrl}
            alt={mission.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 18 }}
          />
        ) : (
          mission.emoji
        )}
      </div>
      <div className="mission-copy">
        <div className="mission-topline">
          <h3>{mission.name}</h3>
          <StatusPill status={mission.status} />
        </div>
        <p>{mission.species} · {mission.age} р.</p>
        <div className="mission-meta">
          <span>{mission.temperament}</span>
          {mission.city ? <span>{mission.city}</span> : null}
          <span>{mission.updated}</span>
        </div>
      </div>
    </button>
  )
}

function SectionCard({ title, subtitle, children }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h3>{title}</h3>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
      </div>
      <div className="panel-pad">{children}</div>
    </section>
  )
}

export default function HomePage() {
  const navigate = useNavigate()

  const [missions, setMissions] = useState([])
  const [archivedMissions, setArchivedMissions] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeSection, setActiveSection] = useState('rescues')
  const [selectedId, setSelectedId] = useState(null)
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('Name')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mainImage, setMainImage] = useState(null)
  const [mainPreview, setMainPreview] = useState(null)
  const [gallery, setGallery] = useState([])
  const [galleryPreviews, setGalleryPreviews] = useState([])

  const [form, setForm] = useState({
    name: '',
    species: 'собака',
    age: '',
    description: '',
    status: 'needs rescue',
    temperament: 'лагідний',
    city: '',
    weight: '',
  })

  const token = localStorage.getItem('token')
  const isAuthenticated = Boolean(token)

  useEffect(() => {
    setLoading(true)

    const mapAnimal = (a) => ({
      id: a.id ?? a._id,
      name: a.name,
      species: a.species ?? '',
      age: a.age ?? '?',
      description: a.description ?? '',
      temperament: a.temperament ?? '',
      status: a.status ?? 'needs rescue',
      city: a.city ?? '',
      weight: a.weight ?? null,
      lat: a.lat ?? null,
      lng: a.lng ?? null,
      imageUrl: a.imageUrl || null,
      emoji: emojiFromSpecies(a.species),
      theme: themeFromStatus(a.status),
      updated: new Date(a.updatedAt ?? Date.now()).toLocaleDateString('uk-UA'),
      archivedAt:
        a.status === 'archived'
          ? new Date(a.updatedAt ?? Date.now()).toLocaleDateString('uk-UA')
          : null,
    })

    Promise.all([
      fetch(`${API}/api/animals`).then((r) => r.json()),
      fetch(`${API}/api/animals/archived`).then((r) => r.json()),
    ])
      .then(([active, archived]) => {
        const mappedActive = Array.isArray(active) ? active.map(mapAnimal) : []
        const mappedArchived = Array.isArray(archived) ? archived.map(mapAnimal) : []
        setMissions(mappedActive)
        setArchivedMissions(mappedArchived)
        setSelectedId(mappedActive[0]?.id ?? null)
      })
      .catch((err) => console.error('Fetch animals error:', err))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const handler = () => setShowAuthModal(true)
    window.addEventListener('open-auth-modal', handler)
    return () => window.removeEventListener('open-auth-modal', handler)
  }, [])

  const visibleMissions = useMemo(() => {
    let items = [...missions]

    if (query.trim()) {
      const q = query.toLowerCase()
      items = items.filter((m) =>
        [m.name, m.species, m.status, m.description, m.temperament, m.city]
          .join(' ')
          .toLowerCase()
          .includes(q)
      )
    }

    if (filter !== 'All') items = items.filter((m) => m.status === filter)

    if (sort === 'Name') items.sort((a, b) => a.name.localeCompare(b.name, 'uk'))
    else if (sort === 'Age') items.sort((a, b) => Number(a.age) - Number(b.age))
    else if (sort === 'Status') items.sort((a, b) => a.status.localeCompare(b.status))

    return items
  }, [missions, filter, query, sort])

  const selectedMission =
    visibleMissions.find((m) => m.id === selectedId) ||
    missions.find((m) => m.id === selectedId) ||
    missions[0] ||
    null

  const needsRescueCount = missions.filter((m) => m.status === 'needs rescue').length
  const rescuedCount = missions.filter((m) => m.status === 'rescued').length
  const archivedCount = archivedMissions.length
  const totalCount = missions.length + archivedMissions.length
  const dogsCount = missions.filter(
    (m) =>
      m.species?.toLowerCase().includes('dog') ||
      m.species?.toLowerCase().includes('соб') ||
      m.species?.toLowerCase().includes('пес')
  ).length

  function resetForm() {
    setForm({
      name: '',
      species: 'собака',
      age: '',
      description: '',
      status: 'needs rescue',
      temperament: 'лагідний',
      city: '',
      weight: '',
    })
    setMainImage(null)
    setMainPreview(null)
    setGallery([])
    setGalleryPreviews([])
  }

  function handleFormChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleOpenCreateModal() {
    if (!isAuthenticated) {
      setIsLoginPromptOpen(true)
      return
    }
    setIsCreateOpen(true)
  }

  async function handleCreateAnimal(e) {
    e.preventDefault()

    if (!isAuthenticated) {
      setIsCreateOpen(false)
      setIsLoginPromptOpen(true)
      return
    }

    if (!form.name.trim() || !form.description.trim()) return

    let lat = null
    let lng = null

    if (form.city.trim()) {
      try {
        const geo = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(form.city)}&format=json&limit=1&countrycodes=ua`,
          { headers: { 'Accept-Language': 'uk' } }
        )
        const geoData = await geo.json()
        if (geoData.length > 0) {
          lat = parseFloat(geoData[0].lat)
          lng = parseFloat(geoData[0].lon)
        }
      } catch (err) {
        console.warn('Geocoding failed:', err)
      }
    }

    try {
      const formData = new FormData()
      formData.append('name', form.name.trim())
      formData.append('species', form.species)
      formData.append('age', Number(form.age) || 0)
      formData.append('description', form.description.trim())
      formData.append('status', form.status)
      formData.append('temperament', form.temperament)
      formData.append('city', form.city.trim())
      if (form.weight) formData.append('weight', Number(form.weight))
      if (lat) formData.append('lat', lat)
      if (lng) formData.append('lng', lng)
      if (mainImage) formData.append('mainImage', mainImage)
      gallery.forEach((f) => formData.append('gallery', f))

      const res = await fetch(`${API}/api/animals`, {
        method: 'POST',
        headers: { 'x-admin-secret': import.meta.env.VITE_ADMIN_SECRET },
        body: formData,
      })

      if (!res.ok) throw new Error('Server error')

      const saved = await res.json()
      const newAnimal = {
        id: saved.id ?? saved._id,
        name: saved.name,
        species: saved.species,
        age: saved.age,
        description: saved.description,
        temperament: saved.temperament,
        status: saved.status,
        city: saved.city ?? '',
        weight: saved.weight ?? null,
        lat: saved.lat ?? null,
        lng: saved.lng ?? null,
        imageUrl: saved.imageUrl || null,
        emoji: emojiFromSpecies(saved.species),
        theme: themeFromStatus(saved.status),
        updated: new Date(saved.createdAt ?? Date.now()).toLocaleDateString('uk-UA'),
      }

      if (newAnimal.status === 'archived') {
        setArchivedMissions((prev) => [newAnimal, ...prev])
        setActiveSection('archive')
      } else {
        setMissions((prev) => [newAnimal, ...prev])
        setSelectedId(newAnimal.id)
        setActiveSection('rescues')
      }

      setIsCreateOpen(false)
      resetForm()
    } catch (err) {
      console.error(err)
      alert('Не вдалося створити запис.')
    }
  }

  function handleOpenCase() {
    if (!selectedMission) return
    navigate(`/animals/${selectedMission.id}`)
  }

  async function handleArchive() {
    if (!selectedMission) return

    try {
      await fetch(`${API}/api/animals/${selectedMission.id}/archive`, {
        method: 'PATCH',
        headers: { 'x-admin-secret': import.meta.env.VITE_ADMIN_SECRET },
      })
    } catch (err) {
      console.error('Archive error:', err)
      alert('Не вдалося заархівувати тварину.')
      return
    }

    const archivedAnimal = {
      ...selectedMission,
      status: 'archived',
      theme: 'archive',
      updated: new Date().toLocaleDateString('uk-UA'),
      archivedAt: new Date().toLocaleDateString('uk-UA'),
    }

    setArchivedMissions((prev) => [archivedAnimal, ...prev])

    const updatedMissions = missions.filter((m) => m.id !== selectedMission.id)
    setMissions(updatedMissions)

    if (updatedMissions.length > 0) {
      setSelectedId(updatedMissions[0].id)
    } else {
      setSelectedId(null)
    }

    setActiveSection('archive')
  }

  function renderFooter() {
    return (
      <footer className="homepage-footer">
        <div className="homepage-footer-top">
          <div className="homepage-footer-brand">
            <h2>SafeTails</h2>
            <p>
              Допомагаємо тваринам знайти безпеку,
              турботу та новий дім. Разом ми можемо
              змінити їхнє майбутнє.
            </p>
          </div>

          <div className="homepage-footer-columns">
            <div className="homepage-footer-column">
              <span>НАВІГАЦІЯ</span>
              <button type="button" onClick={() => setActiveSection('dashboard')}>
                Панель
              </button>
              <button type="button" onClick={() => setActiveSection('rescues')}>
                Тварини
              </button>
              <button type="button" onClick={() => setActiveSection('dispatch')}>
                Відправка
              </button>
            </div>

            <div className="homepage-footer-column">
              <span>ДОПОМОГА</span>
              <button type="button" onClick={() => setActiveSection('rescues')}>
                Прихисток
              </button>
              <button type="button" onClick={() => setActiveSection('medical')}>
                Медична карта
              </button>
              <button type="button" onClick={() => setActiveSection('archive')}>
                Архів
              </button>
            </div>

            <div className="homepage-footer-column">
              <span>ПІДТРИМКА</span>
              <button type="button">Довідка</button>
              <button type="button">Донат</button>
              <button type="button">Волонтерство</button>
            </div>

            <div className="homepage-footer-column">
              <span>ПРАВОВА</span>
              <button type="button">Конфіденційність</button>
              <button type="button">Умови</button>
            </div>
          </div>
        </div>

        <div className="homepage-footer-bottom">
          <p>© 2026 SafeTails. Всі права захищені.</p>
          <div className="homepage-footer-bottom-icons" aria-hidden="true">
            <span>↗</span>
            <span>✦</span>
          </div>
        </div>
      </footer>
    )
  }

  function renderTopBar(title, text) {
    return (
      <section className="hero-block">
        <div className="hero-copy">
          <h2>{title}</h2>
          <p>{text}</p>
        </div>

        <div className="topbar-actions">
          <button className="collapse-btn" type="button" onClick={() => setSidebarOpen((prev) => !prev)}>
            {sidebarOpen ? 'Сховати меню' : 'Показати меню'}
          </button>
        </div>
      </section>
    )
  }

  function renderContent() {
    if (activeSection === 'dashboard') {
      return (
        <>
          {renderTopBar('Дашборд', 'Загальний огляд рятувальної діяльності, критичних сповіщень, логістичного навантаження та поточного медичного потоку.')}

          <section className="stats-grid">
            <StatCard label="Потребують порятунку" value={String(needsRescueCount).padStart(2, '0')} meta="Потрібне негайне реагування" />
            <StatCard label="Врятовано" value={String(rescuedCount).padStart(2, '0')} meta="Тварини під контрольованим доглядом" />
            <StatCard label="В архіві" value={String(archivedCount).padStart(2, '0')} meta="Переміщено до архіву" />
            <StatCard label="Всього тварин" value={String(totalCount).padStart(2, '0')} meta="У системі" />
            <StatCard label="Собаки" value={String(dogsCount).padStart(2, '0')} meta="Собачі випадки" />
          </section>

          <section className="workspace">
            <SectionCard title="Пріоритетна дошка" subtitle="Швидкий огляд тварин, що потребують порятунку">
              <div className="simple-list">
                {missions.filter((m) => m.status === 'needs rescue').slice(0, 3).map((item) => (
                  <div className="simple-row" key={item.id}>
                    <div>
                      <strong>{item.emoji} {item.name}</strong>
                      <p>{item.species} · {item.city} · {item.description}</p>
                    </div>
                    <StatusPill status={item.status} />
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Оперативна нотатка" subtitle="Зведення поточного командування">
              <div className="detail-note">
                <p>Наразі {needsRescueCount} тварин потребують термінової допомоги. {rescuedCount} вже врятовано та перебувають під наглядом.</p>
              </div>
            </SectionCard>
          </section>

          {renderFooter()}
        </>
      )
    }

    if (activeSection === 'dispatch') {
      return (
        <>
          {renderTopBar('Диспетчер', 'Координуйте команди, призначайте маршрути та відстежуйте запити на рятувальний транспорт.')}

          <section className="logistics" aria-label="Черга диспетчера">
            {logisticsSeed.map((item) => (
              <button key={item.id} className="logistics-item" type="button">
                <div className="logistics-icon">{item.icon}</div>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.detail}</p>
                </div>
                <div className="logistics-meta">
                  <strong>{item.eta}</strong>
                  <span>{item.type}</span>
                </div>
              </button>
            ))}
          </section>

          {renderFooter()}
        </>
      )
    }

    if (activeSection === 'medical') {
      return (
        <>
          {renderTopBar('Медичний журнал', 'Переглядайте хід лікування, призначений персонал та оновлення одужання для кожного пацієнта.')}

          <SectionCard title="Медичні записи" subtitle="Останні дії з лікування">
            <div className="simple-list">
              {medicalSeed.map((item) => (
                <div className="simple-row" key={item.id}>
                  <div>
                    <strong>{item.patient}</strong>
                    <p>{item.treatment} · {item.doctor}</p>
                  </div>
                  <StatusPill status={item.status} />
                </div>
              ))}
            </div>
          </SectionCard>

          {renderFooter()}
        </>
      )
    }

    if (activeSection === 'archive') {
      return (
        <>
          {renderTopBar('Архів', 'Перегляд завершених рятувальних місій, результатів відновлення та архівованих справ тварин.')}

          <SectionCard title="Архівовані тварини" subtitle="Справи, переміщені з активного потоку порятунку">
            <div className="simple-list">
              {archivedMissions.length > 0 ? (
                archivedMissions.map((item) => (
                  <div className="simple-row" key={item.id}>
                    <div>
                      <strong>{item.name}</strong>
                      <p>{item.species} · Архівовано {item.archivedAt || item.updated}</p>
                    </div>
                    <span className="archive-tag">В архіві</span>
                  </div>
                ))
              ) : (
                <div className="detail-note">
                  <p>Архівованих тварин ще немає.</p>
                </div>
              )}
            </div>
          </SectionCard>

          {renderFooter()}
        </>
      )
    }

    return (
      <>
        {renderTopBar('Активні порятунки', 'Відстежуйте активні справи порятунку, відправляйте команди та переглядайте деталі в одному місці.')}

        <section className="stats-grid" aria-label="Статистика місій">
          <StatCard label="Потребують порятунку" value={String(needsRescueCount).padStart(2, '0')} meta="Тварини, що потребують негайних дій" />
          <StatCard label="Врятовано" value={String(rescuedCount).padStart(2, '0')} meta="Успішно врятовані" />
          <StatCard label="В архіві" value={String(archivedCount).padStart(2, '0')} meta="Видалено з активного списку" />
          <StatCard label="Собаки" value={String(dogsCount).padStart(2, '0')} meta="Собачі випадки" />
        </section>

        <section className="workspace">
          <div className="panel">
            <div className="panel-header">
              <div>
                <h3>Список тварин</h3>
                <p>Оберіть тварину для перегляду деталей.</p>
              </div>

              <div className="controls">
                <input
                  className="search"
                  type="text"
                  placeholder="Пошук тварин"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoComplete="off"
                />

                {[
                  { value: 'All', label: 'Всі' },
                  { value: 'needs rescue', label: 'Потребують порятунку' },
                  { value: 'rescued', label: 'Врятовано' },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    className={`toolbar-btn ${filter === value ? 'active' : ''}`}
                    onClick={() => setFilter(value)}
                  >
                    {label}
                  </button>
                ))}

                {[
                  { value: 'Name', label: "Ім'я" },
                  { value: 'Age', label: 'Вік' },
                  { value: 'Status', label: 'Статус' },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    className={`toolbar-btn ${sort === value ? 'active' : ''}`}
                    onClick={() => setSort(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mission-list">
              {loading ? (
                <div className="detail-note">
                  <p>Завантаження тварин...</p>
                </div>
              ) : visibleMissions.length > 0 ? (
                visibleMissions.map((mission) => (
                  <MissionRow
                    key={mission.id}
                    mission={mission}
                    active={selectedMission?.id === mission.id}
                    onSelect={setSelectedId}
                  />
                ))
              ) : (
                <div className="detail-note">
                  <p>Тварин за поточним пошуком або фільтрами не знайдено.</p>
                </div>
              )}
            </div>
          </div>

          {selectedMission ? (
            <aside className="panel detail-card">
              <div className={`hero ${selectedMission.theme}`}>
                {selectedMission.imageUrl ? (
                  <img src={selectedMission.imageUrl} alt={selectedMission.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  selectedMission.emoji
                )}
              </div>

              <div className="detail-body">
                <div className="detail-head">
                  <div>
                    <StatusPill status={selectedMission.status} />
                    <h3 style={{ marginTop: 12 }}>{selectedMission.name}</h3>
                    <p>{selectedMission.species} · {selectedMission.age} р.</p>
                  </div>
                </div>

                <div className="detail-grid">
                  <div className="mini-card">
                    <span>Темперамент</span>
                    <strong>{selectedMission.temperament || 'Невідомо'}</strong>
                  </div>
                  <div className="mini-card">
                    <span>Вік</span>
                    <strong>{selectedMission.age} р.</strong>
                  </div>
                  {selectedMission.city && (
                    <div className="mini-card">
                      <span>Місто</span>
                      <strong>{selectedMission.city}</strong>
                    </div>
                  )}
                  {selectedMission.weight && (
                    <div className="mini-card">
                      <span>Вага</span>
                      <strong>{selectedMission.weight} кг</strong>
                    </div>
                  )}
                </div>

                <div className="detail-note">
                  <p>{selectedMission.description}</p>
                </div>

                <div className="detail-actions">
                  <button className="detail-primary-btn" type="button" onClick={handleOpenCase}>
                    Відкрити справу
                  </button>
                  <button className="detail-ghost-btn" type="button" onClick={handleArchive}>
                    Архівувати
                  </button>
                </div>
              </div>
            </aside>
          ) : null}
        </section>

        <section className="logistics" aria-label="Додаткова логістика">
          <div className="logistics-head">
            <h3>Додаткова логістика</h3>
            <span className="eyebrow small-no-margin">Черга підтримки</span>
          </div>

          {logisticsSeed.map((item) => (
            <button key={item.id} className="logistics-item" type="button">
              <div className="logistics-icon">{item.icon}</div>
              <div>
                <h4>{item.title}</h4>
                <p>{item.detail}</p>
              </div>
              <div className="logistics-meta">
                <strong>{item.eta}</strong>
                <span>{item.type}</span>
              </div>
            </button>
          ))}
        </section>

        {renderFooter()}
      </>
    )
  }

  return (
    <div className="missions-shell">
      <button
        className="collapse-btn-fixed"
        type="button"
        onClick={() => setSidebarOpen((p) => !p)}
      >
        {sidebarOpen ? 'Сховати меню' : 'Показати меню'}
      </button>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Inter:wght@400;500;600;700&display=swap');

        :root {
          --bg: #07090d;
          --panel: #11151c;
          --panel-2: #171c24;
          --panel-3: #0d1117;
          --border: rgba(255,255,255,0.08);
          --text: #f4f7fb;
          --muted: #9aa4b2;
          --soft: #6b7280;
          --accent: #ff6b2b;
          --shadow: 0 18px 48px rgba(0,0,0,0.24);
          --radius: 22px;
          --font-display: 'Playfair Display', serif;
          --font-body: 'Inter', sans-serif;
        }

        * {
          box-sizing: border-box;
        }

        .missions-shell {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(255,107,43,0.12), transparent 28%),
            radial-gradient(circle at bottom right, rgba(59,130,246,0.12), transparent 24%),
            var(--bg);
          color: var(--text);
          font-family: 'Inter', sans-serif;
        }

        .collapse-btn-fixed {
          position: fixed;
          top: 70px;
          right: 20px;
          z-index: 100;
          border: 1px solid var(--border);
          background: rgba(17,21,28,0.95);
          backdrop-filter: blur(12px);
          color: var(--text);
          border-radius: 14px;
          height: 40px;
          padding: 0 16px;
          cursor: pointer;
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 500;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5);
          transition: transform .18s ease, background .18s ease;
        }

        .collapse-btn-fixed:hover {
          transform: translateY(-1px);
          background: #1a1f28;
        }

        .layout {
          display: grid;
          min-height: 100vh;
          width: 100%;
        }

        .layout.sidebar-open {
          grid-template-columns: 290px minmax(0, 1fr);
        }

        .layout.sidebar-closed {
          grid-template-columns: 1fr;
        }

        .sidebar {
          position: sticky;
          top: 0;
          height: 100vh;
          padding: 24px 18px;
          border-right: 1px solid var(--border);
          background: rgba(8, 10, 14, 0.88);
          backdrop-filter: blur(18px);
          display: grid;
          grid-template-rows: auto 1fr auto;
          gap: 20px;
        }

        .content.with-sidebar,
        .content.full-width {
          width: 100%;
          padding: 28px;
        }

        .content.with-sidebar {
          max-width: none;
          margin: 0;
        }

        .content.full-width {
          max-width: 1440px;
          margin: 0 auto;
        }

        .command-card,
        .panel,
        .stat-card {
          border: 1px solid var(--border);
          background: rgba(17,21,28,0.9);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
        }

        .homepage-footer {
          margin-top: 22px;
          padding: 28px 0 0;
          background: transparent;
          border: none;
          border-radius: 0;
          box-shadow: none;
        }

        .command-card {
          padding: 18px;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .command-icon {
          width: 52px;
          height: 52px;
          border-radius: 18px;
          display: grid;
          place-items: center;
          background: linear-gradient(180deg, rgba(255,107,43,0.18), rgba(255,107,43,0.04));
          color: #ffd7c2;
          font-size: 24px;
        }

        .command-card h3,
        .panel-header h3,
        .hero-copy h2 {
          margin: 0;
          font-family: var(--font-display);
        }

        .homepage-footer-brand h2 {
          margin: 0;
          color: var(--accent);
          font-family: var(--font-display);
        }

        .command-card p,
        .panel-header p,
        .hero-copy p,
        .homepage-footer-brand p,
        .homepage-footer-bottom p,
        .detail-note p,
        .simple-row p,
        .mission-copy p,
        .logistics-item p,
        .detail-head p {
          margin: 0;
          color: var(--muted);
          font-family: var(--font-body);
        }

        .nav-list {
          display: grid;
          gap: 10px;
          align-content: start;
        }

        .ref-nav-link,
        .toolbar-btn,
        .collapse-btn,
        .new-mission-btn,
        .detail-primary-btn,
        .detail-ghost-btn,
        .homepage-footer-column button,
        .modal-close-btn,
        .modal-submit-btn {
          border: 1px solid var(--border);
          background: var(--panel-2);
          color: var(--text);
          cursor: pointer;
          transition: 0.2s ease;
          font-family: var(--font-body);
        }

        .ref-nav-link {
          width: 100%;
          border-radius: 18px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          text-align: left;
        }

        .ref-nav-link.active,
        .ref-nav-link:hover,
        .toolbar-btn:hover,
        .collapse-btn:hover,
        .new-mission-btn:hover,
        .detail-primary-btn:hover,
        .detail-ghost-btn:hover,
        .homepage-footer-column button:hover,
        .modal-close-btn:hover,
        .modal-submit-btn:hover {
          border-color: rgba(255,107,43,0.4);
          background: rgba(255,107,43,0.1);
        }

        .nav-icon {
          opacity: 0.8;
        }

        .sidebar-footer-ref {
          display: grid;
          gap: 10px;
        }

        .new-mission-btn {
          width: 100%;
          min-height: 48px;
          border-radius: 16px;
          font-weight: 700;
        }

        .hero-block {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 22px;
        }

        .hero-copy {
          max-width: 620px;
        }

        .hero-copy h2 {
          font-size: 46px;
          line-height: 1;
          margin-bottom: 10px;
        }

        .topbar-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          align-items: flex-start;
          flex-shrink: 0;
          padding-top: 6px;
        }

        .collapse-btn {
          padding: 12px 16px;
          border-radius: 14px;
          font-weight: 600;
          white-space: nowrap;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 14px;
          margin-bottom: 22px;
        }

        .stat-card {
          padding: 18px;
        }

        .eyebrow {
          display: inline-block;
          margin-bottom: 12px;
          color: #ffb18b;
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-family: var(--font-display);
        }

        .small-no-margin {
          margin-bottom: 0;
        }

        .stat-card strong {
          display: block;
          font-size: 34px;
          margin-bottom: 6px;
          font-family: var(--font-display);
        }

        .workspace {
          display: grid;
          grid-template-columns: minmax(0, 1.25fr) minmax(320px, 0.75fr);
          gap: 18px;
          margin-bottom: 22px;
        }

        .panel {
          overflow: hidden;
        }

        .panel-header {
          padding: 18px 18px 0;
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: flex-start;
        }

        .panel-pad {
          padding: 18px;
        }

        .controls {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .search,
        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          border-radius: 14px;
          border: 1px solid var(--border);
          background: var(--panel-3);
          color: var(--text);
          padding: 12px 14px;
          outline: none;
          font: inherit;
        }

        .search {
          min-width: 220px;
          border-radius: 999px;
        }

        .form-textarea {
          min-height: 110px;
          resize: vertical;
        }

        .toolbar-btn {
          padding: 10px 14px;
          border-radius: 999px;
        }

        .toolbar-btn.active {
          background: rgba(255,255,255,0.08);
        }

        .mission-list,
        .logistics,
        .simple-list {
          display: grid;
          gap: 12px;
        }

        .mission-list {
          padding: 16px;
        }

        .mission-row,
        .logistics-item,
        .simple-row {
          width: 100%;
          border: 1px solid var(--border);
          background: var(--panel-2);
          color: inherit;
          border-radius: 18px;
          padding: 14px;
        }

        .mission-row {
          display: grid;
          grid-template-columns: 70px 1fr;
          gap: 14px;
          text-align: left;
          cursor: pointer;
        }

        .mission-row.active {
          border-color: rgba(255,107,43,0.6);
          background: linear-gradient(180deg, rgba(255,107,43,0.08), rgba(255,255,255,0.02));
        }

        .mission-thumb {
          width: 70px;
          height: 70px;
          border-radius: 18px;
          display: grid;
          place-items: center;
          font-size: 34px;
          overflow: hidden;
        }

        .mission-thumb.danger {
          background: linear-gradient(180deg, #4a201f, #2b1212);
        }

        .mission-thumb.calm {
          background: linear-gradient(180deg, #12312b, #10201d);
        }

        .mission-thumb.watch {
          background: linear-gradient(180deg, #3f3217, #241c0f);
        }

        .mission-thumb.archive {
          background: linear-gradient(180deg, #374151, #1f2937);
        }

        .mission-topline,
        .detail-head,
        .simple-row,
        .logistics-head,
        .homepage-footer-top,
        .homepage-footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }

        .mission-topline h3,
        .detail-head h3 {
          margin: 0;
          font-size: 16px;
          font-family: var(--font-display);
        }

        .mission-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          color: var(--soft);
          font-size: 12px;
        }

        .status-pill,
        .archive-tag,
        .distance-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 999px;
          padding: 7px 12px;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
          font-family: var(--font-display);
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .detail-card {
          overflow: hidden;
        }

        .hero {
          min-height: 220px;
          display: grid;
          place-items: center;
          font-size: 96px;
          border-bottom: 1px solid var(--border);
          overflow: hidden;
        }

        .hero.danger {
          background: linear-gradient(180deg, #5c2622 0%, #241110 100%);
        }

        .hero.calm {
          background: linear-gradient(180deg, #173830 0%, #0d1514 100%);
        }

        .hero.watch {
          background: linear-gradient(180deg, #55451e 0%, #20180b 100%);
        }

        .hero.archive {
          background: linear-gradient(180deg, #374151 0%, #111827 100%);
        }

        .detail-body {
          padding: 20px;
          display: grid;
          gap: 18px;
        }

        .detail-grid,
        .form-grid,
        .homepage-footer-columns {
          display: grid;
          gap: 12px;
        }

        .detail-grid {
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        }

        .mini-card {
          border: 1px solid var(--border);
          background: var(--panel-3);
          border-radius: 16px;
          padding: 14px;
          display: grid;
          gap: 8px;
        }

        .mini-card span {
          color: var(--soft);
          font-size: 12px;
          font-family: var(--font-display);
        }

        .detail-note {
          border: 1px solid var(--border);
          background: var(--panel-3);
          border-radius: 18px;
          padding: 16px;
        }

        .detail-actions,
        .modal-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .detail-primary-btn,
        .detail-ghost-btn {
          min-height: 48px;
          border-radius: 14px;
          padding: 0 18px;
          font-weight: 700;
        }

        .detail-primary-btn {
          background: var(--accent);
          color: #fff;
          border-color: transparent;
        }

        .detail-ghost-btn {
          background: transparent;
        }

        .logistics-item {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 14px;
          align-items: center;
          text-align: left;
          cursor: pointer;
        }

        .logistics-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          font-size: 22px;
          background: var(--panel-3);
        }

        .logistics-meta {
          display: grid;
          gap: 4px;
          text-align: right;
          color: var(--muted);
          font-size: 12px;
        }

        .archive-tag,
        .distance-chip {
          border: 1px solid var(--border);
          background: var(--panel-3);
          color: var(--text);
        }

        .homepage-footer-top {
          display: grid;
          grid-template-columns: 1.2fr 1.8fr;
          gap: 40px;
          margin-bottom: 24px;
        }

        .homepage-footer-brand p {
          max-width: 320px;
          line-height: 1.7;
        }

        .homepage-footer-columns {
          grid-template-columns: repeat(4, minmax(120px, 1fr));
        }

        .homepage-footer-column {
          display: grid;
          gap: 10px;
          align-content: start;
        }

        .homepage-footer-column span {
          font-size: 12px;
          letter-spacing: 0.12em;
          color: #ffb18b;
          font-family: var(--font-display);
        }

        .homepage-footer-column button {
          padding: 0;
          background: transparent;
          border: none;
          color: var(--muted);
          text-align: left;
        }

        .homepage-footer-bottom {
          padding-top: 18px;
          border-top: 1px solid var(--border);
          align-items: center;
        }

        .homepage-footer-bottom-icons {
          display: flex;
          gap: 10px;
          color: #ffb18b;
        }

        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(6px);
          display: grid;
          place-items: center;
          padding: 20px;
          z-index: 1000;
        }

        .modal-card {
          width: min(720px, 100%);
          height: min(90vh, 820px);
          background: #0f141b;
          border: 1px solid var(--border);
          border-radius: 24px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow);
        }

        .modal-header {
          padding: 20px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          flex-shrink: 0;
        }

        .modal-close {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--panel-2);
          color: var(--text);
          cursor: pointer;
        }

        .modal-scroll {
          flex: 1;
          min-height: 0;
          padding: 20px;
          display: grid;
          gap: 14px;
          overflow-y: auto;
          overflow-x: hidden;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .modal-scroll::-webkit-scrollbar {
          display: none;
        }

        .form-field {
          display: grid;
          gap: 8px;
        }

        .form-field label {
          font-size: 13px;
          color: #d7dde6;
          font-weight: 600;
          font-family: var(--font-display);
        }

        .modal-actions {
          padding: 16px 20px 20px;
          border-top: 1px solid var(--border);
          background: #0f141b;
          flex-shrink: 0;
        }

        .modal-close-btn,
        .modal-submit-btn {
          min-height: 48px;
          border-radius: 14px;
          padding: 0 18px;
          font-weight: 700;
        }

        .modal-submit-btn {
          background: var(--accent);
          color: white;
          border-color: transparent;
        }

        @media (max-width: 1180px) {
          .workspace {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 1100px) {
          .homepage-footer-top {
            grid-template-columns: 1fr;
            gap: 28px;
          }

          .homepage-footer-columns {
            grid-template-columns: repeat(2, minmax(160px, 1fr));
          }
        }

        @media (max-width: 980px) {
          .sidebar {
            position: static;
            width: 100%;
            height: auto;
            display: block;
          }

          .layout,
          .layout.sidebar-open,
          .layout.sidebar-closed {
            grid-template-columns: 1fr;
          }

          .content.with-sidebar,
          .content.full-width {
            max-width: none;
            margin: 0;
            padding: 20px 16px 24px;
          }
        }

        @media (max-width: 780px) {
          .hero-block {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
          }

          .mission-row,
          .detail-grid,
          .form-grid,
          .logistics-item {
            grid-template-columns: 1fr;
          }

          .mission-thumb {
            width: 100%;
            height: 120px;
          }

          .detail-head,
          .simple-row,
          .logistics-head,
          .topbar-actions,
          .controls,
          .detail-actions,
          .modal-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .hero-copy h2 {
            font-size: 34px;
          }

          .modal-card {
            height: min(92vh, 760px);
            width: 100%;
          }

          .modal-backdrop {
            padding: 12px;
          }
        }

        @media (max-width: 640px) {
          .homepage-footer {
            padding: 24px 0 18px;
            border-radius: 0;
          }

          .homepage-footer-columns {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .homepage-footer-bottom {
            flex-direction: column;
            align-items: flex-start;
          }

          .homepage-footer-brand h2 {
            font-size: 22px;
          }

          .homepage-footer-column button {
            font-size: 15px;
          }
        }
      `}</style>

      <div className={`layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {sidebarOpen ? (
          <aside className="sidebar">
            <div className="command-card">
              <div className="command-icon">✦</div>
              <div>
                <h3>Командний центр</h3>
                <p>СЕКТОР 7 ДЕЛЬТА</p>
              </div>
            </div>

            <nav className="nav-list" aria-label="Головна навігація">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`ref-nav-link ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(item.id)}
                >
                  <span className="nav-icon" aria-hidden="true">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="sidebar-footer-ref">
              <button className="new-mission-btn" type="button" onClick={handleOpenCreateModal}>
                + Додати тварину
              </button>
            </div>
          </aside>
        ) : null}

        <main className={`content ${sidebarOpen ? 'with-sidebar' : 'full-width'}`}>
          {renderContent()}
        </main>
      </div>

      {isCreateOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Додати тварину">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-display)' }}>Додати нову тварину</h3>
                <p style={{ margin: '6px 0 0', color: 'var(--muted)' }}>Заповніть форму, щоб створити нову рятувальну місію.</p>
              </div>
              <button className="modal-close" type="button" onClick={() => setIsCreateOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAnimal} style={{ display: 'contents' }}>
              <div className="modal-scroll">

                {/* ГОЛОВНЕ ФОТО */}
                <div className="form-field">
                  <label>Головне фото</label>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                    {mainPreview && (
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <div style={{ width: 80, height: 80, borderRadius: 12, overflow: 'hidden', border: '2px solid #ff6b2b' }}>
                          <img src={mainPreview} alt="main" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <button
                          type="button"
                          onClick={() => { setMainImage(null); setMainPreview(null) }}
                          style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: '#ff3b30', border: 'none', color: 'white', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
                        >×</button>
                      </div>
                    )}

                    <label
                      htmlFor="mainImageInput"
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 12,
                        border: '2px dashed #333',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#555',
                        fontSize: 24,
                        gap: 4,
                        flexShrink: 0,
                      }}
                    >
                      <span>+</span>
                      <span style={{ fontSize: 10, color: '#444' }}>фото</span>
                    </label>

                    <input
                      id="mainImageInput"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files[0]
                        if (!file) return
                        setMainImage(file)
                        setMainPreview(URL.createObjectURL(file))
                      }}
                    />
                  </div>
                </div>

                {/* ГАЛЕРЕЯ — ВИПРАВЛЕНО */}
                <div className="form-field">
                  <label>Галерея (до 3 фото)</label>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                    {galleryPreviews.map((src, i) => (
                      <div key={i} style={{ position: 'relative', flexShrink: 0 }}>
                        <div style={{ width: 80, height: 80, borderRadius: 12, overflow: 'hidden', border: '2px solid #ff6b2b' }}>
                          <img src={src} alt={`gallery-${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setGallery(prev => prev.filter((_, idx) => idx !== i))
                            setGalleryPreviews(prev => prev.filter((_, idx) => idx !== i))
                          }}
                          style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: '#ff3b30', border: 'none', color: 'white', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
                        >×</button>
                      </div>
                    ))}

                    {galleryPreviews.length < 3 && (
                      <label style={{
                        width: 80, height: 80, borderRadius: 12,
                        border: '2px dashed #333', display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                        color: '#555', fontSize: 24, gap: 4, flexShrink: 0,
                      }}>
                        <span>+</span>
                        <span style={{ fontSize: 10, color: '#444' }}>фото</span>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={e => {
                            const file = e.target.files[0]
                            if (!file) return
                            setGallery(prev => [...prev, file])
                            setGalleryPreviews(prev => [...prev, URL.createObjectURL(file)])
                            e.target.value = ''
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-field">
                    <label htmlFor="name">Ім'я</label>
                    <input id="name" name="name" className="form-input" value={form.name} onChange={handleFormChange} />
                  </div>

                  <div className="form-field">
                    <label htmlFor="species">Вид</label>
                    <input id="species" name="species" className="form-input" value={form.species} onChange={handleFormChange} />
                  </div>

                  <div className="form-field">
                    <label htmlFor="age">Вік</label>
                    <input id="age" name="age" type="number" className="form-input" value={form.age} onChange={handleFormChange} />
                  </div>

                  <div className="form-field">
                    <label htmlFor="status">Статус</label>
                    <select id="status" name="status" className="form-select" value={form.status} onChange={handleFormChange}>
                      <option value="needs rescue">Потребує порятунку</option>
                      <option value="rescued">Врятовано</option>
                      <option value="archived">В архіві</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label htmlFor="temperament">Темперамент</label>
                    <input id="temperament" name="temperament" className="form-input" value={form.temperament} onChange={handleFormChange} />
                  </div>

                  <div className="form-field">
                    <label htmlFor="city">Місто</label>
                    <input id="city" name="city" className="form-input" value={form.city} onChange={handleFormChange} />
                  </div>

                  <div className="form-field">
                    <label htmlFor="weight">Вага</label>
                    <input id="weight" name="weight" type="number" className="form-input" value={form.weight} onChange={handleFormChange} />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="description">Опис</label>
                  <textarea
                    id="description"
                    name="description"
                    className="form-textarea"
                    value={form.description}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button className="detail-ghost-btn" type="button" onClick={() => setIsCreateOpen(false)}>
                  Скасувати
                </button>
                <button className="detail-primary-btn" type="submit">
                  Зберегти тварину
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <LoginPromptModal
        open={isLoginPromptOpen}
        onClose={() => setIsLoginPromptOpen(false)}
        onLogin={() => {
          setIsLoginPromptOpen(false)
          window.dispatchEvent(new CustomEvent('open-auth-modal'))
        }}
        onContinueWithoutAccount={() => setIsLoginPromptOpen(false)}
      />

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false)
            setIsCreateOpen(true)
          }}
        />
      )}

      <Footer sidebarOpen={sidebarOpen} />
    </div>
  )
}