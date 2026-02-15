import { describe, it, expect } from 'vitest'
import { MealyMachine } from '@/lib/automata/mealy-machine'

const config = {
  states: ['q1', 'q2', 'q3'],
  symbolsIn: '01',
  symbolsOut: 'abcd',
  transfers: [
    ['q1', '01', 'q2', 'a'],
    ['q2', '0', 'q2', 'b'],
    ['q2', '1', 'q3', 'c'],
    ['q3', '01', 'q1', 'd'],
  ] as [string | string[], string, string, string][],
  start: 'q1',
}

describe('MealyMachine', () => {
  it('should produce output for "00100010"', () => {
    const mealy = new MealyMachine(config)
    const output = mealy.sequence('00100010')
    // q1 -0-> q2(a), q2 -0-> q2(b), q2 -1-> q3(c), q3 -0-> q1(d),
    // q1 -0-> q2(a), q2 -0-> q2(b), q2 -1-> q3(c), q3 -0-> q1(d)
    expect(output).toBe('abcdabcd')
  })

  it('should produce correct trace', () => {
    const mealy = new MealyMachine(config)
    const trace = mealy.traceSequence('001')
    expect(trace).toHaveLength(3)
    expect(trace[0]).toEqual({
      fromState: 'q1', symbol: '0', toState: 'q2',
      output: 'a', cumulativeOutput: 'a',
    })
    expect(trace[1]).toEqual({
      fromState: 'q2', symbol: '0', toState: 'q2',
      output: 'b', cumulativeOutput: 'ab',
    })
    expect(trace[2]).toEqual({
      fromState: 'q2', symbol: '1', toState: 'q3',
      output: 'c', cumulativeOutput: 'abc',
    })
  })

  it('should support multi-source states', () => {
    const mealy = new MealyMachine(config)
    // q1-0->q2(a), q2-1->q3(c), q3-0->q1(d), q1-1->q2(a)
    const trace = mealy.traceSequence('0101')
    expect(trace[3]).toEqual({
      fromState: 'q1', symbol: '1', toState: 'q2',
      output: 'a', cumulativeOutput: 'acda',
    })
  })
})
