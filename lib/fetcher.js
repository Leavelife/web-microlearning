export async function getLessons() {
  const res = await fetch("http://localhost:3000/api/admin/materi", {
    cache: "no-store",
  });

  const data = await res.json();
  return data.materis;
}