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
      <h2 className="text-4xl md:text-5xl font-bold mb-5">{t('title')}</h2>
      <p className="text-lg md:text-xl text-muted-foreground mb-4">{t('description')}</p>
      <p className="text-base text-muted-foreground mb-6 italic">{t('diff')}</p>

      {/* Theory + Example 6-tuple side by side */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-lg bg-muted/30 border border-border/50">
          <p className="text-base md:text-lg font-medium mb-3">{t('theory')}</p>
          <ul className="text-base text-muted-foreground space-y-1.5 font-mono">
            <li>{t('theoryS')}</li>
            <li>{t('theoryS0')}</li>
            <li>{t('theorySigma')}</li>
            <li>{t('theoryLambda')}</li>
            <li>{t('theoryT')}</li>
            <li>{t('theoryG')}</li>
          </ul>
        </div>

        <div className="p-5 rounded-lg bg-blue-500/5 border border-blue-500/20">
          <p className="text-base md:text-lg font-medium mb-3 text-blue-400">{t('exampleConfig')}</p>
          <ul className="text-base space-y-1.5 font-mono">
            <li>
              <span className="text-muted-foreground">S = </span>
              {'{ '}
              <span className="text-blue-400">q0</span>
              {', '}
              <span className="text-blue-400">q1</span>
              {', '}
              <span className="text-blue-400">q2</span>
              {' }'}
            </li>
            <li>
              <span className="text-muted-foreground">S₀ = </span>
              <span className="text-blue-400">q0</span>
            </li>
            <li>
              <span className="text-muted-foreground">Σ = </span>
              {'{ '}
              <span className="text-foreground">0</span>
              {', '}
              <span className="text-foreground">1</span>
              {' }'}
            </li>
            <li>
              <span className="text-muted-foreground">Λ = </span>
              {'{ '}
              <span className="text-green-400">a</span>
              {', '}
              <span className="text-green-400">b</span>
              {', '}
              <span className="text-green-400">c</span>
              {', '}
              <span className="text-green-400">d</span>
              {' }'}
            </li>
          </ul>
          <div className="mt-3 pt-3 border-t border-blue-500/10 grid grid-cols-2 gap-x-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">{t('exampleT')}</p>
              <div className="space-y-0.5 text-base font-mono">
                <div><span className="text-muted-foreground">T(</span>q0, 0<span className="text-muted-foreground">) = </span>q1</div>
                <div><span className="text-muted-foreground">T(</span>q0, 1<span className="text-muted-foreground">) = </span>q1</div>
                <div><span className="text-muted-foreground">T(</span>q1, 0<span className="text-muted-foreground">) = </span>q1</div>
                <div><span className="text-muted-foreground">T(</span>q1, 1<span className="text-muted-foreground">) = </span>q2</div>
                <div><span className="text-muted-foreground">T(</span>q2, 0<span className="text-muted-foreground">) = </span>q0</div>
                <div><span className="text-muted-foreground">T(</span>q2, 1<span className="text-muted-foreground">) = </span>q0</div>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">{t('exampleG')}</p>
              <div className="space-y-0.5 text-base font-mono">
                <div><span className="text-muted-foreground">G(</span>q0, 0<span className="text-muted-foreground">) = </span><span className="text-green-400">a</span></div>
                <div><span className="text-muted-foreground">G(</span>q0, 1<span className="text-muted-foreground">) = </span><span className="text-green-400">a</span></div>
                <div><span className="text-muted-foreground">G(</span>q1, 0<span className="text-muted-foreground">) = </span><span className="text-green-400">b</span></div>
                <div><span className="text-muted-foreground">G(</span>q1, 1<span className="text-muted-foreground">) = </span><span className="text-green-400">c</span></div>
                <div><span className="text-muted-foreground">G(</span>q2, 0<span className="text-muted-foreground">) = </span><span className="text-green-400">d</span></div>
                <div><span className="text-muted-foreground">G(</span>q2, 1<span className="text-muted-foreground">) = </span><span className="text-green-400">d</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
