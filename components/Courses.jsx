import LessonGrid from "@/components/lesson/LessonGrid";

export default function Courses({ lessons = [] }) {
  return (
    <section className="px-8 py-16">
      <h2 className="text-2xl font-bold mb-10 text-slate-800">
        Pilih materi belajarmu
      </h2>

      <LessonGrid lessons={lessons} />
    </section>
  );
}
