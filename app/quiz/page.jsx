import Link from "next/link";
import QuizCard from "@/components/quiz/QuizCard";
import { getQuizListForBrowse } from "@/lib/quiz-for-pages";
import Navbar from "@/components/Navbar";
import Image from "next/image";

// Force dynamic rendering untuk real-time updates
export const dynamic = "force-dynamic";

export default async function QuizPage() {
  const quizzes = await getQuizListForBrowse();

  return (<>
    <Navbar />
    <div className="min-h-screen bg-linear-to-b from-white via-violet-50 to-indigo-50 px-6 py-10 mt-10">
      <div className="max-w-7xl mx-auto">
        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center mb-12 px-4 md:px-0">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">
              <span className="h-2.5 w-2.5 rounded-full bg-violet-500" /> Quiz Challenge
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
                Kembangkan kemampuan dengan quiz interaktif
              </h1>
              <p className="mt-4 text-lg text-slate-600 max-w-xl">
                Pilih quiz dari berbagai materi, kumpulkan EXP, dan raih badge sambil belajar dengan cara yang lebih seru.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-violet-100 bg-white px-5 py-4 shadow-sm">
                <p className="text-sm text-violet-500 uppercase font-semibold tracking-[0.18em]">Quiz</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{quizzes.length}</p>
              </div>
              <div className="rounded-3xl border border-violet-100 bg-white px-5 py-4 shadow-sm">
                <p className="text-sm text-violet-500 uppercase font-semibold tracking-[0.18em]">XP Reward</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">Tinggi</p>
              </div>
              <div className="rounded-3xl border border-violet-100 bg-white px-5 py-4 shadow-sm">
                <p className="text-sm text-violet-500 uppercase font-semibold tracking-[0.18em]">Level Gamified</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">Interaktif</p>
              </div>
            </div>
            <button className="mt-2 inline-flex items-center justify-center rounded-full bg-linear-to-r from-violet-600 to-fuchsia-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:-translate-y-0.5">
              Mulai Sekarang
            </button>
          </div>
          <div className="relative overflow-hidden rounded-[30px] border border-violet-100 bg-linear-to-br from-violet-100 via-white to-indigo-100 p-6 shadow-xl">
            <div className="absolute inset-y-0 right-0 w-40 bg-linear-to-t from-violet-200 to-transparent opacity-70" />
            <Image 
              src="/landing-quiz-page.png" 
              alt="Ilustrasi Explore Quiz" 
              className="relative mx-auto w-full max-w-lg rounded-[28px] object-cover shadow-2xl shadow-violet-200/40"
              width={560}
              height={400}
            />
          </div>
        </section>

        <section className="px-4 md:px-0">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-600">Semua Quiz</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">Pilih tantanganmu</h2>
            </div>
            <p className="text-sm text-slate-500 max-w-xl">
              Setiap quiz hadir dengan pengalaman gamified yang membantu kamu tetap termotivasi dan terstruktur.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {quizzes.length === 0 ? (
              <div className="col-span-full text-center py-16 text-slate-500 border border-dashed border-slate-200 rounded-3xl bg-white shadow-sm">
                <p className="mb-4">Belum ada quiz yang tersedia.</p>
                <Link
                  href="/"
                  className="text-sm font-medium text-violet-700 underline underline-offset-4"
                >
                  Kembali ke beranda
                </Link>
              </div>
            ) : (
              quizzes.map((quiz) => <QuizCard key={quiz.id} quiz={quiz} />)
            )}
          </div>
        </section>
      </div>
    </div>
  </>
  );
}
