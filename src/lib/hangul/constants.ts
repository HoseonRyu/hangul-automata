import type { MealyConfig } from '@/lib/automata/types'

export const STATES = ['S', 'V', 'O', 'U', 'A', 'I', 'K', 'N', 'R', 'L']

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
  ['S', C, 'V', '0'],
  ['V', 'h', 'O', '1'],
  ['V', 'n', 'U', '1'],
  ['V', 'kiju', 'A', '1'],
  ['V', 'ybloOpPm', 'I', '1'],
  ['O', 'ko', 'I', '1'],
  ['U', 'jp', 'I', '1'],
  [['O', 'U'], 'l', 'I', '1'],
  ['A', 'l', 'I', '.1'],
  ['I', 'l', 'I', '1'],
  [['O', 'U', 'A', 'I'], 'rq', 'K', '2'],
  [['O', 'U', 'A', 'I'], 's', 'N', '2'],
  [['O', 'U', 'A', 'I'], 'f', 'R', '2'],
  [['O', 'U', 'A', 'I'], 'eatdwczxvgRT', 'L', '2'],
  [['O', 'U', 'A', 'I'], 'EQW', 'V', '.0'],
  [['K', 'N', 'R', 'L'], 'h', 'O', 'd.01'],
  [['K', 'N', 'R', 'L'], 'n', 'U', 'd.01'],
  [['K', 'N', 'R', 'L'], 'kiju', 'A', 'd.01'],
  [['K', 'N', 'R', 'L'], 'ybloOpPm', 'I', 'd.01'],
  ['K', 't', 'L', '2'],
  ['K', strDiff(C, 't'), 'V', '.0'],
  ['N', 'wg', 'L', '2'],
  ['N', strDiff(C, 'wg'), 'V', '.0'],
  ['R', 'raqtxvg', 'L', '2'],
  ['R', strDiff(C, 'raqtxvg'), 'V', '.0'],
  ['L', C, 'V', '.0'],
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
