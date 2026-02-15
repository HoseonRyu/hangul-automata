'use client'

import { memo } from 'react'
import {
  BaseEdge,
  getBezierPath,
  getStraightPath,
  type EdgeProps,
} from '@xyflow/react'

interface TransitionEdgeData {
  label?: string
  symbols?: string[]
  isActive?: boolean
  isDokkaebi?: boolean
  [key: string]: unknown
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
  const { label, isActive, isDokkaebi } = (data ?? {}) as TransitionEdgeData
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
    : 'var(--color-foreground)'

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: strokeColor,
          strokeWidth: isActive ? 2.5 : 1.5,
          opacity: isActive ? 1 : 0.4,
          strokeDasharray: isActive ? '6 3' : 'none',
          transition: 'stroke 0.3s, opacity 0.3s',
        }}
        markerEnd={`url(#arrow-${isActive ? 'active' : 'default'})`}
      />
      {label && (
        <foreignObject
          x={labelX - 50}
          y={labelY - 14}
          width={100}
          height={28}
          className="pointer-events-none"
        >
          <div
            className={`
              text-center text-sm font-mono px-1.5 py-0.5 rounded
              ${isActive
                ? isDokkaebi
                  ? 'text-amber-400 bg-amber-500/20 font-bold'
                  : 'text-blue-400 bg-blue-500/20 font-bold'
                : 'text-muted-foreground'
              }
            `}
          >
            {label}
          </div>
        </foreignObject>
      )}
    </>
  )
}

export const TransitionEdge = memo(TransitionEdgeComponent)
