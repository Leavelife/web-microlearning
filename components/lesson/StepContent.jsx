import Link from "next/link";

function isYoutubeUrl(url) {
  if (!url || typeof url !== "string") return false;
  return /youtube\.com|youtu\.be/i.test(url);
}

function toYoutubeEmbed(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    const id = u.searchParams.get("v");
    return id ? `https://www.youtube.com/embed/${id}` : null;
  } catch {
    return null;
  }
}

export default function StepContent({ step, materiJudul }) {
  if (!step) {
    return (
      <p className="text-gray-500">Pilih tahap di sisi kiri.</p>
    );
  }

  const { tipe, konten, judul, quiz } = step;
  const youtubeEmbedUrl =
    tipe === "video" && konten && isYoutubeUrl(konten)
      ? toYoutubeEmbed(konten)
      : null;

  return (
    <div className="space-y-6 mt-15">
      <div>
        <p className="text-sm text-gray-400 mb-1">{materiJudul}</p>
        <h2 className="text-2xl font-bold text-gray-900">{judul}</h2>
        <span className="inline-block mt-2 text-xs font-medium uppercase tracking-wide text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
          {tipe}
        </span>
      </div>

      {tipe === "text" && (
        <div className="prose prose-gray max-w-none">
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {konten}
          </div>
        </div>
      )}

      {tipe === "image" && konten && (
        <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={konten}
            alt={judul}
            className="w-full max-h-[480px] object-contain mx-auto"
          />
        </div>
      )}

      {tipe === "video" && konten && (
        <div className="rounded-xl overflow-hidden border border-gray-200 bg-black aspect-video">
          {youtubeEmbedUrl ? (
            <iframe
              title={judul}
              src={youtubeEmbedUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : isYoutubeUrl(konten) ? (
            <div className="flex h-full min-h-[200px] items-center justify-center p-6 text-center text-sm text-white/90">
              URL YouTube tidak valid atau tidak bisa di-embed. Periksa link di
              admin.
            </div>
          ) : (
            <video
              src={konten}
              controls
              className="w-full h-full"
            >
              Browser tidak mendukung pemutaran video.
            </video>
          )}
        </div>
      )}

      {!["text", "image", "video"].includes(tipe) && (
        <div className="whitespace-pre-wrap text-gray-700">{konten}</div>
      )}

      {quiz?.id && (
        <div className="pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 mb-2">Quiz untuk tahap ini:</p>
          <Link
            href={`/quiz/${quiz.id}`}
            className="inline-flex items-center px-4 py-2 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800"
          >
            {quiz.judul || "Kerjakan quiz"}
          </Link>
        </div>
      )}
    </div>
  );
}
