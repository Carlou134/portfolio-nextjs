import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

const sendMock = vi.fn()

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(function Resend() {
    return { emails: { send: sendMock } }
  }),
}))

const { POST } = await import('./route')

function makeRequest(body: unknown) {
  return new NextRequest('http://localhost/api/contact', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('POST /api/contact', () => {
  beforeEach(() => {
    sendMock.mockReset()
    sendMock.mockResolvedValue({ data: { id: '1' }, error: null })
  })

  it('rejects when a required field is missing', async () => {
    const res = await POST(makeRequest({ name: '', email: 'a@b.com', message: 'hola que tal' }))
    expect(res.status).toBe(400)
    expect((await res.json()).error).toMatch(/requeridos/i)
    expect(sendMock).not.toHaveBeenCalled()
  })

  it('rejects an invalid email', async () => {
    const res = await POST(makeRequest({ name: 'Carlos', email: 'no-es-un-email', message: 'hola que tal' }))
    expect(res.status).toBe(400)
    expect((await res.json()).error).toMatch(/inválido/i)
  })

  it('rejects a message shorter than 10 characters', async () => {
    const res = await POST(makeRequest({ name: 'Carlos', email: 'a@b.com', message: 'corto' }))
    expect(res.status).toBe(400)
    expect((await res.json()).error).toMatch(/corto/i)
  })

  it('sends the email and returns success for valid input', async () => {
    const res = await POST(
      makeRequest({ name: 'Carlos', email: 'a@b.com', message: 'Quiero hablar de un proyecto' })
    )
    expect(res.status).toBe(200)
    expect((await res.json()).success).toBe(true)
    expect(sendMock).toHaveBeenCalledTimes(1)
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'carlouvasquez134@gmail.com' })
    )
  })

  it('returns 500 and logs the error when Resend fails', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    sendMock.mockRejectedValueOnce(new Error('network down'))

    const res = await POST(
      makeRequest({ name: 'Carlos', email: 'a@b.com', message: 'Quiero hablar de un proyecto' })
    )
    expect(res.status).toBe(500)
    expect(consoleError).toHaveBeenCalledWith('Error sending email:', expect.any(Error))

    consoleError.mockRestore()
  })
})
