'use client'

import { useTranslations } from 'next-intl'

interface TransferRow {
  from: string
  symbols: string
  to: string
  output: string
  nodes: string[]
  edges: string[]
  dokkaebi?: boolean
}

const TRANSFER_DISPLAY: TransferRow[] = [
  // S: 시작 상태
  { from: 'S', symbols: 'C', to: 'V', output: '0', nodes: ['S', 'V'], edges: ['S-C-V'] },
  { from: 'S', symbols: 'V', to: 'B', output: '1', nodes: ['S', 'B'], edges: ['S-V-B'] },
  // V: 초성 입력 완료
  { from: 'V', symbols: 'h', to: 'O', output: '1', nodes: ['V', 'O'], edges: ['V-h-O'] },
  { from: 'V', symbols: 'n', to: 'U', output: '1', nodes: ['V', 'U'], edges: ['V-n-U'] },
  { from: 'V', symbols: 'k,i,j,u', to: 'A', output: '1', nodes: ['V', 'A'], edges: ['V-kiju-A'] },
  { from: 'V', symbols: 'y,b,l,o,O,p,P,m', to: 'I', output: '1', nodes: ['V', 'I'], edges: ['V-ybl-I'] },
  { from: 'V', symbols: 'C', to: 'V', output: '.0', nodes: ['V'], edges: ['V-C-V'] },
  // 복합모음
  { from: 'O', symbols: 'k,o', to: 'I', output: '1', nodes: ['O', 'I'], edges: ['O-ko-I'] },
  { from: 'U', symbols: 'j,p', to: 'I', output: '1', nodes: ['U', 'I'], edges: ['U-jp-I'] },
  { from: '{O,U}', symbols: 'l', to: 'I', output: '1', nodes: ['O', 'U', 'I'], edges: ['OU-l-I'] },
  { from: 'I', symbols: 'l', to: 'I', output: '1', nodes: ['I'], edges: ['I-l-I'] },
  // 비복합모음 → B
  { from: 'O', symbols: 'V\\{k,o,l}', to: 'B', output: '.1', nodes: ['O', 'B'], edges: ['O-V-B'] },
  { from: 'U', symbols: 'V\\{j,p,l}', to: 'B', output: '.1', nodes: ['U', 'B'], edges: ['U-V-B'] },
  { from: 'A', symbols: 'V', to: 'B', output: '.1', nodes: ['A', 'B'], edges: ['A-V-B'] },
  { from: 'I', symbols: 'V\\l', to: 'B', output: '.1', nodes: ['I', 'B'], edges: ['I-V-B'] },
  // 종성 입력
  { from: '{O,U,A,I}', symbols: 'r,q', to: 'K', output: '2', nodes: ['O', 'U', 'A', 'I', 'K'], edges: ['OUAI-rq-K'] },
  { from: '{O,U,A,I}', symbols: 's', to: 'N', output: '2', nodes: ['O', 'U', 'A', 'I', 'N'], edges: ['OUAI-s-N'] },
  { from: '{O,U,A,I}', symbols: 'f', to: 'R', output: '2', nodes: ['O', 'U', 'A', 'I', 'R'], edges: ['OUAI-f-R'] },
  { from: '{O,U,A,I}', symbols: 'e,a,t,...', to: 'L', output: '2', nodes: ['O', 'U', 'A', 'I', 'L'], edges: ['OUAI-etc-L'] },
  { from: '{O,U,A,I}', symbols: 'E,Q,W', to: 'V', output: '.0', nodes: ['A', 'V'], edges: ['OUAI-EQW-V'] },
  // 도깨비불 (d.01)
  { from: '{K,N,R,L}', symbols: 'h', to: 'O', output: 'd.01', nodes: ['K', 'N', 'R', 'L', 'O'], edges: ['KNRL-vowel-O'], dokkaebi: true },
  { from: '{K,N,R,L}', symbols: 'n', to: 'U', output: 'd.01', nodes: ['K', 'N', 'R', 'L', 'U'], edges: ['KNRL-vowel-O'], dokkaebi: true },
  { from: '{K,N,R,L}', symbols: 'k,i,j,u', to: 'A', output: 'd.01', nodes: ['K', 'N', 'R', 'L', 'A'], edges: ['KNRL-vowel-A'], dokkaebi: true },
  { from: '{K,N,R,L}', symbols: 'y,b,l,...,m', to: 'I', output: 'd.01', nodes: ['K', 'N', 'R', 'L', 'I'], edges: ['KNRL-vowel-I'], dokkaebi: true },
  // 복합종성
  { from: 'K', symbols: 't', to: 'L', output: '2', nodes: ['K', 'L'], edges: ['K-t-L'] },
  { from: 'K', symbols: 'C\\t', to: 'V', output: '.0', nodes: ['K', 'V'], edges: ['K-C-V'] },
  { from: 'N', symbols: 'w,g', to: 'L', output: '2', nodes: ['N', 'L'], edges: ['N-wg-L'] },
  { from: 'N', symbols: 'C\\wg', to: 'V', output: '.0', nodes: ['N', 'V'], edges: ['N-C-V'] },
  { from: 'R', symbols: 'r,a,q,t,...', to: 'L', output: '2', nodes: ['R', 'L'], edges: ['R-comp-L'] },
  { from: 'R', symbols: 'C\\raqtxvg', to: 'V', output: '.0', nodes: ['R', 'V'], edges: ['R-C-V'] },
  { from: 'L', symbols: 'C', to: 'V', output: '.0', nodes: ['L', 'V'], edges: ['L-C-V'] },
  // B: 단독 자모
  { from: 'B', symbols: 'V', to: 'B', output: '.1', nodes: ['B'], edges: ['B-V-B'] },
  { from: 'B', symbols: 'C', to: 'V', output: '.0', nodes: ['B', 'V'], edges: ['B-C-V'] },
]

