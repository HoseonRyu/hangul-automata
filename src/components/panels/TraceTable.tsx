'use client'

import type { DFATraceStep, MealyTraceStep, HangulTraceStep } from '@/lib/automata/types'

type TraceStep = DFATraceStep | MealyTraceStep | HangulTraceStep

interface TraceTableProps {
  trace: TraceStep[]
  currentStep: number
  type: 'dfa' | 'mealy' | 'hangul'
  className?: string
  stepLabel?: string
  fromLabel?: string
  inputLabel?: string
  toLabel?: string
  outputLabel?: string
  resultLabel?: string
  hangulLabel?: string
}

export function TraceTable({
  trace,
  currentStep,
  type,
  className = '',
  stepLabel = 'Step',
  fromLabel = 'From',
  inputLabel = 'Input',
  toLabel = 'To',
  outputLabel = 'Output',
  resultLabel = 'Result',
  hangulLabel = 'Hangul',
}: TraceTableProps) {
  if (trace.length === 0) return null

  return (
    <div className={`rounded-lg border border-border overflow-hidden h-full flex flex-col ${className}`}>
      <div className="overflow-x-auto overflow-y-auto flex-1 min-h-0">
        <table className="w-full text-base">
          <thead className="sticky top-0">
            <tr className="bg-muted/50 text-muted-foreground text-sm">
              <th className="px-3 py-2 text-center">{stepLabel}</th>
              <th className="px-3 py-2 text-center">{fromLabel}</th>
              <th className="px-3 py-2 text-center">{inputLabel}</th>
              <th className="px-3 py-2 text-center">{toLabel}</th>
              {type !== 'dfa' && <th className="px-3 py-2 text-center">{outputLabel}</th>}
              {type === 'dfa' && <th className="px-3 py-2 text-center">{resultLabel}</th>}
              {type === 'hangul' && <th className="px-3 py-2 text-center">{hangulLabel}</th>}
            </tr>
          </thead>
          <tbody className="font-mono">
            {trace.map((step, i) => {
              const isActive = i === currentStep
              const isPast = i < currentStep
              const isFuture = i > currentStep

              return (
                <tr
                  key={i}
                  className={`
                    border-t border-border/50 transition-colors
                    ${isActive ? 'bg-blue-500/15 text-blue-400' : ''}
                    ${isPast ? 'text-foreground/60' : ''}
                    ${isFuture ? 'text-muted-foreground/30' : ''}
                  `}
                >
                  <td className="px-3 py-1.5 text-center text-sm">{i + 1}</td>
                  <td className="px-3 py-1.5 text-center">{step.fromState}</td>
                  <td className="px-3 py-1.5 text-center font-bold">{step.symbol}</td>
                  <td className="px-3 py-1.5 text-center">{step.toState}</td>
                  {type === 'dfa' && (
                    <td className="px-3 py-1.5 text-center">
                      {(step as DFATraceStep).isFinal ? (
                        <span className="text-green-400">Accept</span>
                      ) : (
                        <span className="text-red-400">Reject</span>
                      )}
                    </td>
                  )}
                  {type === 'mealy' && (
                    <td className="px-3 py-1.5 text-center">
                      {(step as MealyTraceStep).output}
                    </td>
                  )}
                  {type === 'hangul' && (
                    <>
                      <td className="px-3 py-1.5 text-center">
                        {(step as HangulTraceStep).output}
                      </td>
                      <td className="px-3 py-1.5 text-center">
                        {(step as HangulTraceStep).currentHangul}
                      </td>
                    </>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
