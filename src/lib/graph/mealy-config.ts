import type { Node, Edge } from '@xyflow/react'

export const mealyNodes: Node[] = [
  {
    id: 'q1',
    type: 'stateNode',
    position: { x: 100, y: 200 },
    data: { label: 'q1', isStart: true, isFinal: false },
  },
  {
    id: 'q2',
    type: 'stateNode',
    position: { x: 350, y: 200 },
    data: { label: 'q2', isStart: false, isFinal: false },
  },
  {
    id: 'q3',
    type: 'stateNode',
    position: { x: 600, y: 200 },
    data: { label: 'q3', isStart: false, isFinal: false },
  },
]

export const mealyEdges: Edge[] = [
  {
    id: 'q1-01-q2',
    source: 'q1',
    target: 'q2',
    type: 'transitionEdge',
    data: { label: '0,1 / a', symbols: ['0', '1'] },
  },
  {
    id: 'q2-0-q2',
    source: 'q2',
    target: 'q2',
    type: 'transitionEdge',
    data: { label: '0 / b', symbols: ['0'] },
  },
  {
    id: 'q2-1-q3',
    source: 'q2',
    target: 'q3',
    type: 'transitionEdge',
    data: { label: '1 / c', symbols: ['1'] },
  },
  {
    id: 'q3-01-q1',
    source: 'q3',
    target: 'q1',
    type: 'transitionEdge',
    data: { label: '0,1 / d', symbols: ['0', '1'] },
  },
]

export const mealyConfig = {
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
