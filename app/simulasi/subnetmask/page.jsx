"use client";

import Navbar from "@/components/Navbar";
import SubnetmaskSimulasi from "@/components/simulasi/subnetmask/SubnetmaskSimulasi";

export default function SubnetmaskSimulasiPage() {
  return (
    <main className="min-h-screen bg-slate-100 text-gray-900">
      <Navbar />
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Simulasi Translasi Subnet Mask</h1>
        <p className="text-gray-600 mb-6">
          Konversi CIDR menjadi subnet mask biner 32-bit. Klik setiap kotak untuk mengubah 0/1,
          lalu konfirmasi untuk melihat hasil dan kotak yang salah.
        </p>
        <SubnetmaskSimulasi />
      </section>
    </main>
  );
}

