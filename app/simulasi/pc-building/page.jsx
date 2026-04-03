"use client";

import Navbar from "@/components/Navbar";
import VirtualLabPC from "@/components/simulasi/pc-building/VirtualLabPC";

export default function PcBuildingSimulasiPage() {
  return (
    <main className="min-h-screen bg-slate-100 text-gray-900">
      <Navbar />
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">PC Building Virtual Lab</h1>
        <p className="text-gray-600 mb-6">
          Latih pemahaman Anda tentang letak komponen utama pada motherboard. Seret komponen dari
          tray di bawah ke slot yang sesuai di motherboard virtual.
        </p>
        <VirtualLabPC />
      </section>
    </main>
  );
}

