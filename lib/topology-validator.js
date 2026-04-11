/**
 * Graph validation utility for topology verification
 */

import { TOPOLOGY_TYPES, TOPOLOGY_INFO } from './topology-types';

/**
 * Build adjacency list from edges
 * @param {Array} nodes - Array of node objects
 * @param {Array} edges - Array of [nodeIdA, nodeIdB] pairs
 * @returns {Map} - adjacency list as Map<nodeId, Set<connectedNodeIds>>
 */
export function buildAdjacencyList(nodes, edges) {
  const adjacencyList = new Map();

  nodes.forEach(node => {
    adjacencyList.set(node.id, new Set());
  });

  edges.forEach(([nodeA, nodeB]) => {
    adjacencyList.get(nodeA)?.add(nodeB);
    adjacencyList.get(nodeB)?.add(nodeA); // undirected graph
  });

  return adjacencyList;
}

/**
 * Check if all nodes are connected (one connected component)
 * @param {Map} adjacencyList - adjacency list
 * @returns {boolean}
 */
export function isConnected(adjacencyList) {
  if (adjacencyList.size === 0) return true;

  const visited = new Set();
  const stack = [adjacencyList.keys().next().value]; // Start from first node

  while (stack.length > 0) {
    const current = stack.pop();
    if (visited.has(current)) continue;

    visited.add(current);
    adjacencyList.get(current).forEach(neighbor => {
      if (!visited.has(neighbor)) {
        stack.push(neighbor);
      }
    });
  }

  return visited.size === adjacencyList.size;
}

/**
 * Detect cycle in undirected graph using DFS
 * @param {Map} adjacencyList
 * @returns {boolean}
 */
export function hasCycle(adjacencyList) {
  const visited = new Set();
  const recursionStack = new Set();

  function dfs(node, parent) {
    visited.add(node);
    recursionStack.add(node);

    for (let neighbor of adjacencyList.get(node)) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor, node)) return true;
      } else if (neighbor !== parent && recursionStack.has(neighbor)) {
        // Cycle detected untuk undirected graph
        return true;
      }
    }

    recursionStack.delete(node);
    return false;
  }

  for (let node of adjacencyList.keys()) {
    if (!visited.has(node)) {
      if (dfs(node, null)) return true;
    }
  }

  return false;
}

/**
 * Get degree of each node
 * @param {Map} adjacencyList
 * @returns {Map} - nodeId -> degree
 */
export function getNodeDegrees(adjacencyList) {
  const degrees = new Map();

  adjacencyList.forEach((neighbors, nodeId) => {
    degrees.set(nodeId, neighbors.size);
  });

  return degrees;
}

/**
 * Validate Star topology
 * Central node must be connected to all others, others only to central
 */
export function isValidStar(nodes, adjacencyList) {
  const degrees = getNodeDegrees(adjacencyList);

  // Find potential central node (should have degree = nodes.length - 1)
  const centralCandidates = Array.from(degrees.entries()).filter(
    ([_, degree]) => degree === nodes.length - 1
  );

  if (centralCandidates.length !== 1) return false;

  const [centralNode] = centralCandidates[0];

  // All other nodes should have degree 1 and only connected to central
  for (let node of nodes) {
    if (node.id === centralNode) continue;

    const neighbors = adjacencyList.get(node.id);
    if (neighbors.size !== 1 || !neighbors.has(centralNode)) {
      return false;
    }
  }

  return true;
}

/**
 * Validate Ring topology
 * Circular chain, all nodes degree 2, no additional connections
 */
export function isValidRing(nodes, adjacencyList) {
  const degrees = getNodeDegrees(adjacencyList);

  // All nodes must have degree 2
  for (let [_, degree] of degrees) {
    if (degree !== 2) return false;
  }

  // Must be connected
  if (!isConnected(adjacencyList)) return false;

  // Must have exactly one cycle
  if (!hasCycle(adjacencyList)) return false;

  // Check if it's a proper ring (not multiple cycles)
  // Ring should have exactly n edges for n nodes
  const edgeCount = Array.from(degrees.values()).reduce((sum, d) => sum + d, 0) / 2;
  if (edgeCount !== nodes.length) return false;

  return true;
}

/**
 * Validate Mesh topology
 * All nodes connected to all other nodes
 */
