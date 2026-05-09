export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Kebijakan Privasi</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-600 mb-6">
            Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mt-6 mb-4">1. Pengenalan</h2>
            <p className="text-slate-600 mb-4">
              MICROLAB (\"kami\", \"kami\", atau \"perusahaan kami\") mengoperasikan platform pembelajaran online. Halaman ini menginformasikan Anda tentang kebijakan privasi kami mengenai pengumpulan, penggunaan, dan pengungkapan data pribadi Anda ketika Anda menggunakan layanan kami.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mt-6 mb-4">2. Data yang Kami Kumpulkan</h2>
            <p className="text-slate-600 mb-4">Kami mengumpulkan beberapa jenis data dari pengguna kami:</p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li><strong>Informasi Identitas:</strong> Nama, email, nomor telepon, foto profil</li>
              <li><strong>Informasi Akun:</strong> Riwayat login, preferensi, pengaturan keamanan</li>
              <li><strong>Data Pembelajaran:</strong> Progres kursus, skor quiz, waktu belajar, pencapaian</li>
              <li><strong>Informasi Teknis:</strong> Alamat IP, jenis browser, sistem operasi, perangkat yang digunakan</li>
              <li><strong>Informasi Penggunaan:</strong> Halaman yang dikunjungi, waktu yang dihabiskan, tautan yang diklik</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mt-6 mb-4">3. Bagaimana Kami Menggunakan Data Anda</h2>
            <p className="text-slate-600 mb-4">Data yang kami kumpulkan digunakan untuk:</p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>Menyediakan dan meningkatkan layanan pembelajaran kami</li>
              <li>Membuat dan mengelola akun pengguna Anda</li>
              <li>Mengirim notifikasi dan pembaruan terkait kursus</li>
              <li>Menganalisis penggunaan platform untuk peningkatan</li>
              <li>Mendeteksi dan mencegah aktivitas jahat atau tidak sah</li>
              <li>Mematuhi kewajiban hukum</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mt-6 mb-4">4. Bagikan Data Anda</h2>
            <p className="text-slate-600 mb-4">
              Kami tidak menjual, memperdagangkan, atau mentransfer informasi pribadi Anda kepada pihak ketiga. Kami mungkin membagikan informasi dalam keadaan tertentu:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>Dengan layanan penyedia kami yang membantu operasi platform kami</li>
              <li>Untuk mematuhi persyaratan hukum atau permintaan pemerintah</li>
              <li>Untuk melindungi hak, privasi, keamanan kami atau pengguna lain</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mt-6 mb-4">5. Keamanan Data</h2>
            <p className="text-slate-600 mb-4">
              Keamanan data pribadi Anda penting bagi kami. Kami menggunakan enkripsi SSL dan tindakan keamanan lainnya untuk melindungi informasi Anda. Namun, tidak ada metode transmisi internet atau penyimpanan elektronik yang 100% aman.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mt-6 mb-4">6. Cookie dan Teknologi Pelacakan</h2>
            <p className="text-slate-600 mb-4">
              Kami menggunakan cookie dan teknologi pelacakan serupa untuk melacak aktivitas di platform kami dan menyimpan informasi tertentu. Anda dapat mengatur browser untuk menolak cookie, tetapi ini mungkin mempengaruhi fungsionalitas platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mt-6 mb-4">7. Hak Anda</h2>
            <p className="text-slate-600 mb-4">
              Anda memiliki hak untuk:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>Mengakses data pribadi Anda yang kami miliki</li>
              <li>Meminta koreksi data yang tidak akurat</li>
              <li>Meminta penghapusan akun dan data Anda</li>
              <li>Menarik persetujuan untuk pemrosesan data kami</li>
            </ul>
            <p className="text-slate-600 mt-4">
              Untuk menggunakan hak-hak ini, silakan hubungi kami di halo@microlab.com
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mt-6 mb-4">8. Retensi Data</h2>
            <p className="text-slate-600 mb-4">
              Kami menyimpan data pribadi Anda selama akun Anda aktif atau selama diperlukan untuk menyediakan layanan kami. Anda dapat meminta penghapusan data kapan saja.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mt-6 mb-4">9. Perubahan pada Kebijakan Privasi</h2>
            <p className="text-slate-600 mb-4">
              Kami mungkin memperbarui Kebijakan Privasi kami dari waktu ke waktu. Kami akan memberitahu Anda tentang perubahan material dengan memposting Kebijakan Privasi baru di halaman ini.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mt-6 mb-4">10. Hubungi Kami</h2>
            <p className="text-slate-600 mb-4">
              Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami:
            </p>
            <p className="text-slate-600">
              Email: halo@microlab.com<br />
              Lokasi: Malang, Jawa Timur, Indonesia
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
