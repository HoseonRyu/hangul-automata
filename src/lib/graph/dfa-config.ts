import type { Node, Edge } from '@xyflow/react'

export const dfaNodes: Node[] = [
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
    data: { label: 'q1', isStart: false, isFinal: true },
  },
  {
    id: 'q2',
    type: 'stateNode',
    position: { x: 380, y: 230 },
    data: { label: 'q2', isStart: false, isFinal: true },
  },
]

export const dfaEdges: Edge[] = [
  {
    id: 'q0-0-q1',
    source: 'q0',
    target: 'q1',
    type: 'transitionEdge',
    label: '0',
    data: { label: '0', symbols: ['0'] },
  },
  {
    id: 'q0-1-q2',
    source: 'q0',
    target: 'q2',
    type: 'transitionEdge',
    label: '1',
    data: { label: '1', symbols: ['1'] },
  },
  {
    id: 'q1-0-q1',
    source: 'q1',
    target: 'q1',
    type: 'transitionEdge',
    label: '0',
    data: { label: '0', symbols: ['0'] },
  },
  {
    id: 'q1-1-q2',
    source: 'q1',
    target: 'q2',
    type: 'transitionEdge',
    label: '1',
    data: { label: '1', symbols: ['1'] },
  },
  {
    id: 'q2-0-q0',
    source: 'q2',
    target: 'q0',
    type: 'transitionEdge',
    label: '0',
    data: { label: '0', symbols: ['0'] },
  },
  {
    id: 'q2-1-q1',
    source: 'q2',
    target: 'q1',
    type: 'transitionEdge',
    label: '1',
    data: { label: '1', symbols: ['1'] },
  },
]

export const dfaConfig = {
  states: ['q0', 'q1', 'q2'],
  symbols: '01',
  transfers: [
    ['q0', '0', 'q1'],
    ['q0', '1', 'q2'],
    ['q1', '0', 'q1'],
    ['q1', '1', 'q2'],
    ['q2', '0', 'q0'],
    ['q2', '1', 'q1'],
  ] as [string, string, string][],
  start: 'q0',
  final: ['q1', 'q2'],
}
