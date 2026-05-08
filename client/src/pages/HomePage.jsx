import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginPromptModal from '../components/LoginPromptModal'
import AuthModal from '../components/AuthModal'

const API = 'https://safetails-production-8790.up.railway.app'

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
        {mission.imageUrl
          ? <img src={mission.imageUrl} alt={mission.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 18 }} />
          : mission.emoji
        }
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
      id: a._id,
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
      archivedAt: a.status === 'archived'
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
      .catch((err) => console.error('Fetch error:', err))
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
          .join(' ').toLowerCase().includes(q)
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
  const dogsCount = missions.filter((m) =>
    m.species?.toLowerCase().includes('dog') ||
    m.species?.toLowerCase().includes('соб') ||
    m.species?.toLowerCase().includes('пес')
  ).length

  function resetForm() {
    setForm({ name: '', species: 'собака', age: '', description: '', status: 'needs rescue', temperament: 'лагідний', city: '', weight: '' })
  }

  function handleFormChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleOpenCreateModal() {
    if (!isAuthenticated) { setIsLoginPromptOpen(true); return }
    setIsCreateOpen(true)
  }

  async function handleCreateAnimal(e) {
    e.preventDefault()
    if (!isAuthenticated) { setIsCreateOpen(false); setIsLoginPromptOpen(true); return }
    if (!form.name.trim() || !form.description.trim()) return

    let lat = null, lng = null
    if (form.city.trim()) {
      try {
        const geo = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(form.city)}&format=json&limit=1&countrycodes=ua`, { headers: { 'Accept-Language': 'uk' } })
        const geoData = await geo.json()
        if (geoData.length > 0) { lat = parseFloat(geoData[0].lat); lng = parseFloat(geoData[0].lon) }
      } catch (err) { console.warn('Geocoding failed:', err) }
    }

    const payload = {
      name: form.name.trim(), species: form.species, age: Number(form.age) || 0,
      description: form.description.trim(), status: form.status, temperament: form.temperament,
      city: form.city.trim(), weight: form.weight ? Number(form.weight) : null, lat, lng,
    }

    try {
      const res = await fetch(`${API}/api/animals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': import.meta.env.VITE_ADMIN_SECRET },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Server error')
      const saved = await res.json()
      const newAnimal = {
        id: saved._id, name: saved.name, species: saved.species, age: saved.age,
        description: saved.description, temperament: saved.temperament, status: saved.status,
        city: saved.city ?? '', weight: saved.weight ?? null, lat: saved.lat ?? null,
        lng: saved.lng ?? null, imageUrl: saved.imageUrl || null,
        emoji: emojiFromSpecies(saved.species), theme: themeFromStatus(saved.status),
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
      ...selectedMission, status: 'archived', theme: 'archive',
      updated: new Date().toLocaleDateString('uk-UA'),
      archivedAt: new Date().toLocaleDateString('uk-UA'),
    }
    setArchivedMissions((prev) => [archivedAnimal, ...prev])
    const updatedMissions = missions.filter((m) => m.id !== selectedMission.id)
    setMissions(updatedMissions)
    setSelectedId(updatedMissions.length > 0 ? updatedMissions[0].id : null)
    setActiveSection('archive')
  }

  function renderContent() {
    if (activeSection === 'dashboard') {
      return (
        <>
          <section className="hero-block">
            <div className="hero-copy">
              <h2>Дашборд</h2>
              <p>Загальний огляд рятувальної діяльності, критичних сповіщень, логістичного навантаження та поточного медичного потоку.</p>
            </div>
            <div className="topbar-actions">
              <button className="collapse-btn" type="button" onClick={() => setSidebarOpen((p) => !p)}>
                {sidebarOpen ? 'Сховати меню' : 'Показати меню'}
              </button>
            </div>
          </section>
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
        </>
      )
    }

    if (activeSection === 'dispatch') {
      return (
        <>
          <section className="hero-block">
            <div className="hero-copy">
              <h2>Диспетчер</h2>
              <p>Координуйте команди, призначайте маршрути та відстежуйте запити на рятувальний транспорт.</p>
            </div>
            <div className="topbar-actions">
              <button className="collapse-btn" type="button" onClick={() => setSidebarOpen((p) => !p)}>
                {sidebarOpen ? 'Сховати меню' : 'Показати меню'}
              </button>
            </div>
          </section>
          <section className="logistics" aria-label="Черга диспетчера">
            {logisticsSeed.map((item) => (
              <button key={item.id} className="logistics-item" type="button">
                <div className="logistics-icon">{item.icon}</div>
                <div><h4>{item.title}</h4><p>{item.detail}</p></div>
                <div className="logistics-meta"><strong>{item.eta}</strong><span>{item.type}</span></div>
              </button>
            ))}
          </section>
        </>
      )
    }

    if (activeSection === 'medical') {
      return (
        <>
          <section className="hero-block">
            <div className="hero-copy">
              <h2>Медичний журнал</h2>
              <p>Переглядайте хід лікування, призначений персонал та оновлення одужання для кожного пацієнта.</p>
            </div>
            <div className="topbar-actions">
              <button className="collapse-btn" type="button" onClick={() => setSidebarOpen((p) => !p)}>
                {sidebarOpen ? 'Сховати меню' : 'Показати меню'}
              </button>
            </div>
          </section>
          <SectionCard title="Медичні записи" subtitle="Останні дії з лікування">
            <div className="simple-list">
              {medicalSeed.map((item) => (
                <div className="simple-row" key={item.id}>
                  <div><strong>{item.patient}</strong><p>{item.treatment} · {item.doctor}</p></div>
                  <StatusPill status={item.status} />
                </div>
              ))}
            </div>
          </SectionCard>
        </>
      )
    }

    if (activeSection === 'archive') {
      return (
        <>
          <section className="hero-block">
            <div className="hero-copy">
              <h2>Архів</h2>
              <p>Перегляд завершених рятувальних місій, результатів відновлення та архівованих справ тварин.</p>
            </div>
            <div className="topbar-actions">
              <button className="collapse-btn" type="button" onClick={() => setSidebarOpen((p) => !p)}>
                {sidebarOpen ? 'Сховати меню' : 'Показати меню'}
              </button>
            </div>
          </section>
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
                <div className="detail-note"><p>Архівованих тварин ще немає.</p></div>
              )}
            </div>
          </SectionCard>
        </>
      )
    }

    return (
      <>
        <section className="hero-block">
          <div className="hero-copy">
            <h2>Активні порятунки</h2>
            <p>Відстежуйте активні справи порятунку, відправляйте команди та переглядайте деталі в одному місці.</p>
          </div>
          <div className="topbar-actions">
            <button className="collapse-btn" type="button" onClick={() => setSidebarOpen((p) => !p)}>
              {sidebarOpen ? 'Сховати меню' : 'Показати меню'}
            </button>
          </div>
        </section>

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
                <input className="search" type="text" placeholder="Пошук тварин" value={query} onChange={(e) => setQuery(e.target.value)} autoComplete="off" />
                {[{ value: 'All', label: 'Всі' }, { value: 'needs rescue', label: 'Потребують порятунку' }, { value: 'rescued', label: 'Врятовано' }].map(({ value, label }) => (
                  <button key={value} type="button" className={`toolbar-btn ${filter === value ? 'active' : ''}`} onClick={() => setFilter(value)}>{label}</button>
                ))}
                {[{ value: 'Name', label: "Ім'я" }, { value: 'Age', label: 'Вік' }, { value: 'Status', label: 'Статус' }].map(({ value, label }) => (
                  <button key={value} type="button" className={`toolbar-btn ${sort === value ? 'active' : ''}`} onClick={() => setSort(value)}>{label}</button>
                ))}
              </div>
            </div>
            <div className="mission-list">
              {loading ? (
                <div className="detail-note"><p>Завантаження тварин...</p></div>
              ) : visibleMissions.length > 0 ? (
                visibleMissions.map((mission) => (
                  <MissionRow key={mission.id} mission={mission} active={selectedMission?.id === mission.id} onSelect={setSelectedId} />
                ))
              ) : (
                <div className="detail-note"><p>Тварин за поточним пошуком або фільтрами не знайдено.</p></div>
              )}
            </div>
          </div>

          {selectedMission ? (
            <aside className="panel detail-card">
              <div className={`hero ${selectedMission.theme}`}>
                {selectedMission.imageUrl
                  ? <img src={selectedMission.imageUrl} alt={selectedMission.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : selectedMission.emoji
                }
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
                  <div className="mini-card"><span>Темперамент</span><strong>{selectedMission.temperament || 'Невідомо'}</strong></div>
                  <div className="mini-card"><span>Вік</span><strong>{selectedMission.age} р.</strong></div>
                  {selectedMission.city && <div className="mini-card"><span>Місто</span><strong>{selectedMission.city}</strong></div>}
                  {selectedMission.weight && <div className="mini-card"><span>Вага</span><strong>{selectedMission.weight} кг</strong></div>}
                </div>
                <div className="detail-note"><p>{selectedMission.description}</p></div>
                <div className="detail-actions">
                  <button className="detail-primary-btn" type="button" onClick={handleOpenCase}>Відкрити справу</button>
                  <button className="detail-ghost-btn" type="button" onClick={handleArchive}>Архівувати</button>
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
              <div><h4>{item.title}</h4><p>{item.detail}</p></div>
              <div className="logistics-meta"><strong>{item.eta}</strong><span>{item.type}</span></div>
            </button>
          ))}
        </section>
      </>
    )
  }

  return (
    <div className="missions-shell">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Alexandria:wght@300;400;500;600;700;800;900&family=Adamina&display=swap');

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
          --font-display: 'Alexandria', sans-serif;
          --font-body: 'Adamina', serif;
        }

        * { box-sizing: border-box; }

        .missions-shell {
          min-height: calc(100vh - 60px);
          background:
            radial-gradient(circle at top right, rgba(255,107,43,0.12), transparent 26%),
            linear-gradient(180deg, #07090d 0%, #090c11 100%);
          color: var(--text);
          font-family: var(--font-body);
        }

        .layout { min-height: calc(100vh - 60px); }

        .sidebar {
          position: fixed; top: 60px; left: 0; width: 188px;
          height: calc(100vh - 60px); overflow-y: auto;
          background: linear-gradient(180deg, #05070b 0%, #070912 100%);
          border-right: 1px solid rgba(255,255,255,0.05); z-index: 30;
        }

        .command-card {
          margin: 14px 8px; border: 1px solid rgba(255,255,255,0.08);
          background: linear-gradient(180deg, rgba(32,30,54,0.95), rgba(25,24,42,0.92));
          border-radius: 12px; padding: 8px 10px; display: flex; align-items: center; gap: 9px;
        }
        .command-icon {
          width: 36px; height: 36px; border-radius: 11px; display: grid; place-items: center;
          background: linear-gradient(135deg, #ff7b32, #ff5a1f);
          color: white; font-size: 13px; font-weight: 700; flex-shrink: 0;
        }
        .command-card h3 { margin: 0; font-size: 10px; font-weight: 800; color: #f4f4f8; line-height: 1.15; font-family: var(--font-display); }
        .command-card p { margin: 3px 0 0; font-size: 8px; letter-spacing: 0.18em; text-transform: uppercase; color: #73778a; line-height: 1.1; font-family: var(--font-display); }

        .nav-list { display: grid; padding: 0 0 8px; border-top: 1px solid rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.04); }

        .ref-nav-link {
          position: relative; min-height: 42px; border-radius: 0; padding: 0 13px;
          color: #6f7385; border: 0; background: transparent;
          display: flex; align-items: center; gap: 8px;
          font-size: 12px; font-weight: 500; font-family: var(--font-display);
          width: 100%; cursor: pointer; text-align: left;
        }
        .ref-nav-link:hover { background: rgba(255,255,255,0.02); color: #d5d8e3; }
        .ref-nav-link.active { background: linear-gradient(90deg, rgba(255,107,43,0.12), rgba(255,107,43,0.04)); color: #ff6b2b; font-weight: 600; }
        .ref-nav-link.active::before { content: ''; position: absolute; left: 0; top: 8px; bottom: 8px; width: 3px; border-radius: 0 3px 3px 0; background: #ff6b2b; }

        .nav-icon { width: 12px; display: inline-flex; justify-content: center; font-size: 10px; }
        .sidebar-footer-ref { padding: 12px 8px 14px; display: grid; gap: 6px; }

        .new-mission-btn, .collapse-btn, .toolbar-btn, .mission-row,
        .detail-primary-btn, .detail-ghost-btn, .logistics-item,
        .modal-close-btn, .modal-submit-btn {
          transition: transform .18s ease, background .18s ease, border-color .18s ease;
        }
        .new-mission-btn:hover, .collapse-btn:hover, .toolbar-btn:hover, .mission-row:hover,
        .detail-primary-btn:hover, .detail-ghost-btn:hover, .logistics-item:hover,
        .modal-close-btn:hover, .modal-submit-btn:hover { transform: translateY(-1px); }

        .new-mission-btn {
          width: 100%; min-height: 40px; border: 0; border-radius: 999px;
          background: linear-gradient(135deg, #ff7c32, #f35a19);
          color: white; font-size: 13px; font-weight: 800; cursor: pointer; font-family: var(--font-display);
        }

        .content { min-width: 0; width: 100%; max-width: 100%; display: grid; gap: 24px; transition: padding 0.25s ease; }
        .content.with-sidebar { padding: 28px 28px 28px 212px; }
        .content.full-width { padding: 28px; }

        .hero-block { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 16px; align-items: start; }
        .hero-copy h2 { margin: 0; font-family: var(--font-display); font-size: clamp(28px, 4vw, 42px); font-weight: 800; line-height: 1.05; letter-spacing: -0.02em; }
        .hero-copy p { margin: 12px 0 0; font-family: var(--font-body); max-width: 620px; color: var(--muted); font-size: 15px; line-height: 1.75; }
        .topbar-actions { display: flex; justify-content: flex-end; }

        .collapse-btn, .toolbar-btn, .modal-close-btn {
          border: 1px solid var(--border); background: var(--panel); color: var(--text);
          border-radius: 14px; min-height: 46px; padding: 0 16px; cursor: pointer;
          font-family: var(--font-display); font-size: 13px; font-weight: 500;
        }
        .modal-submit-btn, .detail-primary-btn {
          border: 0; background: linear-gradient(135deg, #ff7f47 0%, #ff6b2b 100%);
          color: white; border-radius: 14px; min-height: 46px; padding: 0 16px;
          cursor: pointer; font-family: var(--font-display); font-weight: 700; font-size: 14px;
        }

        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
        .stat-card, .panel { background: rgba(17,21,28,0.94); border: 1px solid var(--border); border-radius: 24px; box-shadow: var(--shadow); }
        .stat-card { padding: 18px; }

        .eyebrow { display: block; margin-bottom: 10px; color: var(--muted); font-family: var(--font-display); font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }
        .small-no-margin { margin-bottom: 0; }
        .stat-card strong { display: block; font-family: var(--font-display); font-size: 32px; font-weight: 800; line-height: 1; margin-bottom: 8px; letter-spacing: -0.02em; }
        .stat-card p, .panel-header p, .mission-copy p, .logistics-item p, .simple-row p { margin: 0; color: var(--muted); font-family: var(--font-body); font-size: 13px; line-height: 1.5; }

        .workspace { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(320px, 420px); gap: 20px; align-items: start; }

        .panel-header { padding: 20px 20px 16px; border-bottom: 1px solid var(--border); display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px; align-items: center; }
        .panel-header h3, .logistics-head h3 { margin: 0; font-family: var(--font-display); font-size: 17px; font-weight: 700; }
        .panel-pad { padding: 16px; }
        .controls { display: flex; flex-wrap: wrap; gap: 10px; }

        .search, .form-input, .form-select, .form-textarea {
          width: 100%; border-radius: 14px; border: 1px solid var(--border);
          background: var(--panel-3); color: var(--text); padding: 12px 14px; outline: none; font-family: var(--font-body); font-size: 14px;
        }
        .search { min-width: 220px; border-radius: 999px; }
        .form-textarea { min-height: 110px; resize: vertical; }
        .toolbar-btn.active { background: rgba(255,255,255,0.08); }

        .mission-list, .logistics, .simple-list { display: grid; gap: 12px; }
        .mission-list { padding: 16px; }

        .mission-row, .logistics-item, .simple-row { width: 100%; border: 1px solid var(--border); background: var(--panel-2); color: inherit; border-radius: 18px; padding: 14px; }
        .mission-row { display: grid; grid-template-columns: 70px 1fr; gap: 14px; text-align: left; cursor: pointer; }
        .mission-row.active { border-color: rgba(255,107,43,0.6); background: linear-gradient(180deg, rgba(255,107,43,0.08), rgba(255,255,255,0.02)); }

        .mission-thumb { width: 70px; height: 70px; border-radius: 18px; display: grid; place-items: center; font-size: 34px; overflow: hidden; }
        .mission-thumb.danger { background: linear-gradient(180deg, #4a201f, #2b1212); }
        .mission-thumb.calm { background: linear-gradient(180deg, #12312b, #10201d); }
        .mission-thumb.watch { background: linear-gradient(180deg, #3f3217, #241c0f); }
        .mission-thumb.archive { background: linear-gradient(180deg, #374151, #1f2937); }

        .mission-topline, .detail-head, .simple-row, .logistics-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
        .mission-topline h3, .detail-head h3 { margin: 0; font-family: var(--font-display); font-size: 15px; font-weight: 700; }
        .mission-meta { display: flex; flex-wrap: wrap; gap: 10px; color: var(--soft); font-family: var(--font-body); font-size: 12px; }

        .status-pill, .archive-tag { display: inline-flex; align-items: center; gap: 8px; border-radius: 999px; padding: 6px 11px; font-family: var(--font-display); font-size: 11px; font-weight: 700; white-space: nowrap; }
        .status-dot { width: 8px; height: 8px; border-radius: 50%; }

        .detail-card { overflow: hidden; }
        .hero { min-height: 220px; display: grid; place-items: center; font-size: 96px; border-bottom: 1px solid var(--border); overflow: hidden; }
        .hero.danger { background: linear-gradient(180deg, #5c2622 0%, #241110 100%); }
        .hero.calm { background: linear-gradient(180deg, #173830 0%, #0d1514 100%); }
        .hero.watch { background: linear-gradient(180deg, #55451e 0%, #20180b 100%); }
        .hero.archive { background: linear-gradient(180deg, #374151 0%, #111827 100%); }

        .detail-body { padding: 20px; display: grid; gap: 18px; }
        .detail-head p { margin: 6px 0 0; font-family: var(--font-body); color: var(--muted); font-size: 13px; }

        .archive-tag { border: 1px solid var(--border); background: var(--panel-3); color: var(--text); }
        .detail-grid, .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        .mini-card, .detail-note { border-radius: 18px; background: var(--panel-3); border: 1px solid var(--border); padding: 16px; }
        .mini-card span { display: block; color: var(--muted); font-family: var(--font-display); font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px; }
        .mini-card strong { font-family: var(--font-display); font-size: 17px; font-weight: 700; }
        .detail-note p { margin: 0; font-family: var(--font-body); color: #d0d5dd; line-height: 1.75; font-size: 14px; }

        .detail-actions, .modal-actions { display: flex; gap: 12px; }
        .detail-primary-btn, .detail-ghost-btn, .modal-close-btn, .modal-submit-btn { flex: 1; min-height: 46px; font-weight: 700; }
        .detail-ghost-btn { border: 1px solid var(--border); background: var(--panel); color: var(--muted); border-radius: 14px; cursor: pointer; font-family: var(--font-display); font-size: 13px; font-weight: 600; }

        .logistics-item { text-align: left; display: grid; grid-template-columns: 44px 1fr auto; gap: 14px; align-items: center; cursor: pointer; }
        .logistics-icon { width: 44px; height: 44px; border-radius: 14px; display: grid; place-items: center; background: var(--panel-2); font-size: 20px; }
        .logistics-item h4, .simple-row strong { margin: 0 0 4px; font-family: var(--font-display); font-size: 14px; font-weight: 700; }
        .logistics-meta { text-align: right; }
        .logistics-meta strong { display: block; font-family: var(--font-display); font-size: 13px; font-weight: 700; }
        .logistics-meta span { font-family: var(--font-body); color: var(--muted); font-size: 11px; }

        .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.62); display: flex; align-items: center; justify-content: center; padding: 20px; z-index: 1000; }
        .modal-card { width: min(680px, 100%); height: min(88vh, 760px); background: #0f141b; border: 1px solid var(--border); border-radius: 24px; box-shadow: 0 24px 60px rgba(0,0,0,0.45); overflow: hidden; display: flex; flex-direction: column; margin: auto; }
        .modal-head { padding: 20px 20px 16px; border-bottom: 1px solid var(--border); flex-shrink: 0; }
        .modal-head h3 { margin: 0 0 6px; font-family: var(--font-display); font-size: 20px; font-weight: 800; }
        .modal-head p { margin: 0; font-family: var(--font-body); color: var(--muted); font-size: 13px; }
        .modal-form { display: flex; flex-direction: column; flex: 1; min-height: 0; }
        .modal-scroll { flex: 1; min-height: 0; padding: 20px; display: grid; gap: 14px; overflow-y: auto; overflow-x: hidden; scrollbar-width: none; -ms-overflow-style: none; }
        .modal-scroll::-webkit-scrollbar { display: none; }
        .form-field { display: grid; gap: 8px; }
        .form-field label { font-family: var(--font-display); font-size: 11px; color: #d7dde6; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
        .modal-actions { padding: 16px 20px 20px; border-top: 1px solid var(--border); background: #0f141b; flex-shrink: 0; }

        @media (max-width: 1180px) { .workspace { grid-template-columns: 1fr; } }
        @media (max-width: 980px) {
          .sidebar { position: static; width: 100%; height: auto; display: block; }
          .content.with-sidebar, .content.full-width { padding: 20px 16px 24px; }
        }
        @media (max-width: 780px) {
          .hero-block, .mission-row, .detail-grid, .form-grid, .logistics-item { grid-template-columns: 1fr; }
          .mission-thumb { width: 100%; height: 120px; }
          .detail-head, .simple-row, .logistics-head, .topbar-actions, .controls, .detail-actions, .modal-actions { flex-direction: column; align-items: stretch; }
          .hero-copy h2 { font-size: 28px; }
          .modal-card { height: min(92vh, 760px); width: 100%; }
          .modal-backdrop { padding: 12px; }
        }
      `}</style>

      <div className="layout">
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
                <button key={item.id} type="button" className={`ref-nav-link ${activeSection === item.id ? 'active' : ''}`} onClick={() => setActiveSection(item.id)}>
                  <span className="nav-icon" aria-hidden="true">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
            <div className="sidebar-footer-ref">
              <button className="new-mission-btn" type="button" onClick={handleOpenCreateModal}>+ Додати тварину</button>
            </div>
          </aside>
        ) : null}

        <main className={`content ${sidebarOpen ? 'with-sidebar' : 'full-width'}`}>
          {renderContent()}
        </main>
      </div>

      {isCreateOpen && (
        <div className="modal-backdrop" onClick={() => setIsCreateOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Додати нову тварину</h3>
              <p>Заповніть форму, щоб створити нову рятувальну місію.</p>
            </div>
            <form className="modal-form" onSubmit={handleCreateAnimal} autoComplete="off">
              <div className="modal-scroll">
                <div className="form-grid">
                  <div className="form-field">
                    <label htmlFor="name">Ім'я тварини</label>
                    <input id="name" name="name" className="form-input" value={form.name} onChange={handleFormChange} placeholder="Барні" autoComplete="new-password" />
                  </div>
                  <div className="form-field">
                    <label htmlFor="species">Вид</label>
                    <select id="species" name="species" className="form-select" value={form.species} onChange={handleFormChange}>
                      <option value="собака">🐕 Собака</option>
                      <option value="кіт">🐈 Кіт</option>
                      <option value="інше">🐾 Інше</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label htmlFor="age">Вік (років)</label>
                    <input id="age" name="age" type="number" min="0" max="30" className="form-input" value={form.age} onChange={handleFormChange} placeholder="3" />
                  </div>
                  <div className="form-field">
                    <label htmlFor="weight">Вага (кг)</label>
                    <input id="weight" name="weight" type="number" min="0" max="200" step="0.1" className="form-input" value={form.weight} onChange={handleFormChange} placeholder="5" />
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
                    <select id="temperament" name="temperament" className="form-select" value={form.temperament} onChange={handleFormChange}>
                      <option value="лагідний">Лагідний</option>
                      <option value="активний">Активний</option>
                      <option value="спокійний">Спокійний</option>
                      <option value="грайливий">Грайливий</option>
                      <option value="незалежний">Незалежний</option>
                    </select>
                  </div>
                </div>
                <div className="form-field">
                  <label htmlFor="city">Місто знаходження</label>
                  <input id="city" name="city" className="form-input" value={form.city} onChange={handleFormChange} placeholder="Львів" autoComplete="new-password" />
                </div>
                <div className="form-field">
                  <label htmlFor="description">Опис</label>
                  <textarea id="description" name="description" className="form-textarea" value={form.description} onChange={handleFormChange} placeholder="Короткий опис тварини..." />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="modal-close-btn" onClick={() => setIsCreateOpen(false)}>Скасувати</button>
                <button type="submit" className="modal-submit-btn">Зберегти тварину</button>
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
    </div>
  )
}