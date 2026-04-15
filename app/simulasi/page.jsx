import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { cookies } from "next/headers";
import { getUserFromToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const SIMULATIONS = [
  {
    idSimulasi: "kabel-lan",
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
    idSimulasi: "pc-building",
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
    idSimulasi: "subnetmask",
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
    idSimulasi: "topologi",
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

export default async function SimulasiPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  const user = getUserFromToken(token);

  if (!user) {
    redirect("/login");
  }

  // Get completed simulations
  const completedSimulations = await prisma.hasilSimulasi.findMany({
    where: {
      userId: user.id,
      status: "selesai",
    },
    select: {
      idSimulasi: true,
    },
  });

  const completedSet = new Set(completedSimulations.map((sim) => sim.idSimulasi));

  return (
    <main className="min-h-screen bg-slate-100 text-gray-800">
      <Navbar />
      <section className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Virtual Lab Simulasi</h1>
        <p className="mb-8 text-gray-600 max-w-2xl">
          Pilih salah satu virtual lab di bawah untuk memulai praktik. Selesaikan setiap simulasi untuk membuka simulasi berikutnya!
        </p>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {SIMULATIONS.map((item, index) => {
            let isUnlocked = false;
            let isCompleted = completedSet.has(item.idSimulasi);

            if (index === 0) {
              isUnlocked = true;
            } else {
              const previousItem = SIMULATIONS[index - 1];
              isUnlocked = completedSet.has(previousItem.idSimulasi);
            }

            if (!isUnlocked) {
              return (
                <div
                  key={item.href}
                  className="group block rounded-2xl border-2 bg-gray-50 shadow-sm overflow-hidden border-gray-200 opacity-60 cursor-not-allowed"
                >
                  <div className="relative h-48 w-full bg-slate-100 border-b border-gray-200 grayscale opacity-70">
                    <Image
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain p-6"
                    />
                  </div>
                  <div className="p-6 relative">
                    <div className="absolute inset-0 bg-white/40 flex items-center justify-center z-10 backdrop-blur-[1px]">
                      <span className="bg-gray-800 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                         Terkunci
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-500">
                      {item.title}
                    </h2>
                    <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                      {item.description}
                    </p>
                    <p className="mt-4 text-sm font-medium text-gray-400">
                      Selesaikan tahap sebelumnya terlebih dahulu
                    </p>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group block rounded-2xl border-2 bg-white shadow-md overflow-hidden transition ${item.borderClass} ${item.ringHover} hover:shadow-lg relative`}
              >
                {isCompleted && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-green-100 text-green-700 border border-green-200 text-xs font-bold px-2 py-1 rounded shadow-sm">
                      SELESAI
                    </span>
                  </div>
                )}
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
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                  <p className={`mt-4 text-sm font-medium ${item.accentClass}`}>
                    {isCompleted ? "Mainkan ulang →" : "Buka simulasi →"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
