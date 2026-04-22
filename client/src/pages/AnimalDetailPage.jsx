import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

function AnimalDetailPage() {
  const { id } = useParams()
  const [animal, setAnimal] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`http://localhost:5000/api/animals/${id}`)
      .then(res => res.json())
      .then(data => {
        setAnimal(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return <p>Завантаження...</p>
  if (!animal) return <p>Тварину не знайдено</p>

  return (
    <div>
      <Link to="/animals">← Назад до каталогу</Link>
      {animal.imageUrl && (
        <img src={animal.imageUrl} alt={animal.name} width="300" />
      )}
      <h1>{animal.name}</h1>
      <p>Вид: {animal.species}</p>
      <p>Вік: {animal.age}</p>
      <p>Опис: {animal.description}</p>
      <p>Статус: {animal.status}</p>
    </div>
  )
}

export default AnimalDetailPage