import { describe, it, expect } from 'vitest'
import { MealyMachine } from '@/lib/automata/mealy-machine'

const config = {
  states: ['q0', 'q1', 'q2'],
  symbolsIn: '01',
  symbolsOut: 'abcd',
  transfers: [
    ['q0', '01', 'q1', 'a'],
    ['q1', '0', 'q1', 'b'],
    ['q1', '1', 'q2', 'c'],
    ['q2', '01', 'q0', 'd'],
  ] as [string | string[], string, string, string][],
  start: 'q0',
}

describe('MealyMachine', () => {
  it('should produce output for "00100010"', () => {
    const mealy = new MealyMachine(config)
    const output = mealy.sequence('00100010')
    // q0 -0-> q1(a), q1 -0-> q1(b), q1 -1-> q2(c), q2 -0-> q0(d),
    // q0 -0-> q1(a), q1 -0-> q1(b), q1 -1-> q2(c), q2 -0-> q0(d)
    expect(output).toBe('abcdabcd')
  })

  it('should produce correct trace', () => {
    const mealy = new MealyMachine(config)
    const trace = mealy.traceSequence('001')
    expect(trace).toHaveLength(3)
    expect(trace[0]).toEqual({
      fromState: 'q0', symbol: '0', toState: 'q1',
      output: 'a', cumulativeOutput: 'a',
    })
    expect(trace[1]).toEqual({
      fromState: 'q1', symbol: '0', toState: 'q1',
      output: 'b', cumulativeOutput: 'ab',
    })
    expect(trace[2]).toEqual({
      fromState: 'q1', symbol: '1', toState: 'q2',
      output: 'c', cumulativeOutput: 'abc',
    })
  })

  it('should support multi-source states', () => {
    const mealy = new MealyMachine(config)
    // q0-0->q1(a), q1-1->q2(c), q2-0->q0(d), q0-1->q1(a)
    const trace = mealy.traceSequence('0101')
    expect(trace[3]).toEqual({
      fromState: 'q0', symbol: '1', toState: 'q1',
      output: 'a', cumulativeOutput: 'acda',
    })
  })
})
