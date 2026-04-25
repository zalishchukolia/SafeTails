import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function FindingNewBeginningsPage() {
  const [animals, setAnimals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/animals`)
      .then(res => res.json())
      .then(data => {
        setAnimals(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0d0d0d]">
      <div className="text-gray-400 text-lg">Завантаження...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0d0d0d] px-8 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">
            Finding New <span className="text-[#ff6b2b]">Beginnings</span>
          </h1>
          <p className="text-gray-400">
            Every animal below has survived a crisis. They aren't just pets — 
            they are survivors waiting for their next mission.
          </p>
        </div>

        {/* Картки тварин */}
        {animals.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            <p className="text-xl">Наразі немає тварин</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {animals.map(animal => (
              <div
                key={animal._id}
                className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-[#222] hover:border-[#ff6b2b] transition-colors"
              >
                {animal.imageUrl ? (
                  <img
                    src={animal.imageUrl}
                    alt={animal.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-[#222] flex items-center justify-center">
                    <span className="text-gray-600 text-4xl">🐾</span>
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-white font-bold text-xl">{animal.name}</h2>
                    <span className="text-gray-400 text-sm">{animal.age} р.</span>
                  </div>
                  <p className="text-gray-500 text-sm mb-1">{animal.species}</p>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {animal.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      animal.status === 'needs rescue'
                        ? 'bg-red-900 text-red-300'
                        : 'bg-green-900 text-green-300'
                    }`}>
                      {animal.status}
                    </span>
                    <Link
                      to={`/animals/${animal._id}`}
                      className="bg-[#ff6b2b] text-white text-sm px-4 py-2 rounded-full hover:bg-[#e55a1f] transition-colors"
                    >
                      Meet {animal.name}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default FindingNewBeginningsPage