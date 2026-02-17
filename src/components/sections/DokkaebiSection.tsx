'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'motion/react'
import { Section } from '@/components/layout/Section'
import { HangulConverter } from '@/lib/hangul/converter'

// Pre-compute the trace for "rkfk" (도깨비불 발생 예시)
const converter = new HangulConverter()
const demoTrace = converter.traceConvert('rkfk')

const codeColors: Record<string, string> = {
  '0': 'text-green-400 bg-green-500/15',
  '1': 'text-blue-400 bg-blue-500/15',
  '2': 'text-red-400 bg-red-500/15',
  '.': 'text-muted-foreground',
  'd': 'text-amber-400 bg-amber-500/15',
}

type Segment =
  | { type: 'normal'; char: string; index: number }
  | { type: 'cancelled'; chars: { char: string; index: number }[] }

function buildSegments(code: string): Segment[] {
  const segments: Segment[] = []
  let i = 0
  while (i < code.length) {
    if (i + 1 < code.length && code[i + 1] === 'd') {
      segments.push({
        type: 'cancelled',
        chars: [
          { char: code[i], index: i },
          { char: 'd', index: i + 1 },
        ],
      })
      i += 2
    } else {
      segments.push({ type: 'normal', char: code[i], index: i })
      i++
    }
  }
  return segments
}

const WALKTHROUGH_DATA = [
  {
    key: 'r', jamo: 'ㄱ', role: '초성', code: '0', state: 'S → V', dokkaebi: false,
    hangulBefore: '', hangulAfter: '',
    detail: '자음 ㄱ이 초성으로 입력됩니다.',
  },
  {
    key: 'k', jamo: 'ㅏ', role: '중성', code: '01', state: 'V → A', dokkaebi: false,
    hangulBefore: '', hangulAfter: '가',
    detail: '모음 ㅏ가 중성으로 결합하여 "가"가 됩니다.',
  },
  {
    key: 'f', jamo: 'ㄹ', role: '종성', code: '012', state: 'A → R', dokkaebi: false,
    hangulBefore: '가', hangulAfter: '갈',
    detail: '자음 ㄹ이 종성(받침)으로 들어가 "갈"이 됩니다.',
  },
  {
    key: 'k', jamo: 'ㅏ', role: '도깨비불!', code: '012d.01', state: 'R → A', dokkaebi: true,
    hangulBefore: '갈', hangulAfter: '가라',
    detail: '모음이 오면 종성 ㄹ이 떨어져 나와 다음 음절의 초성이 됩니다. "갈" → "가" + "라"',
  },
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {WALKTHROUGH_DATA.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className={`p-5 rounded-lg border ${step.dokkaebi ? 'border-amber-500/40 bg-amber-500/5' : 'border-border/50 bg-muted/20'}`}
          >
            {/* Header: step number + key input + role badge */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm text-muted-foreground">
                {t('step')} {i + 1}
              </span>
              <span className="font-mono text-2xl font-bold text-blue-400">
                {step.key}
              </span>
              <span className="text-lg text-foreground/80">({step.jamo})</span>
              <span className={`text-sm font-semibold px-2 py-0.5 rounded ${
                step.dokkaebi
                  ? 'text-amber-400 bg-amber-500/15'
                  : step.role === '초성'
                  ? 'text-green-400 bg-green-500/15'
                  : step.role === '중성'
                  ? 'text-blue-400 bg-blue-500/15'
                  : 'text-red-400 bg-red-500/15'
              }`}>
                {step.role}
              </span>
            </div>

            {/* Description */}
            <p className="text-base text-muted-foreground mb-3">
              {step.detail}
            </p>

            {/* State transition + code */}
            <div className="flex items-center gap-3 text-sm font-mono mb-3">
              <span className="text-muted-foreground">{step.state}</span>
              <span className="text-foreground/40">|</span>
              <span className="flex gap-0.5">
                {buildSegments(step.code).map((seg) => {
                  if (seg.type === 'normal') {
                    return (
                      <span
                        key={seg.index}
                        className={`px-1 rounded ${codeColors[seg.char] || 'text-foreground'}`}
                      >
                        {seg.char}
                      </span>
                    )
                  }
                  const first = seg.chars[0]
                  const second = seg.chars[1]
                  return (
                    <span
                      key={`cancelled-${first.index}`}
                      className="relative inline-flex gap-0.5"
                    >
                      <motion.span
                        animate={{ opacity: [1, 1, 0.35, 0.35] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        className={`px-1 rounded ${codeColors[first.char] || 'text-foreground'}`}
                      >
                        {first.char}
                      </motion.span>
                      <motion.span
                        animate={{ opacity: [1, 1, 0.35, 0.35] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        className={`px-1 rounded ${codeColors[second.char] || 'text-foreground'}`}
                      >
                        {second.char}
                      </motion.span>
                      <motion.svg
                        animate={{ opacity: [0, 0, 0.8, 0.8] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute inset-0 pointer-events-none"
                        width="100%"
                        height="100%"
                      >
                        <line
                          x1="10%" y1="85%"
                          x2="90%" y2="15%"
                          stroke="#ef4444"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </motion.svg>
                    </span>
                  )
                })}
              </span>
            </div>

            {/* Hangul transformation */}
            <div className="flex items-center gap-3 text-2xl font-bold">
              {step.hangulBefore && (
                <>
                  <span className={step.dokkaebi ? 'text-muted-foreground line-through' : 'text-muted-foreground/40'}>
                    {step.hangulBefore}
                  </span>
                  <span className={`text-lg ${step.dokkaebi ? 'text-amber-400' : 'text-foreground/30'}`}>→</span>
                </>
              )}
              {i < demoTrace.length && (
                <span className={step.dokkaebi ? 'text-amber-400' : 'text-foreground'}>
                  {demoTrace[i].currentHangul}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
