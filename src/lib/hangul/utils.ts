import { FIRST, MIDDLE, LAST } from './constants'

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
    output += hangulChar(segmentsQuery[i], segmentsCode[i])
  }

  return output
}
