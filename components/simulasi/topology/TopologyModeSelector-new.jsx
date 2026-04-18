'use client';

import React, { useState } from 'react';
import { getTopologiesByDifficulty, DIFFICULTY_LEVELS } from '@/lib/topology-config';

export default function TopologyModeSelector({ onSelectTopology }) {
  const topologiesByDifficulty = getTopologiesByDifficulty();
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simulasi Topologi Jaringan
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Pelajari berbagai topologi jaringan dengan simulasi interaktif. Pilih topologi yang ingin Anda latih dan susun koneksi dengan benar sesuai solusi yang tepat.
          </p>
        </div>

        {/* Difficulty Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {['easy', 'medium', 'hard'].map(level => {
            const info = DIFFICULTY_LEVELS[level];
            return (
              <button
                key={level}
                onClick={() =>
                  setSelectedDifficulty(selectedDifficulty === level ? null : level)
                }
                className={`px-6 py-3 rounded-lg font-semibold transition-all border-2 ${
                  selectedDifficulty === level
                    ? `border-current text-white`
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
                style={{
                  backgroundColor:
                    selectedDifficulty === level ? info.color : undefined,
                  borderColor:
                    selectedDifficulty === level ? info.color : undefined,
                }}
              >
                {info.label}
              </button>
            );
          })}
        </div>

        {/* Topologies Grid */}
        <div className="space-y-12">
          {['easy', 'medium', 'hard'].map(difficulty => {
            if (selectedDifficulty && selectedDifficulty !== difficulty) return null;

            const topologies = topologiesByDifficulty[difficulty];
            const difficultyInfo = DIFFICULTY_LEVELS[difficulty];

            return (
              <div key={difficulty}>
                <h2
                  className="text-2xl font-bold mb-6"
                  style={{ color: difficultyInfo.color }}
                >
                  {difficultyInfo.label}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {topologies.map(topology => (
                    <button
                      key={topology.type}
                      onClick={() => onSelectTopology(topology.type)}
                      className="group bg-white hover:shadow-lg border-2 border-gray-200 hover:border-blue-500 rounded-lg p-6 text-left transition-all"
                    >
                      {/* Icon */}
                      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                        {topology.icon}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {topology.name}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {topology.description}
                      </p>

                      {/* Rules Preview */}
                      <div className="mb-4 pb-4 border-t border-gray-200">
                        <ul className="text-xs text-gray-600 space-y-1">
                          {topology.rules?.slice(0, 2).map((rule, idx) => (
                            <li key={idx} className="truncate">
                              {rule}
                            </li>
                          ))}
                          {topology.rules?.length > 2 && (
                            <li className="text-gray-500 italic">
                              ... dan {topology.rules.length - 2} aturan lainnya
                            </li>
                          )}
                        </ul>
                      </div>

                      {/* CTA */}
                      <div className="flex items-center justify-between">
                        <span
                          className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white"
                          style={{ backgroundColor: difficultyInfo.color }}
                        >
                          {topology.nodeCount} node
                        </span>
                        <span className="text-blue-600 group-hover:translate-x-1 transition-transform">
                          →
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Bagaimana Cara Bermain?</h3>
            <ol className="text-gray-700 space-y-2 text-sm">
              <li>1. Pilih topologi yang ingin Anda latih</li>
              <li>2. Pelajari aturan dan tips di panel kiri</li>
              <li>3. Klik dua node untuk membuat koneksi</li>
              <li>4. Klik edge untuk menghapus koneksi yang salah</li>
              <li>5. Susun sesuai solusi yang benar</li>
              <li>6. Klik "Selesai & Kirim" untuk validasi</li>
            </ol>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Penilaian</h3>
            <ul className="text-gray-700 space-y-2 text-sm">
              <li>✓ <strong>100 poin:</strong> Topologi valid sempurna</li>
              <li>✓ <strong>80-99 poin:</strong> Topologi valid dengan penyesuaian</li>
              <li>✓ <strong>50-79 poin:</strong> Sebagian besar benar</li>
              <li>✓ <strong>0-49 poin:</strong> Perlu belajar lebih lanjut</li>
              <li>✓ <strong>Bonus:</strong> +5 jika selesai &lt; 5 menit</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Tips Belajar</h3>
            <ul className="text-gray-700 space-y-2 text-sm">
              <li>• Mulai dari topologi mudah (Star, Bus)</li>
              <li>• Pahami perbedaan setiap topologi</li>
              <li>• Ulangi topologi sulit hingga mahir</li>
              <li>• Lihat aturan jika kesulitan</li>
              <li>• Catat waktu Anda untuk improvement</li>
              <li>• Eksperimen kombinasi topologi hybrid</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
