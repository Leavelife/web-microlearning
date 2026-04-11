import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const SIMULATIONS = [
  {
    href: "/simulasi/kabel-lan",
    title: "Simulasi Pemasangan Kabel LAN",
    description:
      "Latih urutan kabel straight T568B dengan menarik kabel ke pin konektor RJ-45. Skor dan kesalahan dicatat seperti praktik di lab.",
    imageSrc: "/images/virtual-lab/connector.png",
    imageAlt: "Ilustrasi konektor RJ-45 untuk simulasi kabel LAN",
    borderClass: "border-purple-300 hover:border-purple-500",
    ringHover: "group-hover:ring-2 group-hover:ring-purple-200",
    accentClass: "text-purple-600 group-hover:text-purple-700",
    titleHoverClass: "group-hover:text-purple-800",
  },
  {
    href: "/simulasi/subnetmask",
    title: "Simulasi Translasi Subnet Mask",
    description:
      "Latihan mengubah CIDR menjadi subnet mask biner 32-bit. Jawab dengan klik 0/1, lalu konfirmasi untuk melihat mana yang benar dan salah.",
    imageSrc: "/images/virtual-lab/subnetmask.png",
    imageAlt: "Ilustrasi simulasi translasi subnet mask",
    borderClass: "border-indigo-300 hover:border-indigo-500",
    ringHover: "group-hover:ring-2 group-hover:ring-indigo-200",
    accentClass: "text-indigo-600 group-hover:text-indigo-700",
    titleHoverClass: "group-hover:text-indigo-800",
  },
  {
    href: "/simulasi/pc-building",
    title: "PC Building Virtual Lab",
    description:
      "Simulasi pemasangan komponen utama PC pada motherboard: CPU, RAM, GPU, penyimpanan, dan PSU dengan drag and drop.",
    imageSrc: "/images/virtual-lab/pc.png",
    imageAlt: "Ilustrasi motherboard untuk simulasi rakit PC",
    borderClass: "border-emerald-300 hover:border-emerald-500",
    ringHover: "group-hover:ring-2 group-hover:ring-emerald-200",
    accentClass: "text-emerald-600 group-hover:text-emerald-700",
    titleHoverClass: "group-hover:text-emerald-800",
  },
  {
    href: "/simulasi/topologi",
    title: "Simulasi Topologi Jaringan",
    description:
      "Pelajari berbagai topologi jaringan (Star, Ring, Mesh, Bus, Tree, Hybrid) dengan simulasi interaktif. Susun koneksi dengan benar dan validasi struktur topologi Anda.",
    imageSrc: "/images/virtual-lab/topology.png",
    imageAlt: "Ilustrasi simulasi topologi jaringan",
    borderClass: "border-blue-300 hover:border-blue-500",
    ringHover: "group-hover:ring-2 group-hover:ring-blue-200",
    accentClass: "text-blue-600 group-hover:text-blue-700",
    titleHoverClass: "group-hover:text-blue-800",
  },
];

export default function SimulasiPage() {
  return (
    <main className="min-h-screen bg-slate-100 text-gray-800">
      <Navbar />
      <section className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Virtual Lab Simulasi</h1>
        <p className="mb-8 text-gray-600 max-w-2xl">
          Pilih salah satu virtual lab di bawah untuk memulai praktik. Setiap kartu menampilkan gambar ringkas dan penjelasan singkat.
        </p>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {SIMULATIONS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group block rounded-2xl border-2 bg-white shadow-md overflow-hidden transition ${item.borderClass} ${item.ringHover} hover:shadow-lg`}
            >
              <div className="relative h-48 w-full bg-gradient-to-b from-slate-50 to-slate-100 border-b border-slate-200">
                <Image
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain p-6"
                  priority={item.href === "/simulasi/kabel-lan"}
                />
              </div>
              <div className="p-6">
                <h2
                  className={`text-xl font-semibold text-gray-900 transition-colors ${item.titleHoverClass}`}
                >
                  {item.title}
                </h2>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">{item.description}</p>
                <p className={`mt-4 text-sm font-medium ${item.accentClass}`}>Buka simulasi →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