export function isValidMesh(nodes, adjacencyList) {
  const expectedConnections = (nodes.length * (nodes.length - 1)) / 2;
  const edgeCount = Array.from(adjacencyList.values()).reduce(
    (sum, neighbors) => sum + neighbors.size,
    0
  ) / 2;

  if (edgeCount !== expectedConnections) return false;

  // Every pair should be connected
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const neighbors = adjacencyList.get(nodes[i].id);
      if (!neighbors || !neighbors.has(nodes[j].id)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Validate Bus topology
 * Linear chain, each node degree at most 2, no cycles
 */
export function isValidBus(nodes, adjacencyList) {
  const degrees = getNodeDegrees(adjacencyList);

  // Must be connected
  if (!isConnected(adjacencyList)) return false;

  // Must NOT have cycles
  if (hasCycle(adjacencyList)) return false;

  // Count nodes with degree 1 (endpoints) - should be 2
  const endpointCount = Array.from(degrees.values()).filter(d => d === 1).length;
  if (endpointCount !== 2) return false;

  // All other nodes should have degree 2
  for (let [_, degree] of degrees) {
    if (degree !== 1 && degree !== 2) return false;
  }

  // Must have exactly n-1 edges
  const edgeCount = Array.from(degrees.values()).reduce((sum, d) => sum + d, 0) / 2;
  if (edgeCount !== nodes.length - 1) return false;

  return true;
}

/**
 * Validate Tree topology
 * Connected acyclic graph
 */
export function isValidTree(nodes, adjacencyList) {
  // Must be connected
  if (!isConnected(adjacencyList)) return false;

  // Must NOT have cycles
  if (hasCycle(adjacencyList)) return false;

  // Must have exactly n-1 edges
  const edgeCount = Array.from(adjacencyList.values()).reduce(
    (sum, neighbors) => sum + neighbors.size,
    0
  ) / 2;
  if (edgeCount !== nodes.length - 1) return false;

  return true;
}

/**
 * Validate Hybrid topology
 * Flexible - just needs to be connected
 */
export function isValidHybrid(nodes, adjacencyList) {
  // Must be connected
  if (!isConnected(adjacencyList)) return false;

  // Should have meaningful connections (at least n-1)
  const edgeCount = Array.from(adjacencyList.values()).reduce(
    (sum, neighbors) => sum + neighbors.size,
    0
  ) / 2;
  if (edgeCount < nodes.length - 1) return false;

  return true;
}

/**
 * Main validation function
 * Now checks against correct edges for exact solution
 * @param {Array} nodes - Array of node objects with id, label, type
 * @param {Array} edges - Array of [nodeIdA, nodeIdB] connections
 * @param {string} topologyType - Type of topology
 * @param {Array} correctEdges - The correct edges that should be created
 * @returns {Object} - { isValid: boolean, errors: Array<string>, correctCount: number }
 */
export function validateTopology(nodes, edges, topologyType, correctEdges) {
  const errors = [];
  let correctCount = 0;

  // Validation dasar
  if (!nodes || nodes.length === 0) {
    errors.push('Tidak ada node');
    return { isValid: false, errors, correctCount: 0 };
  }

  if (!correctEdges || correctEdges.length === 0) {
    errors.push('Tidak ada referensi jawaban yang benar');
    return { isValid: false, errors, correctCount: 0 };
  }

  // Normalize edges to allow for order-independent comparison
  const normalizeEdge = ([a, b]) => {
    return [Math.min(a, b), Math.max(a, b)];
  };

  const normalizedUserEdges = edges.map(normalizeEdge);
  const normalizedCorrectEdges = correctEdges.map(normalizeEdge);

  // Check each user edge
  for (const userEdge of normalizedUserEdges) {
    const isCorrect = normalizedCorrectEdges.some(
      ce => ce[0] === userEdge[0] && ce[1] === userEdge[1]
    );

    if (isCorrect) {
      correctCount++;
    } else {
      errors.push(`Koneksi ${userEdge[0] + 1}↔${userEdge[1] + 1} tidak sesuai`);
    }
  }

  // Check for missing edges
  const missingEdges = normalizedCorrectEdges.filter(
    ce => !normalizedUserEdges.some(ue => ue[0] === ce[0] && ue[1] === ce[1])
  );

  if (missingEdges.length > 0) {
    errors.push(`Kurang ${missingEdges.length} koneksi`);
    missingEdges.slice(0, 3).forEach(edge => {
      // Only show first 3 missing edges as hints
    });
  }

  const isValid = errors.length === 0 && correctCount === normalizedCorrectEdges.length;

  return { isValid, errors, correctCount };
}

/**
 * Calculate score based on validation
 * @param {Array} nodes
 * @param {Array} edges
 * @param {string} topologyType
 * @param {Array} correctEdges - The correct edges
 * @param {number} timeSpent - in seconds
 * @returns {Object} - { score: number, feedback: string, details: Object }
 */
export function calculateScore(nodes, edges, topologyType, correctEdges, timeSpent = 0) {
  const validation = validateTopology(nodes, edges, topologyType, correctEdges);
  
  let score = 0;
  const maxScore = 100;
  const totalCorrectEdges = correctEdges?.length || 0;

  if (validation.isValid) {
    score = maxScore;
  } else {
    // Partial scoring: base score on correct connections
    const pointsPerEdge = totalCorrectEdges > 0 ? maxScore * 0.8 / totalCorrectEdges : 0;
    score = Math.floor(validation.correctCount * pointsPerEdge);

    // Bonus: 20 points if all correct edges are present (even with extra connections)
    const hasAllCorrect = validation.correctCount === totalCorrectEdges;
    if (hasAllCorrect && edges.length > totalCorrectEdges) {
      score = Math.max(score, 80); // At least 80 if all correct but has extra
    }
  }

  // Time bonus (max +5 jika selesai < 5 menit)
  if (timeSpent < 300) {
    score += Math.max(1, Math.floor(5 * (1 - timeSpent / 300)));
  }

  return {
    score: Math.min(maxScore, score),
    isValid: validation.isValid,
    errors: validation.errors,
    correctCount: validation.correctCount,
    totalCorrect: totalCorrectEdges,
    feedback:
      validation.errors.length === 0
        ? `✓ Topologi ${topologyType} benar! Skor: ${Math.min(maxScore, score)}`
        : `✗ Ada kesalahan:\n${validation.errors.join('\n')}`,
    details: {
      edgeCount: edges.length,
      correctEdgeCount: validation.correctCount,
      totalCorrectEdges: totalCorrectEdges,
      nodeCount: nodes.length,
      accuracy: totalCorrectEdges > 0 ? Math.round((validation.correctCount / totalCorrectEdges) * 100) : 0,
      timeSpent,
    },
  };
}
