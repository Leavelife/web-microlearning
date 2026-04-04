import { getColorById } from "@/lib/color";

export default function LessonCard({ lesson }) {
  const bgColor = getColorById(lesson.id);

  return (
    <div className={`rounded-2xl p-5 text-white ${bgColor}`}>
      
      <div className="mb-3 text-sm opacity-80">
        Tahap {lesson.tahap} • {lesson.tipe}
      </div>

      <h2 className="text-xl font-semibold mb-2">
        {lesson.judul}
      </h2>

      <p className="text-sm opacity-90 mb-5">
        {lesson.deskripsi}
      </p>

      <button className="bg-black text-white px-4 py-2 rounded-full text-sm">
        Start
      </button>
    </div>
  );
}