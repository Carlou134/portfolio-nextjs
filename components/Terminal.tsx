'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

type Line = { type: 'input' | 'output'; text: string };

const copy = {
  prompt: { es: 'visitante@cfvasquez', en: 'visitor@cfvasquez' },
  welcome: {
    es: "Escribí 'help' para empezar.",
    en: "Type 'help' to get started.",
  },
  help: {
    es: 'Comandos: whoami, about, experience, projects, stack, contact, clear',
    en: 'Commands: whoami, about, experience, projects, stack, contact, clear',
  },
  whoami: {
    es: 'Carlos Vásquez — Fullstack Developer. .NET · React · Next.js · IA aplicada.',
    en: 'Carlos Vásquez — Fullstack Developer. .NET · React · Next.js · Applied AI.',
  },
  notFound: {
    es: (cmd: string) => `command not found: ${cmd} (escribí 'help')`,
    en: (cmd: string) => `command not found: ${cmd} ('help' for a list)`,
  },
};

const sectionCommands: Record<string, string> = {
  about: 'sobre-mi',
  'sobre-mi': 'sobre-mi',
  experience: 'experiencia',
  experiencia: 'experiencia',
  projects: 'proyectos',
  proyectos: 'proyectos',
  stack: 'stack',
  contact: 'contacto',
  contacto: 'contacto',
};

export default function Terminal() {
  const { lang } = useLanguage();
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  function runCommand(raw: string) {
    const cmd = raw.trim().toLowerCase();
    const nextLines: Line[] = [...lines, { type: 'input', text: raw }];

    if (cmd === 'clear') {
      setLines([]);
      return;
    }

    if (cmd === 'help') {
      nextLines.push({ type: 'output', text: copy.help[lang] });
    } else if (cmd === 'whoami') {
      nextLines.push({ type: 'output', text: copy.whoami[lang] });
    } else if (cmd in sectionCommands) {
      document.getElementById(sectionCommands[cmd])?.scrollIntoView({ behavior: 'smooth' });
    } else if (cmd.length > 0) {
      nextLines.push({ type: 'output', text: copy.notFound[lang](cmd) });
    }

    setLines(nextLines);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    runCommand(input);
    setInput('');
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
      className="hidden md:flex items-center"
    >
      <div
        className="bg-bg-card border border-border rounded-[12px] p-6 w-full cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="w-3 h-3 rounded-full bg-red-500/70" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <span className="w-3 h-3 rounded-full bg-green-500/70" />
          <span className="ml-2 font-mono text-xs text-text-muted">{copy.prompt[lang]}:~</span>
        </div>

        <div ref={scrollRef} className="font-mono text-sm leading-7 h-64 overflow-y-auto">
          <div className="text-text-secondary">{copy.welcome[lang]}</div>

          {lines.map((line, i) => (
            <div
              key={i}
              className={line.type === 'input' ? 'text-text-primary' : 'text-text-secondary'}
            >
              {line.type === 'input' && <span style={{ color: '#00E5A0' }}>$ </span>}
              {line.text}
            </div>
          ))}

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <span style={{ color: '#00E5A0' }}>$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent outline-none text-text-primary"
              autoComplete="off"
              spellCheck={false}
              aria-label="terminal input"
            />
          </form>
        </div>
      </div>
    </motion.div>
  );
}
