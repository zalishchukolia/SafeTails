export function normalizeTemperament(value) {
  const v = String(value || '').trim().toLowerCase()

  const map = {
    calm: 'calm',
    'спокійний': 'calm',
    active: 'active',
    'активний': 'active',
    playful: 'playful',
    'грайливий': 'playful',
    gentle: 'gentle',
    'лагідний': 'gentle',
    independent: 'independent',
    'незалежний': 'independent',
    protective: 'protective',
    'захисний': 'protective',
  }

  return map[v] || v
}

export function getAgeCategory(age) {
  const num = Number(age)

  if (Number.isNaN(num)) return 'Невідомо'
  if (num < 1) return 'Цуценя/Кошеня'
  if (num >= 1 && num < 3) return 'Молодий'
  if (num >= 3 && num < 8) return 'Дорослий'
  return 'Старший'
}

export function formatAge(age) {
  const num = Number(age)

  if (Number.isNaN(num)) return ''
  if (num === 1) return '1 рік'
  if (num > 1 && num < 5) return `${num} роки`
  return `${num} років`
}

export function getAnimalImage(animal) {
  return animal.imageUrl || animal.image || animal.photo || animal.mainImage || null
}

export function getAnimalBadge(animal) {
  return String(animal.status || animal.badge || 'READY').toUpperCase()
}