import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Courses from "@/components/Courses";
import Footer from "@/components/Footer";
import { getMateriListFormatted } from "@/lib/materi-list";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";

export const dynamic = "force-dynamic";

async function getUserProfile() {
  try {
    const user = await requireAuth();
    const data = await prisma.user.findUnique({
      where: { id: user.id },
      include: { level: true },
    });

    if (!data) return null;

    return {
      totalExp: data.totalExp,
      level: data.level,
    };
  } catch {
    return null;
  }
}

export default async function Home() {
  const lessons = await getMateriListFormatted();
  const userProfile = await getUserProfile();

  return (
    <main className="bg-white text-slate-800">
      <Navbar />
      <Hero userProfile={userProfile} />
      <Features />
      <Courses lessons={lessons} />
      <Footer />
    </main>
  );
}