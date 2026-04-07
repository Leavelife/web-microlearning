import Link from "next/link";
import QuizCard from "@/components/quiz/QuizCard";
import { getQuizListForBrowse } from "@/lib/quiz-for-pages";
import Navbar from "@/components/Navbar";
import Image from "next/image";


export default async function QuizPage() {
  const quizzes = await getQuizListForBrowse();

  return (<>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-6 py-10 mt-15">
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-8 px-4 md:px-8">
    
        {/* Bagian Kiri: Teks */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 leading-tight">
            Explore Quiz
          </h1>
          <p className="text-gray-500 text-lg md:text-xl">
            Latih skill kamu dengan berbagai quiz interaktif yang menyenangkan.
          </p>
          
          <button className="mt-6 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition-colors">
            Mulai Sekarang
          </button>
        </div>

        {/* Bagian Kanan: Gambar */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <Image 
            src="/images/quiz.jpg" 
            alt="Ilustrasi Explore Quiz" 
            className="w-full max-w-md rounded-2xl object-cover shadow-lg"
            width={500}
            height={350}
          />
        </div>
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
