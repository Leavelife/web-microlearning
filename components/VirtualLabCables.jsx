"use client";

export default function VirtualLabCables({ cables, onCableDragStart }) {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Kabel tersedia</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {cables.length === 0 ? (
          <div className="col-span-full text-sm text-gray-500">Semua kabel sudah digunakan.</div>
        ) : (
          cables.map((cable) => (
            <div
              key={cable.id}
              draggable
              onDragStart={(e) => onCableDragStart(e, cable.id)}
              className="border rounded-md p-2 shadow-sm cursor-grab hover:shadow-lg transition bg-white"
            >
              <div className="text-xs text-gray-500">{cable.label}</div>
              <div
                className="text-sm font-semibold"
                style={{ color: cable.colorText || "#1f2937" }}
              >
                {cable.label}
              </div>
              <div
                className="mt-1 h-2 w-full rounded"
                style={{ backgroundColor: cable.colorHex || "#e5e7eb" }}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
