import LessonGrid from "@/components/lesson/LessonGrid";
import Navbar from "@/components/Navbar";
import { getMateriListFormatted } from "@/lib/materi-list";
import Image from "next/image";

export default async function LearnPage() {
  const lessons = await getMateriListFormatted();

  return (<>
        <Navbar />
        <div className="min-h-screen bg-white px-6 py-10">
        
        {/* HERO */}
        <div className="mb-16 mt-20 px-4 sm:px-6 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Right Content - Image Layout */}
            <div className="relative w-full max-w-sm sm:max-w-md aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-blue-100 to-purple-100 p-4 sm:p-8 shadow-2xl mx-auto lg:mx-0">
              <div className="absolute inset-4 rounded-2xl overflow-hidden bg-white shadow-lg">
                <Image
                  src="/hero-materi.png"
                  alt="Virtual Learning Lab"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Left Content */}
            <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
              <div className="space-y-3 lg:space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-blue-700 border border-blue-100">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  Gamified Learning Experience
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                  Level Up Your
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Skills</span>
                  <br />
                  <span className="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-600">Earn XP & Unlock Achievements</span>
                </h1>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Master new technologies through interactive lessons, challenging quizzes, and hands-on simulations.
                  Track your progress, compete with friends, and unlock badges as you advance through levels.
                </p>
              </div>

              {/* Gamification Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-lg mx-auto lg:mx-0">
                <div className="text-center p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                  <div className="text-xl sm:text-2xl font-bold text-blue-600 mb-1">⚡ XP</div>
                  <div className="text-xs sm:text-sm text-blue-700 font-medium">Experience Points</div>
                </div>
                <div className="text-center p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                  <div className="text-xl sm:text-2xl font-bold text-purple-600 mb-1">🏆</div>
                  <div className="text-xs sm:text-sm text-purple-700 font-medium">Achievements</div>
                </div>
                <div className="text-center p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                  <div className="text-xl sm:text-2xl font-bold text-green-600 mb-1">📈</div>
                  <div className="text-xs sm:text-sm text-green-700 font-medium">Progress Tracking</div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-2 lg:pt-4">
                <button className="inline-flex items-center gap-2 sm:gap-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  Start Learning Journey
                </button>
              </div>
            </div>
          </div>
        </div>

        <LessonGrid lessons={lessons} />
        </div>
  </>
  );
}