'use client'

import { motion, AnimatePresence } from 'motion/react'

interface OutputPanelProps {
  output: string
  currentStep: number
  title?: string
  className?: string
}

export function OutputPanel({ output, currentStep, title, className = '' }: OutputPanelProps) {
  const visibleOutput = output.slice(0, currentStep + 1)

  return (
    <div className={`rounded-lg border border-border p-4 ${className}`}>
      {title && (
        <div className="text-xs text-muted-foreground mb-2 font-medium">{title}</div>
      )}
      <div className="font-mono text-xl min-h-[2rem] flex items-center">
        <AnimatePresence mode="popLayout">
          {Array.from(visibleOutput).map((char, i) => (
            <motion.span
              key={`${i}-${char}`}
              initial={{ opacity: 0, y: -10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={i === currentStep ? 'text-blue-400 font-bold' : 'text-foreground'}
            >
              {char}
            </motion.span>
          ))}
        </AnimatePresence>
        {visibleOutput.length === 0 && (
          <span className="text-muted-foreground/40">...</span>
        )}
      </div>
    </div>
  )
}
