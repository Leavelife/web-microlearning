export async function getLessons() {
  const baseUrl = process.env.NODE_ENV === 'production' ? 'https://web-microlearning.vercel.app' : 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/admin/materi`, {
    cache: "no-store",
  });

  const data = await res.json();
  return data.materis;
}