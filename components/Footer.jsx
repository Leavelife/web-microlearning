export default function Footer() {
  return (
    <footer className="px-8 py-10 bg-slate-100 mt-10">
      <div className="grid md:grid-cols-3 gap-6 text-sm">
        <div>
          <h3 className="font-semibold mb-2">Tentang Kami</h3>
          <p className="text-slate-500">
            Platform microlearning untuk siswa TKJ.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Contact</h3>
          <p className="text-slate-500">email@email.com</p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Ikuti Kami</h3>
          <p className="text-slate-500">Instagram • Github</p>
        </div>
      </div>
    </footer>
  );
}