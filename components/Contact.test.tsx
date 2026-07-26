import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Contact from './Contact'
import { LanguageProvider } from '@/contexts/LanguageContext'

async function fillAndSubmit(user: ReturnType<typeof userEvent.setup>, message: string) {
  await user.type(screen.getByPlaceholderText('Tu nombre'), 'Carlos')
  await user.type(screen.getByPlaceholderText('tucorreo@ejemplo.com'), 'carlos@example.com')
  await user.type(screen.getByPlaceholderText('Cuéntame del proyecto...'), message)
  await user.click(screen.getByRole('button', { name: /enviar mensaje/i }))
}

describe('Contact form', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('submits to /api/contact and shows a success message', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response)

    const user = userEvent.setup()
    render(<Contact />, { wrapper: LanguageProvider })
    await fillAndSubmit(user, 'Quiero hablar de un proyecto')

    expect(await screen.findByText(/mensaje enviado/i)).toBeInTheDocument()
    expect(fetch).toHaveBeenCalledWith(
      '/api/contact',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"lang":"es"'),
      })
    )
  })

  it('shows the server error message when the request fails', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'El mensaje es muy corto.' }),
    } as Response)

    const user = userEvent.setup()
    render(<Contact />, { wrapper: LanguageProvider })
    await fillAndSubmit(user, 'corto')

    expect(await screen.findByText('El mensaje es muy corto.')).toBeInTheDocument()
  })

  it('shows a connection error message when fetch throws', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('network down'))

    const user = userEvent.setup()
    render(<Contact />, { wrapper: LanguageProvider })
    await fillAndSubmit(user, 'Quiero hablar de un proyecto')

    expect(await screen.findByText(/error de conexión/i)).toBeInTheDocument()
  })
})
