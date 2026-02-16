'use client'

import React, { memo } from 'react'
import {
  BaseEdge,
  getBezierPath,
  getStraightPath,
  type EdgeProps,
} from '@xyflow/react'

interface TransitionEdgeData {
  label?: string
  categoryLabel?: string
  symbols?: string[]
  isActive?: boolean
  isDokkaebi?: boolean
  isHighlighted?: boolean
  [key: string]: unknown
}

function parseCategoryLabel(text: string): React.ReactNode {
  // Parse subscript notation: "o_h" → o<sub>h</sub>
  const parts = text.split(/(_[a-zA-Z]+)/g)
  return parts.map((part, i) => {
    if (part.startsWith('_')) {
      return <sub key={i}>{part.slice(1)}</sub>
    }
    return part
  })
}

function TransitionEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  source,
  target,
}: EdgeProps) {
  const { label, categoryLabel, isActive, isDokkaebi, isHighlighted } = (data ?? {}) as TransitionEdgeData
  const hasDualLabel = !!categoryLabel && !!label
  const isSelfLoop = source === target

  let edgePath: string
  let labelX: number
  let labelY: number

  if (isSelfLoop) {
    // Self-loop: draw a loop above the node
    const loopSize = 40
    edgePath = `M ${sourceX} ${sourceY - 30}
      C ${sourceX - loopSize} ${sourceY - 80},
        ${sourceX + loopSize} ${sourceY - 80},
        ${sourceX} ${sourceY - 30}`
    labelX = sourceX
    labelY = sourceY - 85
  } else {
    // Check if it's a return edge (target is to the left)
    const isReturn = targetX < sourceX
    if (isReturn) {
      const [path, lx, ly] = getBezierPath({
        sourceX,
        sourceY: sourceY + 10,
        targetX,
        targetY: targetY + 10,
        sourcePosition,
        targetPosition,
        curvature: 0.4,
      })
      edgePath = path
      labelX = lx
      labelY = ly + 15
    } else {
      const [path, lx, ly] = getBezierPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
        curvature: 0.25,
      })
      edgePath = path
      labelX = lx
      labelY = ly
    }
  }

  const strokeColor = isActive
    ? isDokkaebi
      ? '#f59e0b'
      : '#3b82f6'
    : isHighlighted
      ? '#10b981'
      : 'var(--color-foreground)'

  const markerType = isActive ? 'active' : isHighlighted ? 'highlight' : 'default'

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: strokeColor,
          strokeWidth: isActive ? 2.5 : isHighlighted ? 2 : 1.5,
          opacity: isActive || isHighlighted ? 1 : 0.6,
          strokeDasharray: isActive ? '6 3' : 'none',
          transition: 'stroke 0.3s, opacity 0.3s',
        }}
        markerEnd={`url(#arrow-${markerType})`}
      />
      {(label || categoryLabel) && (
        <foreignObject
          x={labelX - 50}
          y={hasDualLabel ? labelY - 20 : labelY - 14}
          width={100}
          height={hasDualLabel ? 42 : 28}
          className="pointer-events-none"
        >
          <div
            className={`
              text-center font-mono px-1.5 rounded flex flex-col items-center justify-center
              ${hasDualLabel ? 'py-0' : 'py-0.5'}
              ${isActive
                ? isDokkaebi
                  ? 'text-amber-400 bg-amber-500/20 font-bold'
                  : 'text-blue-400 bg-blue-500/20 font-bold'
                : isHighlighted
                  ? 'text-emerald-400 bg-emerald-500/20 font-bold'
                  : 'text-muted-foreground'
              }
            `}
          >
            {hasDualLabel ? (
              <>
                <span className="text-sm leading-tight">{parseCategoryLabel(categoryLabel)}</span>
                <span className="text-[10px] leading-tight opacity-50">{label}</span>
              </>
            ) : (
              <span className="text-sm">{label}</span>
            )}
          </div>
        </foreignObject>
      )}
    </>
  )
}

export const TransitionEdge = memo(TransitionEdgeComponent)
