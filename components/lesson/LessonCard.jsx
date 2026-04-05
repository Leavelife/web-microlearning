import Link from "next/link";
import { getColorById } from "@/lib/color";

function getCtaLabel(percent) {
  const n =
    typeof percent === "number" && !Number.isNaN(percent)
      ? Math.min(100, Math.max(0, percent))
      : 0;
  if (n >= 100) return "Telah Selesai";
  if (n > 0) return "Lanjutkan";
  return "Mulai Belajar";
}

export default function LessonCard({ lesson, progressPercent }) {
  const bgColor = getColorById(lesson.id);
  const showProgress =
    typeof progressPercent === "number" && progressPercent > 0;
  const ctaLabel = getCtaLabel(progressPercent);

  return (
    <div className={`rounded-2xl p-5 text-white ${bgColor} shadow-2xl`}>
      <div className="mb-3 text-sm opacity-80">
        Tahap {lesson.tahap} • {lesson.tipe}
      </div>

      <h2 className="text-xl font-semibold mb-2">
        {lesson.judul}
      </h2>

      <p className="text-sm opacity-90 mb-4">
        {lesson.deskripsi}
      </p>

      {showProgress && (
        <div className="mb-4">
          <div className="flex justify-between text-xs opacity-90 mb-1">
            <span>Progres</span>
            <span className="font-semibold">{progressPercent}%</span>
          </div>
          <div className="h-2 rounded-full bg-black/20 overflow-hidden">
            <div
              className="h-full rounded-full bg-white/90 transition-all duration-300"
              style={{ width: `${Math.min(100, progressPercent)}%` }}
            />
          </div>
        </div>
      )}

      <Link
        href={`/learn/${lesson.id}`}
        className="inline-block bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:opacity-90"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
