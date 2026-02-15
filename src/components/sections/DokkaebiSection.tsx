'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'motion/react'
import { Section } from '@/components/layout/Section'
import { HangulConverter } from '@/lib/hangul/converter'

// Pre-compute the trace for "dkssud"
const converter = new HangulConverter()
const demoTrace = converter.traceConvert('dkssud')

const WALKTHROUGH_DATA = [
  { key: 'd', desc_ko: 'ㅇ (초성)', desc_en: 'ㅇ (initial)', code: '0', state: 'S → V' },
  { key: 'k', desc_ko: 'ㅏ (중성)', desc_en: 'ㅏ (medial)', code: '01', state: 'V → A' },
  { key: 's', desc_ko: 'ㄴ (종성)', desc_en: 'ㄴ (final)', code: '012', state: 'A → N' },
  { key: 's', desc_ko: 'ㄴ (새 음절 초성)', desc_en: 'ㄴ (new initial)', code: '012.0', state: 'N → V' },
  { key: 'u', desc_ko: 'ㅕ (중성)', desc_en: 'ㅕ (medial)', code: '012.01', state: 'V → A' },
  { key: 'd', desc_ko: 'ㅇ (종성)', desc_en: 'ㅇ (final)', code: '012.012', state: 'A → L' },
]

export function DokkaebiSection() {
  const t = useTranslations('dokkaebi')

  return (
    <Section id="dokkaebi">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('title')}</h2>
      <p className="text-muted-foreground mb-6 max-w-3xl">{t('description')}</p>
      <p className="text-sm text-muted-foreground mb-8 max-w-3xl">{t('explanation')}</p>

      {/* Unicode formula */}
      <div className="mb-10 p-5 rounded-lg bg-muted/30 border border-border/50 max-w-xl">
        <h3 className="font-semibold text-sm mb-2">{t('formula')}</h3>
        <code className="text-blue-400 text-lg font-mono">
          chr(f × 588 + m × 28 + l + 44032)
        </code>
        <p className="text-xs text-muted-foreground mt-2">{t('formulaDesc')}</p>
      </div>

      {/* Walkthrough */}
      <h3 className="text-xl font-bold mb-6">{t('walkthrough')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {WALKTHROUGH_DATA.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="p-4 rounded-lg border border-border/50 bg-muted/20"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs text-muted-foreground">
                {t('step')} {i + 1}
              </span>
              <span className="font-mono text-lg font-bold text-blue-400">
                {step.key}
              </span>
            </div>
            <div className="text-sm text-muted-foreground mb-1">
              {step.desc_ko}
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
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
              <div className="mt-2 text-lg font-bold">
                {demoTrace[i].currentHangul}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Dokkaebi demonstration */}
      <div className="p-6 rounded-lg bg-amber-500/5 border border-amber-500/20 max-w-xl">
        <h4 className="font-semibold text-amber-400 text-sm mb-3">
          도깨비불 예시: &quot;rkfk&quot; → &quot;가라&quot;
        </h4>
        <div className="space-y-2 text-sm font-mono">
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
