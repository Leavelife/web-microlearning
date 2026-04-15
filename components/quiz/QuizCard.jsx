import Link from "next/link";
import { getColorById } from "@/lib/color";

export default function QuizCard({ quiz }) {
  const materiJudul = quiz.materiStep?.materi?.judul ?? "Materi";
  const stepUrutan = quiz.materiStep?.urutan ?? "—";
  const jumlahSoal = quiz._count?.soal ?? 0;
  const durasi = quiz.durasi ?? 30;
  const colorClass = getColorById(String(quiz.id));

  return (
    <div className={`group overflow-hidden rounded-[32px] border border-white/30 ${colorClass} shadow-[0_30px_80px_-40px_rgba(126,34,206,0.35)] transition-transform duration-300 hover:-translate-y-1`}>
      <div className="rounded-[32px] bg-white/10 p-6 backdrop-blur-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="rounded-2xl bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 shadow-sm shadow-black/10">
            {materiJudul}
          </div>
          <div className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/90">
            Step {stepUrutan}
          </div>
        </div>

        <h2 className="mt-6 text-xl font-semibold text-white">{quiz.judul}</h2>
        <p className="mt-3 text-sm leading-6 text-white/80 line-clamp-3">
          {quiz.deskripsi || "Tanpa deskripsi"}
        </p>

        <div className="mt-6 flex flex-wrap gap-3 text-xs text-white/80">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 font-medium backdrop-blur-sm">
            ⏱ {durasi} menit
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 font-medium backdrop-blur-sm">
            {jumlahSoal} soal
          </span>
        </div>

        <Link
          href={`/quiz/${quiz.id}`}
          className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-black/80 px-5 py-3 text-sm font-semibold text-violet-100 shadow-lg shadow-white/20 transition duration-300 hover:-translate-y-px hover:bg-white/95"
        >
          Mulai Quiz
        </Link>
      </div>
    </div>
  );
}
