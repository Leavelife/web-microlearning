const courses = [1, 2, 3, 4];

export default function Courses() {
  return (
    <section className="px-8 py-16">
      <h2 className="text-2xl font-bold mb-10">
        Pilih materi belajarmu
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {courses.map((_, i) => (
          <div
            key={i}
            className="p-6 border rounded-xl 
            transition-all duration-300 hover:shadow-lg"
          >
            <h3 className="font-semibold">Materi Dasar-dasar</h3>
            <p className="text-sm text-slate-500 mt-2">
              Jumlah materi: 8
            </p>

            {/* Progress */}
            <div className="mt-4">
              <div className="w-full bg-slate-200 h-2 rounded-full">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-700"
                  style={{ width: "10%" }}
                ></div>
              </div>
              <p className="text-xs mt-1">Progress: 10%</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}