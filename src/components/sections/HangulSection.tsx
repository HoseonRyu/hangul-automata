'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Section } from '@/components/layout/Section'
import { AutomataGraph } from '@/components/graph/AutomataGraph'
import { InputField } from '@/components/controls/InputField'
import { PlaybackControls } from '@/components/controls/PlaybackControls'
import { TraceTable } from '@/components/panels/TraceTable'
import { CodePanel } from '@/components/panels/CodePanel'
import { HangulDisplay } from '@/components/panels/HangulDisplay'
import { hangulNodes, hangulEdges } from '@/lib/graph/hangul-config'
import { SYMBOLS_IN } from '@/lib/hangul/constants'
import { useHangulTrace } from '@/hooks/useAutomataTrace'
import { usePlayback } from '@/hooks/usePlayback'

export function HangulSection() {
  const t = useTranslations('hangul')
  const tc = useTranslations('common')
  const [input, setInput] = useState('')
  const { trace, error, result } = useHangulTrace(input)
  const playback = usePlayback({ totalSteps: trace.length })

  const currentStep = playback.currentStep
  const activeState =
    currentStep >= 0 ? trace[currentStep]?.toState : 'S'

  // Find matching edge
  const activeEdge =
    currentStep >= 0
      ? hangulEdges.find(
          (e) =>
            e.source === trace[currentStep]?.fromState &&
            e.target === trace[currentStep]?.toState &&
            (e.data as { symbols?: string[] })?.symbols?.includes(trace[currentStep]?.symbol)
        )?.id ?? null
      : null

  const isDokkaebi = currentStep >= 0 ? trace[currentStep]?.isDokkaebi : false
  const syllableCode = currentStep >= 0 ? trace[currentStep]?.syllableCode ?? '' : ''

  return (
    <Section id="hangul">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('title')}</h2>
      <p className="text-muted-foreground mb-8 max-w-3xl">{t('description')}</p>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <AutomataGraph
            initialNodes={hangulNodes}
            initialEdges={hangulEdges}
            activeState={activeState}
            activeEdgeId={activeEdge}
            isDokkaebi={isDokkaebi}
            className="!h-[500px]"
          />
        </div>

        <div className="lg:col-span-2 flex flex-col gap-4">
          <InputField
            value={input}
            onChange={(v) => { setInput(v); playback.reset() }}
            placeholder={t('inputPlaceholder')}
            validSymbols={SYMBOLS_IN}
            examples={[
              { label: 'dkssud → 안녕', value: 'dkssud' },
              { label: 'tjltkd → 세상', value: 'tjltkd' },
              { label: 'gksrmf → 한글', value: 'gksrmf' },
              { label: 'dkssudgkTwjd → 안녕하세요', value: 'dkssudgkTwjd' },
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

              <HangulDisplay
                trace={trace}
                currentStep={currentStep}
                finalResult={result}
                title={t('hangulTitle')}
              />

              <CodePanel
                code={syllableCode}
                currentStep={currentStep}
                title={t('codeTitle')}
              />

              <TraceTable
                trace={trace}
                currentStep={currentStep}
                type="hangul"
                stepLabel={tc('step')}
                fromLabel={tc('from')}
                inputLabel={tc('input')}
                toLabel={tc('to')}
                outputLabel={tc('output')}
                hangulLabel={tc('hangul')}
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
