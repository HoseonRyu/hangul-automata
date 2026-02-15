'use client'

import { useMemo } from 'react'
import { DFA } from '@/lib/automata/dfa'
import { MealyMachine } from '@/lib/automata/mealy-machine'
import { HangulConverter } from '@/lib/hangul/converter'
import type { DFAConfig, MealyConfig, DFATraceStep, MealyTraceStep, HangulTraceStep } from '@/lib/automata/types'

export function useDFATrace(config: DFAConfig, input: string) {
  return useMemo(() => {
    if (!input) return { trace: [] as DFATraceStep[], error: null, result: null }
    try {
      const dfa = new DFA(config)
      const trace = dfa.traceSequence(input)
      const result = dfa.sequence(input)
      return { trace, error: null, result }
    } catch (e) {
      return { trace: [] as DFATraceStep[], error: (e as Error).message, result: null }
    }
  }, [config, input])
}

export function useMealyTrace(config: MealyConfig, input: string) {
  return useMemo(() => {
    if (!input) return { trace: [] as MealyTraceStep[], error: null, output: '' }
    try {
      const mealy = new MealyMachine(config)
      const trace = mealy.traceSequence(input)
      const output = mealy.sequence(input)
      return { trace, error: null, output }
    } catch (e) {
      return { trace: [] as MealyTraceStep[], error: (e as Error).message, output: '' }
    }
  }, [config, input])
}

export function useHangulTrace(input: string) {
  return useMemo(() => {
    if (!input) return { trace: [] as HangulTraceStep[], error: null, result: '' }
    try {
      const converter = new HangulConverter()
      const trace = converter.traceConvert(input)
      const result = converter.convert(input)
      return { trace, error: null, result }
    } catch (e) {
      return { trace: [] as HangulTraceStep[], error: (e as Error).message, result: '' }
    }
  }, [input])
}
