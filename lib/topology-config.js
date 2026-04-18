/**
 * Topology configuration and rules
 */

import { TOPOLOGY_TYPES, TOPOLOGY_INFO } from './topology-types';

export const TOPOLOGY_CONFIG = {
  [TOPOLOGY_TYPES.STAR]: {
    name: 'Star',
    description: TOPOLOGY_INFO[TOPOLOGY_TYPES.STAR].description,
    icon: TOPOLOGY_INFO[TOPOLOGY_TYPES.STAR].icon,
    difficulty: 'easy',
    nodeCount: 5,
    rules: [
      '• Ada 1 node pusat (switch/hub)',
      '• Semua node lain terhubung hanya ke node pusat',
      '• Node lain tidak boleh saling terhubung',
      '• Total 4 koneksi (dari 4 node ke pusat)',
    ],
    tips: [
      'Identifikasi node pusat terlebih dahulu',
      'Hubungkan setiap node ke pusat secara langsung',
      'Pastikan tidak ada koneksi antar node non-pusat',
    ],
    expectedConnections: 4,
  },
  [TOPOLOGY_TYPES.RING]: {
    name: 'Ring',
    description: TOPOLOGY_INFO[TOPOLOGY_TYPES.RING].description,
    icon: TOPOLOGY_INFO[TOPOLOGY_TYPES.RING].icon,
    difficulty: 'medium',
    nodeCount: 5,
    rules: [
      '• Setiap node terhubung ke tepat 2 node lain',
      '• Membentuk lingkaran tertutup',
      '• Tidak ada node yang terhubung ke lebih dari 2 node',
      '• Total 5 koneksi membentuk satu sirkuit',
    ],
    tips: [
      'Bayangkan node dalam lingkaran',
      'Hubungkan node 1→2→3→4→5→1',
      'Setiap node harus memiliki tepat 2 koneksi',
      'Pastikan membentuk loop tertutup',
    ],
    expectedConnections: 5,
  },
  [TOPOLOGY_TYPES.MESH]: {
    name: 'Mesh',
    description: TOPOLOGY_INFO[TOPOLOGY_TYPES.MESH].description,
    icon: TOPOLOGY_INFO[TOPOLOGY_TYPES.MESH].icon,
    difficulty: 'hard',
    nodeCount: 4,
    rules: [
      '• Setiap node terhubung ke SEMUA node lainnya',
      '• Konektivitas maksimal',
      '• Jumlah koneksi = n×(n-1)/2',
      '• Untuk 4 node: 6 koneksi total',
    ],
    tips: [
      'Node 1 harus terhubung ke 2, 3, dan 4',
      'Node 2 harus terhubung ke 1, 3, dan 4',
      'Node 3 harus terhubung ke 1, 2, dan 4',
      'Node 4 harus terhubung ke 1, 2, dan 3',
    ],
    expectedConnections: 6,
  },
  [TOPOLOGY_TYPES.BUS]: {
    name: 'Bus',
    description: TOPOLOGY_INFO[TOPOLOGY_TYPES.BUS].description,
    icon: TOPOLOGY_INFO[TOPOLOGY_TYPES.BUS].icon,
    difficulty: 'easy',
    nodeCount: 5,
    rules: [
      '• Semua node terhubung dalam satu garis lurus',
      '• Node di ujung memiliki 1 koneksi',
      '• Node di tengah memiliki 2 koneksi',
      '• Total koneksi = n-1',
      '• Tidak ada cycle/loop',
    ],
    tips: [
      'Bayangkan garis horizontal dengan node di atasnya',
      'Hubungkan node 1→2→3→4→5',
      'Node pertama dan terakhir adalah endpoint',
      'Jangan buat koneksi antar node tengah',
    ],
    expectedConnections: 4,
  },
  [TOPOLOGY_TYPES.TREE]: {
    name: 'Tree',
    description: TOPOLOGY_INFO[TOPOLOGY_TYPES.TREE].description,
    icon: TOPOLOGY_INFO[TOPOLOGY_TYPES.TREE].icon,
    difficulty: 'hard',
    nodeCount: 6,
    rules: [
      '• Struktur hierarchical seperti pohon',
      '• Semua node terhubung',
      '• Tidak ada cycle',
      '• Ada node root/akar (pusat)',
      '• Node lain adalah branch atau leaf',
    ],
    tips: [
      'Mulai dari root di atas',
      'Hubungkan ke branch nodes',
      'Hubungkan branch ke leaf nodes',
      'Jangan buat koneksi yang membentuk loop',
      'Setiap node (kecuali root) terhubung ke parent',
    ],
    expectedConnections: 5,
  },
  [TOPOLOGY_TYPES.HYBRID]: {
    name: 'Hybrid',
    description: TOPOLOGY_INFO[TOPOLOGY_TYPES.HYBRID].description,
    icon: TOPOLOGY_INFO[TOPOLOGY_TYPES.HYBRID].icon,
    difficulty: 'hard',
    nodeCount: 7,
    rules: [
      '• Kombinasi dari 2+ topologi dasar',
      '• Flexible sesuai kebutuhan',
      '• Minimal semua node harus terhubung',
      '• Struktur bisa campuran (bagian Star + bagian Tree)',
    ],
    tips: [
      'Identifikasi bagian-bagian topologi dasar',
      'Pastikan setiap bagian valid',
      'Pastikan semua bagian terhubung satu sama lain',
      'Tidak perlu membentuk topologi "murni"',
    ],
    expectedConnections: 'variable',
  },
};

/**
 * Get difficulty level info
 */
export const DIFFICULTY_LEVELS = {
  easy: {
    label: 'Mudah',
    color: '#10b981',
    topologies: [TOPOLOGY_TYPES.STAR, TOPOLOGY_TYPES.BUS],
  },
  medium: {
    label: 'Menengah',
    color: '#f59e0b',
    topologies: [TOPOLOGY_TYPES.RING],
  },
  hard: {
    label: 'Sulit',
    color: '#ef4444',
    topologies: [TOPOLOGY_TYPES.TREE, TOPOLOGY_TYPES.MESH, TOPOLOGY_TYPES.HYBRID],
  },
};

/**
 * Get topology by name
 */
export function getTopologyConfig(topologyType) {
  return TOPOLOGY_CONFIG[topologyType] || null;
}

/**
 * Get all topologies grouped by difficulty
 */
export function getTopologiesByDifficulty() {
  const grouped = {};

  Object.entries(DIFFICULTY_LEVELS).forEach(([level, info]) => {
    grouped[level] = info.topologies.map(t => ({
      type: t,
      ...TOPOLOGY_CONFIG[t],
      difficulty: level,
    }));
  });

  return grouped;
}

/**
 * Get all available topologies
 */
export function getAllTopologies() {
  return Object.keys(TOPOLOGY_TYPES).map(key => TOPOLOGY_TYPES[key]);
}
