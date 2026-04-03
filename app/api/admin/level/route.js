// app/api/admin/level
import {prisma} from "@/lib/prisma";
import {requireRole } from "@/lib/auth-guard";

export async function POST(req) {
  try {
    await requireRole( "admin");

    const body = await req.json();
    const { nama, minExp, urlGambar } = body;

    const level = await prisma.level.create({
      data: {
        nama,
        minExp: Number(minExp),
        urlGambar,
      },
    });

    return Response.json(level);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  const levels = await prisma.level.findMany({
    orderBy: { minExp: "asc" },
  });

  return Response.json(levels);
}