import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import LearnMateriClient from "@/components/lesson/LearnMateriClient";
import { getUserFromToken } from "@/lib/auth";
import { ensureProgressMateri, getMateriForLearn } from "@/lib/learn-materi";

export default async function LearnMateriPage({ params }) {
  const { learnId } = await params;

  const materi = await getMateriForLearn(learnId);
  if (!materi) {
    notFound();
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const user = token ? getUserFromToken(token) : null;
  const isLoggedIn = Boolean(user?.id);

  let initialProgress = null;
  if (isLoggedIn && materi.steps?.length) {
    initialProgress = await ensureProgressMateri(
      user.id,
      materi.id,
      materi.steps
    );
  }

  const payload = {
    id: materi.id,
    judul: materi.judul,
    deskripsi: materi.deskripsi,
    steps: materi.steps.map((s) => ({
      id: s.id,
      urutan: s.urutan,
      judul: s.judul,
      contents: s.contents?.map((content) => ({
        id: content.id,
        tipe: content.tipe,
        konten: content.konten,
        urutan: content.urutan,
      })) || [],
      quiz: s.quiz
        ? { id: s.quiz.id, judul: s.quiz.judul }
        : null,
    })),
  };

  const progressProps = initialProgress
    ? {
        stepSekarang: initialProgress.stepSekarang,
        selesai: initialProgress.selesai,
      }
    : null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white flex flex-col">
        <LearnMateriClient
          materi={payload}
          initialProgress={progressProps}
          isLoggedIn={isLoggedIn}
        />
      </div>
    </>
  );
}
