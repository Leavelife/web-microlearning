import Link from "next/link";

export default function QuizCard({ quiz }) {
  const materiJudul = quiz.materiStep?.materi?.judul ?? "Materi";
  const stepUrutan = quiz.materiStep?.urutan ?? "—";
  const jumlahSoal = quiz._count?.soal ?? 0;
  const durasi = quiz.durasi ?? 30;

  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="text-sm text-gray-400 mb-1">
        {materiJudul} • Step {stepUrutan}
      </div>

      <h2 className="text-lg font-semibold mb-1 text-gray-900">
        {quiz.judul}
      </h2>

      <p className="text-sm text-gray-500 mb-3 line-clamp-2">
        {quiz.deskripsi || "Tanpa deskripsi"}
      </p>

      <div className="text-xs text-gray-400 mb-4">
        ⏱ {durasi} menit • {jumlahSoal} soal
      </div>

      <Link
        href={`/quiz/${quiz.id}`}
        className="inline-block px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
      >
        Mulai Quiz
      </Link>
    </div>
  );
}
