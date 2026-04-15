"use client";

import { useEffect, useMemo, useState } from "react";
import SimulationCompletionModal from "@/components/simulasi/SimulationCompletionModal";

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
  const [cidr, setCidr] = useState(24);
  const [bits, setBits] = useState(() => Array(32).fill(0));
  const [confirmed, setConfirmed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Agar random benar-benar terjadi tiap akses (client-side) dan tetap aman dari hydration mismatch.
  useEffect(() => {
    const c = randomCidr();
    setCidr(c);
    setBits(Array(32).fill(0));
    setConfirmed(false);
  }, []);

  const expectedBits = useMemo(() => cidrToBits(cidr), [cidr]);
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

  const onToggleBit = (index) => {
    if (confirmed) return;
    setBits((prev) => {
      const next = [...prev];
      next[index] = next[index] ? 0 : 1;
      return next;
    });
  };

  const onConfirm = () => {
    setConfirmed(true);
    setShowModal(true);
  };

  const onResetAnswer = () => {
    setBits(Array(32).fill(0));
    setConfirmed(false);
    setShowModal(false);
  };

  const onShuffleMask = () => {
    const c = randomCidr();
    setCidr(c);
    setBits(Array(32).fill(0));
    setConfirmed(false);
  };

  const onPickCidr = (value) => {
    const c = clampCidr(value);
    setCidr(c);
    setBits(Array(32).fill(0));
    setConfirmed(false);
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
                <p className="text-2xl font-bold text-gray-900">/{cidr}{confirmed ? ` (${expectedDecimal})` : ''}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={onShuffleMask}
                  className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition"
                >
                  Acak CIDR
                </button>
                <button
                  onClick={onResetAnswer}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
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
                className="w-full md:w-48 px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-200"
              >
                {Array.from({ length: 33 }, (_, i) => (
                  <option key={i} value={i}>
                    /{i}
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
                disabled={confirmed}
                className={`px-5 py-2 rounded-lg text-white transition ${
                  confirmed ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                Konfirmasi Jawaban
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
      <SimulationCompletionModal
        isOpen={showModal}
        score={wrongCount === 0 ? 100 : Math.max(0, Math.round((correctCount / 32) * 100))}
        correctCount={correctCount}
        totalCount={32}
        expGained={0}
        simulationName="Simulasi Subnet Mask"
        onReset={onResetAnswer}
      />
    </div>
  );
}

