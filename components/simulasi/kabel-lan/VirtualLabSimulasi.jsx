"use client";

import { useMemo, useState } from "react";
import VirtualLabRJ45 from "@/components/simulasi/kabel-lan/VirtualLabRJ45";
import VirtualLabCables from "@/components/simulasi/kabel-lan/VirtualLabCables";

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
    colorText: "#fff",
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
  const [availableCables, setAvailableCables] = useState(() => shuffle(CABLE_LIBRARY));
  const [slots, setSlots] = useState(Array(8).fill(null));
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [moves, setMoves] = useState(0);
  const [finished, setFinished] = useState(false);

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
    setScore((prev) => prev + (isCorrect ? 20 : 5));
    if (!isCorrect) setMistakes((prev) => prev + 1);
  };

  const onSlotClick = (slotIndex) => {
    const slotValue = slots[slotIndex];
    if (!slotValue || finished) return;

    setSlots((prev) => {
      const next = [...prev];
      next[slotIndex] = null;
      return next;
    });
    setAvailableCables((prev) => [...prev, slotValue]);
    setMoves((prev) => prev + 1);
    setScore((prev) => Math.max(0, prev - 5));
    if (slotValue.value !== TARGET_ORDER[slotIndex]) {
      setMistakes((prev) => Math.max(0, prev - 1));
    }
  };

  const onReset = () => {
    setAvailableCables(shuffle(CABLE_LIBRARY));
    setSlots(Array(8).fill(null));
    setScore(0);
    setMistakes(0);
    setMoves(0);
    setFinished(false);
  };

  const onFinish = () => {
    setFinished(true);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="lg:w-2/3">
          <h2 className="text-xl font-semibold mb-3">Konektor</h2>
          <VirtualLabRJ45 slots={slots} onSlotDrop={onSlotDrop} onSlotClick={onSlotClick} />

          <div className="mt-4 text-sm text-gray-700">
            <p>
              Urutan straight (T568B): 1. Putih/Oranye, 2. Oranye, 3. Putih/Hijau, 4. Biru, 5.
              Putih/Biru, 6. Hijau, 7. Putih/Coklat, 8. Coklat.
            </p>
            <p className="mt-2">Klik pin untuk membatalkan penempatan.</p>
          </div>
        </div>

        <div className="lg:w-1/3 border border-gray-200 rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-3">Status Sesi</h3>
          <p>Skor: <strong>{score}</strong></p>
          <p>Moves: <strong>{moves}</strong></p>
          <p>Correct: <strong>{correctCount}</strong> / 8</p>
          <p>Mistakes: <strong>{mistakes}</strong></p>
          <p>Slot terisi: <strong>{slots.filter(Boolean).length}</strong> / 8</p>

          {finished ? (
            <div className="mt-3 p-3 rounded bg-green-50 text-green-700">
              Sesi selesai. Hasil Anda: {correctCount} benar dari 8.
            </div>
          ) : isComplete ? (
            <div className="mt-3 p-3 rounded bg-blue-50 text-blue-700">
              Semua slot terisi. Tekan Finish untuk menutup sesi.
            </div>
          ) : (
            <div className="mt-3 p-3 rounded bg-yellow-50 text-yellow-700">
              Masih ada slot kosong. Anda boleh melanjutkan atau menekan Finish kapan saja.
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <button
              onClick={onFinish}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            >
              Finish Sesi
            </button>
            <button
              onClick={onReset}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <VirtualLabCables cables={availableCables} onCableDragStart={onCableDragStart} />
    </div>
  );
}
