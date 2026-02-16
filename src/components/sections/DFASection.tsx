'use client'

import { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'motion/react'
import { Section } from '@/components/layout/Section'
import { AutomataGraph } from '@/components/graph/AutomataGraph'
import { InputField } from '@/components/controls/InputField'
import { PlaybackControls } from '@/components/controls/PlaybackControls'
import { TraceTable } from '@/components/panels/TraceTable'
import { Badge } from '@/components/ui/badge'
import { dfaNodes, dfaEdges, dfaConfig } from '@/lib/graph/dfa-config'
import { useDFATrace } from '@/hooks/useAutomataTrace'
import { usePlayback } from '@/hooks/usePlayback'

export function DFASection() {
  const t = useTranslations('dfa')
  const tc = useTranslations('common')
  const [mode, setMode] = useState<'explain' | 'interactive'>('explain')
  const [input, setInput] = useState('')
  const [highlight, setHighlight] = useState<{
    key: string
    nodes?: string[]
    edges?: string[]
  } | null>(null)

  const toggleHighlight = useCallback((key: string, nodes?: string[], edges?: string[]) => {
    setHighlight((prev) => prev?.key === key ? null : { key, nodes, edges })
  }, [])
  const { trace, error, result } = useDFATrace(dfaConfig, input)
  const playback = usePlayback({ totalSteps: trace.length * 2 })

  const rawStep = playback.currentStep
  const traceIndex = rawStep >= 0 ? Math.floor(rawStep / 2) : -1
  const isTransition = rawStep >= 0 && rawStep % 2 === 0

  const activeState =
    traceIndex >= 0
      ? isTransition
        ? trace[traceIndex]?.fromState
        : trace[traceIndex]?.toState
      : dfaConfig.start
  const activeEdge =
    traceIndex >= 0 && isTransition
      ? dfaEdges.find(
          (e) =>
            e.source === trace[traceIndex]?.fromState &&
            e.target === trace[traceIndex]?.toState &&
            (e.data as { symbols?: string[] })?.symbols?.includes(trace[traceIndex]?.symbol)
        )?.id ?? null
      : null

  const handleModeChange = (newMode: 'explain' | 'interactive') => {
    setMode(newMode)
    setHighlight(null)
    if (newMode === 'explain') {
      setInput('')
      playback.reset()
    }
  }

  const allEdgeIds = dfaEdges.map((e) => e.id)
  const hlClass = (key: string) =>
    highlight?.key === key
      ? 'ring-1 ring-emerald-500/50 bg-emerald-500/10 rounded'
      : ''
  const btnBase = 'cursor-pointer transition-all duration-200 hover:bg-emerald-500/5 rounded px-1 -mx-1'

  return (
    <Section id="dfa">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-4xl md:text-5xl font-bold">{t('title')}</h2>
        <div className="flex gap-1 bg-muted/30 rounded-lg p-1">
          <button
            onClick={() => handleModeChange('explain')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              mode === 'explain'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tc('modeExplain')}
          </button>
          <button
            onClick={() => handleModeChange('interactive')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              mode === 'interactive'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tc('modeInteractive')}
          </button>
        </div>
      </div>
      <p className="text-lg md:text-xl text-muted-foreground mb-5">{t('description')}</p>

      <div className="grid grid-cols-1 lg:grid-cols-5 lg:h-[70vh] gap-5">
        {/* Graph — always same position */}
        <div className="lg:col-span-3">
          <AutomataGraph
            className="!h-full"
            initialNodes={dfaNodes}
            initialEdges={dfaEdges}
            activeState={mode === 'explain' ? (highlight ? null : dfaConfig.start) : activeState}
            activeEdgeId={mode === 'explain' ? null : activeEdge}
            highlightNodes={mode === 'explain' ? highlight?.nodes : undefined}
            highlightEdges={mode === 'explain' ? highlight?.edges : undefined}
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
              {/* DFA 정의 */}
              <div className="p-5 rounded-lg bg-muted/30 border border-border/50 grow">
                <p className="text-lg font-medium mb-4">{t('theory')}</p>
                <div className="text-base text-muted-foreground font-mono space-y-2">
                  <div>{t('theoryQ')}</div>
                  <div>{t('theorySigma')}</div>
                  <div>{t('theoryDelta')}</div>
                  <div>{t('theoryQ0')}</div>
                  <div>{t('theoryF')}</div>
                </div>
              </div>

              {/* Tuple 구성 + 전이 함수 (하나의 카드) */}
              <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20 grow overflow-y-auto">
                <p className="text-sm text-blue-400 mb-3">{t('exampleConfig')}</p>
                <div className="text-base font-mono space-y-2">
                  <button type="button" className={`${btnBase} ${hlClass('Q')} block text-left w-full`} onClick={() => toggleHighlight('Q', ['q0', 'q1', 'q2'])}>
                    <span className="text-muted-foreground">Q = </span>{'{ '}<span className="text-blue-400">q0</span>{', '}<span className="text-blue-400">q1</span>{', '}<span className="text-blue-400">q2</span>{' }'}
                  </button>
                  <button type="button" className={`${btnBase} ${hlClass('Σ')} block text-left w-full`} onClick={() => toggleHighlight('Σ', undefined, allEdgeIds)}>
                    <span className="text-muted-foreground">{'\u03A3'} = </span>{'{ '}<span className="text-foreground">0</span>{', '}<span className="text-foreground">1</span>{' }'}
                  </button>
                  <button type="button" className={`${btnBase} ${hlClass('q0')} block text-left w-full`} onClick={() => toggleHighlight('q0', ['q0'])}>
                    <span className="text-muted-foreground">q{'\u2080'} = </span><span className="text-blue-400">q0</span>
                  </button>
                  <button type="button" className={`${btnBase} ${hlClass('F')} block text-left w-full`} onClick={() => toggleHighlight('F', ['q1', 'q2'])}>
                    <span className="text-muted-foreground">F = </span>{'{ '}<span className="text-green-400">q1</span>{', '}<span className="text-green-400">q2</span>{' }'}
                  </button>
                </div>

                <div className="mt-3 pt-3 border-t border-blue-500/10">
                  <p className="text-sm text-muted-foreground mb-2">{t('exampleDelta')}</p>
                  <div className="text-base font-mono space-y-1.5">
                    <button type="button" className={`${btnBase} ${hlClass('δ-q0-0')} block text-left w-full`} onClick={() => toggleHighlight('δ-q0-0', ['q0', 'q1'], ['q0-0-q1'])}>
                      <span className="text-muted-foreground">{'\u03B4'}(</span>q0, 0<span className="text-muted-foreground">) = </span>q1
                    </button>
                    <button type="button" className={`${btnBase} ${hlClass('δ-q0-1')} block text-left w-full`} onClick={() => toggleHighlight('δ-q0-1', ['q0', 'q2'], ['q0-1-q2'])}>
                      <span className="text-muted-foreground">{'\u03B4'}(</span>q0, 1<span className="text-muted-foreground">) = </span>q2
                    </button>
                    <button type="button" className={`${btnBase} ${hlClass('δ-q1-0')} block text-left w-full`} onClick={() => toggleHighlight('δ-q1-0', ['q1'], ['q1-0-q1'])}>
                      <span className="text-muted-foreground">{'\u03B4'}(</span>q1, 0<span className="text-muted-foreground">) = </span>q1
                    </button>
                    <button type="button" className={`${btnBase} ${hlClass('δ-q1-1')} block text-left w-full`} onClick={() => toggleHighlight('δ-q1-1', ['q1', 'q2'], ['q1-1-q2'])}>
                      <span className="text-muted-foreground">{'\u03B4'}(</span>q1, 1<span className="text-muted-foreground">) = </span>q2
                    </button>
                    <button type="button" className={`${btnBase} ${hlClass('δ-q2-0')} block text-left w-full`} onClick={() => toggleHighlight('δ-q2-0', ['q2', 'q0'], ['q2-0-q0'])}>
                      <span className="text-muted-foreground">{'\u03B4'}(</span>q2, 0<span className="text-muted-foreground">) = </span>q0
                    </button>
                    <button type="button" className={`${btnBase} ${hlClass('δ-q2-1')} block text-left w-full`} onClick={() => toggleHighlight('δ-q2-1', ['q2', 'q1'], ['q2-1-q1'])}>
                      <span className="text-muted-foreground">{'\u03B4'}(</span>q2, 1<span className="text-muted-foreground">) = </span>q1
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="interactive"
              className="flex flex-col gap-3 h-full rounded-lg border border-border/50 bg-muted/30 p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <InputField
                value={input}
                onChange={(v) => { setInput(v); playback.reset() }}
                placeholder={t('inputPlaceholder')}
                validSymbols="01"
                examples={[
                  { label: `${t('example')}: 00100`, value: '00100' },
                  { label: `${t('example')}: 0010`, value: '0010' },
                  { label: `${t('example')}: 001`, value: '001' },
                ]}
              />

              {input && !error && (
                <>
                  <PlaybackControls
                    isPlaying={playback.isPlaying}
                    isAtStart={playback.isAtStart}
                    isAtEnd={playback.isAtEnd}
                    speed={playback.speed}
                    currentStep={traceIndex}
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

                  {playback.isFinished && result !== null && (
                    <Badge
                      variant={result ? 'default' : 'destructive'}
                      className="self-center text-lg px-5 py-1.5"
                    >
                      {result ? t('accepted') : t('rejected')}
                    </Badge>
                  )}

                  <div className="grow min-h-0 overflow-y-auto">
                    <TraceTable
                      trace={trace}
                      currentStep={traceIndex}
                      type="dfa"
                      stepLabel={tc('step')}
                      fromLabel={tc('from')}
                      inputLabel={tc('input')}
                      toLabel={tc('to')}
                      resultLabel={tc('result')}
                    />
                  </div>
                </>
              )}

              {error && (
                <div className="text-red-400 text-base p-4 rounded-lg bg-red-500/10 border border-red-500/20">
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
