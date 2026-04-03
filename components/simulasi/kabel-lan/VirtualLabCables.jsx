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
              className="min-w-[90px] max-w-[90px] cursor-grab"
            >
              <div className="h-16 w-full flex items-center justify-center">
                <Image
                  src={cable.imageSrc}
                  alt={cable.label}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div className="mt-2 text-center text-xs font-semibold" style={{ color: cable.colorText || "#111827" }}>
                {cable.label}
              </div>
              <div className="text-[11px] text-center text-gray-500 truncate">{cable.value}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
