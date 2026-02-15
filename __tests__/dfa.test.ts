import { describe, it, expect } from 'vitest'
import { DFA } from '@/lib/automata/dfa'

const config = {
  states: ['q1', 'q2', 'q3'],
  symbols: '01',
  transfers: [
    ['q1', '0', 'q2'],
    ['q2', '0', 'q2'],
    ['q2', '1', 'q3'],
    ['q3', '0', 'q1'],
  ] as [string, string, string][],
  start: 'q1',
  final: ['q2', 'q3'],
}

describe('DFA', () => {
  it('should accept "00100010"', () => {
    const dfa = new DFA(config)
    expect(dfa.sequence('00100010')).toBe(true)
  })

  it('should accept "0" (transitions to q2 which is final)', () => {
    const dfa = new DFA(config)
    expect(dfa.sequence('0')).toBe(true)
  })

  it('should accept "01" (transitions to q3 which is final)', () => {
    const dfa = new DFA(config)
    expect(dfa.sequence('01')).toBe(true)
  })

  it('should reject "010" (transitions q1→q2→q3→q1, not final)', () => {
    const dfa = new DFA(config)
    expect(dfa.sequence('010')).toBe(false)
  })

  it('should produce correct trace', () => {
    const dfa = new DFA(config)
    const trace = dfa.traceSequence('001')
    expect(trace).toHaveLength(3)
    expect(trace[0]).toEqual({ fromState: 'q1', symbol: '0', toState: 'q2', isFinal: true })
    expect(trace[1]).toEqual({ fromState: 'q2', symbol: '0', toState: 'q2', isFinal: true })
    expect(trace[2]).toEqual({ fromState: 'q2', symbol: '1', toState: 'q3', isFinal: true })
  })

  it('should throw on invalid symbol', () => {
    const dfa = new DFA(config)
    expect(() => dfa.sequence('2')).toThrow()
  })
})
