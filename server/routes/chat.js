const express = require('express')
const router = express.Router()
const Groq = require('groq-sdk')

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

router.post('/', async (req, res) => {
  try {
    const { message } = req.body

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'Ти помічник з адопції тварин на платформі SafeTails. Допомагай користувачам знайти тварину, відповідай на питання про усиновлення. Спілкуйся українською.'
        },
        { role: 'user', content: message }
      ]
    })

    res.json({ reply: response.choices[0].message.content })
  } catch (err) {
    console.error('Groq error:', err.message)
    res.status(500).json({ message: 'Помилка чату' })
  }
})

module.exports = router