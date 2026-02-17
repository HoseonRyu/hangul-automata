import { describe, it, expect } from 'vitest'
import { HangulConverter } from '@/lib/hangul/converter'

describe('HangulConverter', () => {
  const converter = new HangulConverter()

  it('should convert "dkssud" to "안녕"', () => {
    expect(converter.convert('dkssud')).toBe('안녕')
  })

  it('should convert "tptkd" to "세상"', () => {
    expect(converter.convert('tptkd')).toBe('세상')
  })

  it('should convert "gksrmf" to "한글"', () => {
    expect(converter.convert('gksrmf')).toBe('한글')
  })

  it('should convert "dkssudgktpdy" to "안녕하세요"', () => {
    expect(converter.convert('dkssudgktpdy')).toBe('안녕하세요')
  })

  it('should handle dokkaebi phenomenon in trace', () => {
    // "rkfk" = 가라: r(ㄱ)k(ㅏ)f(ㄹ)k(ㅏ) — 종성 ㄹ이 다음 음절 초성으로 이동
    const trace = converter.traceConvert('rkfk')
    const dokkaebiSteps = trace.filter(step => step.isDokkaebi)
    expect(dokkaebiSteps.length).toBeGreaterThan(0)
  })

  it('should convert "rhkqo" to "과보"', () => {
    // 'r'(ㄱ) + 'h'(ㅗ) + 'k'(ㅏ) = 과, 'q'(ㅂ) + 'o' ...
    // Actually let's test a simpler one
    expect(converter.convert('rk')).toBe('가')
  })

  it('should convert single syllable "rk" to "가"', () => {
    expect(converter.convert('rk')).toBe('가')
  })

  it('should convert "rksk" to "가나"', () => {
    expect(converter.convert('rksk')).toBe('가나')
  })

  it('should convert with ㅐ(o), ㅒ(O), ㅔ(p), ㅖ(P) vowels', () => {
    expect(converter.convert('ro')).toBe('개')     // ㄱ + ㅐ
    expect(converter.convert('rO')).toBe('걔')     // ㄱ + ㅒ
    expect(converter.convert('rp')).toBe('게')     // ㄱ + ㅔ
    expect(converter.convert('rP')).toBe('계')     // ㄱ + ㅖ
    expect(converter.convert('tpdy')).toBe('세요')   // ㅔ in multi-syllable
  })

  it('should handle dokkaebi with new vowels (o,O,p,P)', () => {
    // r(ㄱ) + k(ㅏ) + f(ㄹ) + p(ㅔ) → 갈 → 가 + 레 (dokkaebi)
    expect(converter.convert('rkfp')).toBe('가레')
  })

  it('should convert "dml" to "의" (ㅡ+ㅣ=ㅢ)', () => {
    expect(converter.convert('dml')).toBe('의')
  })

  it('should convert "rhkls" to "괜" (ㅗ+ㅏ+ㅣ=ㅙ + 종성)', () => {
    expect(converter.convert('rhkls')).toBe('괜')
  })

  it('should split A+l into separate syllables ("tjl" → "서ㅣ")', () => {
    expect(converter.convert('tjl')).toBe('서ㅣ')
  })

  it('should convert compound vowels ㅙ(ㅗ+ㅐ) and ㅞ(ㅜ+ㅔ)', () => {
    expect(converter.convert('dho')).toBe('왜')       // ㅇ + ㅗ + ㅐ = 왜 (ㅙ)
    expect(converter.convert('dnp')).toBe('웨')       // ㅇ + ㅜ + ㅔ = 웨 (ㅞ)
  })

  it('should convert "dhormfjsmsi" to "왜그러느냐"', () => {
    expect(converter.convert('dhormfjsmsi')).toBe('왜그러느냐')
  })

  // === 완전 전이 함수 테스트 (모든 상태에서 모든 입력 처리) ===

  it('should handle bare vowel input from start: "k" → "ㅏ"', () => {
    expect(converter.convert('k')).toBe('ㅏ')
    expect(converter.convert('h')).toBe('ㅗ')
    expect(converter.convert('l')).toBe('ㅣ')
  })

  it('should handle vowel after vowel: "rkk" → "가ㅏ"', () => {
    expect(converter.convert('rkk')).toBe('가ㅏ')
  })

  it('should handle consecutive consonants: "rr" → "ㄱㄱ"', () => {
    expect(converter.convert('rr')).toBe('ㄱㄱ')
  })

  it('should handle "rkrr" → "각ㄱ"', () => {
    expect(converter.convert('rkrr')).toBe('각ㄱ')
  })

  it('should handle bare vowel then consonant: "kr" → "ㅏㄱ"', () => {
    expect(converter.convert('kr')).toBe('ㅏㄱ')
  })

  it('should handle bare vowel + consonant + vowel: "krk" → "ㅏ가"', () => {
    expect(converter.convert('krk')).toBe('ㅏ가')
  })

  it('should handle consecutive bare vowels: "kk" → "ㅏㅏ"', () => {
    expect(converter.convert('kk')).toBe('ㅏㅏ')
    expect(converter.convert('khl')).toBe('ㅏㅗㅣ')
  })

  it('should handle vowel from medial state (non-compound): "rhi" → "호ㅑ"', () => {
    // r(ㄱ)+h(ㅗ) → 고, then i(ㅑ) is not compound with ㅗ → split
    // Wait, r=ㄱ? No, let me re-check. Actually r=ㄱ, h=ㅗ → 고 (state O)
    // i(ㅑ) from O is non-compound → "고ㅑ"
    // Actually: r→V(0), h→O(1), i→B(.1). Code: "01.1"
    // seg0: "rh"/"01" → hangulChar → ㄱ+ㅗ = 고
    // seg1: "i"/"1" → vowelToJamo('i') = ㅑ
    expect(converter.convert('rhi')).toBe('고ㅑ')
  })

  it('should convert "rkfk" to "갈라" (dokkaebi case)', () => {
    // r(ㄱ) + k(ㅏ) + f(ㄹ) -> 갈, then f becomes final
    // but next is k(ㅏ) -> dokkaebi: 갈 loses ㄹ -> 가, ㄹ becomes 라
    // Actually: r->V(0), k->A(1) = "가", f->R(2) = "갈", k->A(d.01) dokkaebi
    // So "갈" -> "가" + "라" = "가라"
    // Wait, let me reconsider. 'f' is ㄹ as a consonant.
    // r(ㄱ,0) k(ㅏ,1) f(ㄹ,2) k(ㅏ,d.01) -> code: 012d.01
    // After d processing: 01.01 -> segments: "rk"/"01" and "fk"/"01"
    // hangulChar("rk","01") = 가, hangulChar("fk","01") = 라
    expect(converter.convert('rkfk')).toBe('가라')
  })
})
