'use client';

import TopologySimulation from '@/components/simulasi/topology/TopologySimulation';
import Navbar from '@/components/Navbar';

export default function TopologyPage() {
  return (
    <main className="min-h-screen bg-slate-100 text-gray-900">
      <Navbar />
      <section className="max-w-6xl mx-auto px-4 py-8 mt-6">
        <TopologySimulation />
      </section>
    </main>
  );
}
