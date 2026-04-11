'use client';

import React from 'react';

export default function TopologyCanvas({
  nodes,
  edges,
  correctEdges,
  selectedNodeId,
  onNodeClick,
  onEdgeClick,
}) {
  const CANVAS_WIDTH = 1000;
  const CANVAS_HEIGHT = 650;
  const NODE_RADIUS = 50;
  const PADDING_X = 100;
  const PADDING_Y = 100;

  // Scale positions from percentage to actual canvas coordinates with padding
  const scalePosition = (percentage, dimension, padding) => {
    const usableSpace = dimension - (padding * 2);
    return padding + (percentage / 100) * usableSpace;
  };

  // Check if an edge is correct
  const isEdgeCorrect = (nodeAId, nodeBId) => {
    const normalized = [Math.min(nodeAId, nodeBId), Math.max(nodeAId, nodeBId)];
    return correctEdges.some(ce => {
      const ceNormalized = [Math.min(ce[0], ce[1]), Math.max(ce[0], ce[1])];
      return ceNormalized[0] === normalized[0] && ceNormalized[1] === normalized[1];
    });
  };

  return (
    <div className="flex flex-col justify-center items-center bg-slate-50 rounded-lg p-4 w-full">
      <svg
        viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
        className="border border-gray-300 rounded bg-white w-full h-auto min-h-[400px]"
        style={{ maxHeight: '700px' }}
      >
        {/* Draw edges first (behind nodes) */}
        <g>
          {edges.map(([nodeAId, nodeBId], edgeIdx) => {
            const nodeA = nodes.find(n => n.id === nodeAId);
            const nodeB = nodes.find(n => n.id === nodeBId);

            if (!nodeA || !nodeB) return null;

            const x1 = scalePosition(nodeA.x, CANVAS_WIDTH, PADDING_X);
            const y1 = scalePosition(nodeA.y, CANVAS_HEIGHT, PADDING_Y);
            const x2 = scalePosition(nodeB.x, CANVAS_WIDTH, PADDING_X);
            const y2 = scalePosition(nodeB.y, CANVAS_HEIGHT, PADDING_Y);
            
            const isCorrect = isEdgeCorrect(nodeAId, nodeBId);

            return (
              <g key={`edge-${edgeIdx}`}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isCorrect ? '#10b981' : '#ef4444'}
                  strokeWidth="10"
                  className="cursor-pointer hover:stroke-gray-700 transition-colors"
                  onClick={() => onEdgeClick(nodeAId, nodeBId)}
                />

                {/* Checkmark or X for correctness */}
                <text
                  x={(x1 + x2) / 2}
                  y={(y1 + y2) / 2 - 12}
                  fontSize="18"
                  fontWeight="bold"
                  fill={isCorrect ? '#10b981' : '#ef4444'}
                  textAnchor="middle"
                  className="pointer-events-none"
                >
                  {isCorrect ? '✓' : '✗'}
                </text>
              </g>
            );
          })}
        </g>

        {/* Draw nodes */}
        <g>
          {nodes.map(node => {
            const x = scalePosition(node.x, CANVAS_WIDTH, PADDING_X);
            const y = scalePosition(node.y, CANVAS_HEIGHT, PADDING_Y);
            const isSelected = selectedNodeId === node.id;

            return (
              <g
                key={`node-${node.id}`}
                onClick={() => onNodeClick(node.id)}
                className="cursor-pointer"
              >
                {/* Node circle */}
                <circle
                  cx={x}
                  cy={y}
                  r={NODE_RADIUS}
                  fill={isSelected ? '#3b82f6' : '#f3f4f6'}
                  stroke={isSelected ? '#3b82f6' : '#d1d5db'}
                  strokeWidth={isSelected ? '4' : '3'}
                  className="transition-all hover:stroke-blue-400"
                />

                {/* Node icon/label */}
                <text
                  x={x}
                  y={y}
                  fontSize="27"
                  fontWeight="bold"
                  fill={isSelected ? '#fff' : '#374151'}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="pointer-events-none select-none"
                >
                  {node.id + 1}
                </text>

                {/* Node name label */}
                <text
                  x={x}
                  y={y + NODE_RADIUS + 30}
                  fontSize="20"
                  fill="#6b7280"
                  textAnchor="middle"
                  className="pointer-events-none select-none"
                >
                  {node.label}
                </text>

                {/* Selection highlight */}
                {isSelected && (
                  <circle
                    cx={x}
                    cy={y}
                    r={NODE_RADIUS + 15}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeDasharray="3,3"
                    className="animate-pulse"
                  />
                )}
              </g>
            );
          })}
        </g>

      </svg>
      
      {/* Instructions */}
      <div className="mt-4 text-center text-gray-500 font-medium text-sm px-4">
        Klik node pertama, kemudian node kedua untuk membuat koneksi. Klik edge untuk menghapus.
      </div>
    </div>
  );
}
