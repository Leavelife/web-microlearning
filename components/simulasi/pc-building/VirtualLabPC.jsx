"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

const SLOT_CONFIG = [
  // Posisi pc part di motherboard.
  { id: "cpu-slot", accept: "cpu", pos: { x: 40, y: 29, w: 7, h: 6 } },
  { id: "ram-slot-1", accept: "ram", pos: { x: 51, y: 23, w: 8, h: 18 } },
  { id: "gpu-slot", accept: "gpu", pos: { x: 29, y: 48.7, w: 18, h: 2 } },
  { id: "storage-slot", accept: "storage", pos: { x: 34, y: 38, w: 14, h: 4 } },
  { id: "psu-slot", accept: "psu", pos: { x: 14, y: 64, w: 25, h: 10 } },
];

const COMPONENT_LIBRARY = [
  {
    id: "cpu-1",
    type: "cpu",
    name: "Prosesor (CPU)",
    description: "Otak komputer, dipasang pada socket CPU.",
    imageSrc: "/images/virtual-lab/parts/cpu.jpeg",
  },
  {
    id: "ram-1",
    type: "ram",
    name: "RAM",
    description: "Memori utama, dipasang pada slot RAM.",
    imageSrc: "/images/virtual-lab/parts/ram.jpg",
  },
  {
    id: "gpu-1",
    type: "gpu",
    name: "Kartu Grafis (GPU)",
    description: "Kartu grafis, dipasang pada slot PCIe.",
    imageSrc: "/images/virtual-lab/parts/gpu.jpg",
  },
  {
    id: "psu-1",
    type: "psu",
    name: "Power Supply",
    description: "Sumber daya listrik utama PC.",
    imageSrc: "/images/virtual-lab/parts/psu.png",
  },
  {
    id: "storage-1",
    type: "storage",
    name: "SSD NVME",
    description: "Media penyimpanan sistem operasi dan data.",
    imageSrc: "/images/virtual-lab/parts/ssd.jpeg",
  },
];

