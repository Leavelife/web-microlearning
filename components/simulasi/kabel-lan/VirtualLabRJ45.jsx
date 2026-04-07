"use client";

import Image from "next/image";

// Layout pin dalam persen relatif terhadap ukuran gambar konektor.
const PIN_LAYOUT = [
  { x: 8.6, y: 50, w: 6, h: 46 }, // P1
  { x: 16.3, y: 50, w: 6, h: 46 }, // P2
  { x: 24, y: 50, w: 6, h: 46 }, // P3
  { x: 31.7, y: 50, w: 6, h: 46 }, // P4
  { x: 40, y: 50, w: 6, h: 46 }, // P5
  { x: 48, y: 50, w: 6, h: 46 }, // P6
  { x: 55.5, y: 50, w: 6, h: 46 }, // P7
  { x: 64, y: 50, w: 6, h: 46 }, // P8
];

export default function VirtualLabRJ45({ slots, onSlotDrop, onSlotClick }) {
  return (
    <div className="w-full mb-6">
      <div className="relative mx-auto max-w-lg">
        <Image
          src="/images/virtual-lab/connector.png"
          alt="RJ-45 connector"
          width={400}
          height={90}
          loading="eager"
          className="rounded-xl border border-slate-300"
        />

        <div className="absolute inset-0">
          {slots.map((slot, index) => {
            const hasCable = !!slot;
            const layout = PIN_LAYOUT[index] ?? PIN_LAYOUT[0];
            return (
              <div
                key={index}
                onClick={() => hasCable && onSlotClick(index)}
                onDragOver={(ev) => ev.preventDefault()}
                onDrop={(ev) => onSlotDrop(ev, index)}
                style={{
                  left: `${layout.x}%`,
                  top: `${layout.y}%`,
                  width: `${layout.w}%`,
                  height: `${layout.h}%`,
                }}
                className={`absolute border rounded-md flex flex-col justify-center items-center text-center transition ${
                  hasCable ? "border-green-500 bg-green-100" : "border-gray-300 bg-white"
                } hover:border-purple-500 cursor-pointer`}
              >
                <span className="text-[10px] text-gray-600">P{index + 1}</span>
                {slot ? (
                  <div className="mt-1">
                    <Image
                      src={slot.imageSrc}
                      alt={slot.label}
                      width={30}
                      height={30}
                      className="rounded"
                    />
                  </div>
                ) : (
                  <span className="text-[10px] text-gray-400">(tarik)</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
