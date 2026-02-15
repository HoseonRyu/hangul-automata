'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
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
  const [input, setInput] = useState('')
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

  return (
    <Section id="mealy">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('title')}</h2>
      <p className="text-muted-foreground mb-4">{t('description')}</p>
      <p className="text-sm text-muted-foreground mb-6 italic">{t('diff')}</p>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <AutomataGraph
            initialNodes={mealyNodes}
            initialEdges={mealyEdges}
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
