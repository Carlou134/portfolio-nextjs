'use client';

import { type ReactNode } from 'react';
import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: 'easeOut' as const,
    },
  }),
};

const KW = ({ children }: { children: ReactNode }) => (
  <span style={{ color: '#3B82F6' }}>{children}</span>
);
const TY = ({ children }: { children: ReactNode }) => (
  <span style={{ color: '#A78BFA' }}>{children}</span>
);
const AT = ({ children }: { children: ReactNode }) => (
  <span style={{ color: '#00E5A0' }}>{children}</span>
);

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export default function Hero() {
  return (
    <section className="section min-h-screen flex items-center relative">
      <div className="dot-grid absolute inset-0 opacity-40 pointer-events-none" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full relative z-10">
        {/* Left column */}
        <div className="flex flex-col justify-center gap-6">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="font-mono text-sm text-text-secondary tracking-wide"
          >
            Fullstack Developer · Lima, Perú
          </motion.p>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="font-mono font-bold leading-tight"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
          >
            Construyo software
            <br />
            <span style={{ color: '#00E5A0' }}>que funciona.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-text-secondary text-base font-sans leading-relaxed"
          >
            .NET · React · Next.js · Python.
            <br />
            +2 años entregando en producción.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="flex gap-4 flex-wrap items-center"
          >
            <motion.button
              className="btn-primary"
              onClick={() =>
                document.getElementById('proyectos')?.scrollIntoView({ behavior: 'smooth' })
              }
              whileTap={{ scale: 0.95 }}
            >
              Ver proyectos
            </motion.button>

            <motion.a
              href="/Carlos_Vasquez_Desarrollador_Fullstack_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              whileTap={{ scale: 0.95 }}
            >
              Descargar CV
            </motion.a>

            <Link
              href="https://github.com/Carlou134"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg border border-border hover:border-border-hover text-text-secondary hover:text-text-primary transition-colors duration-200"
              aria-label="GitHub"
            >
              <GithubIcon />
            </Link>
          </motion.div>
        </div>

        {/* Right column — decorative code block */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="hidden md:flex items-center"
        >
          <div className="bg-bg-card border border-border rounded-[12px] p-6 w-full">
            {/* Editor header */}
            <div className="flex items-center gap-2 mb-5">
              <span className="w-3 h-3 rounded-full bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <span className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="ml-2 font-mono text-xs text-text-muted">api_controller.cs</span>
            </div>

            {/* Syntax-highlighted C# snippet */}
            <code className="font-mono text-sm leading-7 block text-text-primary select-none whitespace-pre overflow-x-auto">
              <span className="block"><AT>[ApiController]</AT></span>
              <span className="block"><AT>[Route(&quot;api/[controller]&quot;)]</AT></span>
              <span className="block"><KW>public</KW>{' '}<KW>class</KW>{' '}AlertsController : ControllerBase</span>
              <span className="block">{'{'}</span>
              <span className="block">{'    '}<KW>private</KW>{' '}<KW>readonly</KW>{' '}<TY>IMediator</TY>{' '}_mediator;</span>
              <span className="block">&nbsp;</span>
              <span className="block">{'    '}<AT>[HttpPost(&quot;classify&quot;)]</AT></span>
              <span className="block">{'    '}<KW>public</KW>{' '}<KW>async</KW>{' '}<TY>Task</TY>{'<'}<TY>IActionResult</TY>{'>'}{' '}Classify(</span>
              <span className="block">{'        '}<AT>[FromBody]</AT>{' '}AlertRequest request)</span>
              <span className="block">{'    '}{'{'}</span>
              <span className="block">{'        '}<KW>var</KW>{' '}result = <KW>await</KW>{' '}_mediator</span>
              <span className="block">{'            '}.Send(<KW>new</KW>{' '}ClassifyAlertCommand(request));</span>
              <span className="block">&nbsp;</span>
              <span className="block">{'        '}<KW>return</KW>{' '}Ok(result);</span>
              <span className="block">{'    '}{'}'}</span>
              <span className="block">{'}'}</span>
            </code>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
