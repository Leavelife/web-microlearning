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
  const hasCompletedAnyTopology = completedSet.has("topologi");
  const completedCount = completedSet.size;
  const completionRate = Math.round((completedCount / SIMULATIONS.length) * 100);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <Navbar />
      <section className="max-w-6xl mx-auto p-6 pt-15">
        <div className="mb-10 rounded-4xl border border-slate-200 bg-white shadow-[0_30px_80px_-40px_rgba(15,23,42,0.08)] overflow-hidden">
          <div className="grid gap-6 p-8 md:grid-cols-[1.9fr_1fr] items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-violet-600/90 mb-3">Virtual Lab Gamified</p>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Tingkatkan skill jaringan dengan simulasi interaktif berorientasi badge
              </h1>
              <p className="mt-4 max-w-2xl text-sm text-slate-600 leading-7">
                Pilih tantangan yang sesuai dan kumpulkan pencapaian untuk membuka modul berikutnya.
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Simulasi selesai</p>
                <p className="mt-3 text-4xl font-semibold text-slate-950">{completedCount}/{SIMULATIONS.length}</p>
                <p className="mt-2 text-sm text-slate-600">Selesaikan semua modul untuk meraih badge penuh.</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Progress latihan</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-950">{completionRate}%</p>
                  </div>
                  <div className="inline-flex rounded-full bg-violet-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-violet-700">
                    Gamified</div>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-linear-to-r from-cyan-500 via-violet-500 to-fuchsia-500" style={{ width: `${completionRate}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {SIMULATIONS.map((item, index) => {
            let isUnlocked = false;
            // For topology, check if ANY topology type is completed; for others, check exact idSimulasi
            let isCompleted = item.idSimulasi === 'topologi' 
              ? hasCompletedAnyTopology 
              : completedSet.has(item.idSimulasi);

            if (index === 0) {
              isUnlocked = true;
            } else {
              const previousItem = SIMULATIONS[index - 1];
              // For topology unlock check, also use hasCompletedAnyTopology
              const previousCompleted = previousItem.idSimulasi === 'topologi' 
                ? hasCompletedAnyTopology 
                : completedSet.has(previousItem.idSimulasi);
              isUnlocked = previousCompleted;
            }

            if (!isUnlocked) {
              return (
                <div
                  key={item.href}
                  className="group relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-slate-300 via-slate-200 to-slate-300" />
                  <div className="relative h-52 w-full bg-slate-50 border-b border-slate-200">
                    <Image
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain p-6"
                    />
                  </div>
                  <div className="p-6 pt-8">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs uppercase tracking-[0.25em] text-slate-500">
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                      Terkunci
                    </div>
                    <h2 className="text-2xl font-semibold text-slate-950 mb-3">
                      {item.title}
                    </h2>
                    <p className="text-sm leading-7 text-slate-600">
                      {item.description}
                    </p>
                    <div className="mt-6 rounded-3xl bg-slate-50 p-4 border border-slate-200">
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Persyaratan</p>
                      <p className="mt-2 text-sm text-slate-600">Selesaikan simulasi sebelumnya untuk membuka level ini.</p>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl ${item.ringHover}`}
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-cyan-400 via-violet-400 to-fuchsia-400" />
                {isCompleted && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 ring-1 ring-emerald-200 shadow-sm">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> SELESAI
                    </span>
                  </div>
                )}
                <div className="relative h-52 w-full bg-slate-50 border-b border-slate-200">
                  <Image
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    width={300}
                    height={200}
                    className="object-contain max-h-full group-hover:scale-110 transition-transform duration-300"
                    priority={item.href === "/simulasi/kabel-lan"}
                  />
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className={`text-2xl font-semibold tracking-tight text-slate-950 transition-colors ${item.titleHoverClass}`}>
                      {item.title}
                    </h2>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                      {isCompleted ? 'Mastered' : 'Ready' }
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {item.description}
                  </p>
                  <div className="mt-6 flex items-center justify-between gap-3">
                    <p className={`text-sm font-semibold ${item.accentClass}`}>
                      {isCompleted ? "Mainkan ulang →" : "Buka simulasi →"}
                    </p>
                    <span className="inline-flex rounded-full bg-slate-100 px-3 py-2 text-xs uppercase tracking-[0.18em] text-slate-700">
                      {isCompleted ? 'Bonus XP' : 'Level Baru'}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
