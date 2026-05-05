require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()
const PORT = process.env.PORT || 3001

// ✅ Спочатку middleware
app.use(cors())
app.use(express.json())

// ✅ Потім всі роути
app.use('/api/animals', require('./routes/animals'))
app.use('/api/adoptions', require('./routes/adoptions'))
app.use('/api/success-stories', require('./routes/successStories'))
app.use('/api/donations', require('./routes/donations'))
app.use('/api/chat', require('./routes/chat'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/missions', require('./routes/missions'))  // ✅ тут

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB підключено!'))
  .catch((err) => console.log('❌ Помилка підключення:', err))

app.get('/', (req, res) => {
  res.json({ message: 'SafeTails API працює! 🐾' })
})

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущено на порті ${PORT}`)
})