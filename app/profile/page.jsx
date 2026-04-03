import { cookies } from "next/headers"
import ProfileSection from "@/components/profile/ProfileSection"
import Navbar from "@/components/Navbar"

async function getProfile() {
  const cookieStore = await cookies()

  const res = await fetch("http://localhost:3000/api/profile", {
    headers: {
      Cookie: `token=${cookieStore.get("token")?.value}`
    },
    cache: "no-store"
  })

  return res.json()
}

export default async function ProfilePage() {
  const data = await getProfile()

  return (
    <div className="">
        <Navbar />
        <ProfileSection user={data} />
    </div>
  )
}