export interface DFAConfig {
  states: string[]
  symbols: string
  transfers: [string, string, string][] // [from, symbol, to]
  start: string
  final: string[]
}

export interface MealyConfig {
  states: string[]
  symbolsIn: string
  symbolsOut: string
  transfers: [string | string[], string, string, string][] // [from, symbols, to, output]
  start: string
}

export interface DFATraceStep {
  fromState: string
  symbol: string
  toState: string
  isFinal: boolean
}

export interface MealyTraceStep {
  fromState: string
  symbol: string
  toState: string
  output: string
  cumulativeOutput: string
}

export interface HangulTraceStep extends MealyTraceStep {
  currentHangul: string
  syllableCode: string
  isDokkaebi: boolean
}
