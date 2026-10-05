"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

type Line = { type: "input" | "output"; text: string };

// Command aliases the visitor types (English and Spanish both work), mapped
// to the section's actual DOM id. Not translated UI copy, so it stays out of
// messages/*.json — a translator would never touch these literal command words.
const sectionCommands: Record<string, string> = {
  about: "sobre-mi",
  "sobre-mi": "sobre-mi",
  experience: "experiencia",
  experiencia: "experiencia",
  projects: "proyectos",
  proyectos: "proyectos",
  stack: "stack",
  contact: "contacto",
  contacto: "contacto",
};

export default function Terminal() {
  const t = useTranslations("Terminal");
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  function runCommand(raw: string) {
    const cmd = raw.trim().toLowerCase();
    const nextLines: Line[] = [...lines, { type: "input", text: raw }];

    if (cmd === "clear") {
      setLines([]);
      return;
    }

    if (cmd === "help") {
      nextLines.push({ type: "output", text: t("help") });
    } else if (cmd === "whoami") {
      nextLines.push({ type: "output", text: t("whoami") });
    } else if (cmd in sectionCommands) {
      document
        .getElementById(sectionCommands[cmd])
        ?.scrollIntoView({ behavior: "smooth" });
    } else if (cmd.length > 0) {
      nextLines.push({ type: "output", text: t("notFound", { cmd }) });
    }

    setLines(nextLines);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    runCommand(input);
    setInput("");
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
          <span className="ml-2 font-mono text-xs text-text-muted">
            {t("prompt")}:~
          </span>
        </div>

        <div
          ref={scrollRef}
          className="font-mono text-sm leading-7 h-64 overflow-y-auto"
        >
          <div className="text-text-secondary">{t("welcome")}</div>

          {lines.map((line, i) => (
            <div
              key={i}
              className={
                line.type === "input"
                  ? "text-text-primary"
                  : "text-text-secondary"
              }
            >
              {line.type === "input" && <span className="text-accent">$ </span>}
              {line.text}
            </div>
          ))}

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <span className="text-accent">$</span>
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
