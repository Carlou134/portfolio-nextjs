'use client'

import { useLanguage } from '@/contexts/LanguageContext'

const copy = {
  location: { es: 'cfvasquez · Lima, Perú', en: 'cfvasquez · Lima, Peru' },
  builtWith: {
    es: 'Construido con Next.js + Tailwind + Framer Motion',
    en: 'Built with Next.js + Tailwind + Framer Motion',
  },
}

export default function Footer() {
  const { lang } = useLanguage()

  return (
    <footer className="border-t border-border py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-mono text-xs text-text-muted">
          {copy.location[lang]} · {new Date().getFullYear()}
        </span>
        <span className="font-mono text-xs text-text-muted">{copy.builtWith[lang]}</span>
      </div>
    </footer>
  )
}
