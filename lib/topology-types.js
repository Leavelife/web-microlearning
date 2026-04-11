/**
 * Topology types and constants for network topology simulator
 */

export const TOPOLOGY_TYPES = {
  STAR: 'star',
  RING: 'ring',
  MESH: 'mesh',
  BUS: 'bus',
  TREE: 'tree',
  HYBRID: 'hybrid',
};

export const TOPOLOGY_INFO = {
  [TOPOLOGY_TYPES.STAR]: {
    name: 'Star Topology',
    description: 'Topologi dimana semua node terhubung ke satu node pusat (switch/hub). Node tidak boleh saling terhubung langsung.',
    icon: '⭐',
    nodeCount: 5,
    expectedConnections: 4, // semua node ke pusat
    rules: {
      requiresCentralNode: true,
      allowedDegrees: { central: -1, others: 1 }, // pusat koneksi ke semua, others hanya ke pusat
      maxDegree: 1, // untuk node non-pusat
      noCycles: true,
    },
  },
  [TOPOLOGY_TYPES.RING]: {
    name: 'Ring Topology',
    description: 'Topologi dimana setiap node terhubung ke 2 node lain membentuk lingkaran. Setiap node memiliki degree 2.',
    icon: '⭕',
    nodeCount: 5,
    expectedConnections: 5, // lingkat tertutup
    rules: {
      requiresCentralNode: false,
      allNodesDegree: 2, // semua node degree 2
      hasCycle: true,
      isCyclicOnly: true, // hanya ada 1 cycle
    },
  },
  [TOPOLOGY_TYPES.MESH]: {
    name: 'Mesh Topology',
    description: 'Topologi dimana setiap node terhubung ke semua node lainnya. Konektivitas maksimal.',
    icon: '🔗',
    nodeCount: 4,
    expectedConnections: 6, // n*(n-1)/2 untuk n=4: 6
    rules: {
      fullMesh: true, // semua node ke semua node
      minConnectivity: 1, // fully connected graph
    },
  },
  [TOPOLOGY_TYPES.BUS]: {
    name: 'Bus Topology',
    description: 'Topologi linear dimana semua node terhubung pada satu garis/saluran. Node pada ujung memiliki degree 1, node tengah degree 2.',
    icon: '━━',
    nodeCount: 5,
    expectedConnections: 4, // linear chain: n-1
    rules: {
      linearChain: true, // harus membentuk garis lurus
      maxDegree: 2,
      hasCycle: false,
      minNodeDegree: 1,
    },
  },
  [TOPOLOGY_TYPES.TREE]: {
    name: 'Tree Topology',
    description: 'Topologi hierarchical dimana node-node terhubung dalam struktur pohon. Tidak ada cycle, semua connected.',
    icon: '🌳',
    nodeCount: 6,
    expectedConnections: 5, // tree: n-1
    rules: {
      tree: true, // connected acyclic graph
      noCycles: true,
      allConnected: true,
    },
  },
  [TOPOLOGY_TYPES.HYBRID]: {
    name: 'Hybrid Topology',
    description: 'Kombinasi dari 2 atau lebih topologi dasar. Flexible connectivity sesuai kebutuhan.',
    icon: '🔀',
    nodeCount: 7,
    expectedConnections: 'variable', // bisa bervariasi
    rules: {
      flexible: true, // rules ditentukan per case
      minConnectivity: 'allConnected', // minimal semua node connected
    },
  },
};

export const NODE_TYPES = {
  DEVICE: 'device',
  SERVER: 'server',
  SWITCH: 'switch',
  ROUTER: 'router',
  PRINTER: 'printer',
  WORKSTATION: 'workstation',
};

export const NODE_ICONS = {
  [NODE_TYPES.DEVICE]: '💻',
  [NODE_TYPES.SERVER]: '🖥️',
  [NODE_TYPES.SWITCH]: '🔌',
  [NODE_TYPES.ROUTER]: '📡',
  [NODE_TYPES.PRINTER]: '🖨️',
  [NODE_TYPES.WORKSTATION]: '🖱️',
};

/**
 * Scoring configuration
 */
export const SCORING = {
  BASE_POINTS: 100,
  POINTS_PER_CORRECT_CONNECTION: 20,
  PENALTY_PER_INVALID_CONNECTION: -5,
  PENALTY_PER_MISSING_CONNECTION: -10,
  TIME_BONUS_THRESHOLD: 300, // bonus jika selesai < 5 menit
  TIME_PENALTY_PER_SECOND: -0.1,
};

/**
 * Predefined node layouts per topology
 */
