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
import { hangulNodes, hangulEdges, hangulGroupNodes } from '@/lib/graph/hangul-config'
import { SYMBOLS_IN } from '@/lib/hangul/constants'
import { useHangulTrace } from '@/hooks/useAutomataTrace'
import { usePlayback } from '@/hooks/usePlayback'

const allNodes = [...hangulGroupNodes, ...hangulNodes]

const categories = [
  { symbol: 'C', desc: 'All consonants', keys: 'r,s,e,f,a,q,t,d,w,c,z,x,v,g + R,E,Q,T,W' },
  { symbol: 'c', desc: 'Single consonants', keys: 'r,s,e,f,a,q,t,d,w,c,z,x,v,g' },
  { symbol: 'D', desc: 'Double consonants', keys: 'R,E,Q,T,W' },
  { symbol: 'a', desc: 'Simple vowels', keys: 'k,i,j,u,m' },
  { symbol: 'o', desc: 'Compound vowel starters', keys: 'h(ㅗ), n(ㅜ)' },
  { symbol: 'v', desc: 'Terminal vowels', keys: 'y,b,l,o,O,p,P' },
  { symbol: 'V', desc: 'All vowels', keys: 'a + o + v' },
] as const

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
      <h2 className="text-4xl md:text-5xl font-bold mb-5">{t('title')}</h2>
      <p className="text-lg md:text-xl text-muted-foreground mb-6">{t('description')}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="rounded-lg border border-border bg-background/50 p-4">
          <h4 className="text-sm font-semibold text-muted-foreground mb-2">{t('regexTitle')}</h4>
          <p className="font-mono text-sm leading-relaxed">
            S = [ C · (a + o<sub>h</sub> + o<sub>n</sub> + v<sub>t</sub>) · (c + D + &Lambda;) ]*
          </p>
        </div>
        <div className="rounded-lg border border-border bg-background/50 p-4">
          <h4 className="text-sm font-semibold text-muted-foreground mb-2">{t('legendTitle')}</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-mono">
            {categories.map((cat) => (
              <div key={cat.symbol} className="flex gap-1.5">
                <span className="font-bold text-foreground shrink-0">{cat.symbol}</span>
                <span className="text-muted-foreground truncate">{cat.keys}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <AutomataGraph
            initialNodes={allNodes}
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
              { label: 'tptkd → 세상', value: 'tptkd' },
              { label: 'gksrmf → 한글', value: 'gksrmf' },
              { label: 'dkssudgktpdy → 안녕하세요', value: 'dkssudgktpdy' },
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
