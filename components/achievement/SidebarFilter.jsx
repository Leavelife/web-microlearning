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
    <div className="w-48 border-r pr-4">
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          className={`block w-full text-left mb-3 font-semibold
            ${filter === f ? "text-blue-600" : "text-gray-600"}
          `}
        >
          {f}
        </button>
      ))}
    </div>
  )
}