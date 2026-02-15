'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'motion/react'
import { Section } from '@/components/layout/Section'
import { HangulConverter } from '@/lib/hangul/converter'

// Pre-compute the trace for "rkfk" (도깨비불 발생 예시)
const converter = new HangulConverter()
const demoTrace = converter.traceConvert('rkfk')

const WALKTHROUGH_DATA = [
  { key: 'r', desc_ko: 'ㄱ (초성)', desc_en: 'ㄱ (initial)', code: '0', state: 'S → V', dokkaebi: false },
  { key: 'k', desc_ko: 'ㅏ (중성)', desc_en: 'ㅏ (medial)', code: '01', state: 'V → A', dokkaebi: false },
  { key: 'f', desc_ko: 'ㄹ (종성)', desc_en: 'ㄹ (final)', code: '012', state: 'A → R', dokkaebi: false },
  { key: 'k', desc_ko: 'ㅏ → 도깨비불! 종성 ㄹ이 초성으로 이동', desc_en: 'ㅏ → Dokkaebi! ㄹ moves to initial', code: '012d.01', state: 'R → A', dokkaebi: true },
]

export function DokkaebiSection() {
  const t = useTranslations('dokkaebi')

  return (
    <Section id="dokkaebi" className="!justify-start !pt-12">
      <h2 className="text-4xl md:text-5xl font-bold mb-5">{t('title')}</h2>
      <p className="text-lg md:text-xl text-muted-foreground mb-5">{t('description')}</p>
      <p className="text-base text-muted-foreground mb-6">{t('explanation')}</p>

      {/* Unicode formula */}
      <div className="mb-8 p-6 rounded-lg bg-muted/30 border border-border/50">
        <h3 className="font-semibold text-base md:text-lg mb-3">{t('formula')}</h3>
        <code className="text-blue-400 text-xl md:text-2xl font-mono">
          chr(f × 588 + m × 28 + l + 44032)
        </code>
        <p className="text-sm text-muted-foreground mt-3">{t('formulaDesc')}</p>
      </div>

      {/* Walkthrough */}
      <h3 className="text-2xl font-bold mb-6">{t('walkthrough')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {WALKTHROUGH_DATA.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className={`p-5 rounded-lg border ${step.dokkaebi ? 'border-amber-500/40 bg-amber-500/5' : 'border-border/50 bg-muted/20'}`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm text-muted-foreground">
                {t('step')} {i + 1}
              </span>
              <span className="font-mono text-xl font-bold text-blue-400">
                {step.key}
              </span>
            </div>
            <div className="text-base text-muted-foreground mb-1">
              {step.desc_ko}
            </div>
            <div className="flex items-center gap-2 text-sm font-mono">
              <span className="text-muted-foreground">{step.state}</span>
              <span className="text-foreground/60">→</span>
              <span className="flex gap-0.5">
                {Array.from(step.code).map((c, ci) => (
                  <span
                    key={ci}
                    className={`px-1 rounded ${
                      c === '0'
                        ? 'text-green-400 bg-green-500/15'
                        : c === '1'
                        ? 'text-blue-400 bg-blue-500/15'
                        : c === '2'
                        ? 'text-red-400 bg-red-500/15'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {c}
                  </span>
                ))}
              </span>
            </div>
            {/* Show intermediate hangul */}
            {i < demoTrace.length && (
              <div className="mt-2 text-xl font-bold">
                {demoTrace[i].currentHangul}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Dokkaebi demonstration */}
      <div className="p-6 rounded-lg bg-amber-500/5 border border-amber-500/20">
        <h4 className="font-semibold text-amber-400 text-base mb-3">
          도깨비불 예시: &quot;rkfk&quot; → &quot;가라&quot;
        </h4>
        <div className="space-y-2.5 text-base font-mono">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground w-6">1.</span>
            <span>r(ㄱ) → <span className="text-green-400">초성</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground w-6">2.</span>
            <span>k(ㅏ) → <span className="text-blue-400">중성</span> → 가</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground w-6">3.</span>
            <span>f(ㄹ) → <span className="text-red-400">종성</span> → 갈</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground w-6">4.</span>
            <span>
              k(ㅏ) → <span className="text-amber-400">도깨비불!</span>{' '}
              갈 → 가 + 라
            </span>
          </div>
        </div>
      </div>
    </Section>
  )
}
