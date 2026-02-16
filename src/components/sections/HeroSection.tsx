'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'motion/react'
import { Section } from '@/components/layout/Section'
import { useEffect, useState, useRef } from 'react'
import { HangulConverter } from '@/lib/hangul/converter'

const DEMO_INPUT = 'dkssud'

// Pre-compute trace
const converter = new HangulConverter()
const demoTrace = converter.traceConvert(DEMO_INPUT)

const TYPE_DELAY = 250
const ERASE_DELAY = 80
const PAUSE_AFTER_COMPLETE = 2500
const PAUSE_AFTER_ERASE = 800

export function HeroSection() {
  const t = useTranslations('hero')
  const [charIndex, setCharIndex] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)
  const phaseRef = useRef<'typing' | 'pausing' | 'erasing'>('typing')
  const indexRef = useRef(0)

  const currentHangul = charIndex > 0 && charIndex <= demoTrace.length
    ? demoTrace[charIndex - 1].currentHangul
    : ''
  const typedInput = DEMO_INPUT.slice(0, charIndex)

  useEffect(() => {
    function step() {
      const phase = phaseRef.current
      const idx = indexRef.current

      if (phase === 'typing') {
        if (idx < DEMO_INPUT.length) {
          indexRef.current = idx + 1
          setCharIndex(indexRef.current)
          timerRef.current = setTimeout(step, TYPE_DELAY)
        } else {
          phaseRef.current = 'pausing'
          timerRef.current = setTimeout(step, PAUSE_AFTER_COMPLETE)
        }
      } else if (phase === 'pausing') {
        phaseRef.current = 'erasing'
        timerRef.current = setTimeout(step, ERASE_DELAY)
      } else if (phase === 'erasing') {
        if (idx > 0) {
          indexRef.current = idx - 1
          setCharIndex(indexRef.current)
          timerRef.current = setTimeout(step, ERASE_DELAY)
        } else {
          phaseRef.current = 'typing'
          timerRef.current = setTimeout(step, PAUSE_AFTER_ERASE)
        }
      }
    }

    timerRef.current = setTimeout(step, TYPE_DELAY)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
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
          className="text-2xl md:text-3xl text-muted-foreground mb-14"
        >
          {t('subtitle')}
        </motion.p>
        {/* Demo preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="inline-flex items-center gap-8 bg-muted/30 rounded-2xl border border-border/50 px-10 py-8"
        >
          {/* Input side */}
          <div className="font-mono text-3xl md:text-4xl text-muted-foreground">
            &quot;{typedInput}
            <span className="inline-block w-[3px] h-[1.1em] bg-blue-400 align-middle ml-0.5 animate-[blink_1s_step-end_infinite]" />
            &quot;
          </div>

          {/* Arrow */}
          <span className="text-3xl md:text-4xl text-foreground/30">→</span>

          {/* Output side — real-time hangul */}
          <div className="text-4xl md:text-5xl font-bold text-blue-400 min-w-[3ch] text-left">
            &quot;{currentHangul}&quot;
          </div>
        </motion.div>
      </div>
    </Section>
  )
}
