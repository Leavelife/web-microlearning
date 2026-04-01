import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Courses from "@/components/Courses";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-white text-slate-800">
      <Navbar />
      <Hero />
      <Features />
      <Courses />
      <Footer />
    </main>
  );
}