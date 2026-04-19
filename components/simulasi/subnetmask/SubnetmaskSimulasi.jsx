"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import SimulationCompletionModal from "@/components/simulasi/SimulationCompletionModal";
import { useGamification } from "@/components/gamification/GamificationProvider";

function clampCidr(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.min(32, Math.max(0, Math.trunc(n)));
}

function cidrToBits(cidr) {
  const c = clampCidr(cidr);
  return Array.from({ length: 32 }, (_, i) => (i < c ? 1 : 0));
}

function bitsToDottedDecimal(bits) {
  const toByte = (start) =>
    bits
      .slice(start, start + 8)
      .reduce((acc, bit, idx) => acc + (bit ? 1 << (7 - idx) : 0), 0);
  return [toByte(0), toByte(8), toByte(16), toByte(24)].join(".");
}

function randomCidr() {
  // Range yang umum dipakai untuk subnet mask LAN: /8 sampai /30
  // (bisa diubah kalau ingin lebih luas).
  return 8 + Math.floor(Math.random() * (30 - 8 + 1));
}

export default function SubnetmaskSimulasi() {
  const router = useRouter();
  const [cidr, setCidr] = useState(24);
  const [bits, setBits] = useState(() => Array(32).fill(0));
  const [confirmed, setConfirmed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // XP tracking - simplified to just track count
  const [completedCount, setCompletedCount] = useState(0);
  const [completedCidrs, setCompletedCidrs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const { showGamification } = useGamification();
  const [startTime, setStartTime] = useState(null);

  // Agar random benar-benar terjadi tiap akses (client-side) dan tetap aman dari hydration mismatch.
  useEffect(() => {
    const c = randomCidr();
    setCidr(c);
    setBits(Array(32).fill(0));
    setConfirmed(false);
    setStartTime(Date.now());

    // Load user's completed CIDR count from server
    const loadCompletedCount = async () => {
      try {
        const res = await fetch('/api/simulasi/subnetmask');
        if (res.ok) {
          const data = await res.json();
          if (data.success && typeof data.completedCount === 'number') {
            setCompletedCount(data.completedCount);
          }
          if (data.success && Array.isArray(data.completedCidrs)) {
            const normalizedCidrs = data.completedCidrs
              .map((value) => Number.parseInt(value, 10))
              .filter((value) => Number.isInteger(value) && value >= 0 && value <= 32);
            setCompletedCidrs(Array.from(new Set(normalizedCidrs)).sort((a, b) => a - b));
          }
        }
      } catch (err) {
        console.error('Failed to load completed CIDR count:', err);
      }
    };

    loadCompletedCount();
  }, []);

  const expectedBits = useMemo(() => cidrToBits(cidr), [cidr]);
  const completedCidrSet = useMemo(() => new Set(completedCidrs), [completedCidrs]);
  const isCurrentCidrCompleted = completedCidrSet.has(cidr);
  const expectedDecimal = useMemo(() => bitsToDottedDecimal(expectedBits), [expectedBits]);
  const userDecimal = useMemo(() => bitsToDottedDecimal(bits), [bits]);

  const wrongCount = useMemo(() => {
    if (!confirmed) return 0;
    let wrong = 0;
    for (let i = 0; i < 32; i += 1) {
      if ((bits[i] ? 1 : 0) !== expectedBits[i]) wrong += 1;
    }
    return wrong;
  }, [bits, expectedBits, confirmed]);

  const correctCount = useMemo(() => (confirmed ? 32 - wrongCount : 0), [confirmed, wrongCount]);
  const score = useMemo(() => (confirmed ? (wrongCount === 0 ? 100 : Math.max(0, Math.round((correctCount / 32) * 100))) : 0), [confirmed, correctCount, wrongCount]);

  const onToggleBit = (index) => {
    if (confirmed) return;
    setBits((prev) => {
      const next = [...prev];
      next[index] = next[index] ? 0 : 1;
      return next;
    });
  };

  const onConfirm = async () => {
    // Calculate actual score BEFORE submitting (not from useMemo which uses old state)
    let wrongInAnswer = 0;
    for (let i = 0; i < 32; i += 1) {
      if ((bits[i] ? 1 : 0) !== expectedBits[i]) {
        wrongInAnswer += 1;
      }
    }
    const correctInAnswer = 32 - wrongInAnswer;
    const actualScore = wrongInAnswer === 0 ? 100 : Math.max(0, Math.round((correctInAnswer / 32) * 100));

    setConfirmed(true);
    setIsSubmitting(true);
    setSubmitError(null);

    const timeSpent = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;

    try {
      const res = await fetch('/api/simulasi/subnetmask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cidr,
          correctCount: correctInAnswer,
          totalCount: 32,
          score: actualScore,
          timeSpent,
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch (parseErr) {
        throw new Error('Response format tidak valid dari server');
      }

      if (!res.ok) {
        throw new Error(data?.error || `Terjadi kesalahan (HTTP ${res.status})`);
      }

      if (!data?.result) {
        throw new Error('Response tidak mengandung result data');
      }

      setSubmitResult(data.result);

      // Show gamification popup if available
      if (data.result) {
        showGamification({
          expGained: data.result.expGained ?? 0,
          levelUp: data.result.levelUp ?? null,
          unlockedAchievements: data.result.unlockedAchievements ?? [],
          newTotalExp: data.result.newTotalExp,
        });
      }
      
      // Update completed count from server response
      if (data.result?.xpEarnedCount !== undefined) {
        setCompletedCount(data.result.xpEarnedCount);
      }

      if (data.result?.isPerfect) {
        setCompletedCidrs((prev) => {
          if (prev.includes(cidr)) return prev;
          return [...prev, cidr].sort((a, b) => a - b);
        });
      }

      setShowModal(true);

      if (data.warning) {
        console.warn('Server warning:', data.warning);
      }
    } catch (err) {
      setSubmitError(err?.message || 'Terjadi kesalahan saat menyimpan skor');
      setConfirmed(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onResetAnswer = () => {
    setBits(Array(32).fill(0));
    setConfirmed(false);
    setShowModal(false);
    setSubmitResult(null);
    setSubmitError(null);
  };

  const onShuffleMask = () => {
    const c = randomCidr();
    setCidr(c);
    setBits(Array(32).fill(0));
    setConfirmed(false);
    setShowModal(false);
    setSubmitResult(null);
    setSubmitError(null);
    setStartTime(Date.now());
  };

  const onPickCidr = (value) => {
    const c = clampCidr(value);
    setCidr(c);
    setBits(Array(32).fill(0));
    setConfirmed(false);
    setShowModal(false);
    setSubmitResult(null);
    setSubmitError(null);
    setStartTime(Date.now());
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="lg:w-2/3">
          <h2 className="text-xl font-semibold mb-2">Subnet Mask</h2>
          <p className="text-sm text-gray-600 mb-4">
            Ubah kotak biner (0/1) untuk membentuk subnet mask yang sesuai dengan CIDR yang diberikan.
          </p>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-gray-600">CIDR saat ini</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-2xl font-bold text-gray-900">/{cidr}</p>
                  {isCurrentCidrCompleted && <span className="text-green-600 text-xl">✓</span>}
                  {confirmed ? ` (${expectedDecimal})` : ''}
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  CIDR Selesai: <strong>{completedCount}</strong> / 4
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={onShuffleMask}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition disabled:opacity-50"
                >
                  Acak CIDR
                </button>
                <button
                  onClick={onResetAnswer}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition disabled:opacity-50"
                >
                  Reset Jawaban
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-center">
              <label className="text-sm text-gray-700 font-medium" htmlFor="cidr-select">
                Pilih CIDR
              </label>
              <select
                id="cidr-select"
                value={cidr}
                onChange={(e) => onPickCidr(e.target.value)}
                className={`w-full md:w-48 px-3 py-2 rounded-lg border-2 bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 transition ${isCurrentCidrCompleted ? 'border-green-500 text-green-700 font-semibold' : 'border-slate-300 text-gray-900'}`}
              >
                {Array.from({ length: 33 }, (_, i) => (
                  <option key={i} value={i}>
                    /{i}{completedCidrSet.has(i) ? ' ✓' : ''}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500">
                (Memilih CIDR akan mengosongkan jawaban.)
              </p>
            </div>
          </div>

          <div className="mt-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Jawaban Biner (32 bit)</h3>
            <p className="mt-2 text-sm text-gray-700">Jawaban Anda: <strong>{userDecimal}</strong></p>
            <div className="grid gap-3">
              {[0, 8, 16, 24].map((rowStart) => (
                <div key={rowStart}>
                  <div className="grid grid-cols-8 gap-2 text-xs text-gray-500 mb-1">
                    {[128, 64, 32, 16, 8, 4, 2, 1].map((val) => (
                      <span key={val} className="text-center">{val}</span>
                    ))}
                  </div>
                  <div className="grid grid-cols-8 gap-2">
                    {bits.slice(rowStart, rowStart + 8).map((bit, offset) => {
                      const idx = rowStart + offset;
                      const isWrong = confirmed && (bit ? 1 : 0) !== expectedBits[idx];
                      const isRight = confirmed && !isWrong;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => onToggleBit(idx)}
                          className={`h-12 rounded-lg border text-lg font-bold transition select-none
                            ${
                              confirmed
                                ? isWrong
                                  ? "border-rose-300 bg-rose-50 text-rose-700"
                                  : "border-emerald-300 bg-emerald-50 text-emerald-700"
                                : "border-slate-300 bg-white text-gray-900 hover:border-purple-400 hover:bg-purple-50"
                            }
                          `}
                          aria-label={`Bit ${idx + 1} bernilai ${bit}`}
                          title={
                            confirmed
                              ? isWrong
                                ? `Salah (seharusnya ${expectedBits[idx]})`
                                : "Benar"
                              : "Klik untuk ubah 0/1"
                          }
                        >
                          {bit}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={onConfirm}
                disabled={confirmed || isSubmitting}
                className={`px-5 py-2 rounded-lg text-white transition ${
                  confirmed || isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                {isSubmitting ? 'Menyimpan...' : 'Konfirmasi Jawaban'}
              </button>
              {!confirmed ? (
                <p className="text-sm text-gray-500 self-center">
                  Setelah konfirmasi, kotak benar hijau dan yang salah merah.
                </p>
              ) : (
                <p className="text-sm text-gray-600 self-center">
                  Selesai dinilai. Anda bisa reset jawaban atau ganti CIDR.
                </p>
              )}
            </div>

            {submitError && (
              <div className="mt-3 p-3 rounded bg-red-50 text-red-700 text-sm">
                Error: {submitError}
              </div>
            )}

            {isSubmitting && (
              <div className="mt-3 p-3 rounded bg-blue-50 text-blue-700 text-sm">
                Mengevaluasi hasil dan menyimpan...
              </div>
            )}
          </div>
        </div>

        <div className="lg:w-1/3 border border-gray-200 rounded-xl p-4 bg-slate-50">
          <h3 className="text-lg font-semibold mb-3">Hasil & Statistik</h3>

          <div className="space-y-2 text-sm">
            <p>
              CIDR: <strong>/{cidr}</strong>
            </p>
          </div>

          <div className="mt-4">
            {confirmed ? (
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p>
                  Benar: <strong className="text-emerald-700">{correctCount}</strong> / 32
                </p>
                <p>
                  Salah: <strong className="text-rose-700">{wrongCount}</strong>
                </p>
                {wrongCount === 0 ? (
                  <p className="mt-2 text-emerald-700 text-sm font-semibold">
                    Mantap! Subnet mask Anda sudah tepat.
                  </p>
                ) : (
                  <p className="mt-2 text-gray-600 text-sm">
                    Periksa kotak yang berwarna merah dan coba lagi.
                  </p>
                )}
              </div>
            ) : (
              <div className="rounded-lg border border-slate-200 bg-white p-3 text-gray-600 text-sm">
                Tekan <strong>Konfirmasi Jawaban</strong> untuk melihat penilaian.
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <button
              onClick={onShuffleMask}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              Acak Soal Baru
            </button>
            <button
              onClick={onResetAnswer}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
            >
              Reset Jawaban
            </button>
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {showModal && submitResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all animate-in fade-in scale-95">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-8 text-white text-center">
              <h2 className="text-2xl font-bold mb-2">Simulasi Selesai!</h2>
              <p className="text-purple-100">Simulasi Subnet Mask - CIDR /{cidr}</p>
            </div>

            {/* Content */}
            <div className="px-6 py-8 space-y-6">
              {/* Score Info */}
              <div className="space-y-3">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">Skor Akhir</p>
                  <p className="text-3xl font-bold text-blue-600">{submitResult.score}/100</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Benar</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {submitResult.correctCount}/32
                    </p>
                  </div>
                </div>
              </div>

              {/* XP Reward */}
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-gray-700">Penambahan XP</p>
                  <p className="text-lg font-bold text-yellow-600">+{submitResult.expGained} XP</p>
                </div>
                
                {/* XP Bar Animation */}
                <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-100 ease-out flex items-center justify-end pr-2"
                    style={{
                      width: `${submitResult.expGained > 0 ? (submitResult.expGained / 250) * 100 : 0}%`,
                    }}
                  >
                    {submitResult.expGained > 0 && (
                      <div className="text-xs font-bold text-white drop-shadow-sm">
                        {submitResult.expGained}
                      </div>
                    )}
                  </div>
                </div>

                {submitResult.expGained > 0 && (
                  <>
                    <p className="text-xs text-green-600 font-semibold">
                      ✓ CIDR diselesaikan! ({submitResult.xpEarnedCount}/4)
                    </p>
                    {submitResult.xpEarnedCount >= 4 && (
                      <p className="text-xs text-amber-600 font-semibold">
                        Batas XP tercapai - CIDR selanjutnya tanpa XP
                      </p>
                    )}
                  </>
                )}

                {submitResult.expGained === 0 && submitResult.score === 100 && (
                  <p className="text-xs text-gray-600 font-semibold">
                    ✓ CIDR diselesaikan tapi tanpa XP (batas sudah tercapai)
                  </p>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="bg-gray-50 px-6 py-4 flex flex-col gap-2">
              {completedCount >= 1 && (
                <button
                  onClick={() => router.push('/simulasi/topologi')}
                  className="w-full px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-sm"
                >
                  Buka Simulasi Topology →
                </button>
              )}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onResetAnswer}
                  className="flex-1 px-4 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition shadow-sm"
                >
                  Coba CIDR Baru
                </button>
                <button
                  onClick={() => router.push('/simulasi')}
                  className="flex-1 px-4 py-2.5 bg-gray-300 text-gray-800 font-medium rounded-lg hover:bg-gray-400 transition shadow-sm"
                >
                  Exit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

