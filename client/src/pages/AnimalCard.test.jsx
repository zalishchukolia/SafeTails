import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { AnimalCard } from './AdoptionFormPage'

describe('AnimalCard', () => {
  const animal = {
    id: '1',
    name: 'Мурчик',
    breed: 'Метис',
    age: 3,
    description: 'Дуже лагідний і дружній котик',
    imageUrl: 'https://example.com/cat.jpg',
    status: 'urgent',
  }

  it('renders animal name, breed, age, description and image', () => {
    render(
      <AnimalCard
        animal={animal}
        onApply={vi.fn()}
        onClick={vi.fn()}
      />,
    )

    expect(screen.getByText('Мурчик')).toBeInTheDocument()
    expect(screen.getByText(/Метис/i)).toBeInTheDocument()
    expect(screen.getByText(/3 роки/i)).toBeInTheDocument()
    expect(screen.getByText(/Дуже лагідний і дружній котик/i)).toBeInTheDocument()
    expect(screen.getByAltText('Мурчик')).toBeInTheDocument()
    expect(screen.getByText('URGENT')).toBeInTheDocument()
  })

  it('calls onApply when adoption button is clicked and does not call card onClick', async () => {
    const user = userEvent.setup()
    const onApply = vi.fn()
    const onClick = vi.fn()

    render(
      <AnimalCard
        animal={animal}
        onApply={onApply}
        onClick={onClick}
      />,
    )

    await user.click(screen.getByRole('button', { name: /дати прихисток/i }))

    expect(onApply).toHaveBeenCalledTimes(1)
    expect(onClick).not.toHaveBeenCalled()
  })
})