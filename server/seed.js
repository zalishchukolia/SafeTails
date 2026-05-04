require('dotenv').config()
const mongoose = require('mongoose')
const Animal = require('./models/Animal')

const animals = [
  { name: 'Барні',  species: 'собака', age: 3, description: 'Дружній лабрадор',         status: 'needs rescue', temperament: 'лагідний'    },
  { name: 'Луна',   species: 'кіт',    age: 2, description: 'Ласкава кішечка',           status: 'needs rescue', temperament: 'спокійний'   },
  { name: 'Рекс',   species: 'собака', age: 5, description: 'Вівчарка, розумний пес',    status: 'needs rescue', temperament: 'активний'    },
  { name: 'Міа',    species: 'кіт',    age: 1, description: 'Маленьке кошеня',           status: 'rescued',      temperament: 'грайливий'   },
  { name: 'Бобік',  species: 'собака', age: 4, description: 'Веселий дворняга',          status: 'needs rescue', temperament: 'грайливий'   },
  { name: 'Сніжка', species: 'кіт',    age: 3, description: 'Біла пухнаста кішка',       status: 'rescued',      temperament: 'спокійний'   },
  { name: 'Грей',   species: 'собака', age: 2, description: 'Сірий хаскі',               status: 'needs rescue', temperament: 'активний'    },
  { name: 'Персик', species: 'кіт',    age: 6, description: 'Рудий лінивець',            status: 'needs rescue', temperament: 'незалежний'  },
  { name: 'Зевс',   species: 'собака', age: 7, description: 'Великий дог',               status: 'rescued',      temperament: 'лагідний'    },
  { name: 'Ліла',   species: 'кіт',    age: 2, description: 'Сіамська красуня',          status: 'needs rescue', temperament: 'незалежний'  },
  { name: 'Тобі',   species: 'собака', age: 1, description: 'Цуценя бігль',              status: 'needs rescue', temperament: 'грайливий'   },
  { name: 'Муся',   species: 'кіт',    age: 4, description: 'Чорна кішка',               status: 'rescued',      temperament: 'спокійний'   },
  { name: 'Арес',   species: 'собака', age: 3, description: 'Ротвейлер',                 status: 'needs rescue', temperament: 'активний'    },
  { name: 'Хмара',  species: 'кіт',    age: 5, description: 'Сірий товстун',             status: 'needs rescue', temperament: 'спокійний'   },
  { name: 'Дейзі',  species: 'собака', age: 2, description: 'Золотистий ретривер',       status: 'rescued',      temperament: 'лагідний'    },
  { name: 'Мурка', species: 'кіт',    age: 4, description: 'Руденька красуня',            status: 'needs rescue', temperament: 'незалежний'  },
]

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB підключено!')

    // ✅ ЗАХИСТ: не запускати якщо база вже заповнена
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