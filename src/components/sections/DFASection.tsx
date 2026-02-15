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
      <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('title')}</h2>
      <p className="text-muted-foreground mb-6">{t('description')}</p>

      {/* Theory */}
      <div className="mb-8 p-4 rounded-lg bg-muted/30 border border-border/50">
        <p className="text-sm font-medium mb-2">{t('theory')}</p>
        <ul className="text-sm text-muted-foreground space-y-1 font-mono">
          <li>{t('theoryQ')}</li>
          <li>{t('theorySigma')}</li>
          <li>{t('theoryDelta')}</li>
          <li>{t('theoryQ0')}</li>
          <li>{t('theoryF')}</li>
        </ul>
      </div>

      {/* Interactive demo */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <AutomataGraph
            initialNodes={dfaNodes}
            initialEdges={dfaEdges}
            activeState={activeState}
            activeEdgeId={activeEdge}
          />
        </div>

        <div className="lg:col-span-2 flex flex-col gap-4">
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
                  className="self-center text-base px-4 py-1"
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
            <div className="text-red-400 text-sm p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              {error}
            </div>
          )}
        </div>
      </div>
    </Section>
  )
}
