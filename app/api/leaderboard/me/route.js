export async function GET(req) {
  const user = await getUser()

  const me = await prisma.user.findUnique({
    where: { id: user.id }
  })

  const rank = await prisma.user.count({
    where: {
      totalExp: {
        gt: me.totalExp
      }
    }
  }) + 1

  return Response.json({
    rank,
    totalExp: me.totalExp
  })
}