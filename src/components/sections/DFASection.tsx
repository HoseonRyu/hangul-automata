'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
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
  const [input, setInput] = useState('')
  const { trace, error, result } = useDFATrace(dfaConfig, input)
  const playback = usePlayback({ totalSteps: trace.length })

  const currentStep = playback.currentStep
  const activeState =
    currentStep >= 0 ? trace[currentStep]?.toState : dfaConfig.start
  const activeEdge =
    currentStep >= 0 ? dfaEdges.find(
      (e) =>
        e.source === trace[currentStep]?.fromState &&
        e.target === trace[currentStep]?.toState &&
        (e.data as { symbols?: string[] })?.symbols?.includes(trace[currentStep]?.symbol)
    )?.id ?? null : null

  return (
    <Section id="dfa">
      <h2 className="text-4xl md:text-5xl font-bold mb-3">{t('title')}</h2>
      <p className="text-lg md:text-xl text-muted-foreground mb-5">{t('description')}</p>

      {/* Theory + Example — single card, 3 columns */}
      <div className="mb-5 p-6 lg:p-8 rounded-lg bg-muted/30 border border-border/50">
        <p className="text-lg font-medium mb-5">{t('theory')}</p>
        <div className="flex justify-around">
          {/* Formal definition */}
          <div className="text-base text-muted-foreground font-mono space-y-2.5">
            <div>{t('theoryQ')}</div>
            <div>{t('theorySigma')}</div>
            <div>{t('theoryDelta')}</div>
            <div>{t('theoryQ0')}</div>
            <div>{t('theoryF')}</div>
          </div>

          {/* Tuple values */}
          <div className="border-l border-border/30 pl-8">
            <p className="text-sm text-blue-400 mb-3">{t('exampleConfig')}</p>
            <div className="text-base font-mono space-y-2.5">
              <div><span className="text-muted-foreground">Q = </span>{'{ '}<span className="text-blue-400">q0</span>{', '}<span className="text-blue-400">q1</span>{', '}<span className="text-blue-400">q2</span>{' }'}</div>
              <div><span className="text-muted-foreground">Σ = </span>{'{ '}<span className="text-foreground">0</span>{', '}<span className="text-foreground">1</span>{' }'}</div>
              <div><span className="text-muted-foreground">q₀ = </span><span className="text-blue-400">q0</span></div>
              <div><span className="text-muted-foreground">F = </span>{'{ '}<span className="text-green-400">q1</span>{', '}<span className="text-green-400">q2</span>{' }'}</div>
            </div>
          </div>

          {/* Delta */}
          <div className="border-l border-border/30 pl-8">
            <p className="text-sm text-muted-foreground mb-3">{t('exampleDelta')}</p>
            <div className="text-base font-mono space-y-1.5">
              <div><span className="text-muted-foreground">δ(</span>q0, 0<span className="text-muted-foreground">) = </span>q1</div>
              <div><span className="text-muted-foreground">δ(</span>q0, 1<span className="text-muted-foreground">) = </span>q2</div>
              <div><span className="text-muted-foreground">δ(</span>q1, 0<span className="text-muted-foreground">) = </span>q1</div>
              <div><span className="text-muted-foreground">δ(</span>q1, 1<span className="text-muted-foreground">) = </span>q2</div>
              <div><span className="text-muted-foreground">δ(</span>q2, 0<span className="text-muted-foreground">) = </span>q0</div>
              <div><span className="text-muted-foreground">δ(</span>q2, 1<span className="text-muted-foreground">) = </span>q1</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive demo — graph 2:1 controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <AutomataGraph
          className="lg:col-span-2"
          initialNodes={dfaNodes}
          initialEdges={dfaEdges}
          activeState={activeState}
          activeEdgeId={activeEdge}
        />

        <div
          className="flex flex-col gap-3 h-[360px] overflow-y-auto"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.3) transparent' }}
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

              {playback.isFinished && result !== null && (
                <Badge
                  variant={result ? 'default' : 'destructive'}
                  className="self-center text-lg px-5 py-1.5"
                >
                  {result ? t('accepted') : t('rejected')}
                </Badge>
              )}

              <TraceTable
                trace={trace}
                currentStep={currentStep}
                type="dfa"
                stepLabel={tc('step')}
                fromLabel={tc('from')}
                inputLabel={tc('input')}
                toLabel={tc('to')}
                resultLabel={tc('result')}
              />
            </>
          )}

          {error && (
            <div className="text-red-400 text-base p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              {error}
            </div>
          )}
        </div>
      </div>
    </Section>
  )
}
