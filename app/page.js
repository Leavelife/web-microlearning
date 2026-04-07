import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Courses from "@/components/Courses";
import Footer from "@/components/Footer";
import { getMateriListFormatted } from "@/lib/materi-list";

export default async function Home() {
  const lessons = await getMateriListFormatted();

  return (
    <main className="bg-white text-slate-800">
      <Navbar />
      <Hero />
      <Features />
      <Courses lessons={lessons} />
      <Footer />
    </main>
  );
}