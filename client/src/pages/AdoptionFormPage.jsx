import { useState } from 'react'

function AdoptionFormPage() {
  const [form, setForm] = useState({
    applicantName: '',
    email: '',
    phone: '',
    animalName: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = e => {
    e.preventDefault()
    fetch('https://safetails-production.up.railway.app/api/adoptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(() => setSubmitted(true))
      .catch(() => alert('Помилка при відправці'))
  }

  if (submitted) return (
    <div>
      <h1>Дякуємо за заявку! 🐾</h1>
      <p>Ми зв'яжемось з вами найближчим часом.</p>
    </div>
  )

  return (
    <div>
      <h1>Rescue Adoption Application</h1>
      <p>Заповніть форму щоб усиновити тварину</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Ваше ім'я</label>
          <input
            type="text"
            name="applicantName"
            value={form.applicantName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Телефон</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Ім'я тварини</label>
          <input
            type="text"
            name="animalName"
            value={form.animalName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Повідомлення</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows="4"
          />
        </div>
        <button type="submit">Відправити заявку</button>
      </form>
    </div>
  )
}

export default AdoptionFormPage