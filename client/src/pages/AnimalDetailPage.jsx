import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

const font = "'Inter', 'Helvetica Neue', sans-serif"
const title = "'Merriweather', 'Georgia', serif"
const mono = "'DM Mono', 'Courier New', monospace"

function FooterColumn({ title: colTitle, links }) {
  return (
    <div>
      <div
        style={{
          fontSize: 10,
          color: '#555',
          letterSpacing: 2,
          fontFamily: mono,
          marginBottom: 16,
          textTransform: 'uppercase',
        }}
      >
        {colTitle}
      </div>
      {links.map((link) => (
        <div
          key={link}
          style={{
            fontSize: 13,
            color: '#8a8a8a',
            marginBottom: 12,
            cursor: 'pointer',
            fontFamily: font,
          }}
        >
          {link}
        </div>
      ))}
    </div>
  )
}

function Footer() {
  return (
    <footer style={{ background: '#0d0d0d', fontFamily: font, borderTop: '1px solid #1e1e1e' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '42px 40px 26px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
            gap: 34,
            marginBottom: 30,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 900,
                fontStyle: 'italic',
                background: 'linear-gradient(90deg,#ff6b2b,#ff4500)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: 14,
                fontFamily: title,
                letterSpacing: '-0.02em',
              }}
            >
              SafeTails
            </div>
            <p
              style={{
                fontSize: 13,
                color: '#717171',
                lineHeight: 1.8,
                maxWidth: 290,
                margin: 0,
                fontFamily: font,
              }}
            >
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
          <span style={{ fontSize: 12, color: '#4d4d4d', fontFamily: font }}>
            © 2026 SafeTails. Всі права захищені.
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 14, color: '#4d4d4d', cursor: 'pointer' }}>↗</span>
            <span style={{ fontSize: 14, color: '#4d4d4d', cursor: 'pointer' }}>✦</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (isNaN(date)) return ''
  return date.toLocaleDateString('uk-UA', { day: '2-digit', month: 'short', year: 'numeric' })
}

function getSpeciesEmoji(species) {
  if (!species) return '🐾'
  const s = species.toLowerCase()
  if (s.includes('кіт') || s.includes('кішк') || s.includes('cat')) return '🐱'
  if (s.includes('пес') || s.includes('собак') || s.includes('dog')) return '🐶'
  if (s.includes('кролик') || s.includes('rabbit')) return '🐰'
  return '🐾'
}

function getSpeciesLabel(species) {
  if (!species) return 'тваринки'
  const s = species.toLowerCase()
  if (s.includes('кіт') || s.includes('кішк') || s.includes('cat')) return 'котики'
  if (s.includes('пес') || s.includes('собак') || s.includes('dog')) return 'песики'
  return 'тваринки'
}

function RelatedAnimalCard({ animal }) {
  const img = animal.imageUrl || animal.image || animal.photo
  const rid = animal._id || animal.id
  const name = animal.name || 'Невідомо'
  const city = animal.city || animal.location || animal.region || ''
  const date = formatDate(animal.createdAt || animal.date)

  return (
    <Link
      to={`/animals/${rid}`}
      style={{
        display: 'block',
        background: '#f0ebe0',
        borderRadius: 20,
        overflow: 'hidden',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        minWidth: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.18)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)'
      }}
    >
      <div
        style={{
          width: '100%',
          aspectRatio: '0.92 / 1',
          overflow: 'hidden',
          background: '#e8e0d0',
        }}
      >
        {img ? (
          <img
            src={img}
            alt={name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
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
            }}
          >
            {getSpeciesEmoji(animal.species)}
          </div>
        )}
      </div>

      <div style={{ padding: '14px 12px 16px', textAlign: 'center', minHeight: 104 }}>
        <div
          style={{
            fontSize: 18,
            fontWeight: 900,
            color: '#ff6b2b',
            marginBottom: 4,
            fontFamily: title,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}
        >
          {name}
        </div>

        {city && (
          <div
            style={{
              fontSize: 14,
              color: '#444',
              marginBottom: 6,
              fontFamily: font,
              lineHeight: 1.25,
            }}
          >
            {city}
          </div>
        )}

        {date && <div style={{ fontSize: 12, color: '#aaa', fontFamily: font }}>{date}</div>}
      </div>
    </Link>
  )
}

