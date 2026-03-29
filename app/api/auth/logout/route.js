export async function POST() {
  return new Response(null, {
    headers: {
      "Set-Cookie": "token=; HttpOnly; Path=/; Max-Age=0"
    }
  })
}