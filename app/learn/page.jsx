import { getLessons } from "@/lib/fetcher";
import LessonGrid from "@/components/lesson/LessonGrid";
import Navbar from "@/components/Navbar";

export default async function LearnPage() {
  const lessons = await getLessons();

  return (<>
        <Navbar />
        <div className="min-h-screen bg-white px-6 py-10">
        
        {/* HERO */}
        <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-3">
            Level up your skills 🚀
            </h1>
            <p className="text-gray-500">
            Explore materials and boost your XP
            </p>
        </div>

        <LessonGrid lessons={lessons} />
        </div>
  </>
  );
}