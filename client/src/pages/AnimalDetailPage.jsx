import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

function AnimalDetailPage() {
  const { id } = useParams()
  const [animal, setAnimal] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/animals/${id}`)
      .then(res => res.json())
      .then(data => {
        setAnimal(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
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
  const weight = animal.weight || '24 kg'

  const gallery =
    animal.gallery && Array.isArray(animal.gallery) && animal.gallery.length > 0
      ? animal.gallery.slice(0, 3)
      : [mainImage, mainImage, mainImage]

  return (
    <div className="min-h-screen bg-[#0f0f10] text-white">
      <main className="max-w-[1420px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,0.9fr)_470px] gap-6">
          <section className="space-y-6">
            <div className="rounded-[30px] bg-[#151517] border border-white/10 p-4">
              <div className="relative rounded-[24px] overflow-hidden bg-black h-[270px] sm:h-[310px] lg:h-[360px]">
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-7xl">
                    🐾
                  </div>
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
                    {animal.description ||
                      'This animal is being cared for and is ready for the next stage of the rescue journey.'}
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
                        alt={`${title} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        🐶
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] gap-6">
              <article className="rounded-[28px] bg-[#f4efe3] text-[#2a261e] p-6 border border-black/5">
                <div className="flex items-center gap-2 mb-3 text-xs uppercase tracking-[0.2em] text-[#7e6d56]">
                  <span className="w-2 h-2 rounded-full bg-[#ff6b2b]" />
                  The Rescue Story
                </div>

                <h2 className="text-2xl font-semibold mb-3">
                  {title} is ready for a new beginning
                </h2>

                <p className="text-sm sm:text-base leading-7 text-[#4f4638]">
                  {animal.description ||
                    'This animal came into care with a detailed history, received treatment, and is now being prepared for adoption. The story here can be fully edited from the database and expanded with milestones, medical notes, or rescue context.'}
                </p>
              </article>

              <div className="space-y-6">
                <div className="rounded-[28px] bg-[#151517] border border-white/10 p-5">
                  <div className="text-xs uppercase tracking-[0.24em] text-white/35 mb-4">
                    Personality
                  </div>

                  <ul className="space-y-3 text-sm text-white/70">
                    <li>• Calm around people and other animals.</li>
                    <li>• Learns routines quickly and responds well to care.</li>
                    <li>• Enjoys soft space, gentle walks, and quiet time.</li>
                  </ul>
                </div>

                <div className="rounded-[28px] bg-[#151517] border border-white/10 p-5">
                  <div className="text-xs uppercase tracking-[0.24em] text-white/35 mb-4">
                    Medical History
                  </div>

                  <div className="space-y-3 text-sm text-white/70">
                    <div className="flex justify-between gap-3">
                      <span>Initial check</span>
                      <span className="text-white/40">Completed</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span>Vaccination</span>
                      <span className="text-white/40">Up to date</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span>Recovery phase</span>
                      <span className="text-white/40">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-[28px] bg-[#151517] border border-white/10 p-6">
              <div className="text-xs uppercase tracking-[0.24em] text-white/35">
                Profile
              </div>

              <div className="mt-2 text-3xl font-semibold">{title}</div>
              <div className="mt-1 text-sm text-white/50">{species}</div>

              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                    AGE
                  </div>
                  <div className="mt-2 text-base font-semibold">{age}</div>
                </div>

                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                    WEIGHT
                  </div>
                  <div className="mt-2 text-base font-semibold">{weight}</div>
                </div>

                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                    TEMPERAMENT
                  </div>
                  <div className="mt-2 text-base font-semibold">{temperament}</div>
                </div>

                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                    STATUS
                  </div>
                  <div className="mt-2 text-base font-semibold">
                    {animal.status || 'Recovering'}
                  </div>
                </div>
              </div>

              <Link
                to={`/adoption-application?animalName=${encodeURIComponent(title)}`}
                className="mt-5 block w-full rounded-2xl bg-[#ff6b2b] hover:bg-[#e95c1d] transition-colors py-4 text-center text-lg font-semibold text-white"
              >
                Apply to Adopt
              </Link>

              <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 p-4">
                <div className="w-12 h-12 rounded-full bg-white/10" />
                <div>
                  <div className="text-base font-medium">Sarah Admin</div>
                  <div className="text-sm text-white/45">Assigned caregiver</div>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] bg-[#151517] border border-white/10 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-white/35">
                    Recovery fund
                  </div>
                  <div className="mt-1 text-lg font-semibold">Support treatment</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-white/35">Raised</div>
                  <div className="text-2xl font-bold">$4,280</div>
                </div>
              </div>

              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#ff6b2b]"
                  style={{ width: '68%' }}
                />
              </div>

              <p className="text-xs text-white/45 mt-3">
                Covering medical care, food, and recovery support.
              </p>

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
      </main>
    </div>
  )
}

export default AnimalDetailPage