function AnimalDetailPage() {
  const { id } = useParams()
  const [animal, setAnimal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [related, setRelated] = useState([])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })

    fetch(`https://safetails-production-8790.up.railway.app/api/animals/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setAnimal(data)
        setLoading(false)

        fetch('https://safetails-production-8790.up.railway.app/api/animals')
          .then((res) => res.json())
          .then((all) => {
            const others = all.filter((a) => String(a._id || a.id) !== String(id))
            const sameSpecies = others.filter(
              (a) => a.species?.toLowerCase() === data.species?.toLowerCase()
            )
            const different = others.filter(
              (a) => a.species?.toLowerCase() !== data.species?.toLowerCase()
            )
            setRelated([...sameSpecies, ...different].slice(0, 4))
          })
          .catch(() => {})
      })
      .catch((err) => {
        console.log('FETCH ERROR:', err)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0f0f10',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: font,
        }}
      >
        Завантаження...
      </div>
    )
  }

  if (!animal) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0f0f10',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: font,
        }}
      >
        Тварину не знайдено
      </div>
    )
  }

  const mainImage = animal.imageUrl || animal.image || animal.photo
  const animalName = animal.name || 'Невідомо'
  const species = animal.species || 'Тварина'
  const age = animal.age ? `${animal.age} р.` : 'Вік невідомий'
  const temperament = animal.temperament || 'Дружелюбний'
  const weight = animal.weight ? `${animal.weight} кг` : 'Невідомо'
  const emoji = getSpeciesEmoji(species)
  const speciesLabel = getSpeciesLabel(species)

  const gallery =
    animal.gallery && Array.isArray(animal.gallery) && animal.gallery.length > 0
      ? [...new Set(animal.gallery)].slice(0, 3)
      : [mainImage, mainImage, mainImage]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: '#0f0f10',
        color: '#fff',
        fontFamily: font,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,700;0,900;1,900&family=Inter:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
      `}</style>

      <main
        style={{ flex: 1 }}
        className="max-w-[1420px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8"
      >
        <div style={{ width: '100%', maxWidth: 1260, margin: '0 auto' }}>
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px] gap-6">
            <section className="space-y-6">
              <div className="rounded-[30px] bg-[#151517] border border-white/10 p-4">
                <div className="relative rounded-[24px] overflow-hidden bg-black h-[300px] sm:h-[420px] lg:h-[480px]">
                  {mainImage ? (
                    <img src={mainImage} alt={animalName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-7xl">🐾</div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black via-black/50 to-transparent">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="inline-flex items-center rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold px-3 py-1 uppercase tracking-[0.2em]">
                        Готовий до зустрічі
                      </span>
                      <span className="inline-flex items-center rounded-full bg-white/10 text-white/80 text-[11px] font-medium px-3 py-1">
                        #{String(id).slice(-6)}
                      </span>
                    </div>

                    <h1
                      style={{
                        fontFamily: title,
                        fontWeight: 900,
                        fontSize: 'clamp(28px, 5vw, 46px)',
                        letterSpacing: '-0.02em',
                        lineHeight: 1.05,
                        margin: 0,
                      }}
                    >
                      {animalName}
                    </h1>

                    <p
                      style={{
                        marginTop: 8,
                        maxWidth: 560,
                        fontSize: 15,
                        color: 'rgba(255,255,255,0.7)',
                        lineHeight: 1.75,
                        fontFamily: font,
                      }}
                    >
                      {animal.description || 'Ця тварина перебуває під доглядом і готова до наступного етапу рятувальної подорожі.'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                  {gallery.map((img, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl overflow-hidden bg-white/5 aspect-[4/3] border border-white/10"
                    >
                      {img ? (
                        <img
                          src={img}
                          alt={`${animalName} ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">🐶</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* ОЦЕЙ МЕНШИЙ БЛОК ЗАЛИШИВСЯ */}
              <article className="rounded-[28px] bg-[#f4efe3] text-[#2a261e] p-6 border border-black/5">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 12,
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    color: '#7e6d56',
                    fontFamily: mono,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: '#ff6b2b',
                      display: 'inline-block',
                      flexShrink: 0,
                    }}
                  />
                  Історія порятунку
                </div>

                <h2
                  style={{
                    fontFamily: title,
                    fontWeight: 900,
                    fontSize: 'clamp(20px, 3vw, 26px)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.15,
                    color: '#2a261e',
                    marginBottom: 12,
                  }}
                >
                  {animalName} готовий до нового початку
                </h2>

                <p style={{ fontSize: 15, lineHeight: 1.8, color: '#4f4638', fontFamily: font }}>
                  {animal.description || 'Ця тварина потрапила під нашу опіку з детальною історією, отримала необхідне лікування та зараз готується до усиновлення.'}
                </p>
              </article>
            </section>

            <aside className="space-y-4">
              <div className="rounded-[28px] bg-[#151517] border border-white/10 p-6">
                <div
                  style={{
                    fontSize: 10,
                    textTransform: 'uppercase',
                    letterSpacing: '0.24em',
                    color: 'rgba(255,255,255,0.35)',
                    fontFamily: mono,
                  }}
                >
                  Профіль
                </div>

                <div
                  style={{
                    marginTop: 8,
                    fontFamily: title,
                    fontWeight: 900,
                    fontSize: 30,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1,
                    color: '#fff',
                  }}
                >
                  {animalName}
                </div>

                <div
                  style={{
                    marginTop: 4,
                    fontSize: 14,
                    color: 'rgba(255,255,255,0.5)',
                    fontFamily: font,
                  }}
                >
                  {species}
                </div>

                <div className="grid grid-cols-2 gap-3 mt-5">
                  {[
                    { label: 'ВІК', value: age },
                    { label: 'ВАГА', value: weight },
                    { label: 'ТЕМПЕРАМЕНТ', value: temperament },
                    { label: 'СТАТУС', value: animal.status || 'Відновлення' },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-2xl bg-white/5 border border-white/10 p-4">
                      <div
                        style={{
                          fontSize: 10,
                          textTransform: 'uppercase',
                          letterSpacing: '0.18em',
                          color: 'rgba(255,255,255,0.35)',
                          fontFamily: mono,
                        }}
                      >
                        {label}
                      </div>
                      <div
                        style={{
                          marginTop: 8,
                          fontSize: 15,
                          fontWeight: 700,
                          fontFamily: font,
                          color: '#fff',
                        }}
                      >
                        {value}
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  to={`/adoption-application?animalName=${encodeURIComponent(animalName)}`}
                  style={{
                    marginTop: 20,
                    display: 'block',
                    width: '100%',
                    borderRadius: 16,
                    background: '#ff6b2b',
                    padding: '16px 0',
                    textAlign: 'center',
                    fontSize: 17,
                    fontWeight: 700,
                    color: '#fff',
                    textDecoration: 'none',
                    fontFamily: font,
                    transition: 'background 0.18s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#e95c1d')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#ff6b2b')}
                >
                  Подати заявку на усиновлення
                </Link>
              </div>

              <div className="rounded-[28px] bg-[#151517] border border-white/10 p-5">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: 16,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        textTransform: 'uppercase',
                        letterSpacing: '0.24em',
                        color: 'rgba(255,255,255,0.35)',
                        fontFamily: mono,
                      }}
                    >
                      Фонд підтримки
                    </div>
                    <div
                      style={{
                        marginTop: 4,
                        fontSize: 17,
                        fontWeight: 900,
                        fontFamily: title,
                        letterSpacing: '-0.01em',
                        color: '#fff',
                      }}
                    >
                      Підтримати лікування
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontFamily: mono }}>
                      Зібрано
                    </div>
                    <div
                      style={{
                        fontSize: 24,
                        fontWeight: 900,
                        fontFamily: title,
                        letterSpacing: '-0.02em',
                        color: '#fff',
                      }}
                    >
                      143 349.78 ₴
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    width: '100%',
                    height: 6,
                    borderRadius: 999,
                    background: 'rgba(255,255,255,0.1)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      borderRadius: 999,
                      background: '#ff6b2b',
                      width: '68%',
                    }}
                  />
                </div>

                <p
                  style={{
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.45)',
                    marginTop: 10,
                    lineHeight: 1.6,
                    fontFamily: font,
                  }}
                >
                  Покриває медичну допомогу, харчування та підтримку під час відновлення.
                </p>

                <div style={{ marginTop: 16 }}>
                  <a
                    href="https://send.monobank.ua/jar/7VeXaqv4r8"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block',
                      width: '100%',
                      borderRadius: 14,
                      background: '#ff6b2b',
                      padding: '12px 0',
                      textAlign: 'center',
                      fontWeight: 700,
                      color: '#fff',
                      textDecoration: 'none',
                      fontFamily: font,
                      fontSize: 15,
                      transition: 'background 0.18s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#e95c1d')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#ff6b2b')}
                  >
                    Задонатити
                  </a>
                </div>
              </div>

              <Link
                to="/animals"
                style={{
                  display: 'block',
                  borderRadius: 24,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '16px 20px',
                  textAlign: 'center',
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#fff',
                  textDecoration: 'none',
                  fontFamily: font,
                  transition: 'background 0.18s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.10)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
              >
                ← Повернутись до списку
              </Link>
            </aside>
          </div>

          <div style={{ marginTop: 28, display: 'grid', gap: 28 }}>
            {related.length > 0 && (
              <section style={{ width: '100%' }}>
                <div style={{ marginBottom: 24 }}>
                  <h2
                    style={{
                      fontFamily: title,
                      fontWeight: 900,
                      fontSize: 'clamp(22px, 3vw, 30px)',
                      letterSpacing: '-0.02em',
                      lineHeight: 1.1,
                      color: '#fff',
                      margin: 0,
                    }}
                  >
                    Може зацікавити {emoji}
                  </h2>
                  <span
                    style={{
                      color: 'rgba(255,255,255,0.4)',
                      fontSize: 14,
                      marginTop: 6,
                      display: 'block',
                      fontFamily: font,
                    }}
                  >
                    Ще {speciesLabel} шукають дім
                  </span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                    gap: 16,
                    width: '100%',
                  }}
                >
                  {related.slice(0, 4).map((a) => (
                    <RelatedAnimalCard key={a._id || a.id} animal={a} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default AnimalDetailPage