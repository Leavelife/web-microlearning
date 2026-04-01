"use client";

import Navbar from "@/components/Navbar";
import VirtualLabSimulasi from "@/components/VirtualLabSimulasi";

export default function SimulasiKabelLanPage() {
  return (
    <main className="min-h-screen bg-slate-100 text-gray-900">
      <Navbar />
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Simulasi Kabel LAN (RJ-45)</h1>
        <p className="text-gray-600 mb-6">
          Susun kabel sesuai urutan straight (T568B). Klik untuk unassign jika ingin mengulangi.
        </p>
        <VirtualLabSimulasi />
      </section>
    </main>
  );
}
