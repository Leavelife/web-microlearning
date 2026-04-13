import { redirect } from "next/navigation"
import { requireRole } from "@/lib/auth-guard"

export default async function Page() {
  const roleError = await requireRole("admin").catch((err) => err)

  if (roleError?.message === "UNAUTHORIZED") {
    redirect("/")
  }

  redirect("/admin/dashboard")
}