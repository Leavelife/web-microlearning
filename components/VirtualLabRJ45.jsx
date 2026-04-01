"use client";

export default function VirtualLabRJ45({ slots, onSlotDrop, onSlotClick }) {
  return (
    <div className="w-full mb-4">
      <div className="bg-slate-800 rounded-xl p-4 shadow-lg">
        <div className="text-white text-sm mb-2">Konektor RJ-45 (8 pin)</div>
        <div className="grid grid-cols-8 gap-2">
          {slots.map((slot, index) => {
            const hasCable = !!slot;
            return (
              <div
                key={index}
                onClick={() => hasCable && onSlotClick(index)}
                onDragOver={(ev) => ev.preventDefault()}
                onDrop={(ev) => onSlotDrop(ev, index)}
                className={`h-20 border rounded-md flex flex-col justify-center items-center transition ${
                  hasCable ? "border-green-400 bg-green-100" : "border-gray-300 bg-white"
                } hover:border-purple-500 cursor-pointer`}
              >
                <span className="text-xs text-gray-500">Pin {index + 1}</span>
                {slot ? (
                  <span
                    style={{
                      backgroundColor: slot.colorHex || "#e5e7eb",
                      color: slot.colorText || "#1f2937",
                    }}
                    className="text-xs font-medium px-1 rounded mt-1"
                  >
                    {slot.label}
                  </span>
                ) : (
                  <span className="text-xs italic text-gray-400 mt-1">(kosong)</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
