import type { DFAConfig, DFATraceStep } from './types'

class State {
  name: string
  trans: Map<string, State> = new Map()
  isFinal: boolean = false

  constructor(name: string) {
    this.name = name
  }

  setFinal() {
    this.isFinal = true
  }

  setTrans(symbol: string, next: State) {
    if (this.trans.has(symbol)) {
      throw new Error(`duplicated domain: ${symbol}`)
    }
    this.trans.set(symbol, next)
  }

  next(symbol: string): State | null {
    return this.trans.get(symbol) ?? null
  }
}

export class DFA {
  private states: Map<string, State> = new Map()
  private start: State
  private symbols: string

  constructor(config: DFAConfig) {
    const { states, symbols, transfers, start, final: finals } = config
    this.symbols = symbols

    for (const name of states) {
      const state = new State(name)
      if (finals.includes(name)) {
        state.setFinal()
      }
      this.states.set(name, state)
    }

    this.start = this.states.get(start)!

    for (const [from, symbol, to] of transfers) {
      if (!this.symbols.includes(symbol)) {
        throw new Error(`unexpected symbol in transfer: ${symbol}`)
      }
      this.states.get(from)!.setTrans(symbol, this.states.get(to)!)
    }
  }

  sequence(query: string): boolean {
    let curr: State | null = this.start
    for (const s of query) {
      if (!curr) throw new Error('unexpected null state')
      curr = curr.next(s)
      if (curr === null) {
        throw new Error(`unexpected transfer`)
      }
    }
    return curr!.isFinal
  }

  traceSequence(query: string): DFATraceStep[] {
    const trace: DFATraceStep[] = []
    let curr: State = this.start
    for (const s of query) {
      const fromState = curr.name
      const next = curr.next(s)
      if (next === null) {
        throw new Error(`unexpected transfer: ${fromState}(${s})`)
      }
      curr = next
      trace.push({
        fromState,
        symbol: s,
        toState: curr.name,
        isFinal: curr.isFinal,
      })
    }
    return trace
  }

  getStartState(): string {
    return this.start.name
  }

  isFinalState(stateName: string): boolean {
    return this.states.get(stateName)?.isFinal ?? false
  }
}
