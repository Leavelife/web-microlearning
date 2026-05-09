export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Syarat & Ketentuan</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-600 mb-6">
            Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mt-6 mb-4">1. Penerimaan Syarat</h2>
            <p className="text-slate-600 mb-4">
              Dengan mengakses dan menggunakan platform MICROLAB, Anda menerima dan setuju untuk terikat dengan syarat dan ketentuan penggunaan ini. Jika Anda tidak setuju dengan salah satu bagian dari syarat ini, mohon jangan gunakan platform kami.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mt-6 mb-4">2. Penggunaan Platform</h2>
            <p className="text-slate-600 mb-4">
              Anda setuju untuk menggunakan MICROLAB hanya untuk tujuan yang sah dan dengan cara yang tidak melanggar hak orang lain atau membatasi penggunaan atau kesenangan orang lain terhadap platform.
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>Tidak ada konten yang melanggar hukum atau berbahaya</li>
              <li>Tidak ada akses tidak sah atau penggunaan materi</li>
              <li>Tidak ada gangguan layanan platform</li>
              <li>Tidak ada pengumpulan data otomatis tanpa izin</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mt-6 mb-4">3. Akun Pengguna</h2>
            <p className="text-slate-600 mb-4">
              Ketika Anda membuat akun di MICROLAB, Anda bertanggung jawab untuk menjaga kerahasiaan kata sandi dan informasi akun Anda. Anda setuju untuk menerima tanggung jawab atas semua aktivitas yang terjadi di bawah akun Anda. Anda wajib memberitahu kami segera tentang setiap penggunaan tidak sah dari akun Anda.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mt-6 mb-4">4. Konten Pengguna</h2>
            <p className="text-slate-600 mb-4">
              Anda mempertahankan semua hak atas konten apa pun yang Anda kirim, posting, atau menampilkan di platform MICROLAB. Dengan mengirimkan konten, Anda memberikan MICROLAB lisensi tanpa royalti, non-eksklusif, dapat dialihkan, dan dapat disublisensikan untuk menggunakan, mereproduksi, memodifikasi, dan mendistribusikan konten tersebut.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mt-6 mb-4">5. Konten Pihak Ketiga</h2>
            <p className="text-slate-600 mb-4">
              MICROLAB mungkin berisi tautan ke situs web pihak ketiga. Kami tidak bertanggung jawab atas konten, keakuratan, atau praktik dari situs web eksternal ini. Kunjungan ke situs eksternal adalah atas risiko Anda sendiri.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mt-6 mb-4">6. Pembatasan Tanggung Jawab</h2>
            <p className="text-slate-600 mb-4">
              Dalam hal apapun, MICROLAB, pendiri, direktur, karyawan, atau agen tidak akan bertanggung jawab untuk setiap kerusakan tidak langsung, insidental, khusus, konsekuensial, atau punitif, termasuk kehilangan keuntungan, data, atau penggunaan.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mt-6 mb-4">7. Modifikasi Layanan</h2>
            <p className="text-slate-600 mb-4">
              MICROLAB berhak untuk memodifikasi atau menghentikan layanan kapan saja dengan atau tanpa pemberitahuan. Kami tidak akan bertanggung jawab kepada Anda atau pihak ketiga manapun untuk modifikasi, suspensi, atau penghentian layanan.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mt-6 mb-4">8. Hukum yang Mengatur</h2>
            <p className="text-slate-600 mb-4">
              Syarat dan ketentuan ini dan penggunaan Anda terhadap platform MICROLAB diatur dan ditafsirkan sesuai dengan hukum Indonesia.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mt-6 mb-4">9. Kontak Kami</h2>
            <p className="text-slate-600 mb-4">
              Jika Anda memiliki pertanyaan tentang Syarat dan Ketentuan ini, silakan hubungi kami di halo@microlab.com
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200">
          <a href="/" className="text-[#6F27FF] hover:text-[#8B5CF6] font-semibold transition-colors">
            ← Kembali ke Beranda
          </a>
        </div>
      </div>
    </main>
  );
}
