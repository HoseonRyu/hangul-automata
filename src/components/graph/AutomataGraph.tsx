'use client'

import { useCallback, useMemo } from 'react'
import {
  ReactFlow,
  Background,
  type Node,
  type Edge,
  useNodesState,
  useEdgesState,
  type NodeTypes,
  type EdgeTypes,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { StateNode } from './StateNode'
import { TransitionEdge } from './TransitionEdge'

interface AutomataGraphProps {
  initialNodes: Node[]
  initialEdges: Edge[]
  activeState?: string | null
  activeEdgeId?: string | null
  isDokkaebi?: boolean
  className?: string
}

export function AutomataGraph({
  initialNodes,
  initialEdges,
  activeState,
  activeEdgeId,
  isDokkaebi,
  className = '',
}: AutomataGraphProps) {
  const nodeTypes: NodeTypes = useMemo(() => ({ stateNode: StateNode }), [])
  const edgeTypes: EdgeTypes = useMemo(() => ({ transitionEdge: TransitionEdge }), [])

  const processedNodes = useMemo(
    () =>
      initialNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isActive: node.id === activeState,
        },
      })),
    [initialNodes, activeState]
  )

  const processedEdges = useMemo(
    () =>
      initialEdges.map((edge) => ({
        ...edge,
        data: {
          ...edge.data,
          isActive: edge.id === activeEdgeId,
          isDokkaebi: edge.id === activeEdgeId && isDokkaebi,
        },
      })),
    [initialEdges, activeEdgeId, isDokkaebi]
  )

  const [nodes, , onNodesChange] = useNodesState(processedNodes)
  const [edges, , onEdgesChange] = useEdgesState(processedEdges)

  // Update nodes/edges when processed versions change
  useMemo(() => {
    onNodesChange(
      processedNodes.map((node) => ({
        type: 'reset' as const,
        item: node,
      }))
    )
  }, [processedNodes, onNodesChange])

  useMemo(() => {
    onEdgesChange(
      processedEdges.map((edge) => ({
        type: 'reset' as const,
        item: edge,
      }))
    )
  }, [processedEdges, onEdgesChange])

  return (
    <div className={`w-full h-[400px] rounded-lg border border-border bg-background/50 ${className}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
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
              <path d="M 0 0 L 10 5 L 0 10 z" className="fill-foreground/40" />
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
          </defs>
        </svg>
      </ReactFlow>
    </div>
  )
}
