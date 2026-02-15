import type { Node, Edge } from '@xyflow/react'

export const dfaNodes: Node[] = [
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
    data: { label: 'q2', isStart: false, isFinal: true },
  },
  {
    id: 'q3',
    type: 'stateNode',
    position: { x: 600, y: 200 },
    data: { label: 'q3', isStart: false, isFinal: true },
  },
]

export const dfaEdges: Edge[] = [
  {
    id: 'q1-0-q2',
    source: 'q1',
    target: 'q2',
    type: 'transitionEdge',
    label: '0',
    data: { label: '0', symbols: ['0'] },
  },
  {
    id: 'q2-0-q2',
    source: 'q2',
    target: 'q2',
    type: 'transitionEdge',
    label: '0',
    data: { label: '0', symbols: ['0'] },
  },
  {
    id: 'q2-1-q3',
    source: 'q2',
    target: 'q3',
    type: 'transitionEdge',
    label: '1',
    data: { label: '1', symbols: ['1'] },
  },
  {
    id: 'q3-0-q1',
    source: 'q3',
    target: 'q1',
    type: 'transitionEdge',
    label: '0',
    data: { label: '0', symbols: ['0'] },
  },
]

export const dfaConfig = {
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
