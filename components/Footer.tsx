export default function Footer() {
  return (
    <footer className="border-t border-border py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-mono text-xs text-text-muted">
          cvasquez · Lima, Perú · {new Date().getFullYear()}
        </span>
        <span className="font-mono text-xs text-text-muted">
          Construido con Next.js + Tailwind + Framer Motion
        </span>
      </div>
    </footer>
  )
}
