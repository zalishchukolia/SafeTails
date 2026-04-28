import { useEffect, useState } from 'react'

function SuccessStoriesPage() {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/success-stories`)
      .then(res => res.json())
      .then(data => {
        setStories(data)
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
          <span className="text-[#ff6b2b] text-sm font-semibold uppercase tracking-widest">
            Live Like Transformed
          </span>
          <h1 className="text-4xl font-bold text-white mt-2 mb-3">
            Happy Tails <br />
            <span className="text-[#ff6b2b]">Success Stories</span>
          </h1>
          <p className="text-gray-400 max-w-xl">
            Witness the journey from crisis to compassion. These are the faces 
            of resilience and the families who opened their hearts to a second chance.
          </p>
        </div>

        {/* Картки історій */}
        {stories.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">Поки немає історій</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map(story => (
              <div
                key={story._id}
                className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-[#222] hover:border-[#ff6b2b] transition-colors"
              >
                {story.imageUrl ? (
                  <img
                    src={story.imageUrl}
                    alt={story.animalName}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-[#222] flex items-center justify-center">
                    <span className="text-4xl">🐾</span>
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-green-900 text-green-300 px-2 py-1 rounded-full">
                      Adopted
                    </span>
                  </div>
                  <h2 className="text-white font-bold text-lg mb-2">
                    {story.animalName}
                  </h2>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-3">
                    {story.story}
                  </p>
                  <p className="text-gray-600 text-xs">
                    {new Date(story.adoptedAt).toLocaleDateString('uk-UA')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Секція підтримки */}
        <div className="mt-16 bg-[#1a1a1a] rounded-2xl p-10 text-center border border-[#222]">
          <h2 className="text-2xl font-bold text-white mb-3">Support Our Missions</h2>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Every adoption story starts with a rescue mission. Your contribution 
            funds tactical transport, medical care, and safe housing.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-[#ff6b2b] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#e55a1f] transition-colors">
              Donate to Rescue
            </button>
            <button className="border border-gray-600 text-white px-6 py-3 rounded-full font-semibold hover:border-gray-400 transition-colors">
              Apply to Foster
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuccessStoriesPage