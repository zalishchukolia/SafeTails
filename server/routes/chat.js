const express = require('express')
const router = express.Router()
const OpenAI = require('openai')

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

router.post('/', async (req, res) => {
  const { message } = req.body

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'Ти помічник з адопції тварин на платформі SafeTails. Допомагай користувачам знайти тварину, відповідай на питання про усиновлення. Спілкуйся українською.'
      },
      { role: 'user', content: message }
    ]
  })

  res.json({ reply: response.choices[0].message.content })
})

module.exports = router