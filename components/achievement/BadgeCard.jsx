import Image from "next/image"

export default function BadgeCard({
  nama,
  deskripsi,
  image,
  isUnlocked,
  exp,
  eventType,
  tanggalDidapat
}) {
  function formatTanggal(dateString) {
    const date = new Date(dateString)

    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()

    return `${day}-${month}-${year}`
    }
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border bg-white p-5 text-slate-900 shadow-lg transition duration-300
        ${isUnlocked
          ? "border-emerald-200 shadow-emerald-100/60 hover:-translate-y-1 hover:shadow-xl"
          : "border-slate-200 bg-slate-50 shadow-slate-200/70 hover:shadow-lg"
        }
      `}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-cyan-400 via-slate-400 to-emerald-400" />

      <div className="relative flex flex-col items-center gap-4 pt-4">
        <div className={`flex h-32 w-32 items-center justify-center rounded-full border-2 p-3 transition
            ${isUnlocked ? "border-emerald-300 bg-white" : "border-slate-200 bg-slate-100"}
          `}
        >
          <Image
            src={image}
            alt={nama}
            width={120}
            height={120}
            className={`h-full w-full object-contain transition duration-300
              ${!isUnlocked && "grayscale opacity-80"}
            `}
          />
        </div>

        <div className="text-center">
          <h3 className="text-base font-semibold tracking-tight text-slate-900">
            {nama}
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {deskripsi}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3 border-t border-slate-200 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-[0.18em] text-slate-500">
          <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">
            {eventType || "Achievement"}
          </span>
          <span className={`rounded-full px-2 py-1 font-semibold
              ${isUnlocked ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}
            `}
          >
            {isUnlocked ? "Dimiliki" : "Terkunci"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              EXP
            </p>
            <p className="mt-1 text-base font-semibold text-slate-900">
              {exp ?? 0}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              {isUnlocked ? "Didapat" : "Status"}
            </p>
            <p className={`mt-1 text-base font-semibold
                ${isUnlocked ? "text-emerald-700" : "text-slate-500"}
              `}
            >
              {isUnlocked ? (formatTanggal(tanggalDidapat) || "-") : "Belum"}
            </p>
          </div>
        </div>
      </div>

      {!isUnlocked && (
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-transparent to-white/90" />
      )}
    </div>
  )
}