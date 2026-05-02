'use client'

import { motion } from 'framer-motion'
import {
  siDotnet, siNodedotjs, siSpring, siPython,
  siReact, siNextdotjs, siAngular, siTypescript,
  siTailwindcss, siShadcnui, siDocker, siGit, siGitlab, siScikitlearn
} from 'simple-icons'

interface StackItem {
  name: string
  icon: { path: string; hex: string } | null
}

interface StackColumnData {
  category: string
  color: string
  dot: string
  items: StackItem[]
}

function getIconFill(hex: string): string {
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness < 50 ? '#F9FAFB' : `#${hex}`
}

const SimpleIcon = ({
  icon,
  size = 16,
}: {
  icon: { path: string; hex: string }
  size?: number
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={getIconFill(icon.hex)}
    xmlns="http://www.w3.org/2000/svg"
    className="flex-shrink-0"
  >
    <path d={icon.path} />
  </svg>
)

const si = {
  dotnet: siDotnet as { path: string; hex: string },
  nodejs: siNodedotjs as { path: string; hex: string },
  spring: siSpring as { path: string; hex: string },
  python: siPython as { path: string; hex: string },
  react: siReact as { path: string; hex: string },
  nextjs: siNextdotjs as { path: string; hex: string },
  angular: siAngular as { path: string; hex: string },
  typescript: siTypescript as { path: string; hex: string },
  tailwind: siTailwindcss as { path: string; hex: string },
  shadcn: siShadcnui as { path: string; hex: string },
  docker: siDocker as { path: string; hex: string },
  git: siGit as { path: string; hex: string },
  gitlab: siGitlab as { path: string; hex: string },
  sklearn: siScikitlearn as { path: string; hex: string },
}

const stackData: StackColumnData[] = [
  {
    category: 'Backend',
    color: 'green',
    dot: '#00E5A0',
    items: [
      { name: '.NET Core', icon: si.dotnet },
      { name: 'C#', icon: null },
      { name: 'Node.js', icon: si.nodejs },
      { name: 'Java', icon: null },
      { name: 'Spring Boot', icon: si.spring },
      { name: 'Python', icon: si.python },
      { name: 'SQL Server', icon: null },
      { name: 'EF Core', icon: null },
      { name: 'Clean Architecture', icon: null },
    ],
  },
  {
    category: 'Frontend',
    color: 'blue',
    dot: '#3B82F6',
    items: [
      { name: 'React', icon: si.react },
      { name: 'Next.js', icon: si.nextjs },
      { name: 'Angular', icon: si.angular },
      { name: 'TypeScript', icon: si.typescript },
      { name: 'Tailwind CSS', icon: si.tailwind },
      { name: 'shadcn/UI', icon: si.shadcn },
      { name: 'Zustand', icon: null },
    ],
  },
  {
    category: 'DevOps & ML',
    color: 'amber',
    dot: '#F59E0B',
    items: [
      { name: 'Azure', icon: null },
      { name: 'AWS', icon: null },
      { name: 'Docker', icon: si.docker },
      { name: 'Git', icon: si.git },
      { name: 'GitLab CI/CD', icon: si.gitlab },
      { name: 'scikit-learn', icon: si.sklearn },
      { name: 'Power BI', icon: null },
      { name: 'Power Automate', icon: null },
    ],
  },
]

const StackTag = ({
  item,
  index,
}: {
  item: StackItem
  index: number
}) => (
  <motion.div
    className="stack-tag flex items-center gap-1.5 cursor-default"
    initial={{ opacity: 0, y: 8 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
    whileHover={{ scale: 1.05, transition: { duration: 0.15 } }}
  >
    {item.icon ? (
      <SimpleIcon icon={item.icon} size={14} />
    ) : (
      <div className="w-4 h-4 bg-bg-secondary border border-border rounded flex items-center justify-center flex-shrink-0">
        <span className="font-mono text-[9px] text-text-muted leading-none">
          {item.name.slice(0, 2).toUpperCase()}
        </span>
      </div>
    )}
    <span>{item.name}</span>
  </motion.div>
)

const StackColumn = ({
  data,
  columnIndex,
}: {
  data: StackColumnData
  columnIndex: number
}) => (
  <motion.div
    className="card flex flex-col gap-4 hover:border-accent-green/30 hover:glow-green transition-all duration-300"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.5, delay: columnIndex * 0.15, ease: 'easeOut' }}
    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
  >
    <div className="flex items-center gap-2">
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: data.dot }}
      />
      <span
        className="font-mono text-xs font-medium tracking-widest uppercase"
        style={{ color: data.dot }}
      >
        {data.category}
      </span>
    </div>

    <div className="h-px bg-border w-full" />

    <div className="flex flex-wrap gap-2">
      {data.items.map((item, index) => (
        <StackTag key={item.name} item={item} index={index} />
      ))}
    </div>
  </motion.div>
)

export default function Stack() {
  return (
    <section id="stack" className="section">
      <p className="section-label">Con qué trabajo</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stackData.map((column, columnIndex) => (
          <StackColumn
            key={column.category}
            data={column}
            columnIndex={columnIndex}
          />
        ))}
      </div>
    </section>
  )
}
