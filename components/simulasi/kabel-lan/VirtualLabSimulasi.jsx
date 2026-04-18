"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import VirtualLabRJ45 from "@/components/simulasi/kabel-lan/VirtualLabRJ45";
import SimulationCompletionModal from "@/components/simulasi/SimulationCompletionModal";
import { useGamification } from "@/components/gamification/GamificationProvider";

const TARGET_ORDER = [
  "white-orange",
  "orange",
  "white-green",
  "blue",
  "white-blue",
  "green",
  "white-brown",
  "brown",
];

const CABLE_LIBRARY = [
  {
    id: "1",
    value: "white-orange",
    label: "Putih/Oranye",
    colorHex: "#fdf2e9",
    colorText: "#92400e",
    imageSrc: "/images/virtual-lab/cables/white-orange.png",
  },
  {
    id: "2",
    value: "orange",
    label: "Oranye",
    colorHex: "#f97316",
    colorText: "#7c2d12",
    imageSrc: "/images/virtual-lab/cables/orange.png",
  },
  {
    id: "3",
    value: "white-green",
    label: "Putih/Hijau",
    colorHex: "#dcfce7",
    colorText: "#065f46",
    imageSrc: "/images/virtual-lab/cables/white-green.png",
  },
  {
    id: "4",
    value: "blue",
    label: "Biru",
    colorHex: "#60a5fa",
    colorText: "#1d4ed8",
    imageSrc: "/images/virtual-lab/cables/blue.png",
  },
  {
    id: "5",
    value: "white-blue",
    label: "Putih/Biru",
    colorHex: "#dbeafe",
    colorText: "#1d4ed8",
    imageSrc: "/images/virtual-lab/cables/white-blue.png",
  },
  {
    id: "6",
    value: "green",
    label: "Hijau",
    colorHex: "#4ade80",
    colorText: "#166534",
    imageSrc: "/images/virtual-lab/cables/green.png",
  },
  {
    id: "7",
    value: "white-brown",
    label: "Putih/Coklat",
    colorHex: "#f3e8ff",
    colorText: "#7c2d12",
    imageSrc: "/images/virtual-lab/cables/white-brown.png",
  },
  {
    id: "8",
    value: "brown",
    label: "Coklat",
    colorHex: "#7c2d12",
    colorText: "#7c2d12",
    imageSrc: "/images/virtual-lab/cables/brown.png",
  },
];

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function VirtualLabSimulasi() {
  const [availableCables, setAvailableCables] = useState(() => [...CABLE_LIBRARY]);
  const [slots, setSlots] = useState(Array(8).fill(null));
  
  // Game states
  const [moves, setMoves] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  
  // Session states
  const [startTime, setStartTime] = useState(0);
  const [finished, setFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const { showGamification } = useGamification();

  useEffect(() => {
    setAvailableCables(shuffle([...CABLE_LIBRARY]));
    setStartTime(Date.now());
  }, []);

  const correctCount = useMemo(
    () => slots.filter((item, index) => item && item.value === TARGET_ORDER[index]).length,
    [slots]
  );

  const isComplete = slots.every((item) => item !== null);

  const onCableDragStart = (event, cableId) => {
    event.dataTransfer.setData("text/plain", cableId);
  };

  const onSlotDrop = (event, slotIndex) => {
    event.preventDefault();
    if (slots[slotIndex] !== null || finished) return;

    const cableId = event.dataTransfer.getData("text/plain");
    if (!cableId) return;

    const cable = availableCables.find((c) => c.id === cableId);
    if (!cable) return;

    const intended = TARGET_ORDER[slotIndex];
    const isCorrect = cable.value === intended;

    setSlots((prev) => {
      const next = [...prev];
      next[slotIndex] = cable;
      return next;
    });

    setAvailableCables((prev) => prev.filter((c) => c.id !== cableId));
    setMoves((prev) => prev + 1);
    if (!isCorrect) setMistakes((prev) => prev + 1);
  };

  const onSlotClick = (slotIndex) => {
    const slotValue = slots[slotIndex];
    if (!slotValue || finished) return;

    const intended = TARGET_ORDER[slotIndex];
    const wasCorrect = slotValue.value === intended;

    setSlots((prev) => {
      const next = [...prev];
      next[slotIndex] = null;
      return next;
    });
    
    setAvailableCables((prev) => [...prev, slotValue]);
    setMoves((prev) => prev + 1);
    if (!wasCorrect) {
      setMistakes((prev) => Math.max(0, prev - 1));
    }
  };

  const onReset = () => {
    setAvailableCables(shuffle(CABLE_LIBRARY));
    setSlots(Array(8).fill(null));
    setMoves(0);
    setMistakes(0);
    setFinished(false);
    setStartTime(Date.now());
    setSubmitResult(null);
    setSubmitError(null);
  };

  const onFinish = async () => {
    setFinished(true);
    setIsSubmitting(true);
    setSubmitError(null);
    
    // Validate that we have a valid startTime
    if (startTime === 0) {
      setSubmitError('Terjadi kesalahan: waktu mulai tidak tersimpan. Silakan coba lagi.');
      setIsSubmitting(false);
      return;
    }

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    // Validate data before sending
    if (typeof correctCount !== 'number' || correctCount < 0 || correctCount > 8) {
      setSubmitError('Data kabel tidak valid. Silakan coba lagi.');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/simulasi/kabel-lan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correctCount,
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

      if (data.result) {
        showGamification({
          expGained: data.result.expGained ?? 0,
          levelUp: data.result.levelUp ?? null,
          unlockedAchievements: data.result.unlockedAchievements ?? [],
          newTotalExp: data.result.newTotalExp,
        });
      }
      
      // Show warning if there was a gamification error
      if (data.warning) {
        console.warn('Server warning:', data.warning);
      }
    } catch (err) {
      setSubmitError(err?.message || 'Terjadi kesalahan saat menyimpan skor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filledSlots = slots.filter(Boolean).length;

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="lg:w-2/3">
          <h2 className="text-xl font-semibold mb-3">Konektor</h2>
          <VirtualLabRJ45 slots={slots} onSlotDrop={onSlotDrop} onSlotClick={onSlotClick} />

          <div className="mt-4 text-sm text-gray-700">
            <p>
              Urutkan untuk kabel LAN straight (T568B)
            </p>
            <p className="mt-2">Klik pin untuk membatalkan penempatan.</p>
          </div>
        </div>

        {!submitResult && (
          <div className="lg:w-1/3 border border-gray-200 rounded-xl p-4 flex flex-col h-full">
            <div className="shrink-0">
              <h3 className="text-lg font-semibold mb-3">Status Sesi</h3>
              
              {!finished ? (
                <div className="text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-100 h-32 flex flex-col justify-center items-center text-center">
                   <p className="font-medium text-sm">Statistik disembunyikan</p>
                   <p className="text-xs mt-1">Susun kabel Anda sebaik mungkin. Statistik benar/salah akan muncul setelah Anda menekan &quot;Submit&quot;.</p>
                   <p className="mt-4 font-semibold text-gray-800">Slot terisi: {filledSlots} / 8</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p>Skor Anda: <strong className="text-blue-600 text-lg">{submitResult?.score ?? '-'}</strong> <span className="text-sm text-gray-500">/ 100</span></p>
                  <p>Kabel Benar: <strong>{correctCount}</strong> / 8</p>
                  <p>Jml Kesalahan (Mistakes): <strong>{mistakes}</strong></p>
                  <p>Jml Pergerakan (Moves): <strong>{moves}</strong></p>
                </div>
              )}

              {isSubmitting && (
                <div className="mt-3 p-3 rounded bg-blue-50 text-blue-700 text-sm">
                  Mengevaluasi hasil dan menyimpan...
                </div>
              )}
              
              {submitError && (
                <div className="mt-3 p-3 rounded bg-red-50 text-red-700 text-sm">
                  Error: {submitError}
                </div>
              )}

              {!finished && (
                isComplete ? (
                  <div className="mt-3 p-3 rounded bg-blue-50 text-blue-700 text-sm font-medium">
                    Semua slot terisi. Tekan Submit untuk mengevaluasi hasil.
                  </div>
                ) : (
                  <div className="mt-3 p-3 rounded bg-yellow-50 text-yellow-700 text-sm font-medium">
                    Tarik kabel ke dalam slot.
                  </div>
                )
              )}
            </div>

            {/* Kabel Tersedia */}
            <div className="mt-4 grow flex flex-col min-h-0">
              <h4 className="text-sm font-semibold mb-2 shrink-0">Kabel tersedia</h4>
              <div className="flex-1 overflow-y-auto pr-2 flex flex-col justify-center">
                {availableCables.length === 0 ? (
                  <div className="text-sm text-gray-500 text-center py-4">Semua kabel sudah digunakan.</div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {availableCables.map((cable) => (
                      <div
                        key={cable.id}
                        draggable
                        onDragStart={(e) => onCableDragStart(e, cable.id)}
                        className="flex items-center gap-2 cursor-grab active:cursor-grabbing rounded-lg border border-purple-200 bg-white p-2 shadow-sm transition hover:border-purple-400 hover:shadow-md shrink-0"
                      >
                        <div
                          className="relative h-12 w-12 rounded-md border border-slate-200 bg-slate-50 overflow-hidden flex-shrink-0"
                          style={
                            cable.colorHex
                              ? { backgroundColor: `${cable.colorHex}40` }
                              : undefined
                          }
                        >
                          <Image
                            src={cable.imageSrc}
                            alt={cable.label}
                            fill
                            sizes="48px"
                            className="object-contain p-1"
                          />
                        </div>
                        <p
                          className="text-xs font-semibold line-clamp-2 flex-1"
                          style={{ color: cable.colorText || "#111827" }}
                        >
                          {cable.label}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-2 shrink-0">
              {!finished ? (
                <button
                  onClick={onFinish}
                  disabled={filledSlots === 0}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white font-medium rounded hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Hasil
                </button>
              ) : null}
              
              <button
                onClick={onReset}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded hover:bg-gray-300 transition disabled:opacity-50"
              >
                Ulangi Simulasi
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Completion Modal */}
      <SimulationCompletionModal
        isOpen={!!submitResult && !isSubmitting}
        score={submitResult?.score ?? 0}
        correctCount={correctCount}
        totalCount={8}
        expGained={submitResult?.expGained ?? 0}
        simulationName="Simulasi Kabel LAN"
        onReset={onReset}
      />
    </div>
  );
}
