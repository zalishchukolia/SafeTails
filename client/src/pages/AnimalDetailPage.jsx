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
    setDonated(true)
  }

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

      <hr />
      <h2>Recovery Fund — допоможи тварині</h2>
      {donated ? (
        <p>Дякуємо за ваш донат! 🐾</p>
      ) : (
        <div>
          <input
            type="number"
            placeholder="Сума в грн"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
          <button onClick={handleDonate}>Задонатити</button>
        </div>
      )}
    </div>
  )
}

export default AnimalDetailPage