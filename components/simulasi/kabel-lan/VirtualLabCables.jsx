"use client";

import Image from "next/image";

export default function VirtualLabCables({ cables, onCableDragStart }) {
  return (
    <div className="mt-2">
      <h3 className="text-lg font-semibold mb-2">Kabel tersedia</h3>
      <div className="flex overflow-x-auto gap-3 py-2">
        {cables.length === 0 ? (
          <div className="text-sm text-gray-500">Semua kabel sudah digunakan.</div>
        ) : (
          cables.map((cable) => (
            <div
              key={cable.id}
              draggable
              onDragStart={(e) => onCableDragStart(e, cable.id)}
              className="min-w-[104px] max-w-[104px] shrink-0 cursor-grab active:cursor-grabbing rounded-xl border border-purple-200 bg-white p-2.5 shadow-sm transition hover:border-purple-400 hover:shadow-md"
            >
              <div
                className="relative mx-auto h-50 w-full max-w-[88px] rounded-lg border border-slate-200 bg-slate-50 overflow-hidden"
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
                  sizes="88px"
                  className="object-contain p-1"
                />
              </div>
              <p
                className="mt-2 text-center text-[11px] font-semibold leading-tight line-clamp-2"
                style={{ color: cable.colorText || "#111827" }}
              >
                {cable.label}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
