'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle, AlertCircle, Mail } from 'lucide-react'

function IconLinkedin() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function IconGithub() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

interface FormData {
  name: string
  email: string
  message: string
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

function Spinner() {
  return (
    <div className="w-4 h-4 border-2 border-bg-primary/30 border-t-bg-primary rounded-full animate-spin" />
  )
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async () => {
    setStatus('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json() as { error?: string }

      if (!res.ok) {
        setStatus('error')
        setErrorMessage(data.error ?? 'Error al enviar el mensaje.')
        return
      }

      setStatus('success')
      setFormData({ name: '', email: '', message: '' })
      setTimeout(() => setStatus('idle'), 5000)
    } catch {
      setStatus('error')
      setErrorMessage('Error de conexión. Intenta nuevamente.')
    }
  }

  const isDisabled = status === 'loading' || status === 'success'

  return (
    <section id="contacto" className="section">
      <p className="section-label">Contacto</p>

      <div className="max-w-2xl mx-auto">
        <motion.div
          className="card hover:border-accent-green/30 hover:glow-green transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
        >
          {/* Header */}
          <h2 className="font-mono text-xl font-medium text-text-primary mb-2">
            ¿Tienes un proyecto? Hablemos.
          </h2>
          <p className="text-sm text-text-secondary mb-8">
            Disponible para freelance y posiciones de desarrollo fullstack.
          </p>

          {/* Formulario */}
          <div className="flex flex-col gap-1.5 mb-4">
            <label className="font-mono text-xs text-text-muted tracking-widest uppercase">
              Nombre
            </label>
            <input
              type="text"
              placeholder="Tu nombre"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              disabled={isDisabled}
              className="input"
            />
          </div>

          <div className="flex flex-col gap-1.5 mb-4">
            <label className="font-mono text-xs text-text-muted tracking-widest uppercase">
              Email
            </label>
            <input
              type="email"
              placeholder="tucorreo@ejemplo.com"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              disabled={isDisabled}
              className="input"
            />
          </div>

          <div className="flex flex-col gap-1.5 mb-4">
            <label className="font-mono text-xs text-text-muted tracking-widest uppercase">
              Mensaje
            </label>
            <textarea
              placeholder="Cuéntame del proyecto..."
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
              disabled={isDisabled}
              className="input resize-none"
            />
          </div>

          {/* Botón / estado */}
          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full mt-6 p-4 rounded-lg bg-accent-green/10 border border-accent-green/30 flex items-center gap-3"
            >
              <CheckCircle size={18} color="#00E5A0" />
              <span className="font-mono text-sm text-accent-green">
                ¡Mensaje enviado! Te respondo pronto.
              </span>
            </motion.div>
          ) : status === 'loading' ? (
            <button
              disabled
              className="btn-primary w-full mt-6 flex items-center justify-center gap-2 opacity-70 cursor-not-allowed"
            >
              <Spinner />
              Enviando...
            </button>
          ) : (
            <>
              <motion.button
                onClick={handleSubmit}
                className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
                whileTap={{ scale: 0.95 }}
              >
                <Send size={16} />
                Enviar mensaje
              </motion.button>
              {status === 'error' && (
                <div className="mt-3 p-3 rounded-lg bg-red-900/20 border border-red-500/30 flex items-center gap-2">
                  <AlertCircle size={14} color="#F87171" />
                  <span className="text-xs text-red-400 font-mono">{errorMessage}</span>
                </div>
              )}
            </>
          )}

          {/* Separador */}
          <div className="h-px bg-border my-8" />

          {/* Links sociales */}
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <a
              href="mailto:carlouvasquez134@gmail.com"
              className="flex items-center gap-2 font-mono text-sm text-text-muted hover:text-accent-green transition-colors duration-200"
            >
              <Mail size={16} />
              Email
            </a>
            <a
              href="https://www.linkedin.com/in/carlos-v%C3%A1squez-rodriguez-283a1b23b"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-mono text-sm text-text-muted hover:text-accent-green transition-colors duration-200"
            >
              <IconLinkedin />
              LinkedIn
            </a>
            <a
              href="https://github.com/Carlou134"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-mono text-sm text-text-muted hover:text-accent-green transition-colors duration-200"
            >
              <IconGithub />
              GitHub
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
