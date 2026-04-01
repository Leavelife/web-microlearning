import Image from "next/image";

export default function Hero() {
  return (
    <section className="grid md:grid-cols-2 gap-10 px-8 py-16 items-center">
      
      {/* LEFT */}
      <div>
        <h1 className="text-4xl font-bold leading-snug">
          Belajar materi TKJ <br />
          dengan <span className="text-blue-500">MICROLAB</span>
        </h1>

        <p className="mt-4 text-slate-600">
          Platform microlearning interaktif untuk siswa SMK TKJ dengan sistem
          progres, quiz, dan virtual lab.
        </p>

        {/* GAMIFICATION PREVIEW */}
        <div className="mt-4 text-sm text-slate-500">
          Level: <span className="font-semibold text-yellow-500">Warrior</span> • XP: 1200/2000
        </div>

        <button className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg 
          transition-all duration-300 hover:bg-blue-600 hover:scale-105">
          Mulai Belajar
        </button>
      </div>

      {/* RIGHT */}
      <div className="flex justify-center">
        <Image
          src="https://storyset.com/illustration/online-learning/amico" // cari versi svg/png di storyset
          alt="learning illustration"
          width={10}
          height={10}
          className="w-[80%] transition-all duration-500 hover:scale-105"
        />
      </div>
    </section>
  );
}