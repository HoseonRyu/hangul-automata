import type { Node, Edge } from '@xyflow/react'

export const mealyNodes: Node[] = [
  {
    id: 'q0',
    type: 'stateNode',
    position: { x: 100, y: 130 },
    data: { label: 'q0', isStart: true, isFinal: false },
  },
  {
    id: 'q1',
    type: 'stateNode',
    position: { x: 380, y: 30 },
    data: { label: 'q1', isStart: false, isFinal: false },
  },
  {
    id: 'q2',
    type: 'stateNode',
    position: { x: 380, y: 230 },
    data: { label: 'q2', isStart: false, isFinal: false },
  },
]

export const mealyEdges: Edge[] = [
  {
    id: 'q0-01-q1',
    source: 'q0',
    target: 'q1',
    type: 'transitionEdge',
    data: { label: '0,1 / a', symbols: ['0', '1'] },
  },
  {
    id: 'q1-0-q1',
    source: 'q1',
    target: 'q1',
    type: 'transitionEdge',
    data: { label: '0 / b', symbols: ['0'] },
  },
  {
    id: 'q1-1-q2',
    source: 'q1',
    target: 'q2',
    type: 'transitionEdge',
    data: { label: '1 / c', symbols: ['1'] },
  },
  {
    id: 'q2-01-q0',
    source: 'q2',
    target: 'q0',
    type: 'transitionEdge',
    data: { label: '0,1 / d', symbols: ['0', '1'] },
  },
]

export const mealyConfig = {
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
