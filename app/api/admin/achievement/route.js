// app/api/admin/achievement
import {prisma} from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";

export async function POST(req) {
  try {
    await requireRole("admin");

    const body = await req.json();
    const { nama, deskripsi, syaratExp, kondisi, urlGambar } = body;

    const achievement = await prisma.achievement.create({
      data: {
        nama,
        deskripsi,
        syaratExp: Number(syaratExp),
        kondisi,
        urlGambar,
      },
    });

    return Response.json(achievement);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const achievements = await prisma.achievement.findMany({
      orderBy: { syaratExp: "asc" },
    });

    return Response.json(achievements);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}