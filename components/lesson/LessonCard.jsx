import Link from "next/link";
import Image from "next/image";

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
  const showProgress =
    typeof progressPercent === "number" && progressPercent > 0;
  const ctaLabel = getCtaLabel(progressPercent);
  const thumbnail =
    lesson.thumbnail && lesson.thumbnail.trim() !== "-" && lesson.thumbnail.trim() !== ""
      ? lesson.thumbnail
      : "/default-thumbnail.png";
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        <Image
          src={thumbnail}
          alt={lesson.judul}  
          className="h-full w-full object-cover transition duration-500 ease-out hover:scale-105"
          width={400}
          height={192}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute left-4 bottom-4 right-4">
          <span className="inline-flex rounded-full bg-black/50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
            Tahap {lesson.tahap} • {lesson.tipe}
          </span>
        </div>
      </div>

      <div className="p-5 text-slate-900">
        <h2 className="text-xl font-semibold mb-2">{lesson.judul}</h2>

        <p className="text-sm text-slate-600 mb-5 line-clamp-3">
          {lesson.deskripsi}
        </p>

        {showProgress && (
          <div className="mb-5">
            <div className="flex justify-between text-xs opacity-90 mb-1">
              <span>Progres</span>
              <span className="font-semibold">{progressPercent}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-linear-to-r from-violet-500 to-fuchsia-500 transition-all duration-300"
                style={{ width: `${Math.min(100, progressPercent)}%` }}
              />
            </div>
          </div>
        )}

        <Link
          href={`/learn/${lesson.id}`}
          className="inline-block rounded-full bg-black/80 px-4 py-2 text-sm font-medium text-white transition hover:bg-black"
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}
