const filters = [
  "SEMUA",
  "PROGRES",
  "SKILLS",
  "QUIZ",
  "KONSISTENSI",
  "SPESIAL"
]

export default function SidebarFilter({ filter, setFilter }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
          Filter Kategori
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-500
              ${filter === f
                ? "border-cyan-600 bg-cyan-600 text-white shadow-sm"
                : "border-slate-200 bg-slate-100 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              }
            `}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  )
}