function TypeIcon({ type, className }) {
  const common = { className, viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" };

  switch (type) {
    case "cpu":
      return (
        <svg {...common}>
          <path
            d="M8 7h8v10H8V7Z"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.95"
          />
          <path
            d="M10 10h4v4h-4v-4Z"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.9"
          />
          <path
            d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "ram":
      return (
        <svg {...common}>
          <path
            d="M5 9h14v6H5V9Z"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.95"
          />
          <path
            d="M7 11h2M11 11h2M15 11h2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M7 15v2M10 15v2M13 15v2M16 15v2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "gpu":
      return (
        <svg {...common}>
          <path
            d="M4 8h14v8H4V8Z"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.95"
          />
          <path
            d="M18 10h2v4h-2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M7 12a2 2 0 1 0 0.01 0Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M12 11h3M12 13h3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "psu":
      return (
        <svg {...common}>
          <path
            d="M6 7h12v10H6V7Z"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.95"
          />
          <path
            d="M9 10a2 2 0 1 0 0.01 0Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M13 10h3M13 13h3M9 15h8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "storage":
      return (
        <svg {...common}>
          <path
            d="M6 8h12v8H6V8Z"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.95"
          />
          <path
            d="M8 11h6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M8 14h3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M16 13.5h.01"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path
            d="M7 7h10v10H7V7Z"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.95"
          />
          <path
            d="M9 12h6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}

function MotherboardVisual() {
  // Gambar asli: public/images/virtual-lab/pc.png
  return (
    <Image
      src="/images/virtual-lab/pc.png"
      alt="Ilustrasi motherboard PC untuk simulasi"
      fill
      className="object-contain object-center select-none pointer-events-none"
      priority
    />
  );
}

export default function VirtualLabPC() {
  const [availableComponents, setAvailableComponents] = useState(COMPONENT_LIBRARY);
  const [slots, setSlots] = useState(
    () =>
      SLOT_CONFIG.reduce((acc, slot) => {
        acc[slot.id] = null;
        return acc;
      }, {})
  );
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [moves, setMoves] = useState(0);
  const [message, setMessage] = useState(null);

  const placedComponentsCount = useMemo(
    () => Object.values(slots).filter(Boolean).length,
    [slots]
  );

  const correctCount = useMemo(
    () =>
      SLOT_CONFIG.filter((slot) => {
        const placed = slots[slot.id];
        return placed && placed.type === slot.accept;
      }).length,
    [slots]
  );

  const isComplete = placedComponentsCount === SLOT_CONFIG.length;

  const showMessage = (text, variant = "info") => {
    setMessage({ text, variant });
    window.clearTimeout(showMessage._timeout);
    showMessage._timeout = window.setTimeout(() => {
      setMessage(null);
    }, 2000);
  };

  const handleDragStart = (event, componentId) => {
    event.dataTransfer.setData("text/plain", componentId);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event, slotId) => {
    event.preventDefault();

    const slotConfig = SLOT_CONFIG.find((s) => s.id === slotId);
    if (!slotConfig) return;
    if (slots[slotId]) return; // sudah terisi

    const componentId = event.dataTransfer.getData("text/plain");
    if (!componentId) return;

    const component = availableComponents.find((c) => c.id === componentId);
    if (!component) return;

    setMoves((prev) => prev + 1);

    const isCorrect = component.type === slotConfig.accept;
    if (!isCorrect) {
      // Komponen ditolak dan tetap berada di bawah
      setMistakes((prev) => prev + 1);
      setScore((prev) => Math.max(0, prev - 5));
      showMessage("Komponen tidak cocok dengan slot ini. Coba lagi.", "error");
      return;
    }

    setSlots((prev) => ({
      ...prev,
      [slotId]: component,
    }));
    setAvailableComponents((prev) => prev.filter((c) => c.id !== componentId));
    setScore((prev) => prev + 20);
    showMessage("Komponen berhasil dipasang pada slot yang tepat!", "success");
  };

  const handleRemoveFromSlot = (slotId) => {
    const placed = slots[slotId];
    if (!placed) return;

    setSlots((prev) => ({
      ...prev,
      [slotId]: null,
    }));
    setAvailableComponents((prev) => [...prev, placed]);
    setMoves((prev) => prev + 1);
    setScore((prev) => Math.max(0, prev - 5));
    showMessage("Komponen dikembalikan ke tray bawah.", "info");
  };

  const handleReset = () => {
    setSlots(
      SLOT_CONFIG.reduce((acc, slot) => {
        acc[slot.id] = null;
        return acc;
      }, {})
    );
    setAvailableComponents(COMPONENT_LIBRARY);
    setScore(0);
    setMistakes(0);
    setMoves(0);
    setMessage(null);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Area motherboard / canvas utama */}
        <div className="lg:w-2/3">
          <h2 className="text-xl font-semibold mb-3">Motherboard Virtual</h2>
          <p className="text-sm text-gray-600 mb-4">
            Seret komponen dari tray di bagian bawah ke slot yang sesuai di motherboard. Jika
            komponen salah, ia akan ditolak dan tetap berada di bawah.
          </p>

          <div className="relative rounded-2xl border border-slate-700 overflow-hidden bg-white">
            <div className="relative w-full aspect-[7/10]">
              <MotherboardVisual />

              {SLOT_CONFIG.map((slot) => {
                const placed = slots[slot.id];
                const isCorrect = placed && placed.type === slot.accept;
                const { x, y, w, h } = slot.pos;

                return (
                  <div
                    key={slot.id}
                    onDrop={(e) => handleDrop(e, slot.id)}
                    onDragOver={handleDragOver}
                    onClick={() => handleRemoveFromSlot(slot.id)}
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      width: `${w}%`,
                      height: `${h}%`,
                    }}
                    className={`absolute rounded-xl border-2 p-2 cursor-pointer transition select-none flex items-center justify-center
                      ${
                        placed
                          ? isCorrect
                            ? "border-emerald-400 bg-emerald-500/10"
                            : "border-amber-400 bg-amber-500/10"
                          : "border-dashed border-violet-300 bg-violet-200/30 hover:border-violet-400 hover:bg-violet-200/45"
                      }
                    `}
                    title={placed ? `${slot.label}: ${placed.name}` : `${slot.label} (butuh ${slot.accept})`}
                  >
                    {/* sengaja dikosongkan agar lebih menantang */}
                  </div>
                );
              })}
            </div>
          </div>

          <p className="mt-3 text-xs text-gray-500">
            Klik pada slot yang sudah terisi untuk mengembalikan komponennya.
          </p>
        </div>

        {/* Panel status + tray komponen */}
        <div className="lg:w-1/3 border border-gray-200 rounded-xl p-4 bg-slate-50 flex flex-col h-full max-h-[640px]">
          <div className="shrink-0">
            <h3 className="text-lg font-semibold mb-2">Status Sesi</h3>
            <p>
              Skor: <strong>{score}</strong>
            </p>
            <p>
              Moves: <strong>{moves}</strong>
            </p>
            <p>
              Komponen terpasang: <strong>{placedComponentsCount}</strong> / {SLOT_CONFIG.length}
            </p>
            <p>
              Komponen benar: <strong>{correctCount}</strong> / {SLOT_CONFIG.length}
            </p>
            <p>
              Mistakes: <strong>{mistakes}</strong>
            </p>

            {isComplete ? (
              <div className="mt-3 p-3 rounded bg-emerald-50 text-emerald-700 text-sm">
                Semua slot sudah terisi. Periksa kembali apakah semua komponen sudah cocok dengan
                slotnya.
              </div>
            ) : (
              <div className="mt-3 p-3 rounded bg-blue-50 text-blue-700 text-sm">
                Lengkapi pemasangan semua komponen utama di motherboard.
              </div>
            )}

            {message && (
              <div
                className={`mt-3 p-3 rounded text-sm ${
                  message.variant === "success"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : message.variant === "error"
                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                    : "bg-slate-50 text-slate-700 border border-slate-200"
                }`}
              >
                {message.text}
              </div>
            )}
          </div>

          <div className="mt-4 border-t border-gray-200 pt-3 flex-1 min-h-0 flex flex-col">
            <h4 className="text-sm font-semibold text-gray-800 mb-2">
              Pilihan Komponen (Drag & Drop)
            </h4>
            {availableComponents.length === 0 ? (
              <p className="text-xs text-gray-500">
                Semua komponen sudah dipasang. Jika ingin mencoba lagi, gunakan tombol Reset Sesi.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-1">
                {availableComponents.map((component) => (
                  <div
                    key={component.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, component.id)}
                    className="cursor-grab active:cursor-grabbing rounded-xl bg-white shadow-sm border border-purple-200 p-2.5 hover:border-purple-400 hover:shadow-md transition flex flex-col items-center text-center"
                  >
                    {/* Gambar part */}
                    <div className="w-16 h-16 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center mb-1.5 overflow-hidden relative">
                      {component.imageSrc ? (
                        <Image
                          src={component.imageSrc}
                          alt={component.name}
                          fill
                          className="object-contain"
                        />
                      ) : (
                        <TypeIcon type={component.type} className="w-8 h-8 text-purple-700" />
                      )}
                    </div>
                    {/* Nama part */}
                    <p className="text-[11px] font-semibold text-gray-800 leading-tight line-clamp-2">
                      {component.name}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handleReset}
              className="mt-3 w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition shrink-0"
            >
              Reset Sesi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

