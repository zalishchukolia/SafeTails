import { useEffect, useState } from 'react'

function SuccessStoriesPage() {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://safetails-production.up.railway.app/api/success-stories')
      .then(res => res.json())
      .then(data => {
        setStories(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <p>Завантаження...</p>

  return (
    <div>
      <h1>Success Stories</h1>
      <p>Історії тварин які знайшли новий дім</p>
      {stories.length === 0 ? (
        <p>Поки немає історій</p>
      ) : (
        <div>
          {stories.map(story => (
            <div key={story._id}>
              {story.imageUrl && (
                <img src={story.imageUrl} alt={story.animalName} width="200" />
              )}
              <h2>{story.animalName}</h2>
              <p>{story.story}</p>
              <p>Усиновлено: {new Date(story.adoptedAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SuccessStoriesPage