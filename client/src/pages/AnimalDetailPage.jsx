import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

const font = "'Inter', sans-serif"
const mono = "'Inter', monospace"

function FooterColumn({ title, links }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: '#555', letterSpacing: 2, fontFamily: mono, marginBottom: 16 }}>
        {title}
      </div>
      {links.map((link) => (
        <div key={link} style={{ fontSize: 13, color: '#8a8a8a', marginBottom: 12, cursor: 'pointer' }}>
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
  const name = animal.name || 'Unknown'
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
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.16)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)'
      }}
    >
      <div style={{ width: '100%', aspectRatio: '1/1', overflow: 'hidden', background: '#e8e0d0' }}>
        {img ? (
          <img src={img} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>
            {getSpeciesEmoji(animal.species)}
          </div>
        )}
      </div>
      <div style={{ padding: '14px 16px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#ff6b2b', marginBottom: 4 }}>{name}</div>
        {city && <div style={{ fontSize: 14, color: '#444', marginBottom: 6 }}>{city}</div>}
        {date && <div style={{ fontSize: 13, color: '#aaa' }}>{date}</div>}
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
            setRelated([...sameSpecies, ...different].slice(0, 5))
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
      <div className="min-h-screen bg-[#0f0f10] text-white flex items-center justify-center">
        Завантаження...
      </div>
    )
  }

  if (!animal) {
    return (
      <div className="min-h-screen bg-[#0f0f10] text-white flex items-center justify-center">
        Тварину не знайдено
      </div>
    )
  }

  const mainImage = animal.imageUrl || animal.image || animal.photo
  const title = animal.name || 'Unknown'
  const species = animal.species || 'Animal'
  const age = animal.age ? `${animal.age} years` : 'Age unknown'
  const temperament = animal.temperament || 'Friendly'
  const weight = animal.weight ? `${animal.weight} кг` : 'Невідомо'
  const emoji = getSpeciesEmoji(species)
  const speciesLabel = getSpeciesLabel(species)

  const gallery =
    animal.gallery && Array.isArray(animal.gallery) && animal.gallery.length > 0
      ? [...new Set(animal.gallery)].slice(0, 3)
      : [mainImage, mainImage, mainImage]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#0f0f10', color: '#fff' }}>
      <main style={{ flex: 1 }} className="max-w-[1420px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,0.9fr)_470px] gap-6">

          {/* LEFT COLUMN */}
          <section className="space-y-6">

            {/* Main image + gallery */}
            <div className="rounded-[30px] bg-[#151517] border border-white/10 p-4">
              <div className="relative rounded-[24px] overflow-hidden bg-black h-[300px] sm:h-[420px] lg:h-[480px]">
                {mainImage ? (
                  <img src={mainImage} alt={title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-7xl">🐾</div>
                )}
                <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black via-black/50 to-transparent">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="inline-flex items-center rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold px-3 py-1 uppercase tracking-[0.2em]">
                      Ready to meet
                    </span>
                    <span className="inline-flex items-center rounded-full bg-white/10 text-white/80 text-[11px] font-medium px-3 py-1">
                      #{String(id).slice(-6)}
                    </span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-bold">{title}</h1>
                  <p className="mt-2 max-w-2xl text-sm sm:text-base text-white/70">
                    {animal.description || 'This animal is being cared for and is ready for the next stage of the rescue journey.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                {gallery.map((img, idx) => (
                  <div key={idx} className="rounded-2xl overflow-hidden bg-white/5 aspect-[4/3] border border-white/10">
                    {img ? (
                      <img src={img} alt={`${title} ${idx + 1}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">🐶</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Rescue Story — under gallery, inside left column */}
            <article className="rounded-[28px] bg-[#f4efe3] text-[#2a261e] p-6 border border-black/5">
              <div className="flex items-center gap-2 mb-3 text-xs uppercase tracking-[0.2em] text-[#7e6d56]">
                <span className="w-2 h-2 rounded-full bg-[#ff6b2b]" />
                The Rescue Story
              </div>
              <h2 className="text-2xl font-semibold mb-3">{title} is ready for a new beginning</h2>
              <p className="text-sm sm:text-base leading-7 text-[#4f4638]">
                {animal.description || 'This animal came into care with a detailed history, received treatment, and is now being prepared for adoption.'}
              </p>
            </article>

          </section>

          {/* RIGHT SIDEBAR */}
          <aside className="space-y-4">

            <div className="rounded-[28px] bg-[#151517] border border-white/10 p-6">
              <div className="text-xs uppercase tracking-[0.24em] text-white/35">Profile</div>
              <div className="mt-2 text-3xl font-semibold">{title}</div>
              <div className="mt-1 text-sm text-white/50">{species}</div>

              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-white/35">AGE</div>
                  <div className="mt-2 text-base font-semibold">{age}</div>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-white/35">WEIGHT</div>
                  <div className="mt-2 text-base font-semibold">{weight}</div>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-white/35">TEMPERAMENT</div>
                  <div className="mt-2 text-base font-semibold">{temperament}</div>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-white/35">STATUS</div>
                  <div className="mt-2 text-base font-semibold">{animal.status || 'Recovering'}</div>
                </div>
              </div>

              <Link
                to={`/adoption-application?animalName=${encodeURIComponent(title)}`}
                className="mt-5 block w-full rounded-2xl bg-[#ff6b2b] hover:bg-[#e95c1d] transition-colors py-4 text-center text-lg font-semibold text-white"
              >
                Apply to Adopt
              </Link>
            </div>

            <div className="rounded-[28px] bg-[#151517] border border-white/10 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-white/35">Recovery fund</div>
                  <div className="mt-1 text-lg font-semibold">Support treatment</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-white/35">Raised</div>
                  <div className="text-2xl font-bold">$4,280</div>
                </div>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full bg-[#ff6b2b]" style={{ width: '68%' }} />
              </div>
              <p className="text-xs text-white/45 mt-3">Covering medical care, food, and recovery support.</p>
              <div className="mt-4">
                <a
                  href="https://send.monobank.ua/jar/7VeXaqv4r8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-2xl bg-[#ff6b2b] hover:bg-[#e95c1d] transition-colors px-5 py-3 text-center font-semibold text-white"
                >
                  Donate
                </a>
              </div>
            </div>

            <Link
              to="/adoption-form"
              className="block rounded-[24px] bg-white/5 border border-white/10 px-5 py-4 text-center text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              ← Back to list
            </Link>

          </aside>
        </div>

        {/* RELATED ANIMALS — full width, centered */}
        {related.length > 0 && (
          <div className="mt-12">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Може зацікавити {emoji}</h2>
              <span className="text-white/40 text-sm mt-1 block">
                Ще {speciesLabel} шукають дім
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: 34,
                maxWidth: 1200,
                margin: '0 auto',
              }}
            >
              {related.map((a) => (
                <RelatedAnimalCard key={a._id || a.id} animal={a} />
              ))}
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  )
}

export default AnimalDetailPage