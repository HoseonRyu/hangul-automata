'use client'

import { motion, AnimatePresence } from 'motion/react'

interface JamoMappingItem {
  inputKey: string
  jamo: string
  codeChars: string
}

interface CodePanelProps {
  code: string
  currentStep: number
  title?: string
  className?: string
  jamoMapping?: JamoMappingItem[]
}

const codeColors: Record<string, string> = {
  '0': 'text-green-400 bg-green-500/15', // 초성
  '1': 'text-blue-400 bg-blue-500/15',   // 중성
  '2': 'text-red-400 bg-red-500/15',     // 종성
  '.': 'text-muted-foreground',           // 구분자
  'd': 'text-amber-400 bg-amber-500/15', // 도깨비불
}

type Segment =
  | { type: 'normal'; char: string; index: number }
  | { type: 'cancelled'; chars: { char: string; index: number }[] }

function buildSegments(code: string): Segment[] {
  const segments: Segment[] = []
  let i = 0
  while (i < code.length) {
    // Check if this char + next is a "Xd" cancelled pair
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

export function CodePanel({ code, currentStep, title, className = '', jamoMapping }: CodePanelProps) {
  const segments = buildSegments(code)

  return (
    <div className={`rounded-lg border border-border p-4 ${className}`}>
      {title && (
        <div className="text-sm text-muted-foreground mb-2 font-medium">{title}</div>
      )}
      <div className="font-mono text-xl min-h-[2.5rem] flex items-center flex-wrap gap-1">
        <AnimatePresence mode="popLayout">
          {segments.map((seg) => {
            if (seg.type === 'normal') {
              return (
                <motion.span
                  key={`${seg.index}-${seg.char}`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`
                    inline-block px-1.5 py-0.5 rounded text-base
                    ${codeColors[seg.char] || 'text-foreground'}
                  `}
                >
                  {seg.char}
                </motion.span>
              )
            }

            // Cancelled pair: wrap together with diagonal red slash
            const first = seg.chars[0]
            const second = seg.chars[1]
            return (
              <motion.span
                key={`cancelled-${first.index}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative inline-flex gap-0.5 overflow-hidden"
              >
                <span
                  className={`inline-block px-1.5 py-0.5 rounded text-base opacity-35 ${codeColors[first.char] || 'text-foreground'}`}
                >
                  {first.char}
                </span>
                <span
                  className={`inline-block px-1.5 py-0.5 rounded text-base opacity-35 ${codeColors[second.char] || 'text-foreground'}`}
                >
                  {second.char}
                </span>
                {/* Diagonal red slash across the pair */}
                <svg
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
                    opacity="0.8"
                  />
                </svg>
              </motion.span>
            )
          })}
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
      {jamoMapping && jamoMapping.length > 0 && (
        <div className="mt-2 pt-2 border-t border-border/30 flex flex-wrap gap-2 text-sm font-mono">
          {jamoMapping.map((item, i) => (
            <span key={i} className="flex items-center gap-1">
              <span className="text-blue-400">{item.inputKey}</span>
              <span className="text-muted-foreground">({item.jamo})</span>
              <span className="text-muted-foreground/50">/</span>
              <span className="flex gap-0.5">
                {Array.from(item.codeChars).map((c, ci) => (
                  <span key={ci} className={`px-0.5 rounded ${codeColors[c] || ''}`}>{c}</span>
                ))}
              </span>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
