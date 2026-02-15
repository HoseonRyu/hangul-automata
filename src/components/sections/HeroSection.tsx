'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'motion/react'
import { Section } from '@/components/layout/Section'
import { useEffect, useState } from 'react'

const DEMO_INPUT = 'dkssud'
const DEMO_OUTPUT = '안녕'

export function HeroSection() {
  const t = useTranslations('hero')
  const [typedInput, setTypedInput] = useState('')
  const [showOutput, setShowOutput] = useState(false)

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < DEMO_INPUT.length) {
        setTypedInput(DEMO_INPUT.slice(0, i + 1))
        i++
      } else {
        setShowOutput(true)
        clearInterval(interval)
        // Reset after delay
        setTimeout(() => {
          setTypedInput('')
          setShowOutput(false)
          i = 0
          // Restart
          const restart = setInterval(() => {
            if (i < DEMO_INPUT.length) {
              setTypedInput(DEMO_INPUT.slice(0, i + 1))
              i++
            } else {
              setShowOutput(true)
              clearInterval(restart)
            }
          }, 200)
        }, 3000)
      }
    }, 200)
    return () => clearInterval(interval)
  }, [])

  return (
    <Section id="hero">
      <div className="text-center w-full">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-bold tracking-tight mb-6"
        >
          {t('title')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl md:text-3xl text-muted-foreground mb-10"
        >
          {t('subtitle')}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-14"
        >
          {t('description')}
        </motion.p>

        {/* Demo preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="inline-flex items-center gap-6 bg-muted/30 rounded-2xl border border-border/50 px-10 py-8"
        >
          <span className="font-mono text-3xl md:text-4xl text-muted-foreground">
            &quot;{typedInput}
            <span className="animate-pulse">|</span>
            &quot;
          </span>
          {showOutput && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl md:text-4xl"
            >
              →
            </motion.span>
          )}
          {showOutput && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-4xl md:text-5xl font-bold text-blue-400"
            >
              &quot;{DEMO_OUTPUT}&quot;
            </motion.span>
          )}
        </motion.div>
      </div>
    </Section>
  )
}
