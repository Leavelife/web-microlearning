import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function SimulasiPage() {
  return (
    <main className="min-h-screen bg-slate-100 text-gray-800">
      <Navbar />
      <section className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Virtual Lab Simulasi</h1>
        <p className="mb-6 text-gray-600">
          Pilih salah satu virtual lab di bawah untuk memulai praktik.
        </p>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <Link
            href="/simulasi/kabel-lan"
            className="block rounded-xl border border-purple-300 bg-white p-6 shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold">Simulasi Pemasangan Kabel LAN</h2>
            <p className="mt-2 text-gray-600">
              Latih urutan kabel straight T568B dengan drag and drop ke konektor RJ-45.
            </p>
          </Link>
          <div className="block rounded-xl border border-gray-200 bg-white p-6 text-gray-400">
            <h2 className="text-xl font-semibold">Virtual Lab Lainnya (Coming Soon)</h2>
            <p className="mt-2 text-sm">Simulasi konfigurasi jaringan, topologi, dan troubleshooting.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
