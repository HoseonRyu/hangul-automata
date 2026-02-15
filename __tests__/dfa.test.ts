import { describe, it, expect } from 'vitest'
import { DFA } from '@/lib/automata/dfa'

const config = {
  states: ['q0', 'q1', 'q2'],
  symbols: '01',
  transfers: [
    ['q0', '0', 'q1'],
    ['q1', '0', 'q1'],
    ['q1', '1', 'q2'],
    ['q2', '0', 'q0'],
  ] as [string, string, string][],
  start: 'q0',
  final: ['q1', 'q2'],
}

describe('DFA', () => {
  it('should reject "00100010" (ends at q0, not final)', () => {
    const dfa = new DFA(config)
    // q0→q1→q1→q2→q0→q1→q1→q2→q0 (q0 is not final)
    expect(dfa.sequence('00100010')).toBe(false)
  })

  it('should accept "0" (transitions to q1 which is final)', () => {
    const dfa = new DFA(config)
    expect(dfa.sequence('0')).toBe(true)
  })

  it('should accept "01" (transitions to q2 which is final)', () => {
    const dfa = new DFA(config)
    expect(dfa.sequence('01')).toBe(true)
  })

  it('should reject "010" (transitions q0→q1→q2→q0, not final)', () => {
    const dfa = new DFA(config)
    expect(dfa.sequence('010')).toBe(false)
  })

  it('should produce correct trace', () => {
    const dfa = new DFA(config)
    const trace = dfa.traceSequence('001')
    expect(trace).toHaveLength(3)
    expect(trace[0]).toEqual({ fromState: 'q0', symbol: '0', toState: 'q1', isFinal: true })
    expect(trace[1]).toEqual({ fromState: 'q1', symbol: '0', toState: 'q1', isFinal: true })
    expect(trace[2]).toEqual({ fromState: 'q1', symbol: '1', toState: 'q2', isFinal: true })
  })

  it('should throw on invalid symbol', () => {
    const dfa = new DFA(config)
    expect(() => dfa.sequence('2')).toThrow()
  })
})
