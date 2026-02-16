'use client'

import { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'motion/react'
import { Section } from '@/components/layout/Section'
import { AutomataGraph } from '@/components/graph/AutomataGraph'
import { InputField } from '@/components/controls/InputField'
import { PlaybackControls } from '@/components/controls/PlaybackControls'
import { TraceTable } from '@/components/panels/TraceTable'
import { OutputPanel } from '@/components/panels/OutputPanel'
import { mealyNodes, mealyEdges, mealyConfig } from '@/lib/graph/mealy-config'
import { useMealyTrace } from '@/hooks/useAutomataTrace'
import { usePlayback } from '@/hooks/usePlayback'

export function MealySection() {
  const t = useTranslations('mealy')
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
  const { trace, error, output } = useMealyTrace(mealyConfig, input)
  const playback = usePlayback({ totalSteps: trace.length })

  const currentStep = playback.currentStep
  const activeState =
    currentStep >= 0 ? trace[currentStep]?.toState : mealyConfig.start
  const activeEdge =
    currentStep >= 0 ? mealyEdges.find(
      (e) =>
        e.source === trace[currentStep]?.fromState &&
        e.target === trace[currentStep]?.toState &&
        (e.data as { symbols?: string[] })?.symbols?.includes(trace[currentStep]?.symbol)
    )?.id ?? null : null

  const visibleOutput = currentStep >= 0
    ? trace[currentStep]?.cumulativeOutput ?? ''
    : ''

  const handleModeChange = (newMode: 'explain' | 'interactive') => {
    setMode(newMode)
    setHighlight(null)
    if (newMode === 'explain') {
      setInput('')
      playback.reset()
    }
  }

  const allEdgeIds = mealyEdges.map((e) => e.id)
  const hlClass = (key: string) =>
    highlight?.key === key
      ? 'ring-1 ring-emerald-500/50 bg-emerald-500/10 rounded'
      : ''
  const btnBase = 'cursor-pointer transition-all duration-200 hover:bg-emerald-500/5 rounded px-1 -mx-1'

  return (
    <Section id="mealy">
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
      <p className="text-lg md:text-xl text-muted-foreground mb-4">{t('description')}</p>
      <p className="text-base text-muted-foreground mb-6 italic">{t('diff')}</p>

      <div className="grid grid-cols-1 lg:grid-cols-5 lg:h-[70vh] gap-5">
        {/* Graph — always same position */}
        <div className="lg:col-span-3">
          <AutomataGraph
            className="!h-full"
            initialNodes={mealyNodes}
            initialEdges={mealyEdges}
            activeState={mode === 'explain' ? (highlight ? null : mealyConfig.start) : activeState}
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
              {/* Mealy 정의 */}
              <div className="p-5 rounded-lg bg-muted/30 border border-border/50 grow">
                <p className="text-lg font-medium mb-4">{t('theory')}</p>
                <ul className="text-base text-muted-foreground space-y-2 font-mono">
                  <li>{t('theoryS')}</li>
                  <li>{t('theoryS0')}</li>
                  <li>{t('theorySigma')}</li>
                  <li>{t('theoryLambda')}</li>
                  <li>{t('theoryT')}</li>
                  <li>{t('theoryG')}</li>
                </ul>
              </div>

              {/* 6-tuple 구성 + 전이/출력 함수 (하나의 카드) */}
              <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20 grow overflow-y-auto">
                <p className="text-sm text-blue-400 mb-3">{t('exampleConfig')}</p>
                <div className="text-base space-y-1.5 font-mono">
                  <button type="button" className={`${btnBase} ${hlClass('S')} block text-left w-full`} onClick={() => toggleHighlight('S', ['q0', 'q1', 'q2'])}>
                    <span className="text-muted-foreground">S = </span>
                    {'{ '}<span className="text-blue-400">q0</span>{', '}<span className="text-blue-400">q1</span>{', '}<span className="text-blue-400">q2</span>{' }'}
                  </button>
                  <button type="button" className={`${btnBase} ${hlClass('S0')} block text-left w-full`} onClick={() => toggleHighlight('S0', ['q0'])}>
                    <span className="text-muted-foreground">S{'\u2080'} = </span>
                    <span className="text-blue-400">q0</span>
                  </button>
                  <button type="button" className={`${btnBase} ${hlClass('Σ')} block text-left w-full`} onClick={() => toggleHighlight('Σ', undefined, allEdgeIds)}>
                    <span className="text-muted-foreground">{'\u03A3'} = </span>
                    {'{ '}<span className="text-foreground">0</span>{', '}<span className="text-foreground">1</span>{' }'}
                  </button>
                  <button type="button" className={`${btnBase} ${hlClass('Λ')} block text-left w-full`} onClick={() => toggleHighlight('Λ', undefined, allEdgeIds)}>
                    <span className="text-muted-foreground">{'\u039B'} = </span>
                    {'{ '}<span className="text-green-400">a</span>{', '}<span className="text-green-400">b</span>{', '}<span className="text-green-400">c</span>{', '}<span className="text-green-400">d</span>{' }'}
                  </button>
                </div>

                <div className="mt-3 pt-3 border-t border-blue-500/10 grid grid-cols-2 gap-x-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{t('exampleT')}</p>
                    <div className="space-y-0.5 text-base font-mono">
                      <button type="button" className={`${btnBase} ${hlClass('T-q0-0')} block text-left w-full`} onClick={() => toggleHighlight('T-q0-0', ['q0', 'q1'], ['q0-01-q1'])}>
                        <span className="text-muted-foreground">T(</span>q0, 0<span className="text-muted-foreground">) = </span>q1
                      </button>
                      <button type="button" className={`${btnBase} ${hlClass('T-q0-1')} block text-left w-full`} onClick={() => toggleHighlight('T-q0-1', ['q0', 'q1'], ['q0-01-q1'])}>
                        <span className="text-muted-foreground">T(</span>q0, 1<span className="text-muted-foreground">) = </span>q1
                      </button>
                      <button type="button" className={`${btnBase} ${hlClass('T-q1-0')} block text-left w-full`} onClick={() => toggleHighlight('T-q1-0', ['q1'], ['q1-0-q1'])}>
                        <span className="text-muted-foreground">T(</span>q1, 0<span className="text-muted-foreground">) = </span>q1
                      </button>
                      <button type="button" className={`${btnBase} ${hlClass('T-q1-1')} block text-left w-full`} onClick={() => toggleHighlight('T-q1-1', ['q1', 'q2'], ['q1-1-q2'])}>
                        <span className="text-muted-foreground">T(</span>q1, 1<span className="text-muted-foreground">) = </span>q2
                      </button>
                      <button type="button" className={`${btnBase} ${hlClass('T-q2-0')} block text-left w-full`} onClick={() => toggleHighlight('T-q2-0', ['q2', 'q0'], ['q2-01-q0'])}>
                        <span className="text-muted-foreground">T(</span>q2, 0<span className="text-muted-foreground">) = </span>q0
                      </button>
                      <button type="button" className={`${btnBase} ${hlClass('T-q2-1')} block text-left w-full`} onClick={() => toggleHighlight('T-q2-1', ['q2', 'q0'], ['q2-01-q0'])}>
                        <span className="text-muted-foreground">T(</span>q2, 1<span className="text-muted-foreground">) = </span>q0
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{t('exampleG')}</p>
                    <div className="space-y-0.5 text-base font-mono">
                      <button type="button" className={`${btnBase} ${hlClass('G-q0-0')} block text-left w-full`} onClick={() => toggleHighlight('G-q0-0', ['q0', 'q1'], ['q0-01-q1'])}>
                        <span className="text-muted-foreground">G(</span>q0, 0<span className="text-muted-foreground">) = </span><span className="text-green-400">a</span>
                      </button>
                      <button type="button" className={`${btnBase} ${hlClass('G-q0-1')} block text-left w-full`} onClick={() => toggleHighlight('G-q0-1', ['q0', 'q1'], ['q0-01-q1'])}>
                        <span className="text-muted-foreground">G(</span>q0, 1<span className="text-muted-foreground">) = </span><span className="text-green-400">a</span>
                      </button>
                      <button type="button" className={`${btnBase} ${hlClass('G-q1-0')} block text-left w-full`} onClick={() => toggleHighlight('G-q1-0', ['q1'], ['q1-0-q1'])}>
                        <span className="text-muted-foreground">G(</span>q1, 0<span className="text-muted-foreground">) = </span><span className="text-green-400">b</span>
                      </button>
                      <button type="button" className={`${btnBase} ${hlClass('G-q1-1')} block text-left w-full`} onClick={() => toggleHighlight('G-q1-1', ['q1', 'q2'], ['q1-1-q2'])}>
                        <span className="text-muted-foreground">G(</span>q1, 1<span className="text-muted-foreground">) = </span><span className="text-green-400">c</span>
                      </button>
                      <button type="button" className={`${btnBase} ${hlClass('G-q2-0')} block text-left w-full`} onClick={() => toggleHighlight('G-q2-0', ['q2', 'q0'], ['q2-01-q0'])}>
                        <span className="text-muted-foreground">G(</span>q2, 0<span className="text-muted-foreground">) = </span><span className="text-green-400">d</span>
                      </button>
                      <button type="button" className={`${btnBase} ${hlClass('G-q2-1')} block text-left w-full`} onClick={() => toggleHighlight('G-q2-1', ['q2', 'q0'], ['q2-01-q0'])}>
                        <span className="text-muted-foreground">G(</span>q2, 1<span className="text-muted-foreground">) = </span><span className="text-green-400">d</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="interactive"
              className="flex flex-col gap-4 h-full rounded-lg border border-border/50 bg-muted/30 p-4"
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
                  { label: `${t('example')}: 00100010`, value: '00100010' },
                  { label: `${t('example')}: 0101`, value: '0101' },
                ]}
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

                  <OutputPanel
                    output={visibleOutput}
                    currentStep={currentStep}
                    title={t('outputTitle')}
                  />

                  <div className="grow min-h-0 overflow-y-auto">
                    <TraceTable
                      trace={trace}
                      currentStep={currentStep}
                      type="mealy"
                      stepLabel={tc('step')}
                      fromLabel={tc('from')}
                      inputLabel={tc('input')}
                      toLabel={tc('to')}
                      outputLabel={tc('output')}
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
          )}
        </div>
      </div>
    </Section>
  )
}
