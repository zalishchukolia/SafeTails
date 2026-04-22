import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function AnimalsPage() {
  const [animals, setAnimals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:5000/api/animals')
      .then(res => res.json())
      .then(data => {
        setAnimals(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <p>Завантаження...</p>

  return (
    <div>
      <h1>Каталог тварин</h1>
      {animals.length === 0 ? (
        <p>Тварин поки немає</p>
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
              <p>Статус: {animal.status}</p>
              <Link to={`/animals/${animal._id}`}>Детальніше</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AnimalsPage