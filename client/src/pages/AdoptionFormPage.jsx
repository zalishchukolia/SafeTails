import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginPromptModal from '../components/LoginPromptModal'
import AuthModal from '../components/AuthModal'


const font = "'Inter', sans-serif"


const FILTERS = {
  age: ['Будь-який вік', 'Цуценя/Кошеня', 'Молодий', 'Дорослий', 'Старший'],
  temperament: ['Будь-який характер', 'Спокійний', 'Грайливий', 'Захисний', 'Незалежний'],
}


const AGE_MAP = {
  'All Ages': 'Будь-який вік',
  'Puppy/Kitten': 'Цуценя/Кошеня',
  'Young': 'Молодий',
  'Adult': 'Дорослий',
  'Senior': 'Старший',
}


const BADGE_COLORS = {
  URGENT: { bg: '#ff3b30', text: '#fff' },
  SPONSORED: { bg: '#ff6b2b', text: '#fff' },
  NEW: { bg: '#22c55e', text: '#fff' },
  READY: { bg: '#3b82f6', text: '#fff' },
}


export default function AdoptionFormPage() {
  const navigate = useNavigate()


  const [animals, setAnimals] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [ageFilter, setAgeFilter] = useState('Будь-який вік')
  const [tempFilter, setTempFilter] = useState('Будь-який характер')
  const [visible, setVisible] = useState(8)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [pendingAnimal, setPendingAnimal] = useState(null)


  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/animals`)
      .then(res => res.json())
      .then(data => {
        setAnimals(Array.isArray(data) ? data : data.animals || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])


  const getAgeCategory = age => {
    const numericAge = Number(age)
    if (Number.isNaN(numericAge)) return 'Невідомо'
    if (numericAge < 1) return 'Цуценя/Кошеня'
    if (numericAge >= 1 && numericAge < 3) return 'Молодий'
    if (numericAge >= 3 && numericAge < 8) return 'Дорослий'
    return 'Старший'
  }


  const TEMP_MAP = {
    'Будь-який характер': 'any temperament',
    'Спокійний': 'calm',
    'Грайливий': 'playful',
    'Захисний': 'protective',
    'Незалежний': 'independent',
  }


  const filtered = animals.filter(animal => {
    const q = search.toLowerCase().trim()
    const name = (animal.name || '').toLowerCase()
    const breed = (animal.breed || '').toLowerCase()
    const species = (animal.species || '').toLowerCase()
    const description = (animal.description || '').toLowerCase()
    const temperament = (animal.temperament || '').toLowerCase()


    const matchesSearch =
      q === '' ||
      name.includes(q) ||
      breed.includes(q) ||
      species.includes(q) ||
      description.includes(q)


    const animalAgeCategory = getAgeCategory(animal.age)
    const matchesAge = ageFilter === 'Будь-який вік' || animalAgeCategory === ageFilter


    const tempEn = TEMP_MAP[tempFilter] || ''
    const matchesTemperament =
      tempFilter === 'Будь-який характер' || temperament.includes(tempEn)


    return matchesSearch && matchesAge && matchesTemperament
  })


  const displayed = filtered.slice(0, visible)


  const handleApply = (animalName) => {
    const token = localStorage.getItem('token')
    if (!token) {
      setPendingAnimal(animalName)
      setShowLoginPrompt(true)
    } else {
      navigate('/adoption-application', { state: { animalName } })
    }
  }


  const handleLoginSuccess = () => {
    setShowAuthModal(false)
    setShowLoginPrompt(false)
    if (pendingAnimal) {
      navigate('/adoption-application', { state: { animalName: pendingAnimal } })
    }
  }


  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0d0d0d',
        color: '#fff',
        fontFamily: font,
        paddingBottom: 80,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700;900&family=Inter:wght@400;500;600;700&display=swap');

        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>

      <div style={{ padding: '56px 48px 0', maxWidth: 1200, margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 24,
            marginBottom: 12,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 'clamp(28px, 4vw, 48px)',
                fontWeight: 800,
                margin: 0,
                lineHeight: 1.1,
                fontFamily: "'Merriweather', serif",
              }}
            >
              Знайди того, кому дати{' '}
              <span style={{ color: '#ff6b2b' }}>прихисток</span>
            </h1>


            <p
              style={{
                color: '#666',
                marginTop: 12,
                maxWidth: 500,
                fontSize: 15,
                lineHeight: 1.6,
              }}
            >
              Кожна тварина тут має свою історію. Вони не просто улюбленці —
              вони чекають на свій останній крок: постійний дім.
            </p>
          </div>


          <div
            style={{
              background: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderRadius: 12,
              padding: '10px 20px',
              fontSize: 13,
              color: '#888',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#22c55e',
                display: 'inline-block',
              }}
            />
            {loading ? 'Завантаження…' : `${filtered.length} тварин чекають`}
          </div>
        </div>
      </div>


      <div style={{ padding: '28px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 200 }}>
            <span
              style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#555',
                fontSize: 16,
              }}
            >
              🔍
            </span>


            <input
              value={search}
              onChange={e => {
                setSearch(e.target.value)
                setVisible(8)
              }}
              placeholder="Пошук за іменем, породою або видом..."
              style={{
                width: '100%',
                boxSizing: 'border-box',
                background: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: 10,
                padding: '11px 14px 11px 42px',
                color: '#fff',
                fontSize: 14,
                outline: 'none',
                fontFamily: font,
              }}
            />
          </div>


          <select
            value={ageFilter}
            onChange={e => {
              setAgeFilter(e.target.value)
              setVisible(8)
            }}
            style={{
              background: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderRadius: 10,
              padding: '11px 16px',
              color: ageFilter === 'Будь-який вік' ? '#666' : '#fff',
              fontSize: 14,
              outline: 'none',
              cursor: 'pointer',
              fontFamily: font,
            }}
          >
            {FILTERS.age.map(option => (
              <option key={option}>{option}</option>
            ))}
          </select>


          <select
            value={tempFilter}
            onChange={e => {
              setTempFilter(e.target.value)
              setVisible(8)
            }}
            style={{
              background: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderRadius: 10,
              padding: '11px 16px',
              color: tempFilter === 'Будь-який характер' ? '#666' : '#fff',
              fontSize: 14,
              outline: 'none',
              cursor: 'pointer',
              fontFamily: font,
            }}
          >
            {FILTERS.temperament.map(option => (
              <option key={option}>{option}</option>
            ))}
          </select>


          <button
            onClick={() => {
              setSearch('')
              setAgeFilter('Будь-який вік')
              setTempFilter('Будь-який характер')
              setVisible(8)
            }}
            style={{
              background: 'transparent',
              border: '1px solid #333',
              borderRadius: 10,
              padding: '11px 18px',
              color: '#888',
              fontSize: 14,
              cursor: 'pointer',
              fontFamily: font,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            Скинути фільтри
          </button>
        </div>
      </div>


      <div style={{ padding: '0 48px', maxWidth: 1200, margin: '0 auto' }}>
        {loading ? (
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                style={{
                  flex: '1 1 220px',
                  height: 320,
                  background: '#1a1a1a',
                  borderRadius: 16,
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#555' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🐾</div>
            <p>Тварин за вашими фільтрами не знайдено.</p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
              gap: 20,
            }}
          >
            {displayed.map(animal => (
              <AnimalCard
                key={animal._id || animal.id}
                animal={animal}
                onClick={() => navigate(`/animals/${animal._id || animal.id}`)}
                onApply={() => handleApply(animal.name)}
              />
            ))}
          </div>
        )}


        {!loading && visible < filtered.length && (
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <p style={{ color: '#555', fontSize: 13, marginBottom: 16 }}>
              Нові тварини з'являються щодня.
            </p>


            <button
              onClick={() => setVisible(prev => prev + 8)}
              style={{
                background: 'transparent',
                border: '1px solid #333',
                borderRadius: 30,
                padding: '12px 32px',
                color: '#888',
                fontSize: 14,
                cursor: 'pointer',
                fontFamily: font,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#ff6b2b'
                e.currentTarget.style.color = '#ff6b2b'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#333'
                e.currentTarget.style.color = '#888'
              }}
            >
              ПОКАЗАТИ БІЛЬШЕ
            </button>
          </div>
        )}
      </div>


      {showLoginPrompt && (
        <LoginPromptModal
          onClose={() => setShowLoginPrompt(false)}
          onLogin={() => {
            setShowLoginPrompt(false)
            setShowAuthModal(true)
          }}
        />
      )}


      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleLoginSuccess}
        />
      )}
    </div>
  )
}


function AnimalCard({ animal, onApply, onClick }) {
  const [hovered, setHovered] = useState(false)


  const badge = animal.status?.toUpperCase() || animal.badge?.toUpperCase()
  const badgeStyle = BADGE_COLORS[badge] || BADGE_COLORS.READY


  const age = animal.age
    ? `${animal.age} ${animal.age === 1 ? 'рік' : animal.age < 5 ? 'роки' : 'років'}`
    : ''


  const breed = animal.breed || animal.species || 'Змішана порода'
  const imgUrl = animal.imageUrl || animal.image || animal.photo || null


  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#1a1a1a',
        border: `1px solid ${hovered ? '#ff6b2b44' : '#222'}`,
        borderRadius: 16,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.2s',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? '0 12px 40px #ff6b2b18' : 'none',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          position: 'relative',
          height: 200,
          background: '#111',
          overflow: 'hidden',
        }}
      >
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={animal.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s',
              transform: hovered ? 'scale(1.05)' : 'scale(1)',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 48,
              background: '#141414',
            }}
          >
            🐾
          </div>
        )}


        {badge && (
          <div
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              background: badgeStyle.bg,
              color: badgeStyle.text,
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: 1.5,
              padding: '4px 10px',
              borderRadius: 6,
              textTransform: 'uppercase',
            }}
          >
            {badge}
          </div>
        )}
      </div>


      <div
        style={{
          padding: '14px 16px 16px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ marginBottom: 4 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#fff' }}>
            {animal.name}
          </h3>


          <p style={{ margin: '3px 0 0', fontSize: 12, color: '#666' }}>
            {breed}
            {age ? ` · ${age}` : ''}
          </p>
        </div>


        {animal.description && (
          <p
            style={{
              fontSize: 12,
              color: '#555',
              margin: '8px 0 12px',
              lineHeight: 1.5,
              flex: 1,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {animal.description}
          </p>
        )}


        <button
          onClick={e => {
            e.stopPropagation()
            onApply()
          }}
          style={{
            marginTop: 'auto',
            background: hovered ? '#ff6b2b' : 'transparent',
            border: '1px solid',
            borderColor: hovered ? '#ff6b2b' : '#333',
            borderRadius: 8,
            padding: '10px 0',
            color: hovered ? '#fff' : '#888',
            fontSize: 12,
            fontWeight: 600,
            fontFamily: "'Inter', sans-serif",
            cursor: 'pointer',
            width: '100%',
            transition: 'all 0.2s',
            letterSpacing: 0.5,
          }}
        >
          ДАТИ ПРИХИСТОК
        </button>
      </div>
    </div>
  )
}