import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

function AnimalDetailPage() {
  const { id } = useParams()
  const [animal, setAnimal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [donated, setDonated] = useState(false)
  const [amount, setAmount] = useState('')

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/animals/${id}`)
      .then(res => res.json())
      .then(data => {
        setAnimal(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const handleDonate = () => {
    if (!amount || amount <= 0) return alert('Введіть суму донату')
    fetch(`${import.meta.env.VITE_API_URL}/api/donations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ animalId: id, amount: Number(amount) })
    })
      .then(res => res.json())
      .then(() => setDonated(true))
      .catch(() => alert('Помилка при відправці донату'))
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0d0d0d]">
      <div className="text-gray-400">Завантаження...</div>
    </div>
  )

  if (!animal) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0d0d0d]">
      <div className="text-gray-400">Тварину не знайдено</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex">
      {/* Sidebar */}
      <div className="w-56 bg-[#111] border-r border-[#222] p-4 flex flex-col">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#ff6b2b] text-lg">★</span>
            <span className="text-white font-semibold text-sm">Command Center</span>
          </div>
          <span className="text-gray-600 text-xs">Sector 7 Delta</span>
        </div>
        <nav className="space-y-1">
          {['Dashboard', 'Active Rescues', 'Dispatch', 'Medical Log', 'Archive'].map((item, i) => (
            <div
              key={item}
              className={`px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
                i === 1
                  ? 'bg-[#ff6b2b] bg-opacity-20 text-[#ff6b2b]'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              {item}
            </div>
          ))}
        </nav>
        <div className="mt-auto">
          <Link
            to="/finding-new-beginnings"
            className="block w-full bg-[#ff6b2b] text-white text-center py-2 rounded-xl text-sm font-semibold hover:bg-[#e55a1f] transition-colors"
          >
            ← Back
          </Link>
        </div>
      </div>

      {/* Основний контент */}
      <div className="flex-1 flex gap-6 p-6">
        {/* Фото тварини */}
        <div className="w-80 flex-shrink-0">
          <div className="relative rounded-2xl overflow-hidden">
            {animal.imageUrl ? (
              <img
                src={animal.imageUrl}
                alt={animal.name}
                className="w-full h-96 object-cover"
              />
            ) : (
              <div className="w-full h-96 bg-[#1a1a1a] flex items-center justify-center">
                <span className="text-6xl">🐾</span>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full">
                  CRITICAL STATUS
                </span>
                <span className="text-gray-400 text-xs">#{id.slice(-6)}</span>
              </div>
              <h1 className="text-white text-3xl font-bold">{animal.name}</h1>
              <p className="text-gray-300 text-sm mt-1">{animal.description}</p>
            </div>
          </div>
        </div>

        {/* Права панель */}
        <div className="flex-1 space-y-4">
          {/* Статус */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#222]">
              <div className="text-gray-500 text-xs mb-1">CURRENT PHASE</div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                <span className="text-white font-semibold">Medical Stabilization</span>
              </div>
            </div>
            <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#222]">
              <div className="text-gray-500 text-xs mb-1">SPECIES</div>
              <div className="text-white font-semibold">{animal.species}</div>
            </div>
          </div>

          {/* Recovery Fund */}
          <div className="bg-[#f5f0e8] rounded-xl p-5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-700 font-semibold">Recovery Fund</span>
              <span className="text-gray-900 font-bold text-xl">$4,280</span>
            </div>
            <p className="text-gray-500 text-xs mb-3">Covering surgical and rehabilitation costs</p>
            <div className="w-full bg-gray-300 rounded-full h-2 mb-4">
              <div className="bg-[#ff6b2b] h-2 rounded-full" style={{ width: '68%' }}></div>
            </div>
            {donated ? (
              <div className="bg-green-900 text-green-300 text-center py-3 rounded-xl">
                Дякуємо за донат! 🐾
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Сума"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="flex-1 bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:outline-none focus:border-[#ff6b2b]"
                />
                <button
                  onClick={handleDonate}
                  className="bg-[#ff6b2b] text-white px-6 py-2 rounded-xl font-semibold hover:bg-[#e55a1f] transition-colors"
                >
                  DONATE NOW
                </button>
              </div>
            )}
          </div>

          {/* Field Updates */}
          <div className="bg-[#1a1a1a] rounded-xl p-5 border border-[#222]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white font-semibold">Field Updates</span>
              <span className="text-[#ff6b2b] text-xs">Live Mission Log</span>
            </div>
            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-1 flex-shrink-0"></span>
                <div>
                  <div className="text-xs text-gray-500 mb-1">MEDICAL UPDATE • 2 HOURS AGO</div>
                  <div className="text-white text-sm font-semibold">Vitals Stabilized</div>
                  <div className="text-gray-400 text-xs">
                    Temperature has returned to normal range. Resting comfortably in the high-care unit.
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mt-1 flex-shrink-0"></span>
                <div>
                  <div className="text-xs text-gray-500 mb-1">TRANSPORT LOG • 5 HOURS AGO</div>
                  <div className="text-white text-sm font-semibold">Arrival at Sector 7 HQ</div>
                  <div className="text-gray-400 text-xs">Age: {animal.age} years • Status: {animal.status}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnimalDetailPage