import { MealyMachine } from '@/lib/automata/mealy-machine'
import type { HangulTraceStep } from '@/lib/automata/types'
import { STATES, SYMBOLS_IN, SYMBOLS_OUT, TRANSFERS_ME, START } from './constants'
import { convertToHangul, hangulChar } from './utils'

export class HangulConverter {
  private machine: MealyMachine

  constructor() {
    this.machine = new MealyMachine({
      states: STATES,
      symbolsIn: SYMBOLS_IN,
      symbolsOut: SYMBOLS_OUT,
      transfers: TRANSFERS_ME,
      start: START,
    })
  }

  convert(query: string): string {
    const syllableCode = this.machine.sequence(query)
    return convertToHangul(query, syllableCode)
  }

  traceConvert(query: string): HangulTraceStep[] {
    const mealyTrace = this.machine.traceSequence(query)
    const trace: HangulTraceStep[] = []

    for (let i = 0; i < mealyTrace.length; i++) {
      const step = mealyTrace[i]
      const queryUpToNow = query.slice(0, i + 1)
      const codeUpToNow = step.cumulativeOutput

      // Check if dokkaebi happens (output contains 'd')
      const isDokkaebi = step.output.includes('d')

      // Compute partial hangul from the cumulative state
      let currentHangul = ''
      try {
        currentHangul = this.computePartialHangul(queryUpToNow, codeUpToNow)
      } catch {
        currentHangul = ''
      }

      // Build processed syllable code for display
      let processedCode = ''
      for (const c of codeUpToNow) {
        if (c === 'd') {
          processedCode = processedCode.slice(0, -1)
        } else {
          processedCode += c
        }
      }

      trace.push({
        ...step,
        currentHangul,
        syllableCode: processedCode,
        isDokkaebi,
      })
    }

    return trace
  }

  private computePartialHangul(query: string, code: string): string {
    // Process 'd' codes
    let codeNew = ''
    for (const c of code) {
      if (c === 'd') {
        codeNew = codeNew.slice(0, -1)
      } else {
        codeNew += c
      }
    }

    const codeNoDot = codeNew.replace(/\./g, '')
    const segments = codeNew.split('.')
    const lenList = segments.map(s => s.length)

    let idx = 0
    let output = ''
    for (let si = 0; si < lenList.length; si++) {
      const len = lenList[si]
      const segQuery = query.slice(idx, idx + len)
      const segCode = codeNoDot.slice(idx, idx + len)
      idx += len

      if (segCode.length === 0) continue

      // For the last segment, it might be incomplete (no vowel yet)
      if (si === lenList.length - 1 && !segCode.includes('1')) {
        // Only consonant so far — show the raw character
        output += segQuery
      } else {
        const char = hangulChar(segQuery, segCode)
        output += char || segQuery
      }
    }

    return output
  }

  getStartState(): string {
    return 'S'
  }
}
