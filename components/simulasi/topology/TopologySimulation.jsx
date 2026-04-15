'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TOPOLOGY_TYPES, NODE_LAYOUTS, getShuffledLayout } from '@/lib/topology-types';
import { getTopologyConfig } from '@/lib/topology-config';
import TopologyModeSelector from './TopologyModeSelector';
import TopologyCanvas from './TopologyCanvas';
import TopologyResult from './TopologyResult';
import SimulationCompletionModal from '@/components/simulasi/SimulationCompletionModal';

export default function TopologySimulation() {
  const [selectedTopology, setSelectedTopology] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [correctEdges, setCorrectEdges] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [score, setScore] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [startTime, setStartTime] = useState(null);

  // Timer for tracking time spent
  useEffect(() => {
    if (!selectedTopology || isFinished) return;

    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedTopology, isFinished]);

  // Initialize topology when selected
  useEffect(() => {
    if (!selectedTopology) {
      setNodes([]);
      setEdges([]);
      setCorrectEdges([]);
      setSelectedNodeId(null);
      setMistakes(0);
      setScore(null);
      setIsFinished(false);
      setTimeElapsed(0);
      return;
    }

    // Get shuffled layout for selected topology
    const layout = getShuffledLayout(selectedTopology);
    const layoutData = NODE_LAYOUTS[selectedTopology];
    setNodes(layout.map(n => ({ ...n })));
    setCorrectEdges(layoutData?.correctEdges || []);
    setEdges([]);
    setSelectedNodeId(null);
    setMistakes(0);
    setScore(null);
    setIsFinished(false);
    setTimeElapsed(0);
    setStartTime(Date.now());
  }, [selectedTopology]);

  // Handle node click for connection
  const handleNodeClick = useCallback(
    nodeId => {
      if (!selectedTopology) return;

      if (selectedNodeId === null) {
        // First click: select node
        setSelectedNodeId(nodeId);
      } else if (selectedNodeId === nodeId) {
        // Same node clicked again: deselect
        setSelectedNodeId(null);
      } else {
        // Second node clicked: create connection
        handleConnect(selectedNodeId, nodeId);
        setSelectedNodeId(null);
      }
    },
    [selectedNodeId, selectedTopology]
  );

  // Handle connection creation
  const handleConnect = useCallback((nodeA, nodeB) => {
    // Check if edge already exists
    const edgeExists = edges.some(
      ([a, b]) => (a === nodeA && b === nodeB) || (a === nodeB && b === nodeA)
    );

    if (edgeExists) {
      setFeedback({
        type: 'error',
        message: 'Koneksi ini sudah ada!',
      });
      setMistakes(prev => prev + 1);
      return;
    }

    if (edges.length >= correctEdges.length) {
      setFeedback({
        type: 'error',
        message: `Maksimum koneksi (${correctEdges.length}) tercapai! Hapus koneksi yang ada untuk membuat yang baru.`,
      });
      return;
    }

    // Add edge
    setEdges(prev => [...prev, [nodeA, nodeB]]);
    setFeedback({
      type: 'success',
      message: `Koneksi ${nodeA + 1} ↔ ${nodeB + 1} ditambahkan`,
    });
  }, [edges]);

  // Remove edge
  const handleRemoveEdge = useCallback((nodeA, nodeB) => {
    setEdges(prev =>
      prev.filter(([a, b]) => !((a === nodeA && b === nodeB) || (a === nodeB && b === nodeA)))
    );
    setFeedback({
      type: 'info',
      message: `Koneksi dihapus`,
    });
  }, []);

  // Finish simulation and submit
  const handleFinish = useCallback(async () => {
    if (!selectedTopology || nodes.length === 0) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/simulasi/topology', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topologyType: selectedTopology,
          nodes: nodes.map(n => ({ id: n.id })),
          edges,
          timeSpent: timeElapsed,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit topology');
      }

      const data = await response.json();

      if (data.success) {
        setScore({
          ...data.result,
          timeSpent: timeElapsed,
        });
        setIsFinished(true);
        setFeedback({
          type: data.result.isValid ? 'success' : 'error',
          message: data.result.feedback,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setFeedback({
        type: 'error',
        message: 'Gagal menyimpan hasil. Silakan coba lagi.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedTopology, nodes, edges, timeElapsed]);

  // Reset for new topology
  const handleReset = useCallback(() => {
    setSelectedTopology(null);
    setNodes([]);
    setEdges([]);
    setSelectedNodeId(null);
    setScore(null);
    setMistakes(0);
    setIsFinished(false);
    setTimeElapsed(0);
    setFeedback(null);
  }, []);

  // Format time
  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Show result if finished
  if (isFinished && score) {
    return (
      <div>
        <TopologyResult
          topology={selectedTopology}
          score={score}
          nodes={nodes}
          edges={edges}
          correctEdges={correctEdges}
          onReset={handleReset}
        />
        <SimulationCompletionModal
          isOpen={true}
          score={score.score ?? 0}
          correctCount={score.correctCount ?? 0}
          totalCount={score.totalCorrect ?? correctEdges.length}
          expGained={0}
          simulationName={`Simulasi Topologi ${getTopologyConfig(selectedTopology)?.name || selectedTopology}`}
          onReset={handleReset}
        />
      </div>
    );
  }

  // Show selector if no topology selected
  if (!selectedTopology) {
    return <TopologyModeSelector onSelectTopology={setSelectedTopology} />;
  }

  // Get topology config
  const config = getTopologyConfig(selectedTopology);
  
  // Calculate correct connection count
  const correctCount = edges.filter(([a, b]) => {
    const normalized = [Math.min(a, b), Math.max(a, b)];
    return correctEdges.some(ce => {
      const ceNormalized = [Math.min(ce[0], ce[1]), Math.max(ce[0], ce[1])];
      return ceNormalized[0] === normalized[0] && ceNormalized[1] === normalized[1];
    });
  }).length;

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleReset}
            className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition-colors"
          >
            ← Kembali ke Menu
          </button>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-3 flex items-center gap-4 tracking-tight drop-shadow-sm font-sans">
            <span className="text-4xl md:text-5xl drop-shadow-md text-black">{config?.icon}</span>
            {config?.name}
          </h1>
          <p className="text-gray-600">{config?.description}</p>
        </div>

        {/* Feedback Messages */}
        {feedback && (
          <div
            className={`mb-4 p-3 rounded text-white ${
              feedback.type === 'success'
                ? 'bg-green-600'
                : feedback.type === 'error'
                  ? 'bg-red-600'
                  : 'bg-blue-600'
            }`}
          >
            {feedback.message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel: Rules & Tips */}
          <div className="lg:col-span-1 border border-gray-200 rounded-lg p-6 bg-white">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Aturan Topologi</h2>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-2 text-sm">Koneksi yang diperlukan:</h3>
              <ul className="space-y-1 text-gray-700 text-sm">
                {config?.rules?.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-2 text-sm">Tips:</h3>
              <ul className="space-y-2">
                {config?.tips?.map((tip, idx) => (
                  <li key={idx} className="text-gray-700 text-sm flex gap-2">
                    <span className="text-blue-600">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Center Panel: Canvas */}
          <div className="lg:col-span-2 space-y-6">
            {/* Canvas */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <TopologyCanvas
                nodes={nodes}
                edges={edges}
                correctEdges={correctEdges}
                selectedNodeId={selectedNodeId}
                onNodeClick={handleNodeClick}
                onEdgeClick={handleRemoveEdge}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setEdges([]);
                  setSelectedNodeId(null);
                  setMistakes(0);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition-colors"
              >
                Reset
              </button>
              <button
                onClick={handleFinish}
                disabled={isLoading || edges.length === 0}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded transition-colors font-semibold"
              >
                {isLoading ? 'Mengirim...' : 'Selesai & Kirim'}
              </button>
            </div>
          </div>

          {/* Right Panel: Stats */}
          <div className="lg:col-span-1 border border-gray-200 rounded-lg p-6 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Sesi</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Waktu:</span>
                <strong className="text-gray-900">{formatTime(timeElapsed)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Koneksi:</span>
                <strong className="text-gray-900">{edges.length} / {correctEdges.length}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Benar:</span>
                <strong className="text-green-600">{correctCount}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Kesalahan:</span>
                <strong className="text-red-600">{mistakes}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Node:</span>
                <strong className="text-gray-900">{nodes.length}</strong>
              </div>
            </div>

            {edges.length === correctEdges.length && edges.length > 0 ? (
              <div className="mt-4 p-3 rounded bg-blue-50 text-blue-700 text-sm">
                Semua koneksi telah dibuat. Periksa kebenarannya lalu tekan Selesai.
              </div>
            ) : edges.length > 0 ? (
              <div className="mt-4 p-3 rounded bg-yellow-50 text-yellow-700 text-sm">
                Masih perlu {correctEdges.length - edges.length} koneksi lagi.
              </div>
            ) : (
              <div className="mt-4 p-3 rounded bg-gray-50 text-gray-700 text-sm">
                Mulai dengan klik node pertama, lalu node kedua untuk membuat koneksi.
              </div>
            )}
          </div>
        </div>

        {/* Node List at Bottom */}
        <div className="mt-6 bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Node yang Tersedia:</h3>
          <div className="flex flex-wrap gap-2">
            {nodes.map(node => (
              <button
                key={node.id}
                onClick={() => handleNodeClick(node.id)}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  selectedNodeId === node.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {node.label} ({node.id + 1})
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
