import Image from "next/image";

export default function Hero() {
  return (
    <>
    <section className="grid md:grid-cols-2 gap-10 px-8 py-16 mt-15 items-center">
      
      {/* LEFT */}
      <div>
        <h1 className="text-4xl font-bold leading-snug">
          Belajar materi TKJ <br />
          dengan <span className="text-[#6F27FF]">MICROLAB</span>
        </h1>

        <p className="mt-4 text-slate-600">
          Platform microlearning interaktif untuk siswa SMK TKJ dengan sistem
          progres, quiz, dan virtual lab.
        </p>

        {/* GAMIFICATION PREVIEW */}
        <div className="mt-4 text-sm text-slate-500">
          Level: <span className="font-semibold text-yellow-500">Warrior</span> • XP: 1200/2000
        </div>

        <button className="mt-6 px-6 py-3 bg-[#6F27FF] text-white rounded-lg 
          transition-all duration-300 hover:bg-[#8B5CF6] hover:scale-105">
          Mulai Belajar
        </button>
      </div>

      {/* RIGHT */}
      <div className="flex justify-center">
        <Image
          src="/images/home/hero.svg" 
          alt="learning illustration"
          width={10}
          height={10}
          className="w-[80%] transition-all duration-500 hover:scale-105"
        />
      </div>
    </section>
    <section className="bg-[#6F27FF] text-white rounded-tr-[100px] rounded-tl-[100px] overflow-hidden shadow-2xl">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 px-10 py-20 items-center">
        
        {/* LEFT - Illustration */}
        <div className="flex justify-center relative p-10">
          <div className="absolute inset-0 opacity-10 rounded-full" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
          <Image
            src="/images/home/hero2.svg" 
            alt="learning illustration"
            width={500} 
            height={500}  
            className="relative z-10 w-full max-w-lg transition-all duration-500 hover:scale-105"
          />
        </div>

        {/* RIGHT - Text Content */}
        <div className="text-left space-y-5">
          <h1 className="text-4xl md:text-4xl font-bold leading-tight">
            Belajar Lebih Efektif
          </h1>

          <p className="text-sm md:text-xl text-white opacity-90 max-w-xl">
            Akses materi, latihan soal, dan simulasi jaringan dalam satu platform
            microlearning.
          </p>
          
          <div className="flex justify-start">
            <button className="px-10 py-5 bg-white text-[#6F27FF] rounded-full font-semibold
              transition-all duration-300 hover:bg-slate-100 hover:scale-105 flex items-center gap-3 shadow-md">
              Jelajahi Fitur
              {/* Ikon Panah (>) */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}