export const NODE_LAYOUTS = {
  [TOPOLOGY_TYPES.STAR]: {
    // Satu node di tengah, sisanya di circle
    positions: [
      { id: 0, x: 50, y: 50, label: 'Switch', type: NODE_TYPES.SWITCH }, // center
      { id: 1, x: 20, y: 20, label: 'PC 1', type: NODE_TYPES.DEVICE },
      { id: 2, x: 80, y: 20, label: 'PC 2', type: NODE_TYPES.DEVICE },
      { id: 3, x: 20, y: 80, label: 'PC 3', type: NODE_TYPES.DEVICE },
      { id: 4, x: 80, y: 80, label: 'PC 4', type: NODE_TYPES.DEVICE },
    ],
    // Correct edges: all PCs connected to switch (node 0)
    correctEdges: [[0, 1], [0, 2], [0, 3], [0, 4]],
  },
  [TOPOLOGY_TYPES.RING]: {
    // Nodes arranged dalam circle
    positions: [
      { id: 0, x: 50, y: 10, label: 'PC 1', type: NODE_TYPES.DEVICE },
      { id: 1, x: 85, y: 30, label: 'PC 2', type: NODE_TYPES.DEVICE },
      { id: 2, x: 80, y: 70, label: 'PC 3', type: NODE_TYPES.DEVICE },
      { id: 3, x: 30, y: 85, label: 'PC 4', type: NODE_TYPES.DEVICE },
      { id: 4, x: 10, y: 50, label: 'PC 5', type: NODE_TYPES.DEVICE },
    ],
    // Correct edges: ring formation (0->1->2->3->4->0)
    correctEdges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]],
  },
  [TOPOLOGY_TYPES.MESH]: {
    // Compact layout untuk mesh
    positions: [
      { id: 0, x: 25, y: 25, label: 'Node 1', type: NODE_TYPES.DEVICE },
      { id: 1, x: 75, y: 25, label: 'Node 2', type: NODE_TYPES.DEVICE },
      { id: 2, x: 25, y: 75, label: 'Node 3', type: NODE_TYPES.DEVICE },
      { id: 3, x: 75, y: 75, label: 'Node 4', type: NODE_TYPES.DEVICE },
    ],
    // Correct edges: fully meshed (all nodes connected to all)
    correctEdges: [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]],
  },
  [TOPOLOGY_TYPES.BUS]: {
    // Linear horizontal layout
    positions: [
      { id: 0, x: 10, y: 50, label: 'PC 1', type: NODE_TYPES.DEVICE },
      { id: 1, x: 30, y: 50, label: 'PC 2', type: NODE_TYPES.DEVICE },
      { id: 2, x: 50, y: 50, label: 'PC 3', type: NODE_TYPES.DEVICE },
      { id: 3, x: 70, y: 50, label: 'PC 4', type: NODE_TYPES.DEVICE },
      { id: 4, x: 90, y: 50, label: 'PC 5', type: NODE_TYPES.DEVICE },
    ],
    // Correct edges: linear chain (0-1-2-3-4)
    correctEdges: [[0, 1], [1, 2], [2, 3], [3, 4]],
  },
  [TOPOLOGY_TYPES.TREE]: {
    // Hierarchical tree layout
    positions: [
      { id: 0, x: 50, y: 10, label: 'Root', type: NODE_TYPES.SWITCH },
      { id: 1, x: 25, y: 45, label: 'Branch 1', type: NODE_TYPES.DEVICE },
      { id: 2, x: 75, y: 45, label: 'Branch 2', type: NODE_TYPES.DEVICE },
      { id: 3, x: 10, y: 85, label: 'Leaf 1', type: NODE_TYPES.DEVICE },
      { id: 4, x: 40, y: 85, label: 'Leaf 2', type: NODE_TYPES.DEVICE },
      { id: 5, x: 75, y: 85, label: 'Leaf 3', type: NODE_TYPES.DEVICE },
    ],
    // Correct edges: tree structure (root 0 to branches 1,2; branches to leaves)
    correctEdges: [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5]],
  },
  [TOPOLOGY_TYPES.HYBRID]: {
    // Mixed layout
    positions: [
      { id: 0, x: 50, y: 10, label: 'Core Switch', type: NODE_TYPES.SWITCH },
      { id: 1, x: 25, y: 45, label: 'Group 1', type: NODE_TYPES.SWITCH },
      { id: 2, x: 75, y: 45, label: 'Group 2', type: NODE_TYPES.SWITCH },
      { id: 3, x: 10, y: 85, label: 'PC 1', type: NODE_TYPES.DEVICE },
      { id: 4, x: 40, y: 85, label: 'PC 2', type: NODE_TYPES.DEVICE },
      { id: 5, x: 60, y: 85, label: 'PC 3', type: NODE_TYPES.DEVICE },
      { id: 6, x: 90, y: 85, label: 'PC 4', type: NODE_TYPES.DEVICE },
    ],
    // Correct edges: hybrid (core connected to groups, groups to PCs)
    correctEdges: [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]],
  },
};

/**
 * Shuffle node positions to avoid memorization
 */
export function getShuffledLayout(topologyType) {
  const baseLayout = NODE_LAYOUTS[topologyType];
  if (!baseLayout) return [];

  // Shuffle positions while keeping structure valid
  const positions = [...baseLayout.positions].map(node => {
    let varianceX = 0;
    let varianceY = 0;
    
    // Add variance contextually depending on topology
    if (topologyType === TOPOLOGY_TYPES.BUS) {
      varianceX = (Math.random() - 0.5) * 6; // only slight x variance
      varianceY = 0; // strict linear y line
    } else if (topologyType === TOPOLOGY_TYPES.TREE || topologyType === TOPOLOGY_TYPES.HYBRID) {
      varianceX = (Math.random() - 0.5) * 5; // slight variance to keep hierarchy visible
      varianceY = (Math.random() - 0.5) * 5;
    } else {
      varianceX = (Math.random() - 0.5) * 10;
      varianceY = (Math.random() - 0.5) * 10;
    }

    return {
      ...node,
      x: Math.max(0, Math.min(100, node.x + varianceX)),
      y: Math.max(0, Math.min(100, node.y + varianceY)),
    };
  });

  return positions;
}
