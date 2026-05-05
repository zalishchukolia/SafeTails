require('dotenv').config()
const mongoose = require('mongoose')
const Animal = require('./models/Animal')

const animals = [
  { name: 'Барні',  species: 'собака', age: 3, description: 'Дружній лабрадор',         status: 'needs rescue', temperament: 'лагідний',   city: 'Київ',         lat: 50.4501, lng: 30.5234 },
  { name: 'Луна',   species: 'кіт',    age: 2, description: 'Ласкава кішечка',           status: 'needs rescue', temperament: 'спокійний',  city: 'Львів',        lat: 49.8397, lng: 24.0297 },
  { name: 'Рекс',   species: 'собака', age: 5, description: 'Вівчарка, розумний пес',    status: 'needs rescue', temperament: 'активний',   city: 'Харків',       lat: 49.9935, lng: 36.2304 },
  { name: 'Міа',    species: 'кіт',    age: 1, description: 'Маленьке кошеня',           status: 'rescued',      temperament: 'грайливий',  city: 'Одеса',        lat: 46.4825, lng: 30.7233 },
  { name: 'Бобік',  species: 'собака', age: 4, description: 'Веселий дворняга',          status: 'needs rescue', temperament: 'грайливий',  city: 'Дніпро',       lat: 48.4647, lng: 35.0462 },
  { name: 'Сніжка', species: 'кіт',    age: 3, description: 'Біла пухнаста кішка',       status: 'rescued',      temperament: 'спокійний',  city: 'Запоріжжя',    lat: 47.8388, lng: 35.1396 },
  { name: 'Грей',   species: 'собака', age: 2, description: 'Сірий хаскі',               status: 'needs rescue', temperament: 'активний',   city: 'Вінниця',      lat: 49.2331, lng: 28.4682 },
  { name: 'Персик', species: 'кіт',    age: 6, description: 'Рудий лінивець',            status: 'needs rescue', temperament: 'незалежний', city: 'Полтава',      lat: 49.5883, lng: 34.5514 },
  { name: 'Зевс',   species: 'собака', age: 7, description: 'Великий дог',               status: 'rescued',      temperament: 'лагідний',   city: 'Черкаси',      lat: 49.4444, lng: 32.0598 },
  { name: 'Ліла',   species: 'кіт',    age: 2, description: 'Сіамська красуня',          status: 'needs rescue', temperament: 'незалежний', city: 'Івано-Франківськ', lat: 48.9226, lng: 24.7111 },
  { name: 'Тобі',   species: 'собака', age: 1, description: 'Цуценя бігль',              status: 'needs rescue', temperament: 'грайливий',  city: 'Житомир',      lat: 50.2547, lng: 28.6587 },
  { name: 'Муся',   species: 'кіт',    age: 4, description: 'Чорна кішка',               status: 'rescued',      temperament: 'спокійний',  city: 'Суми',         lat: 50.9077, lng: 34.7981 },
  { name: 'Арес',   species: 'собака', age: 3, description: 'Ротвейлер',                 status: 'needs rescue', temperament: 'активний',   city: 'Миколаїв',     lat: 46.9750, lng: 31.9946 },
  { name: 'Хмара',  species: 'кіт',    age: 5, description: 'Сірий товстун',             status: 'needs rescue', temperament: 'спокійний',  city: 'Херсон',       lat: 46.6354, lng: 32.6169 },
  { name: 'Дейзі',  species: 'собака', age: 2, description: 'Золотистий ретривер',       status: 'rescued',      temperament: 'лагідний',   city: 'Тернопіль',    lat: 49.5535, lng: 25.5948 },
  { name: 'Мурка',  species: 'кіт',    age: 4, description: 'Руденька красуня',          status: 'needs rescue', temperament: 'незалежний', city: 'Хмельницький', lat: 49.4220, lng: 26.9987 },
]

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB підключено!')

    const count = await Animal.countDocuments()
    if (count > 0 && !process.argv.includes('--force')) {
      console.log(`⚠️  База вже має ${count} тварин. Seed скасовано.`)
      console.log('   Щоб перезаписати: node seed.js --force')
      mongoose.connection.close()
      return
    }

    await Animal.deleteMany({})
    console.log('🗑️  Стару базу очищено!')
    await Animal.insertMany(animals)
    console.log(`✅ ${animals.length} тварин додано!`)
    mongoose.connection.close()
  })
  .catch(err => {
    console.log('❌ Помилка:', err)
    mongoose.connection.close()
  })