'use client';

import React from 'react';
import { TOPOLOGY_INFO } from '@/lib/topology-types';

export default function TopologyResult({ topology, score, onReset }) {
  const topologyInfo = TOPOLOGY_INFO[topology];
  const isValid = score.isValid;
  const scoreValue = score.score;
  const timeSpent = score.timeSpent || 0;
  const correctCount = score.correctCount || 0;
  const totalCorrect = score.totalCorrect || 0;

  // Format time
  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Get score assessment
  const getAssessment = score => {
    if (score >= 95) return { text: 'Sempurna!', color: '#10b981', icon: '🎯' };
    if (score >= 85) return { text: 'Sangat Baik!', color: '#10b981', icon: '👏' };
    if (score >= 70) return { text: 'Baik!', color: '#3b82f6', icon: '✓' };
    if (score >= 50) return { text: 'Cukup', color: '#f59e0b', icon: '📚' };
    return { text: 'Perlu Belajar Lagi', color: '#ef4444', icon: '💪' };
  };

  const assessment = getAssessment(scoreValue);
  const accuracy = totalCorrect > 0 ? Math.round((correctCount / totalCorrect) * 100) : 0;

  return (
    <main className="min-h-screen bg-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Result Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          {/* Icon & Title */}
          <div className="mb-6">
            <div className="text-6xl mb-4">{assessment.icon}</div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Sesi Simulasi Selesai!
            </h1>
            <p className="text-gray-600 text-lg">{topologyInfo?.name}</p>
          </div>

          {/* Score Circle */}
          <div className="mb-8">
            <div
              className="w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-4 text-white shadow-lg"
              style={{ backgroundColor: assessment.color }}
            >
              <div className="text-center">
                <div className="text-4xl font-bold">{scoreValue}</div>
                <div className="text-sm opacity-90">/100</div>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-4" style={{ color: assessment.color }}>
              {assessment.text}
            </h2>

            {isValid ? (
              <p className="text-green-600 text-lg font-semibold">
                ✓ Topologi {topologyInfo?.name} Anda Benar!
              </p>
            ) : (
              <div className="text-left bg-red-50 rounded-lg p-4 my-4">
                <p className="text-red-700 font-semibold mb-3">Ada kesalahan dalam koneksi:</p>
                <ul className="text-red-600 space-y-2 text-sm">
                  {score.errors?.map((error, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>{error}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-50 rounded-lg p-4 border border-gray-200">
              <div className="text-gray-600 text-xs mb-1 uppercase font-semibold">Waktu</div>
              <div className="text-2xl font-bold text-gray-900">
                {formatTime(timeSpent)}
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 border border-gray-200">
              <div className="text-gray-600 text-xs mb-1 uppercase font-semibold">Koneksi Benar</div>
              <div className="text-2xl font-bold text-green-600">
                {correctCount}/{totalCorrect}
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 border border-gray-200">
              <div className="text-gray-600 text-xs mb-1 uppercase font-semibold">Akurasi</div>
              <div className="text-2xl font-bold text-blue-600">
                {accuracy}%
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 border border-gray-200">
              <div className="text-gray-600 text-xs mb-1 uppercase font-semibold">Total Node</div>
              <div className="text-2xl font-bold text-gray-900">
                {score.details?.nodeCount || 0}
              </div>
            </div>
          </div>

          {/* Feedback */}
          {score.feedback && (
            <div className={`rounded-lg p-4 mb-8 ${
              isValid
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-yellow-50 border border-yellow-200 text-yellow-700'
            }`}>
              <p className="whitespace-pre-line text-sm">{score.feedback}</p>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-slate-50 rounded-lg p-6 mb-8 text-left border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Langkah Selanjutnya:</h3>
            <ul className="text-gray-700 space-y-2 text-sm">
              {isValid ? (
                <>
                  <li>✓ Topologi Anda sudah sempurna!</li>
                  <li>→ Coba topologi lain yang lebih sulit</li>
                  <li>→ Tingkatkan kecepatan Anda (target &lt; 5 menit)</li>
                  <li>→ Pelajari kombinasi topologi hybrid</li>
                </>
              ) : (
                <>
                  <li>✗ Periksa kembali koneksi yang salah</li>
                  <li>→ Pastikan sesuai dengan solusi yang ditunjukkan</li>
                  <li>→ Pelajari aturan topologi lebih dalam</li>
                  <li>→ Coba lagi, Anda pasti bisa!</li>
                </>
              )}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={onReset}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Coba Topologi Lain
            </button>
            <button
              onClick={() => window.location.href = '/simulasi'}
              className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
            >
              Kembali ke Menu Simulasi
            </button>
          </div>

          {/* Celebration for valid topologies */}
          {isValid && (
            <div className="mt-8 pt-8 border-t border-gray-200 text-center">
              <p className="text-green-600 text-2xl mb-2">🎉 Selamat! 🎉</p>
              <p className="text-gray-600">
                Anda telah menguasai topologi {topologyInfo?.name}!
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
