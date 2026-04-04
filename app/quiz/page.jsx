import Link from "next/link";
import QuizCard from "@/components/quiz/QuizCard";
import { getQuizListForBrowse } from "@/lib/quiz-for-pages";
import Navbar from "@/components/Navbar";
export default async function QuizPage() {
  const quizzes = await getQuizListForBrowse();

  return (<>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-6 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">
          Explore Quiz
        </h1>
        <p className="text-gray-500">
          Latih skill kamu dengan berbagai quiz
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.length === 0 ? (
          <div className="col-span-full text-center py-16 text-gray-500 border border-dashed border-gray-200 rounded-2xl">
            <p className="mb-4">Belum ada quiz yang tersedia.</p>
            <Link
              href="/"
              className="text-sm font-medium text-gray-900 underline underline-offset-4"
            >
              Kembali ke beranda
            </Link>
          </div>
        ) : (
          quizzes.map((quiz) => <QuizCard key={quiz.id} quiz={quiz} />)
        )}
      </div>
    </div>
  </>
  );
}
