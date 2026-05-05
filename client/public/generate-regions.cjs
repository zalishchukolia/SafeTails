const https = require('https')
const fs = require('fs')

const url = 'https://raw.githubusercontent.com/org-scn-design-studio-community/sdkcommunitymaps/master/geojson/Europe/Ukraine-regions.json'

console.log('Завантажую GeoJSON...')

https.get(url, res => {
  let data = ''
  res.on('data', chunk => data += chunk)
  res.on('end', () => {
    try {
      const geojson = JSON.parse(data)

      const DANGER = ['Luhans\'ka', 'Donets\'ka', 'Zaporiz\'ka', 'Khersons\'ka', 'Kharkivs\'ka',
                      'Луганська', 'Донецька', 'Запорізька', 'Херсонська', 'Харківська',
                      'Luhanska', 'Donetska', 'Zaporizka', 'Khersonska', 'Kharkivska']

      // Збережи повний файл
      fs.writeFileSync('ukraine-regions.json', data)
      console.log('✅ ukraine-regions.json збережено!')
      console.log('Кількість регіонів:', geojson.features?.length)
      console.log('Назви перших 5:', geojson.features?.slice(0,5).map(f => f.properties?.name || JSON.stringify(f.properties)).join(', '))
    } catch(e) {
      console.error('❌ Помилка парсингу:', e.message)
      console.log('Відповідь:', data.slice(0, 200))
    }
  })
}).on('error', e => {
  console.error('❌ Помилка запиту:', e.message)
})