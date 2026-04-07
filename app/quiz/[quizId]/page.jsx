import Link from "next/link";
import { notFound } from "next/navigation";
import QuizContainer from "@/components/quiz/QuizContainer";
import { getQuizForPlay } from "@/lib/quiz-for-pages";

export default async function QuizPlayPage({ params }) {
  const { quizId } = await params;
  const quiz = await getQuizForPlay(quizId);

  if (!quiz) {
    notFound();
  }

  if (!quiz.soal?.length) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 gap-6">
        <div className="text-center max-w-md">
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            {quiz.judul}
          </h1>
          <p className="text-gray-500 text-sm">
            Quiz ini belum memiliki soal. Coba lagi nanti.
          </p>
        </div>
        <Link
          href="/quiz"
          className="px-5 py-2.5 rounded-full bg-gray-900 text-white text-sm font-medium"
        >
          Kembali ke daftar quiz
        </Link>
      </div>
    );
  }

  return <QuizContainer key={quiz.id} quiz={quiz} />;
}
