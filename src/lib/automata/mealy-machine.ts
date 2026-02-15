import type { MealyConfig, MealyTraceStep } from './types'

class State {
  name: string
  trans: Map<string, { next: State; output: string }> = new Map()

  constructor(name: string) {
    this.name = name
  }

  setTrans(symbol: string, next: State, output: string) {
    if (this.trans.has(symbol)) {
      throw new Error(`duplicated domain: ${symbol}`)
    }
    this.trans.set(symbol, { next, output })
  }

  next(symbol: string): { next: State; output: string } | null {
    return this.trans.get(symbol) ?? null
  }
}

export class MealyMachine {
  private states: Map<string, State> = new Map()
  private start: State
  private symbolsIn: string
  private symbolsOut: string

  constructor(config: MealyConfig) {
    const { states, symbolsIn, symbolsOut, transfers, start } = config
    this.symbolsIn = symbolsIn
    this.symbolsOut = symbolsOut

    for (const name of states) {
      this.states.set(name, new State(name))
    }

    this.start = this.states.get(start)!

    for (const [froms, symbols, to, output] of transfers) {
      for (const c of output) {
        if (!this.symbolsOut.includes(c)) {
          throw new Error(`unexpected output in transfer: ${c} is not in ${this.symbolsOut}`)
        }
      }
      const fromList = Array.isArray(froms) ? froms : [froms]
      for (const from of fromList) {
        for (const symbol of symbols) {
          if (!this.symbolsIn.includes(symbol)) {
            throw new Error(`unexpected symbol in transfer: ${symbol} is not in ${this.symbolsIn}`)
          }
          this.states.get(from)!.setTrans(symbol, this.states.get(to)!, output)
        }
      }
    }
  }

  sequence(query: string): string {
    let output = ''
    let curr: State = this.start
    for (const s of query) {
      const result = curr.next(s)
      if (result === null) {
        throw new Error(`unexpected transfer: ${curr.name}(${s})`)
      }
      curr = result.next
      output += result.output
    }
    return output
  }

  traceSequence(query: string): MealyTraceStep[] {
    const trace: MealyTraceStep[] = []
    let curr: State = this.start
    let cumulative = ''
    for (const s of query) {
      const fromState = curr.name
      const result = curr.next(s)
      if (result === null) {
        throw new Error(`unexpected transfer: ${fromState}(${s})`)
      }
      curr = result.next
      cumulative += result.output
      trace.push({
        fromState,
        symbol: s,
        toState: curr.name,
        output: result.output,
        cumulativeOutput: cumulative,
      })
    }
    return trace
  }

  getStartState(): string {
    return this.start.name
  }
}
