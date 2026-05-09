"use client"

import Image from "next/image";
import Link from "next/link";

export default function Hero({ userProfile }) {
  const currentLevel = userProfile?.level;
  const currentExp = userProfile?.totalExp ?? 1200;
  const levelName = currentLevel?.nama ?? "Warrior";
  const minExp = currentLevel?.minExp ?? 0;
  const maxExp = currentLevel?.maxExp ?? 2000;
  const progressPercent = currentLevel
    ? Math.max(0, Math.min(100, Math.round(((currentExp - minExp) / (maxExp - minExp)) * 100)))
    : 60;

  return (
    <>
    <section className="grid md:grid-cols-2 gap-6 md:gap-10 px-8 md:px-28 lg:px-42 py-8 md:py-16 mt-10 items-center" >
      
      {/* LEFT */}
      <div>
        <h1 className="text-2xl md:text-4xl font-bold leading-snug">
          Belajar Materi TKJ <br />
          Dengan <span className="text-[#6F27FF]">MICROLAB</span>
        </h1>

        <p className="mt-4 text-sm md:text-base text-slate-600">
          Platform microlearning interaktif untuk siswa SMK TKJ dengan sistem
          progres, quiz, dan virtual lab.
        </p>

        {/* GAMIFICATION PREVIEW */}
        {userProfile ? (
          /* === LOGGED-IN: Realtime data === */
          <div className="mt-6 p-5 md:p-6 rounded-[28px] bg-white border border-slate-200 shadow-sm max-w-md">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Performa Gamification</p>
                <h2 className="text-base md:text-lg font-semibold text-slate-900">Kemajuan belajarmu</h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-semibold">{levelName}</span>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                <span>XP saat ini</span>
                <span className="font-semibold text-slate-900">{currentExp.toLocaleString()} / {maxExp.toLocaleString()}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full rounded-full bg-linear-to-r from-[#6F27FF] to-[#8B5CF6]" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-2xl bg-slate-100 text-slate-700">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </span>
                <span>3 prestasi aktif</span>
              </div>
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-slate-500">Tetap konsisten</span>
            </div>
          </div>
        ) : (
          /* === GUEST: Preview card with CTA === */
          <div className="mt-6 relative max-w-md">
            {/* Blurred preview layer */}
            <div className="p-5 md:p-6 rounded-[28px] bg-white border border-slate-200 shadow-sm blur-[2px] select-none pointer-events-none" aria-hidden="true">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Performa Gamification</p>
                  <h2 className="text-base md:text-lg font-semibold text-slate-900">Kemajuan belajarmu</h2>
                </div>
                <span className="px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-semibold">Warrior</span>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                  <span>XP saat ini</span>
                  <span className="font-semibold text-slate-900">1.200 / 2.000</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full rounded-full bg-linear-to-r from-[#6F27FF] to-[#8B5CF6]" style={{ width: "60%" }}></div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-2xl bg-slate-100 text-slate-700">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </span>
                  <span>3 prestasi aktif</span>
                </div>
                <span className="text-xs uppercase tracking-[0.2em] font-semibold text-slate-500">Tetap konsisten</span>
              </div>
            </div>

            {/* Overlay CTA */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-[28px] bg-white/70 backdrop-blur-sm border border-slate-200 shadow-sm px-6 text-center">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-violet-100 text-violet-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
                </svg>
              </span>
              <p className="text-sm font-semibold text-slate-800">Mulai perjalanan belajarmu!</p>
              <p className="text-xs text-slate-500">Masuk atau daftar untuk melacak XP &amp; level kamu secara realtime.</p>
              <div className="flex gap-2 mt-1">
                <Link href="/login" className="px-4 py-2 rounded-lg bg-[#6F27FF] text-white text-xs font-semibold transition-all duration-200 hover:bg-[#8B5CF6] hover:scale-105">
                  Masuk
                </Link>
                <Link href="/register" className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-semibold transition-all duration-200 hover:bg-slate-50 hover:scale-105">
                  Daftar
                </Link>
              </div>
            </div>
          </div>
        )}

        <Link href="/learn" className="inline-block mt-6 px-4 md:px-6 py-2 md:py-3 bg-[#6F27FF] text-white rounded-lg text-sm md:text-base transition-all duration-300 hover:bg-[#8B5CF6] hover:scale-105">
          Mulai Belajar
        </Link>
      </div>

      {/* RIGHT */}
      <div className="flex justify-center">
        <Image
          src="/images/home/hero.svg" 
          loading="eager"
          alt="learning illustration"
          width={10}
          height={10}
          className="w-[90%] md:w-[80%] transition-all duration-500 hover:scale-105"
        />
      </div>
    </section>
    <section className="bg-[#6F27FF] text-white rounded-tr-[50px] md:rounded-tr-[100px] rounded-tl-[50px] md:rounded-tl-[100px] overflow-hidden shadow-2xl">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 px-6 md:px-10 py-12 md:py-20 items-center">
        
        {/* LEFT - Illustration */}
        <div className="flex justify-center relative p-6 md:p-10">
          <div className="absolute inset-0 opacity-10 rounded-full" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
          <Image
            src="/images/home/hero2.svg" 
            alt="learning illustration"
            width={500} 
            height={500}  
            className="relative z-10 w-full max-w-sm md:max-w-lg transition-all duration-500 hover:scale-105"
          />
        </div>

        {/* RIGHT - Text Content */}
        <div className="text-left space-y-4 md:space-y-5">
          <h1 className="text-2xl md:text-4xl font-bold leading-tight">
            Belajar Lebih Efektif
          </h1>

          <p className="text-sm md:text-xl text-white opacity-90 max-w-xl">
            Akses materi, latihan soal, dan simulasi jaringan dalam satu platform
            microlearning.
          </p>
          
          <div className="flex justify-start">
            <Link href="/learn" className="px-6 md:px-10 py-3 md:py-5 bg-white text-[#6F27FF] rounded-full font-semibold text-sm md:text-base
              transition-all duration-300 hover:bg-slate-100 hover:scale-105 flex items-center gap-2 md:gap-3 shadow-md">
              Jelajahi Fitur
              {/* Ikon Panah (>) */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-4 md:size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}