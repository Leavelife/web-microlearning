const features = [
  {
    title: "Belajar singkat & padat",
    desc: "Materi dirancang microlearning agar cepat dipahami.",
    icon: "📱",
  },
  {
    title: "Praktik virtual",
    desc: "Simulasi jaringan tanpa alat fisik.",
    icon: "🧪",
  },
  {
    title: "Materi up to date",
    desc: "Selalu mengikuti perkembangan teknologi.",
    icon: "🖥️",
  },
  {
    title: "Quiz & ranking",
    desc: "Naik level dengan sistem XP dan leaderboard.",
    icon: "🏆",
  },
];

export default function Features() {
  return (
    <section className="px-8 py-16 bg-slate-50">
      <h2 className="text-2xl font-bold mb-10">
        Keuntungan belajar di MICROLAB
      </h2>

      <div className="grid md:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <div
            key={i}
            className="p-6 bg-white rounded-xl shadow-sm 
            transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
          >
            <div className="text-3xl">{f.icon}</div>
            <h3 className="mt-4 font-semibold">{f.title}</h3>
            <p className="text-sm text-slate-500 mt-2">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}