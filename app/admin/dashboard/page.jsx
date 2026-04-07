import { subDays, format } from "date-fns";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
    const roleError = await requireRole("admin").catch((err) => err);

    if (roleError.message === "UNAUTHORIZED") {
        redirect("/");
    }
    const materi = await prisma.materi.findMany({
        take: 10,
        orderBy: { createdAt: "asc" }
    });

    const quiz = await prisma.quiz.findMany({
        take: 10,
        orderBy: { id: "asc" },
        include: {
            materiStep: {
                include: {
                    materi: true
                }
            },
            _count: {
                select: { soal: true }
            }
        }
    });

    const [totalUsers, totalMateri, totalQuiz, totalSimulasi] = await Promise.all([
        prisma.user.count(),
        prisma.materi.count(),
        prisma.quiz.count(),
        prisma.hasilSimulasi.count()
    ]);

    const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const date = subDays(new Date(), 6 - i);
        return format(date, "yyyy-MM-dd");
    });

    const activityRaw = await prisma.hasilQuizUser.groupBy({
        by: ["tanggal"],
        _count: {
            id: true
        }
    });

    const activityMap = {};

    activityRaw.forEach(item => {
        const key = format(new Date(item.tanggal), "yyyy-MM-dd");
        activityMap[key] = (activityMap[key] || 0) + item._count.id;
    });

    const activityTrend = last7Days.map(date => ({
        name: date.slice(5),
        total: activityMap[date] || 0
    }));
    const scoreRaw = await prisma.hasilQuizUser.groupBy({
        by: ["tanggal"],
        _avg: {
            score: true
        }
    });

    const scoreMap = {};

    scoreRaw.forEach(item => {
        const key = format(new Date(item.tanggal), "yyyy-MM-dd");
        scoreMap[key] = item._avg.score || 0;
    });

    const quizTrend = last7Days.map(date => ({
        name: date.slice(5),
        score: Math.round(scoreMap[date] || 0)
    }));

  return (
    <DashboardClient
      stats={{
        totalUsers,
        totalMateri,
        totalQuiz,
        totalSimulasi
      }}
      initialMateri={materi}
      initialQuiz={quiz}
      chartData={{
        activityTrend,
        quizTrend
      }}
    />
  );
}

