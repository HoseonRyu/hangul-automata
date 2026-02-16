'use client'

import { useMemo } from 'react'
import {
  ReactFlow,
  Background,
  type Node,
  type Edge,
  type NodeTypes,
  type EdgeTypes,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { StateNode } from './StateNode'
import { TransitionEdge } from './TransitionEdge'
import { GroupBackground } from './GroupBackground'

interface AutomataGraphProps {
  initialNodes: Node[]
  initialEdges: Edge[]
  activeState?: string | null
  activeEdgeId?: string | null
  highlightNodes?: string[]
  highlightEdges?: string[]
  isDokkaebi?: boolean
  className?: string
}

export function AutomataGraph({
  initialNodes,
  initialEdges,
  activeState,
  activeEdgeId,
  highlightNodes,
  highlightEdges,
  isDokkaebi,
  className = '',
}: AutomataGraphProps) {
  const nodeTypes: NodeTypes = useMemo(() => ({ stateNode: StateNode, groupBackground: GroupBackground }), [])
  const edgeTypes: EdgeTypes = useMemo(() => ({ transitionEdge: TransitionEdge }), [])

  const nodes = useMemo(
    () =>
      initialNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          ...(node.type === 'stateNode' && {
            isActive: node.id === activeState,
            isHighlighted: highlightNodes?.includes(node.id) ?? false,
          }),
        },
      })),
    [initialNodes, activeState, highlightNodes]
  )

  const edges = useMemo(
    () =>
      initialEdges.map((edge) => ({
        ...edge,
        data: {
          ...edge.data,
          isActive: edge.id === activeEdgeId,
          isDokkaebi: edge.id === activeEdgeId && isDokkaebi,
          isHighlighted: highlightEdges?.includes(edge.id) ?? false,
        },
      })),
    [initialEdges, activeEdgeId, isDokkaebi, highlightEdges]
  )

  return (
    <div className={`w-full h-[360px] rounded-lg border border-border bg-background/50 ${className}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        zoomOnScroll={false}
        panOnDrag={false}
        minZoom={0.5}
        maxZoom={1.5}
      >
        <Background gap={20} size={1} className="opacity-30" />
        <svg>
          <defs>
            <marker
              id="arrow-default"
              viewBox="0 0 10 10"
              refX="10"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" className="fill-foreground/70" />
            </marker>
            <marker
              id="arrow-active"
              viewBox="0 0 10 10"
              refX="10"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
            </marker>
            <marker
              id="arrow-highlight"
              viewBox="0 0 10 10"
              refX="10"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
            </marker>
          </defs>
        </svg>
      </ReactFlow>
    </div>
  )
}
