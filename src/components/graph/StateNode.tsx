'use client'

import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { motion } from 'motion/react'

interface StateNodeData {
  label: string
  isStart: boolean
  isFinal: boolean
  description?: string
  isActive?: boolean
  [key: string]: unknown
}

function StateNodeComponent({ data }: NodeProps) {
  const { label, isStart, isFinal, isActive, description } = data as StateNodeData

  return (
    <motion.div
      className="relative flex items-center justify-center"
      animate={
        isActive
          ? { scale: [1, 1.08, 1], transition: { duration: 0.6, repeat: Infinity } }
          : { scale: 1 }
      }
    >
      {isStart && (
        <div className="absolute -left-8 top-1/2 -translate-y-1/2">
          <svg width="20" height="20" viewBox="0 0 20 20">
            <polygon points="0,0 20,10 0,20" className="fill-foreground/60" />
          </svg>
        </div>
      )}

      <div
        className={`
          relative flex items-center justify-center rounded-full
          w-16 h-16 border-2 transition-colors duration-300
          ${isActive
            ? 'border-blue-500 bg-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.5)]'
            : 'border-foreground/40 bg-background'
          }
          ${isFinal ? 'ring-2 ring-offset-2 ring-foreground/40 ring-offset-background' : ''}
        `}
      >
        <span className={`text-sm font-mono font-bold ${isActive ? 'text-blue-400' : 'text-foreground'}`}>
          {label}
        </span>
      </div>

      {description && (
        <div className="absolute -bottom-5 text-xs text-muted-foreground whitespace-nowrap">
          {description}
        </div>
      )}

      <Handle type="target" position={Position.Left} className="!bg-foreground/40 !w-2 !h-2" />
      <Handle type="source" position={Position.Right} className="!bg-foreground/40 !w-2 !h-2" />
    </motion.div>
  )
}

export const StateNode = memo(StateNodeComponent)
