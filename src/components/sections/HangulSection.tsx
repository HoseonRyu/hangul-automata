'use client'

import { useState, useCallback, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'motion/react'
import { Section } from '@/components/layout/Section'
import { AutomataGraph } from '@/components/graph/AutomataGraph'
import { InputField } from '@/components/controls/InputField'
import { PlaybackControls } from '@/components/controls/PlaybackControls'
import { TraceTable } from '@/components/panels/TraceTable'
import { CodePanel } from '@/components/panels/CodePanel'
import { HangulDisplay } from '@/components/panels/HangulDisplay'
import { HangulTransferTable } from '@/components/panels/HangulTransferTable'
import { hangulNodes, hangulEdges, hangulGroupNodes } from '@/lib/graph/hangul-config'
import { SYMBOLS_IN, C as C_KEYS } from '@/lib/hangul/constants'
import { consonantToJamo, vowelToJamo } from '@/lib/hangul/utils'
import { useHangulTrace } from '@/hooks/useAutomataTrace'
import { usePlayback } from '@/hooks/usePlayback'

const allNodes = [...hangulGroupNodes, ...hangulNodes]

type Mode = 'explain' | 'interactive' | 'realtime'

const STATE_GROUPS = [
  { group: 'start' as const, color: 'text-slate-400', states: ['S'] },
  { group: 'initial' as const, color: 'text-emerald-400', states: ['V'] },
  { group: 'medial' as const, color: 'text-blue-400', states: ['O', 'U', 'A', 'I'] },
  { group: 'final' as const, color: 'text-amber-400', states: ['K', 'N', 'R', 'L'] },
  { group: 'bare' as const, color: 'text-violet-400', states: ['B'] },
] as const

const INPUT_CATEGORIES = [
  { symbol: 'C', keys: 'r,s,e,f,a,q,t,d,w,c,z,x,v,g + R,E,Q,T,W', color: 'text-emerald-400' },
  { symbol: 'h,n', keys: 'ㅗ, ㅜ (복합모음 시작)', color: 'text-blue-400' },
  { symbol: 'k,o,j,p', keys: 'ㅏ,ㅐ,ㅓ,ㅔ (복합모음 구성 가능)', color: 'text-blue-300' },
  { symbol: 'i,u,...', keys: 'ㅑ,ㅡ,ㅠ,ㅣ,... (단순/종결모음)', color: 'text-blue-300' },
] as const

const OUTPUT_CODES = [
  { code: '0', color: 'text-green-400 bg-green-500/15' },
  { code: '1', color: 'text-blue-400 bg-blue-500/15' },
  { code: '2', color: 'text-red-400 bg-red-500/15' },
  { code: '.', color: 'text-muted-foreground bg-muted/50' },
  { code: 'd', color: 'text-amber-400 bg-amber-500/15' },
] as const

const EXAMPLES = [
  { label: 'dkssud → 안녕', value: 'dkssud' },
  { label: 'tptkd → 세상', value: 'tptkd' },
  { label: 'gksrmf → 한글', value: 'gksrmf' },
  { label: 'dkssudgktpdy → 안녕하세요', value: 'dkssudgktpdy' },
]

export function HangulSection() {
  const t = useTranslations('hangul')
  const tc = useTranslations('common')
  const [mode, setMode] = useState<Mode>('explain')
  const [input, setInput] = useState('')
  const [highlight, setHighlight] = useState<{
    key: string
    nodes?: string[]
    edges?: string[]
  } | null>(null)

  const toggleHighlight = useCallback((key: string, nodes?: string[], edges?: string[]) => {
    setHighlight((prev) => prev?.key === key ? null : { key, nodes, edges })
  }, [])

  const { trace, error, result } = useHangulTrace(input)
  const playback = usePlayback({ totalSteps: trace.length })

  const effectiveStep = mode === 'realtime' ? trace.length - 1 : playback.currentStep

  const activeState =
    effectiveStep >= 0 ? trace[effectiveStep]?.toState : 'S'

  const activeEdge =
    effectiveStep >= 0
      ? hangulEdges.find(
          (e) =>
            e.source === trace[effectiveStep]?.fromState &&
            e.target === trace[effectiveStep]?.toState &&
            (e.data as { symbols?: string[] })?.symbols?.includes(trace[effectiveStep]?.symbol)
        )?.id ?? null
      : null

  const isDokkaebi = effectiveStep >= 0 ? trace[effectiveStep]?.isDokkaebi : false
  const syllableCode = effectiveStep >= 0 ? trace[effectiveStep]?.syllableCode ?? '' : ''

  const jamoMapping = useMemo(() => {
    if (!trace.length) return []
    const steps = mode === 'realtime' ? trace : trace.slice(0, playback.currentStep + 1)
    return steps.map(step => ({
      inputKey: step.symbol,
      jamo: C_KEYS.includes(step.symbol) ? consonantToJamo(step.symbol) : vowelToJamo(step.symbol),
      codeChars: step.output,
    }))
  }, [trace, mode, playback.currentStep])

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode)
    setHighlight(null)
    if (newMode === 'explain') {
      setInput('')
      playback.reset()
    } else {
      playback.reset()
    }
  }

  const hlClass = (key: string) =>
    highlight?.key === key
      ? 'ring-1 ring-emerald-500/50 bg-emerald-500/10 rounded'
      : ''
  const btnBase = 'cursor-pointer transition-all duration-200 hover:bg-emerald-500/5 rounded px-1 -mx-1'

  const modeButtons: { key: Mode; label: string }[] = [
    { key: 'explain', label: tc('modeExplain') },
    { key: 'interactive', label: tc('modeInteractive') },
    { key: 'realtime', label: tc('modeRealtime') },
  ]

  return (
    <Section id="hangul">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-4xl md:text-5xl font-bold">{t('title')}</h2>
        <div className="flex gap-1 bg-muted/30 rounded-lg p-1">
          {modeButtons.map((btn) => (
            <button
              key={btn.key}
              onClick={() => handleModeChange(btn.key)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                mode === btn.key
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
      <p className="text-lg md:text-xl text-muted-foreground mb-5">{t('description')}</p>

      <div className="grid grid-cols-1 lg:grid-cols-5 lg:h-[70vh] gap-5">
        {/* Graph — always same position */}
        <div className="lg:col-span-3">
          <AutomataGraph
            className="!h-full"
            initialNodes={allNodes}
            initialEdges={hangulEdges}
            activeState={mode === 'explain' ? (highlight ? null : 'S') : activeState}
            activeEdgeId={mode === 'explain' ? null : activeEdge}
            highlightNodes={mode === 'explain' ? highlight?.nodes : undefined}
            highlightEdges={mode === 'explain' ? highlight?.edges : undefined}
            isDokkaebi={mode !== 'explain' && isDokkaebi}
          />
        </div>

        {/* Right panel — content changes by mode */}
        <div className="lg:col-span-2 min-h-0">
          {mode === 'explain' ? (
            <motion.div
              key="explain"
              className="flex flex-col gap-4 h-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* 상태 설명 */}
              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <p className="text-sm font-semibold text-muted-foreground mb-3">{t('statesTitle')}</p>
                <div className="space-y-2">
                  {STATE_GROUPS.map((group) => (
                    <div key={group.group} className="flex flex-wrap gap-1">
                      {group.states.map((s) => (
                        <button
                          key={s}
                          type="button"
                          className={`${btnBase} ${hlClass(`st-${s}`)} flex items-center gap-1.5 px-2 py-1`}
                          onClick={() => toggleHighlight(`st-${s}`, [s])}
                        >
                          <span className={`font-mono font-bold ${group.color}`}>{s}</span>
                          <span className="text-muted-foreground/30">–</span>
                          <span className="text-sm text-muted-foreground">{t(`state${s}` as 'stateS')}</span>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* 입출력 집합 */}
              <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
                <p className="text-sm text-blue-400 mb-2">{t('inputTitle')}</p>
                <div className="grid grid-cols-1 gap-1 text-sm font-mono mb-3">
                  {INPUT_CATEGORIES.map((cat) => (
                    <div key={cat.symbol} className="flex gap-1.5">
                      <span className={`font-bold shrink-0 ${cat.color}`}>{cat.symbol}</span>
                      <span className="text-muted-foreground truncate">{cat.keys}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-blue-400 mb-2">{t('outputTitle')}</p>
                <div className="flex flex-wrap gap-2 text-sm">
                  {OUTPUT_CODES.map((item) => (
                    <span key={item.code} className="flex items-center gap-1.5">
                      <span className={`font-mono font-bold px-1.5 py-0.5 rounded ${item.color}`}>{item.code}</span>
                      <span className="text-muted-foreground">{t(`outputDesc${item.code === '.' ? 'Dot' : item.code === 'd' ? 'D' : item.code}` as 'outputDesc0')}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* T/G 함수 테이블 */}
              <div className="grow min-h-0 overflow-y-auto">
                <HangulTransferTable
                  highlight={highlight}
                  onToggleHighlight={toggleHighlight}
                />
              </div>
            </motion.div>
          ) : mode === 'interactive' ? (
            <motion.div
              key="interactive"
              className="flex flex-col gap-4 h-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <InputField
                value={input}
                onChange={(v) => { setInput(v); playback.reset() }}
                placeholder={t('inputPlaceholder')}
                validSymbols={SYMBOLS_IN}
                examples={EXAMPLES}
              />

              {input && !error && (
                <>
                  <PlaybackControls
                    isPlaying={playback.isPlaying}
                    isAtStart={playback.isAtStart}
                    isAtEnd={playback.isAtEnd}
                    speed={playback.speed}
                    currentStep={playback.currentStep}
                    totalSteps={trace.length}
                    onPlay={playback.play}
                    onPause={playback.pause}
                    onStepForward={playback.stepForward}
                    onStepBackward={playback.stepBackward}
                    onReset={playback.reset}
                    onGoToEnd={playback.goToEnd}
                    onSpeedChange={playback.setSpeed}
                    speedLabel={tc('speed')}
                  />

                  <HangulDisplay
                    trace={trace}
                    currentStep={playback.currentStep}
                    finalResult={result}
                    title={t('hangulTitle')}
                  />

                  <CodePanel
                    code={syllableCode}
                    currentStep={playback.currentStep}
                    title={t('codeTitle')}
                    jamoMapping={jamoMapping}
                  />

                  <div className="grow min-h-0 overflow-y-auto">
                    <TraceTable
                      trace={trace}
                      currentStep={playback.currentStep}
                      type="hangul"
                      stepLabel={tc('step')}
                      fromLabel={tc('from')}
                      inputLabel={tc('input')}
                      toLabel={tc('to')}
                      outputLabel={tc('output')}
                      hangulLabel={tc('hangul')}
                    />
                  </div>
                </>
              )}

              {error && (
                <div className="text-red-400 text-sm p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  {error}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="realtime"
              className="flex flex-col gap-4 h-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <InputField
                value={input}
                onChange={(v) => { setInput(v); playback.reset() }}
                placeholder={t('inputPlaceholder')}
                validSymbols={SYMBOLS_IN}
                examples={EXAMPLES}
              />

              {input && !error && (
                <>
                  <HangulDisplay
                    trace={trace}
                    currentStep={trace.length - 1}
                    finalResult={result}
                    title={t('hangulTitle')}
                  />

                  <CodePanel
                    code={syllableCode}
                    currentStep={trace.length - 1}
                    title={t('codeTitle')}
                    jamoMapping={jamoMapping}
                  />
                </>
              )}

              {error && (
                <div className="text-red-400 text-sm p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  {error}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </Section>
  )
}
