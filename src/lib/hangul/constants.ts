import type { MealyConfig } from '@/lib/automata/types'

export const STATES = ['S', 'V', 'O', 'U', 'A', 'I', 'K', 'N', 'R', 'L', 'B']

export const C = 'rsefaqtdwczxvgREQTW'
export const V = 'kijuhynbmloOpP'
export const SYMBOLS_IN = C + V
export const SYMBOLS_OUT = '012.d'

function strDiff(str1: string, str2: string): string {
  let ret = ''
  for (const c of str1) {
    if (!str2.includes(c)) {
      ret += c
    }
  }
  return ret
}

export const TRANSFERS_ME: MealyConfig['transfers'] = [
  // S: 시작 상태
  ['S', C, 'V', '0'],           // 자음 → 초성 입력
  ['S', V, 'B', '1'],           // 모음 → 단독 자모

  // V: 초성 입력 완료 (모음 대기)
  ['V', 'h', 'O', '1'],
  ['V', 'n', 'U', '1'],
  ['V', 'kiju', 'A', '1'],
  ['V', 'ybloOpPm', 'I', '1'],
  ['V', C, 'V', '.0'],          // 자음 연속 → 앞 자음 확정, 새 초성

  // 복합모음 (음절 내)
  ['O', 'ko', 'I', '1'],        // ㅗ+ㅏ=ㅘ, ㅗ+ㅐ=ㅙ
  ['U', 'jp', 'I', '1'],        // ㅜ+ㅓ=ㅝ, ㅜ+ㅔ=ㅞ
  [['O', 'U'], 'l', 'I', '1'],  // ㅗ+ㅣ=ㅚ, ㅜ+ㅣ=ㅟ
  ['I', 'l', 'I', '1'],         // ㅡ+ㅣ=ㅢ 등

  // 비복합모음 → 새 단독 자모 세그먼트
  ['O', strDiff(V, 'kol'), 'B', '.1'],
  ['U', strDiff(V, 'jpl'), 'B', '.1'],
  ['A', V, 'B', '.1'],
  ['I', strDiff(V, 'l'), 'B', '.1'],

  // 중성 → 종성
  [['O', 'U', 'A', 'I'], 'rq', 'K', '2'],
  [['O', 'U', 'A', 'I'], 's', 'N', '2'],
  [['O', 'U', 'A', 'I'], 'f', 'R', '2'],
  [['O', 'U', 'A', 'I'], 'eatdwczxvgRT', 'L', '2'],
  [['O', 'U', 'A', 'I'], 'EQW', 'V', '.0'],

  // 도깨비불 (종성 + 모음 → 종성 이동)
  [['K', 'N', 'R', 'L'], 'h', 'O', 'd.01'],
  [['K', 'N', 'R', 'L'], 'n', 'U', 'd.01'],
  [['K', 'N', 'R', 'L'], 'kiju', 'A', 'd.01'],
  [['K', 'N', 'R', 'L'], 'ybloOpPm', 'I', 'd.01'],

  // 복합종성
  ['K', 't', 'L', '2'],
  ['K', strDiff(C, 't'), 'V', '.0'],
  ['N', 'wg', 'L', '2'],
  ['N', strDiff(C, 'wg'), 'V', '.0'],
  ['R', 'raqtxvg', 'L', '2'],
  ['R', strDiff(C, 'raqtxvg'), 'V', '.0'],
  ['L', C, 'V', '.0'],

  // B: 단독 자모 (초성 없는 모음)
  ['B', V, 'B', '.1'],          // 모음 → 새 단독 모음
  ['B', C, 'V', '.0'],          // 자음 → 새 음절 시작
]

export const START = 'S'

export const FIRST = [
  'r', 'R', 's', 'e', 'E', 'f', 'a', 'q', 'Q', 't',
  'T', 'd', 'w', 'W', 'c', 'z', 'x', 'v', 'g',
]

export const MIDDLE = [
  'k', 'kl', 'i', 'il', 'j', 'jl', 'u', 'ul', 'h',
  'hk', 'hkl', 'hl', 'y', 'n', 'nj', 'njl', 'nl', 'b',
  'm', 'ml', 'l',
]

export const LAST = [
  '', 'r', 'R', 'rt', 's', 'sw', 'sg', 'e', 'f', 'fr',
  'fa', 'fq', 'ft', 'fx', 'fv', 'fg', 'a', 'q', 'qt',
  't', 'T', 'd', 'w', 'c', 'z', 'x', 'v', 'g',
]
