import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos.' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido.' },
        { status: 400 }
      )
    }

    if (message.length < 10) {
      return NextResponse.json(
        { error: 'El mensaje es muy corto.' },
        { status: 400 }
      )
    }

    await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>',
      to: 'carlouvasquez134@gmail.com',
      subject: `Nuevo mensaje de ${name} — Portfolio`,
      html: `
        <div style="font-family: monospace;
                    max-width: 600px;
                    margin: 0 auto;
                    background: #0A0F1E;
                    color: #F9FAFB;
                    padding: 32px;
                    border-radius: 12px;
                    border: 1px solid #1F2937;">
          <h2 style="color: #00E5A0;
                     margin-bottom: 24px;
                     font-size: 18px;">
            Nuevo mensaje desde tu portfolio
          </h2>
          <p style="margin-bottom: 8px;">
            <span style="color: #9CA3AF;">De:</span>
            ${name}
          </p>
          <p style="margin-bottom: 8px;">
            <span style="color: #9CA3AF;">Email:</span>
            <a href="mailto:${email}" style="color: #00E5A0;">${email}</a>
          </p>
          <div style="margin-top: 24px;
                      padding: 16px;
                      background: #111827;
                      border-radius: 8px;
                      border: 1px solid #1F2937;">
            <p style="color: #9CA3AF;
                      font-size: 12px;
                      margin-bottom: 8px;">
              MENSAJE
            </p>
            <p style="color: #F9FAFB;
                      line-height: 1.6;
                      white-space: pre-wrap;">
              ${message}
            </p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Error al enviar el mensaje.' },
      { status: 500 }
    )
  }
}
