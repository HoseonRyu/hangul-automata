'use client'

import { motion, AnimatePresence } from 'motion/react'

interface CodePanelProps {
  code: string
  currentStep: number
  title?: string
  className?: string
}

const codeColors: Record<string, string> = {
  '0': 'text-green-400 bg-green-500/15', // 초성
  '1': 'text-blue-400 bg-blue-500/15',   // 중성
  '2': 'text-red-400 bg-red-500/15',     // 종성
  '.': 'text-muted-foreground',           // 구분자
  'd': 'text-amber-400 bg-amber-500/15', // 도깨비불
}

export function CodePanel({ code, currentStep, title, className = '' }: CodePanelProps) {
  // Show code up to currentStep + 1 characters of the raw output
  const visibleCode = code.slice(0, Math.max(0, currentStep + 1) * 2 + 2)

  return (
    <div className={`rounded-lg border border-border p-4 ${className}`}>
      {title && (
        <div className="text-sm text-muted-foreground mb-2 font-medium">{title}</div>
      )}
      <div className="font-mono text-xl min-h-[2.5rem] flex items-center flex-wrap gap-1">
        <AnimatePresence mode="popLayout">
          {Array.from(code).map((char, i) => (
            <motion.span
              key={`${i}-${char}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`
                inline-block px-1.5 py-0.5 rounded text-base
                ${codeColors[char] || 'text-foreground'}
              `}
            >
              {char}
            </motion.span>
          ))}
        </AnimatePresence>
        {code.length === 0 && (
          <span className="text-muted-foreground/40">...</span>
        )}
      </div>
      <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-400" /> 0: 초성
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-400" /> 1: 중성
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-400" /> 2: 종성
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-400" /> d: 도깨비불
        </span>
      </div>
    </div>
  )
}
