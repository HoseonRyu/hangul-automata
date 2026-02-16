'use client'

import { memo } from 'react'
import { type NodeProps } from '@xyflow/react'

const colorMap: Record<string, { bg: string; border: string; text: string }> = {
  slate: {
    bg: 'rgba(100, 116, 139, 0.08)',
    border: 'rgba(100, 116, 139, 0.25)',
    text: 'rgb(148, 163, 184)',
  },
  emerald: {
    bg: 'rgba(16, 185, 129, 0.08)',
    border: 'rgba(16, 185, 129, 0.25)',
    text: 'rgb(52, 211, 153)',
  },
  blue: {
    bg: 'rgba(59, 130, 246, 0.08)',
    border: 'rgba(59, 130, 246, 0.25)',
    text: 'rgb(96, 165, 250)',
  },
  amber: {
    bg: 'rgba(245, 158, 11, 0.08)',
    border: 'rgba(245, 158, 11, 0.25)',
    text: 'rgb(251, 191, 36)',
  },
}

interface GroupBackgroundData {
  label: string
  width: number
  height: number
  color: string
  [key: string]: unknown
}

function GroupBackgroundComponent({ data }: NodeProps) {
  const { label, width, height, color } = data as GroupBackgroundData
  const colors = colorMap[color] ?? colorMap.slate

  return (
    <div
      className="pointer-events-none"
      style={{
        width,
        height,
        backgroundColor: colors.bg,
        border: `1px dashed ${colors.border}`,
        borderRadius: 12,
        position: 'relative',
      }}
    >
      <span
        className="absolute top-2 left-3 text-xs font-medium"
        style={{ color: colors.text }}
      >
        {label}
      </span>
    </div>
  )
}

export const GroupBackground = memo(GroupBackgroundComponent)
