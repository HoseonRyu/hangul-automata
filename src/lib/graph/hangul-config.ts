import type { Node, Edge } from '@xyflow/react'

// 10-state hangul Mealy Machine graph configuration
// States: S(Start), V(초성 입력 후), O(ㅗ), U(ㅜ), A(단모음), I(ㅡ/ㅢ류),
//         K(종성 ㄱ/ㅂ), N(종성 ㄴ), R(종성 ㄹ), L(기타 종성)

const COL1 = 80
const COL2 = 280
const COL3 = 480
const COL4 = 680
const ROW1 = 60
const ROW2 = 200
const ROW3 = 340
const ROW4 = 480

export const hangulNodes: Node[] = [
  {
    id: 'S',
    type: 'stateNode',
    position: { x: COL1, y: ROW2 },
    data: { label: 'S', isStart: true, isFinal: false, description: '시작' },
  },
  {
    id: 'V',
    type: 'stateNode',
    position: { x: COL2, y: ROW2 },
    data: { label: 'V', isStart: false, isFinal: false, description: '초성' },
  },
  {
    id: 'O',
    type: 'stateNode',
    position: { x: COL3, y: ROW1 },
    data: { label: 'O', isStart: false, isFinal: false, description: 'ㅗ' },
  },
  {
    id: 'U',
    type: 'stateNode',
    position: { x: COL3, y: ROW2 },
    data: { label: 'U', isStart: false, isFinal: false, description: 'ㅜ' },
  },
  {
    id: 'A',
    type: 'stateNode',
    position: { x: COL3, y: ROW3 },
    data: { label: 'A', isStart: false, isFinal: false, description: '단모음' },
  },
  {
    id: 'I',
    type: 'stateNode',
    position: { x: COL3, y: ROW4 },
    data: { label: 'I', isStart: false, isFinal: false, description: 'ㅡ류' },
  },
  {
    id: 'K',
    type: 'stateNode',
    position: { x: COL4, y: ROW1 },
    data: { label: 'K', isStart: false, isFinal: false, description: 'ㄱ/ㅂ' },
  },
  {
    id: 'N',
    type: 'stateNode',
    position: { x: COL4, y: ROW2 },
    data: { label: 'N', isStart: false, isFinal: false, description: 'ㄴ' },
  },
  {
    id: 'R',
    type: 'stateNode',
    position: { x: COL4, y: ROW3 },
    data: { label: 'R', isStart: false, isFinal: false, description: 'ㄹ' },
  },
  {
    id: 'L',
    type: 'stateNode',
    position: { x: COL4, y: ROW4 },
    data: { label: 'L', isStart: false, isFinal: false, description: '기타 종성' },
  },
]

