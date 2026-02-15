'use client'

import { motion, AnimatePresence } from 'motion/react'
import type { HangulTraceStep } from '@/lib/automata/types'

interface HangulDisplayProps {
  trace: HangulTraceStep[]
  currentStep: number
  finalResult: string
  title?: string
  className?: string
}

export function HangulDisplay({
  trace,
  currentStep,
  finalResult,
  title,
  className = '',
}: HangulDisplayProps) {
  const currentHangul =
    currentStep >= 0 && currentStep < trace.length
      ? trace[currentStep].currentHangul
      : ''
  const isDokkaebi =
    currentStep >= 0 && currentStep < trace.length
      ? trace[currentStep].isDokkaebi
      : false
  const isFinished = currentStep === trace.length - 1

  return (
    <div className={`rounded-lg border border-border p-4 ${className}`}>
      {title && (
        <div className="text-xs text-muted-foreground mb-2 font-medium">{title}</div>
      )}
      <div className="min-h-[3rem] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentHangul}
            initial={{ opacity: 0.5, scale: 0.95 }}
            animate={{
              opacity: 1,
              scale: 1,
              color: isDokkaebi ? '#f59e0b' : isFinished ? '#22c55e' : '#e2e8f0',
            }}
            className="text-4xl font-bold tracking-wider"
          >
            {currentHangul || (
              <span className="text-muted-foreground/30 text-2xl">한글</span>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      {isDokkaebi && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-xs text-amber-400 mt-1"
        >
          도깨비불 발생!
        </motion.div>
      )}
      {isFinished && finalResult && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-green-400 mt-2"
        >
          결과: {finalResult}
        </motion.div>
      )}
    </div>
  )
}
