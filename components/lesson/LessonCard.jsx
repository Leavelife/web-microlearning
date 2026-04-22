import Link from "next/link";
import Image from "next/image";

function getCtaLabel(percent) {
  const n =
    typeof percent === "number" && !Number.isNaN(percent)
      ? Math.min(100, Math.max(0, percent))
      : 0;
  if (n >= 100) return "Telah Selesai ✓";
  if (n > 0) return "Lanjutkan";
  return "Mulai Belajar";
}

function getDifficultyConfig(tipe) {
  const configs = {
    networking: { color: "from-cyan-500 to-blue-600", badge: "🌐", label: "Network" },
    hardware: { color: "from-amber-500 to-orange-600", badge: "⚙️", label: "Hardware" },
    software: { color: "from-green-500 to-emerald-600", badge: "💾", label: "Software" },
    security: { color: "from-red-500 to-rose-600", badge: "🔒", label: "Security" },
    database: { color: "from-purple-500 to-indigo-600", badge: "🗄️", label: "Database" },
  };
  return configs[tipe?.toLowerCase()] || { color: "from-slate-500 to-slate-700", badge: "📚", label: tipe || "Materi" };
}

export default function LessonCard({ lesson, progressPercent }) {
  const showProgress =
    typeof progressPercent === "number" && progressPercent > 0;
  const ctaLabel = getCtaLabel(progressPercent);
  const thumbnail =
    lesson.thumbnail && lesson.thumbnail.trim() !== "-" && lesson.thumbnail.trim() !== ""
      ? lesson.thumbnail
      : "/default-thumbnail.png";
  
  const difficultyConfig = getDifficultyConfig(lesson.tipe);
  const isCompleted = typeof progressPercent === "number" && progressPercent >= 100;
  const estimatedTime = lesson.totalStep ? Math.max(15, lesson.totalStep * 10) : 30;

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-slate-200 h-full flex flex-col">
      {/* Premium Badge */}
      {isCompleted && (
        <div className="absolute top-3 right-3 z-10">
          <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full px-3 py-1 shadow-lg">
            <span className="text-lg">⭐</span>
            <span className="text-xs font-bold text-white">SELESAI</span>
          </div>
        </div>
      )}

      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
        <Image
          src={thumbnail}
          alt={lesson.judul}  
          className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-110"
          width={400}
          height={192}
        />
        
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t ${difficultyConfig.color} opacity-30 group-hover:opacity-40 transition-opacity duration-300`} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Type Badge - Top Left */}
        <div className="absolute top-4 left-4 z-20">
          <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md">
            <span className="text-lg">{difficultyConfig.badge}</span>
            <span className="text-xs font-semibold text-slate-900">{difficultyConfig.label}</span>
          </div>
        </div>

        {/* Progress Ring - Bottom Right */}
        {showProgress && (
          <div className="absolute bottom-4 right-4 z-20">
            <div className="relative w-16 h-16">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="4"
                  strokeDasharray={`${(progressPercent / 100) * 175.93} 175.93`}
                  className="transition-all duration-500"
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-white drop-shadow-lg">{progressPercent}%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 p-6 flex flex-col">
        {/* Title */}
        <h2 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-slate-950 transition">
          {lesson.judul}
        </h2>

        {/* Description */}
        <p className="text-sm text-slate-600 mb-4 line-clamp-2 flex-1">
          {lesson.deskripsi}
        </p>

        {/* Stats Row */}
        <div className="flex gap-4 mb-5 py-3 border-t border-b border-slate-100">
          {/* Steps */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-lg">📖</span>
            <div>
              <p className="text-slate-500">Step</p>
              <p className="font-semibold text-slate-900">{lesson.totalStep || 0}</p>
            </div>
          </div>

          {/* Time Estimate */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-lg">⏱️</span>
            <div>
              <p className="text-slate-500">Durasi</p>
              <p className="font-semibold text-slate-900">~{estimatedTime}m</p>
            </div>
          </div>

          {/* XP Reward */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-lg">⚡</span>
            <div>
              <p className="text-slate-500">XP</p>
              <p className="font-semibold text-slate-900">{(lesson.totalStep || 1) * 10}</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {showProgress && (
          <div className="mb-5">
            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 transition-all duration-500 shadow-lg"
                style={{ width: `${Math.min(100, progressPercent)}%` }}
              />
            </div>
          </div>
        )}

        {/* CTA Button */}
        <Link
          href={`/learn/${lesson.id}`}
          className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 text-center text-sm
            ${isCompleted
              ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:from-green-600 hover:to-emerald-700"
              : "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:shadow-lg hover:from-violet-700 hover:to-purple-700"
            }
            transform group-hover:scale-105 active:scale-95
          `}
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}