const outputColors: Record<string, string> = {
  '0': 'text-green-400',
  '1': 'text-blue-400',
  '2': 'text-red-400',
  'd': 'text-amber-400',
  '.': 'text-muted-foreground/50',
}

function ColoredOutput({ output }: { output: string }) {
  return (
    <span>
      {Array.from(output).map((c, i) => (
        <span key={i} className={outputColors[c] || 'text-foreground'}>{c}</span>
      ))}
    </span>
  )
}

interface HangulTransferTableProps {
  highlight: { key: string; nodes?: string[]; edges?: string[] } | null
  onToggleHighlight: (key: string, nodes?: string[], edges?: string[]) => void
}

export function HangulTransferTable({ highlight, onToggleHighlight }: HangulTransferTableProps) {
  const t = useTranslations('hangul')
  const math = 'font-serif italic'
  const hlClass = (key: string) =>
    highlight?.key === key
      ? 'ring-1 ring-emerald-500/50 bg-emerald-500/10'
      : ''
  const btnBase = 'cursor-pointer transition-all duration-200 hover:bg-emerald-500/5'

  return (
    <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20 overflow-y-auto">
      <p className="text-sm text-blue-400 mb-3">{t('exampleTG')}</p>
      <div className="grid grid-cols-2 gap-x-4">
        {/* T column */}
        <div>
          <p className="text-xs text-muted-foreground mb-1.5 font-medium">
            <span className={math}>T</span>(from, input) = to
          </p>
          <div className="space-y-0.5 text-sm font-mono">
            {TRANSFER_DISPLAY.map((row, i) => {
              const key = `T-${i}`
              return (
                <button
                  key={key}
                  type="button"
                  className={`${btnBase} ${hlClass(key)} block text-left w-full rounded px-1 py-0.5`}
                  onClick={() => onToggleHighlight(key, row.nodes, row.edges)}
                >
                  <span className={`${math} text-muted-foreground`}>T</span>
                  <span className="text-muted-foreground">(</span>
                  <span className="text-blue-400">{row.from}</span>
                  <span className="text-muted-foreground">, </span>
                  <span className="text-foreground">{row.symbols}</span>
                  <span className="text-muted-foreground">) = </span>
                  <span className="text-blue-400">{row.to}</span>
                  {row.dokkaebi && (
                    <span className="ml-1 text-[10px] px-1 py-0.5 rounded bg-amber-500/20 text-amber-400">도깨비불</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
        {/* G column */}
        <div>
          <p className="text-xs text-muted-foreground mb-1.5 font-medium">
            <span className={math}>G</span>(from, input) = output
          </p>
          <div className="space-y-0.5 text-sm font-mono">
            {TRANSFER_DISPLAY.map((row, i) => {
              const key = `T-${i}`
              return (
                <button
                  key={`G-${i}`}
                  type="button"
                  className={`${btnBase} ${hlClass(key)} block text-left w-full rounded px-1 py-0.5`}
                  onClick={() => onToggleHighlight(key, row.nodes, row.edges)}
                >
                  <span className={`${math} text-muted-foreground`}>G</span>
                  <span className="text-muted-foreground">(</span>
                  <span className="text-blue-400">{row.from}</span>
                  <span className="text-muted-foreground">, </span>
                  <span className="text-foreground">{row.symbols}</span>
                  <span className="text-muted-foreground">) = </span>
                  <ColoredOutput output={row.output} />
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
