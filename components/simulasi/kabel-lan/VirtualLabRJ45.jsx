"use client";

import Image from "next/image";

export default function VirtualLabRJ45({ slots, onSlotDrop, onSlotClick }) {
  return (
    <div className="w-full mb-6">
      <div className="relative mx-auto max-w-lg">
        <Image
          src="/images/virtual-lab/connector.png"
          alt="RJ-45 connector"
          width={560}
          height={180}
          className="rounded-xl border border-slate-300"
        />

        <div className="absolute inset-x-0 top-12 px-4 flex justify-between">
          {slots.map((slot, index) => {
            const hasCable = !!slot;
            return (
              <div
                key={index}
                onClick={() => hasCable && onSlotClick(index)}
                onDragOver={(ev) => ev.preventDefault()}
                onDrop={(ev) => onSlotDrop(ev, index)}
                className={`w-10 h-20 border rounded-md flex flex-col justify-center items-center text-center transition ${
                  hasCable ? "border-green-500 bg-green-100" : "border-gray-300 bg-white"
                } hover:border-purple-500 cursor-pointer`}
              >
                <span className="text-[10px] text-gray-600">P{index + 1}</span>
                {slot ? (
                  <div className="mt-1">
                    <Image
                      src={slot.imageSrc}
                      alt={slot.label}
                      width={24}
                      height={24}
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
