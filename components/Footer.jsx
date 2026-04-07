export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-20 pt-16 pb-8">
      {/* Wrapper untuk membatasi lebar maksimal konten agar rapi di layar besar */}
      <div className="max-w-7xl mx-auto px-8">
        
        {/* Grid Utama */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Kolom 1 & 2: Informasi Brand (Dibuat lebih lebar) */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-[#6F27FF] mb-4">MICROLAB</h3>
            <p className="text-slate-500 leading-relaxed max-w-sm">
              Platform microlearning interaktif yang dirancang khusus untuk siswa SMK jurusan Teknik Komputer dan Jaringan (TKJ).
            </p>
          </div>

          {/* Kolom 3: Kontak */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-5">Kontak Kami</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li>
                <a href="mailto:halo@microlab.com" className="hover:text-[#6F27FF] transition-colors">
                  halo@microlab.com
                </a>
              </li>
              <li>
                {/* Menggunakan alamat contoh */}
                <p>Malang, Jawa Timur</p> 
              </li>
            </ul>
          </div>

          {/* Kolom 4: Sosial Media */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-5">Ikuti Kami</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li>
                <a href="#" className="hover:text-[#6F27FF] transition-colors">Instagram</a>
              </li>
              <li>
                <a href="#" className="hover:text-[#6F27FF] transition-colors">GitHub</a>
              </li>
              <li>
                <a href="#" className="hover:text-[#6F27FF] transition-colors">LinkedIn</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Garis Pemisah dan Area Copyright */}
        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>&copy; {currentYear} MICROLAB. Hak Cipta Dilindungi.</p>
          
          {/* Tautan Legal (Opsional tapi menambah kesan profesional) */}
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-900 transition-colors">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Kebijakan Privasi</a>
          </div>
        </div>

      </div>
    </footer>
  );
}