// Simplified edges: group transitions for readability
export const hangulEdges: Edge[] = [
  // S -> V (consonant input)
  {
    id: 'S-C-V',
    source: 'S',
    target: 'V',
    type: 'transitionEdge',
    data: { label: 'C / 0', symbols: Array.from('rsefaqtdwczxvgREQTW') },
  },
  // V -> vowel states
  {
    id: 'V-h-O',
    source: 'V',
    target: 'O',
    type: 'transitionEdge',
    data: { label: 'h / 1', symbols: ['h'] },
  },
  {
    id: 'V-n-U',
    source: 'V',
    target: 'U',
    type: 'transitionEdge',
    data: { label: 'n / 1', symbols: ['n'] },
  },
  {
    id: 'V-kijum-A',
    source: 'V',
    target: 'A',
    type: 'transitionEdge',
    data: { label: 'k,i,j,u,m / 1', symbols: ['k', 'i', 'j', 'u', 'm'] },
  },
  {
    id: 'V-ybl-I',
    source: 'V',
    target: 'I',
    type: 'transitionEdge',
    data: { label: 'y,b,l,o,O,p,P / 1', symbols: ['y', 'b', 'l', 'o', 'O', 'p', 'P'] },
  },
  // O compound vowels
  {
    id: 'O-k-A',
    source: 'O',
    target: 'A',
    type: 'transitionEdge',
    data: { label: 'k / 1', symbols: ['k'] },
  },
  // U compound vowels
  {
    id: 'U-j-A',
    source: 'U',
    target: 'A',
    type: 'transitionEdge',
    data: { label: 'j / 1', symbols: ['j'] },
  },
  // O,U,A -> I (ㅢ류)
  {
    id: 'OUA-l-I',
    source: 'O',
    target: 'I',
    type: 'transitionEdge',
    data: { label: 'l / 1', symbols: ['l'] },
  },
  // Vowel states -> 종성 states
  {
    id: 'OUAI-rq-K',
    source: 'A',
    target: 'K',
    type: 'transitionEdge',
    data: { label: 'r,q / 2', symbols: ['r', 'q'] },
  },
  {
    id: 'OUAI-s-N',
    source: 'A',
    target: 'N',
    type: 'transitionEdge',
    data: { label: 's / 2', symbols: ['s'] },
  },
  {
    id: 'OUAI-f-R',
    source: 'A',
    target: 'R',
    type: 'transitionEdge',
    data: { label: 'f / 2', symbols: ['f'] },
  },
  {
    id: 'OUAI-etc-L',
    source: 'A',
    target: 'L',
    type: 'transitionEdge',
    data: { label: 'e,a,t,... / 2', symbols: Array.from('eatdwczxvgRT') },
  },
  // 종성 -> vowel (dokkaebi: d.01)
  {
    id: 'KNRL-vowel-O',
    source: 'K',
    target: 'O',
    type: 'transitionEdge',
    data: { label: 'h / d.01', symbols: ['h'], isDokkaebi: true },
  },
  {
    id: 'KNRL-vowel-A',
    source: 'K',
    target: 'A',
    type: 'transitionEdge',
    data: { label: 'k,i,j,u,m / d.01', symbols: ['k', 'i', 'j', 'u', 'm'], isDokkaebi: true },
  },
  // 종성 -> I (dokkaebi with terminal vowels)
  {
    id: 'KNRL-vowel-I',
    source: 'K',
    target: 'I',
    type: 'transitionEdge',
    data: { label: 'y,b,l,o,O,p,P / d.01', symbols: ['y', 'b', 'l', 'o', 'O', 'p', 'P'], isDokkaebi: true },
  },
  // 종성 -> new syllable (consonant: .0)
  {
    id: 'L-C-V',
    source: 'L',
    target: 'V',
    type: 'transitionEdge',
    data: { label: 'C / .0', symbols: Array.from('rsefaqtdwczxvgREQTW') },
  },
  // Compound 종성
  {
    id: 'K-t-L',
    source: 'K',
    target: 'L',
    type: 'transitionEdge',
    data: { label: 't / 2', symbols: ['t'] },
  },
  // K -> V (new syllable with non-t consonant)
  {
    id: 'K-C-V',
    source: 'K',
    target: 'V',
    type: 'transitionEdge',
    data: { label: 'C\\t / .0', symbols: Array.from('rsefaqdwczxvgREQTW') },
  },
  // N compound
  {
    id: 'N-wg-L',
    source: 'N',
    target: 'L',
    type: 'transitionEdge',
    data: { label: 'w,g / 2', symbols: ['w', 'g'] },
  },
  {
    id: 'N-C-V',
    source: 'N',
    target: 'V',
    type: 'transitionEdge',
    data: { label: 'C\\wg / .0', symbols: Array.from('rsefaqtdczxvREQTW') },
  },
  // R compound
  {
    id: 'R-comp-L',
    source: 'R',
    target: 'L',
    type: 'transitionEdge',
    data: { label: 'r,a,q,t,... / 2', symbols: Array.from('raqtxvg') },
  },
  {
    id: 'R-C-V',
    source: 'R',
    target: 'V',
    type: 'transitionEdge',
    data: { label: 'C\\raqtxvg / .0', symbols: Array.from('sefdwczEQTW') },
  },
  // OUAI -> V (쌍자음으로 새 음절)
  {
    id: 'OUAI-EQW-V',
    source: 'A',
    target: 'V',
    type: 'transitionEdge',
    data: { label: 'E,Q,W / .0', symbols: ['E', 'Q', 'W'] },
  },
]
