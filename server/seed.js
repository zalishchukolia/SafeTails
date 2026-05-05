require('dotenv').config()
const mongoose = require('mongoose')
const Animal = require('./models/Animal')

const animals = [
  { name: 'Барні',  species: 'пес', gender: 'male',   age: 3, description: 'Дружній лабрадор, знайдений біля траси.',         status: 'needs rescue', temperament: 'лагідний',   city: 'Київ',             lat: 50.4501, lng: 30.5234 },
  { name: 'Луна',   species: 'кіт', gender: 'female', age: 2, description: 'Ласкава кішечка, загубилась у парку.',            status: 'needs rescue', temperament: 'спокійний',  city: 'Львів',            lat: 49.8397, lng: 24.0297 },
  { name: 'Рекс',   species: 'пес', gender: 'male',   age: 5, description: 'Вівчарка, розумний пес. Потребує допомоги.',      status: 'needs rescue', temperament: 'активний',   city: 'Харків',           lat: 49.9935, lng: 36.2304 },
  { name: 'Міа',    species: 'кіт', gender: 'female', age: 1, description: 'Маленьке кошеня, вже в безпеці у притулку.',      status: 'rescued',      temperament: 'грайливий',  city: 'Одеса',            lat: 46.4825, lng: 30.7233 },
  { name: 'Бобік',  species: 'пес', gender: 'male',   age: 4, description: 'Веселий дворняга, помічений біля ринку.',         status: 'needs rescue', temperament: 'грайливий',  city: 'Дніпро',           lat: 48.4647, lng: 35.0462 },
  { name: 'Сніжка', species: 'кіт', gender: 'female', age: 3, description: 'Біла пухнаста кішка, врятована з підвалу.',       status: 'rescued',      temperament: 'спокійний',  city: 'Запоріжжя',        lat: 47.8388, lng: 35.1396 },
  { name: 'Грей',   species: 'пес', gender: 'male',   age: 2, description: 'Сірий хаскі — волонтери вже в дорозі.',           status: 'in rescue',    temperament: 'активний',   city: 'Вінниця',          lat: 49.2331, lng: 28.4682 },
  { name: 'Персик', species: 'кіт', gender: 'male',   age: 6, description: 'Рудий кіт, команда виїхала на виклик.',           status: 'in rescue',    temperament: 'незалежний', city: 'Полтава',          lat: 49.5883, lng: 34.5514 },
  { name: 'Зевс',   species: 'пес', gender: 'male',   age: 7, description: 'Великий дог, успішно доставлений у притулок.',    status: 'rescued',      temperament: 'лагідний',   city: 'Черкаси',          lat: 49.4444, lng: 32.0598 },
  { name: 'Ліла',   species: 'кіт', gender: 'female', age: 2, description: 'Сіамська кішка, потребує термінової допомоги.',   status: 'needs rescue', temperament: 'незалежний', city: 'Івано-Франківськ', lat: 48.9226, lng: 24.7111 },
  { name: 'Тобі',   species: 'пес', gender: 'male',   age: 1, description: 'Цуценя бігль — рятувальники вже їдуть.',          status: 'in rescue',    temperament: 'грайливий',  city: 'Житомир',          lat: 50.2547, lng: 28.6587 },
  { name: 'Муся',   species: 'кіт', gender: 'female', age: 4, description: 'Чорна кішка, знайшла новий дім.',                 status: 'rescued',      temperament: 'спокійний',  city: 'Суми',             lat: 50.9077, lng: 34.7981 },
  { name: 'Арес',   species: 'пес', gender: 'male',   age: 3, description: 'Ротвейлер помічений у промзоні. Агресії немає.',  status: 'needs rescue', temperament: 'активний',   city: 'Миколаїв',         lat: 46.9750, lng: 31.9946 },
  { name: 'Хмара',  species: 'кіт', gender: 'male',   age: 5, description: 'Сірий кіт, волонтер виїхав на місце.',           status: 'in rescue',    temperament: 'спокійний',  city: 'Херсон',           lat: 46.6354, lng: 32.6169 },
  { name: 'Дейзі',  species: 'пес', gender: 'female', age: 2, description: 'Золотистий ретривер, щаслива у притулку.',        status: 'rescued',      temperament: 'лагідний',   city: 'Тернопіль',        lat: 49.5535, lng: 25.5948 },
  { name: 'Мурка',  species: 'кіт', gender: 'female', age: 4, description: 'Руденька кішка, чекає на порятунок.',             status: 'needs rescue', temperament: 'незалежний', city: 'Хмельницький',     lat: 49.4220, lng: 26.9987 },
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