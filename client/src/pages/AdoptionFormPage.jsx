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
    fetch(`${import.meta.env.VITE_API_URL}/api/adoptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(() => setSubmitted(true))
      .catch(() => alert('Помилка при відправці'))
  }

  if (submitted) return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
      <div className="bg-[#1a1a1a] rounded-2xl p-12 text-center border border-[#222] max-w-md">
        <div className="text-5xl mb-4">🐾</div>
        <h1 className="text-2xl font-bold text-white mb-3">Дякуємо за заявку!</h1>
        <p className="text-gray-400">Ми зв'яжемось з вами найближчим часом.</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0d0d0d] px-8 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Rescue Adoption <span className="text-[#ff6b2b]">Application</span>
          </h1>
          <p className="text-gray-400">
            Your application starts the journey of a lifetime. We carefully review 
            every form to ensure the perfect match for our rescued animals.
          </p>
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#222]">
          <h2 className="text-white font-semibold text-lg mb-6">Personal Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Ваше ім'я *</label>
              <input
                type="text"
                name="applicantName"
                value={form.applicantName}
                onChange={handleChange}
                required
                placeholder="Введіть ім'я"
                className="w-full bg-[#0d0d0d] border border-[#333] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b2b] transition-colors"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Email *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
                className="w-full bg-[#0d0d0d] border border-[#333] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b2b] transition-colors"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Телефон</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+38 (0__) ___ __ __"
                className="w-full bg-[#0d0d0d] border border-[#333] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b2b] transition-colors"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Ім'я тварини *</label>
              <input
                type="text"
                name="animalName"
                value={form.animalName}
                onChange={handleChange}
                required
                placeholder="Яку тварину хочете усиновити?"
                className="w-full bg-[#0d0d0d] border border-[#333] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b2b] transition-colors"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Commitment to Care</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows="4"
                placeholder="Розкажіть про себе і чому ви хочете усиновити цю тварину..."
                className="w-full bg-[#0d0d0d] border border-[#333] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b2b] transition-colors resize-none"
              />
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-[#ff6b2b] text-white py-4 rounded-xl font-semibold text-lg hover:bg-[#e55a1f] transition-colors mt-2"
            >
              Submit Application
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdoptionFormPage