import type { Node, Edge } from '@xyflow/react'

// 11-state hangul Mealy Machine graph configuration
// States: S(Start), V(초성 입력 후), O(ㅗ), U(ㅜ), A(단모음), I(ㅡ/ㅢ류),
//         K(종성 ㄱ/ㅂ), N(종성 ㄴ), R(종성 ㄹ), L(기타 종성), B(단독 자모)

const COL1 = 80
const COL2 = 280
const COL3 = 480
const COL4 = 680
const ROW1 = 60
const ROW2 = 200
const ROW3 = 340
const ROW4 = 480

// Node size (w-20 = 80px) + padding for group backgrounds
const NODE_SIZE = 80
const GROUP_PAD = 40

export const hangulGroupNodes: Node[] = [
  {
    id: 'group-start',
    type: 'groupBackground',
    position: { x: COL1 - GROUP_PAD, y: ROW2 - GROUP_PAD },
    data: { label: 'Start', width: NODE_SIZE + GROUP_PAD * 2, height: NODE_SIZE + GROUP_PAD * 2, color: 'slate' },
    zIndex: -1,
  },
  {
    id: 'group-initial',
    type: 'groupBackground',
    position: { x: COL2 - GROUP_PAD, y: ROW2 - GROUP_PAD },
    data: { label: '초성', width: NODE_SIZE + GROUP_PAD * 2, height: NODE_SIZE + GROUP_PAD * 2, color: 'emerald' },
    zIndex: -1,
  },
  {
    id: 'group-medial',
    type: 'groupBackground',
    position: { x: COL3 - GROUP_PAD, y: ROW1 - GROUP_PAD },
    data: { label: '중성', width: NODE_SIZE + GROUP_PAD * 2, height: (ROW4 - ROW1) + NODE_SIZE + GROUP_PAD * 2, color: 'blue' },
    zIndex: -1,
  },
  {
    id: 'group-final',
    type: 'groupBackground',
    position: { x: COL4 - GROUP_PAD, y: ROW1 - GROUP_PAD },
    data: { label: '종성', width: NODE_SIZE + GROUP_PAD * 2, height: (ROW4 - ROW1) + NODE_SIZE + GROUP_PAD * 2, color: 'amber' },
    zIndex: -1,
  },
  {
    id: 'group-bare',
    type: 'groupBackground',
    position: { x: COL1 - GROUP_PAD, y: ROW4 - GROUP_PAD },
    data: { label: '자모', width: NODE_SIZE + GROUP_PAD * 2, height: NODE_SIZE + GROUP_PAD * 2, color: 'violet' },
    zIndex: -1,
  },
]

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
  {
    id: 'B',
    type: 'stateNode',
    position: { x: COL1, y: ROW4 },
    data: { label: 'B', isStart: false, isFinal: false, description: '단독 자모' },
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
  // S -> B (vowel input: bare vowel)
  {
    id: 'S-V-B',
    source: 'S',
    target: 'B',
    type: 'transitionEdge',
    data: { label: 'V / 1', symbols: Array.from('kijuhynbmloOpP') },
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
    id: 'V-kiju-A',
    source: 'V',
    target: 'A',
    type: 'transitionEdge',
    data: { label: 'k,i,j,u / 1', symbols: ['k', 'i', 'j', 'u'] },
  },
  {
    id: 'V-ybl-I',
    source: 'V',
    target: 'I',
    type: 'transitionEdge',
    data: { label: 'y,b,l,o,O,p,P,m / 1', symbols: ['y', 'b', 'l', 'o', 'O', 'p', 'P', 'm'] },
  },
  // V -> V (consonant: standalone initial, new initial)
  {
    id: 'V-C-V',
    source: 'V',
    target: 'V',
    type: 'transitionEdge',
    data: { label: 'C / .0', symbols: Array.from('rsefaqtdwczxvgREQTW') },
  },
  // O compound vowels
  {
    id: 'O-ko-I',
    source: 'O',
    target: 'I',
    type: 'transitionEdge',
    data: { label: 'k,o / 1', symbols: ['k', 'o'] },
  },
  // U compound vowels
  {
    id: 'U-jp-I',
    source: 'U',
    target: 'I',
    type: 'transitionEdge',
    data: { label: 'j,p / 1', symbols: ['j', 'p'] },
  },
  // O,U -> I (ㅗㅣ, ㅜㅣ)
  {
    id: 'OU-l-I',
    source: 'O',
    target: 'I',
    type: 'transitionEdge',
    data: { label: 'l / 1', symbols: ['l'] },
  },
  // I -> I self-loop (ㅢ, etc.)
  {
    id: 'I-l-I',
    source: 'I',
    target: 'I',
    type: 'transitionEdge',
    data: { label: 'l / 1', symbols: ['l'] },
  },
  // Non-compound vowels → B (new bare segment)
  {
    id: 'O-V-B',
    source: 'O',
    target: 'B',
    type: 'transitionEdge',
    data: { label: 'V\\{k,o,l} / .1', symbols: Array.from('ijuhynbmOpP') },
  },
  {
    id: 'U-V-B',
    source: 'U',
    target: 'B',
    type: 'transitionEdge',
    data: { label: 'V\\{j,p,l} / .1', symbols: Array.from('kiuhynbmoOP') },
  },
  {
    id: 'A-V-B',
    source: 'A',
    target: 'B',
    type: 'transitionEdge',
    data: { label: 'V / .1', symbols: Array.from('kijuhynbmloOpP') },
  },
  {
    id: 'I-V-B',
    source: 'I',
    target: 'B',
    type: 'transitionEdge',
    data: { label: 'V\\l / .1', symbols: Array.from('kijuhynbmoOpP') },
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
    data: { label: 'k,i,j,u / d.01', symbols: ['k', 'i', 'j', 'u'], isDokkaebi: true },
  },
  // 종성 -> I (dokkaebi with terminal vowels)
  {
    id: 'KNRL-vowel-I',
    source: 'K',
    target: 'I',
    type: 'transitionEdge',
    data: { label: 'y,b,l,o,O,p,P,m / d.01', symbols: ['y', 'b', 'l', 'o', 'O', 'p', 'P', 'm'], isDokkaebi: true },
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
  // B -> B (vowel: new bare vowel segment)
  {
    id: 'B-V-B',
    source: 'B',
    target: 'B',
    type: 'transitionEdge',
    data: { label: 'V / .1', symbols: Array.from('kijuhynbmloOpP') },
  },
  // B -> V (consonant: start new syllable)
  {
    id: 'B-C-V',
    source: 'B',
    target: 'V',
    type: 'transitionEdge',
    data: { label: 'C / .0', symbols: Array.from('rsefaqtdwczxvgREQTW') },
  },
]
