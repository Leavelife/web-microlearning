import Image from "next/image"

export default function LevelCard({ level }) {
  return (
    <div className="relative w-72 overflow-hidden rounded-[28px] border border-violet-200/80 bg-white p-6 shadow-[0_30px_70px_-30px_rgba(124,58,237,0.22)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_35px_80px_-25px_rgba(124,58,237,0.28)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-violet-500 via-fuchsia-400 to-violet-300" />

      <div className="relative flex flex-col items-center text-center">
        <div className="relative mb-4">
          <div className="absolute inset-0 rounded-full bg-linear-to-r from-violet-500/20 via-sky-400/0 to-fuchsia-500/15 blur-2xl" />
          <div className="relative z-10 flex h-28 w-28 items-center justify-center rounded-full border border-violet-200 bg-violet-50 p-3 shadow-lg shadow-violet-200/40">
            <Image
              src={`${level.urlGambar}`}
              alt={level.nama}
              width={112}
              height={112}
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-violet-700 shadow-sm shadow-violet-200/60">
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.35)]" />
          GAMIFICATION
        </span>

        <h3 className="mt-4 text-2xl font-semibold text-violet-900">
          {level.nama}
        </h3>

        <p className="mt-2 text-sm text-violet-500">
          Rentang EXP untuk membuka level ini
        </p>

        <div className="mt-5 w-full rounded-[22px] border border-violet-100 bg-violet-50 p-4 text-left text-sm text-violet-700">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-violet-500">
            <span>Minimum</span>
            <span>Maximum</span>
          </div>
          <div className="mt-2 flex items-center justify-between font-semibold text-violet-900">
            <span>{level.minExp.toLocaleString()}</span>
            <span>{level.maxExp.toLocaleString()} EXP</span>
          </div>
          <div className="mt-4 h-2 rounded-full bg-violet-100">
            <div className="h-full w-full rounded-full bg-linear-to-r from-violet-500 via-fuchsia-400 to-violet-300" />
          </div>
        </div>

        <div className="mt-4 flex w-full items-center justify-between rounded-3xl bg-violet-50 px-4 py-3 text-left text-sm text-violet-700">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-violet-500">Badge</p>
            <p className="mt-1 font-semibold text-violet-900">{level.nama} Reward</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-tr from-violet-500 to-fuchsia-500 text-white shadow-xl shadow-fuchsia-500/20">
            ⭐
          </div>
        </div>
      </div>
    </div>
  )
}