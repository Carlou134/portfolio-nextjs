import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Navbar from './Navbar'
import { LanguageProvider } from '@/contexts/LanguageContext'

describe('Navbar', () => {
  it('renders the desktop nav links', () => {
    render(<Navbar />, { wrapper: LanguageProvider })
    expect(screen.getByRole('link', { name: 'Proyectos' })).toBeInTheDocument()
  })

  it('opens the mobile menu on hamburger click and closes it when a link is clicked', async () => {
    const user = userEvent.setup()
    render(<Navbar />, { wrapper: LanguageProvider })

    // Only the desktop link exists before the mobile menu is opened.
    expect(screen.getAllByRole('link', { name: 'Proyectos' })).toHaveLength(1)

    const toggle = screen.getByRole('button', { name: /abrir menú/i })
    await user.click(toggle)

    expect(screen.getAllByRole('link', { name: 'Proyectos' })).toHaveLength(2)
    expect(screen.getByRole('button', { name: /cerrar menú/i })).toHaveAttribute(
      'aria-expanded',
      'true'
    )

    const contactoLinks = screen.getAllByRole('link', { name: 'Contacto' })
    await user.click(contactoLinks[contactoLinks.length - 1])

    expect(screen.getAllByRole('link', { name: 'Proyectos' })).toHaveLength(1)
  })

  it('switches to English when the language toggle is clicked', async () => {
    const user = userEvent.setup()
    render(<Navbar />, { wrapper: LanguageProvider })

    expect(screen.getByRole('link', { name: 'Proyectos' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /switch language/i }))

    expect(screen.getByRole('link', { name: 'Projects' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Proyectos' })).not.toBeInTheDocument()
  })
})
