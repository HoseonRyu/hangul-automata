import { FIRST, MIDDLE, LAST } from './constants'

// 단일 키로 입력되는 복합 모음 → MIDDLE 배열 키 매핑
const VOWEL_ALIASES: Record<string, string> = {
  'o': 'kl',  // ㅐ
  'O': 'il',  // ㅒ
  'p': 'jl',  // ㅔ
  'P': 'ul',  // ㅖ
}

// 초성 인덱스 → 호환용 자모(U+3131~U+314E) 매핑
const CHOSEONG_TO_JAMO = [
  0x3131, 0x3132, 0x3134, 0x3137, 0x3138, 0x3139, 0x3141, 0x3142, 0x3143, 0x3145,
  0x3146, 0x3147, 0x3148, 0x3149, 0x314A, 0x314B, 0x314C, 0x314D, 0x314E,
]

/** 영문 자음 키 → 한글 자모 문자 (예: 's' → 'ㄴ') */
export function consonantToJamo(key: string): string {
  const idx = FIRST.indexOf(key)
  if (idx === -1) return key
  return String.fromCharCode(CHOSEONG_TO_JAMO[idx])
}

export function strDiff(str1: string, str2: string): string {
  let ret = ''
  for (const c of str1) {
    if (!str2.includes(c)) {
      ret += c
    }
  }
  return ret
}

export function hangulChar(query: string, code: string): string {
  let fChr = ''
  let mChr = ''
  let lChr = ''
  for (let i = 0; i < code.length; i++) {
    if (code[i] === '0') {
      fChr += query[i]
    } else if (code[i] === '1') {
      mChr += query[i]
    } else {
      lChr += query[i]
    }
  }
  // 단일 키 모음을 MIDDLE 배열에서 찾을 수 있도록 정규화
  mChr = VOWEL_ALIASES[mChr] ?? mChr
  const f = FIRST.indexOf(fChr)
  const m = MIDDLE.indexOf(mChr)
  const l = LAST.indexOf(lChr)

  if (f === -1 || m === -1 || l === -1) return ''

  return String.fromCharCode(f * 588 + m * 28 + l + 44032)
}

export function convertToHangul(query: string, syllableCode: string): string {
  // Process 'd' (delete) codes
  let codeNew = ''
  for (const c of syllableCode) {
    if (c === 'd') {
      codeNew = codeNew.slice(0, -1)
    } else {
      codeNew += c
    }
  }

  const codeNoDot = codeNew.replace(/\./g, '')
  const lenList = codeNew.split('.').map(s => s.length)

  let idx = 0
  const segmentsQuery: string[] = []
  const segmentsCode: string[] = []
  for (const len of lenList) {
    segmentsQuery.push(query.slice(idx, idx + len))
    segmentsCode.push(codeNoDot.slice(idx, idx + len))
    idx += len
  }

  let output = ''
  for (let i = 0; i < segmentsQuery.length; i++) {
    const char = hangulChar(segmentsQuery[i], segmentsCode[i])
    if (char) {
      output += char
    } else if (!segmentsCode[i].includes('1')) {
      // 모음 없이 자음만 있는 세그먼트 → 자모로 표시
      output += consonantToJamo(segmentsQuery[i])
    }
  }

  return output
}
