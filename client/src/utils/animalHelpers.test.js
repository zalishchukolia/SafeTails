import {
  normalizeTemperament,
  getAgeCategory,
  formatAge,
  getAnimalImage,
  getAnimalBadge,
} from './animalHelpers'

describe('normalizeTemperament', () => {
  it('normalizes Ukrainian temperament values', () => {
    expect(normalizeTemperament('Лагідний')).toBe('gentle')
    expect(normalizeTemperament('Незалежний')).toBe('independent')
  })

  it('normalizes English temperament values', () => {
    expect(normalizeTemperament('calm')).toBe('calm')
    expect(normalizeTemperament('playful')).toBe('playful')
  })

  it('works case-insensitively and trims spaces', () => {
    expect(normalizeTemperament('  Спокійний  ')).toBe('calm')
  })

  it('returns original value if mapping is unknown', () => {
    expect(normalizeTemperament('friendly')).toBe('friendly')
  })
})

describe('getAgeCategory', () => {
  it('returns puppy/kitten for age less than 1', () => {
    expect(getAgeCategory(0.5)).toBe('Цуценя/Кошеня')
  })

  it('returns young for age from 1 to 2', () => {
    expect(getAgeCategory(2)).toBe('Молодий')
  })

  it('returns adult for age from 3 to 7', () => {
    expect(getAgeCategory(5)).toBe('Дорослий')
  })

  it('returns senior for age 8 and above', () => {
    expect(getAgeCategory(10)).toBe('Старший')
  })

  it('returns unknown for invalid age', () => {
    expect(getAgeCategory('abc')).toBe('Невідомо')
  })
})

describe('formatAge', () => {
  it('formats singular age correctly', () => {
    expect(formatAge(1)).toBe('1 рік')
  })

  it('formats ages from 2 to 4 correctly', () => {
    expect(formatAge(3)).toBe('3 роки')
  })

  it('formats ages 5+ correctly', () => {
    expect(formatAge(7)).toBe('7 років')
  })

  it('returns empty string for invalid age', () => {
    expect(formatAge('hello')).toBe('')
  })
})

describe('getAnimalImage', () => {
  it('returns imageUrl first', () => {
    expect(
      getAnimalImage({
        imageUrl: 'image-url.jpg',
        image: 'image.jpg',
        photo: 'photo.jpg',
        mainImage: 'main.jpg',
      }),
    ).toBe('image-url.jpg')
  })

  it('returns first available fallback image', () => {
    expect(
      getAnimalImage({
        photo: 'photo.jpg',
        mainImage: 'main.jpg',
      }),
    ).toBe('photo.jpg')
  })

  it('returns null when no image exists', () => {
    expect(getAnimalImage({})).toBe(null)
  })
})

describe('getAnimalBadge', () => {
  it('returns uppercased status', () => {
    expect(getAnimalBadge({ status: 'rescued' })).toBe('RESCUED')
  })

  it('returns uppercased badge when status is missing', () => {
    expect(getAnimalBadge({ badge: 'urgent' })).toBe('URGENT')
  })

  it('returns READY by default', () => {
    expect(getAnimalBadge({})).toBe('READY')
  })
})