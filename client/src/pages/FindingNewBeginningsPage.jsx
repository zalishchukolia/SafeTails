import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function FindingNewBeginningsPage() {
  const [animals, setAnimals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://safetails-production.up.railway.app/api/animals')
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(a => a.status === 'needs rescue')
        setAnimals(filtered)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <p>Завантаження...</p>

  return (
    <div>
      <h1>Finding New Beginnings</h1>
      <p>Тварини які шукають новий дім</p>
      {animals.length === 0 ? (
        <p>Наразі немає тварин що потребують порятунку</p>
      ) : (
        <div>
          {animals.map(animal => (
            <div key={animal._id}>
              {animal.imageUrl && (
                <img src={animal.imageUrl} alt={animal.name} width="200" />
              )}
              <h2>{animal.name}</h2>
              <p>Вид: {animal.species}</p>
              <p>Вік: {animal.age}</p>
              <p>{animal.description}</p>
              <Link to={`/animals/${animal._id}`}>Детальніше</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FindingNewBeginningsPage