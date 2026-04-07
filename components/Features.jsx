import Image from 'next/image';

const features = [
  {
    title: "Akses Materi",
    desc: "Belajar kapan saja dengan modul singkat",
    imgUrl: "/images/features/akses-materi.svg", 
  },
  {
    title: "Latihan Soal",
    desc: "Uji pemahaman dengan quiz interaktif",
    imgUrl: "/images/features/latihan-soal.svg",
  },
  {
    title: "Simulasi",
    desc: "Praktik langsung jaringan & konfigurasi",
    imgUrl: "/images/features/simulasi.svg",
  },
  {
    title: "Progress",
    desc: "Pantau perkembangan belajar kamu",
    imgUrl: "/images/features/progress.svg",
  },
];

export default function Features() {
  return (
    <section className="relative bg-slate-50 pb-20">
      
      {/* Latar Belakang Ungu Melengkung (Absolute) */}
      {/* rounded-b-[4rem] atau [5rem] digunakan untuk membuat lengkungan besar di bawah */}
      <div className="absolute top-0 left-0 w-full h-[350px] bg-[#6F27FF] rounded-b-3xl z-0"></div>

      {/* Konten Utama */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16">
        
        {/* Judul Section */}
        <h2 className="text-4xl font-bold text-center text-white mb-14 tracking-wide">
          Fitur Pembelajaran
        </h2>

        {/* Grid Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] 
              transition-all duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col items-center text-center"
            >
              {/* Wadah Ilustrasi */}
              <div className="relative w-full h-40 mb-6 flex justify-center items-center">
                {/* Pastikan Anda sudah menyiapkan file gambar SVG/PNG untuk masing-masing card */}
                <Image 
                  src={f.imgUrl} 
                  alt={f.title} 
                  fill
                  className="object-contain"
                />
              </div>

              {/* Teks Konten */}
              <h3 className="text-xl font-bold text-gray-900">{f.title}</h3>
              <p className="text-sm text-slate-500 mt-3 leading-relaxed px-2">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}