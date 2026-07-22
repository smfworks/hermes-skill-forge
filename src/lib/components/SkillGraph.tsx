"use client";

import { useState, useEffect, useCallback } from "react";
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  Node,
  Edge,
  NodeTypes,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import type { GraphNode, GraphEdge, Skill, Lineage } from "@/lib/types";
import { Code, GitBranch, Zap, Clock } from "lucide-react";

// Custom node component for skills
function SkillNode({ data }: { data: { label: string; version: string; status: string; description: string } }) {
  const statusColors = {
    active: "border-green-400",
    evolving: "border-amber-400",
    deprecated: "border-slate-500",
    experimental: "border-blue-400",
  };

  const borderColor = statusColors[data.status as keyof typeof statusColors] || "border-slate-500";

  return (
    <div className={`bg-slate-800 border-2 ${borderColor} rounded-xl p-3 min-w-[140px] text-center`}>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <div className="flex items-center justify-center mb-1">
        <Code className="w-4 h-4 text-purple-400" />
      </div>
      <div className="text-white text-sm font-medium">{data.label}</div>
      <div className="text-slate-400 text-xs">v{data.version}</div>
      <div className="text-slate-500 text-xs capitalize">{data.status}</div>
    </div>
  );
}

const nodeTypes: NodeTypes = {
  skill: SkillNode,
};

interface SkillGraphProps {
  skills: Skill[];
  lineages: Lineage[];
  graph: { nodes: GraphNode[]; edges: GraphEdge[] };
}

export default function SkillGraph({ skills, lineages, graph }: SkillGraphProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    // Convert graph data to React Flow format
    const rfNodes: Node[] = graph.nodes.map((node) => ({
      id: node.id,
      type: node.type,
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: {
        label: node.name,
        version: node.version,
        status: node.status,
        description: node.description,
      },
    }));

    // Filter edges to only include those with valid source/target
    const rfEdges: Edge[] = graph.edges
      .filter((edge) => {
        const sourceExists = rfNodes.some((n) => n.id === edge.source);
        const targetExists = rfNodes.some((n) => n.id === edge.target);
        return sourceExists && targetExists;
      })
      .map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: "smoothstep",
        label: edge.label || "",
        animated: edge.type === "branch",
        style: {
          stroke: edge.type === "evolution" ? "#22c55e" :
                  edge.type === "branch" ? "#f59e0b" :
                  "#8b5cf6",
          strokeWidth: edge.type === "branch" ? 3 : 2,
        },
      }));

    setNodes(rfNodes);
    setEdges(rfEdges);
  }, [graph]);

  const onInit = useCallback((instance: any) => {
    const centerX = 500;
    const centerY = 400;
    const radius = 300;
    const nodeCount = nodes.length;

    nodes.forEach((node, index) => {
      const angle = (index / nodeCount) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      instance.setNodePosition(node.id, { x, y });
    });

    instance.fitView({ duration: 1000 });
  }, [nodes]);

  return (
    <div className="bg-gradient-card border border-slate-800 rounded-xl p-6">
      <div className="h-[500px] w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onInit={onInit}
          fitView
          attributionPosition="bottom-left"
        >
          <MiniMap
            nodeColor={(node) => {
              const status = node.data.status;
              if (status === "active") return "#22c55e";
              if (status === "evolving") return "#f59e0b";
              if (status === "experimental") return "#3b82f6";
              return "#64748b";
            }}
            nodeStrokeWidth={3}
            maskColor="rgba(10, 10, 10, 0.6)"
          />
          <Controls />
          <Background
            color="#334155"
            gap={16}
            lineWidth={1}
          />
        </ReactFlow>
      </div>
    </div>
  );
}
