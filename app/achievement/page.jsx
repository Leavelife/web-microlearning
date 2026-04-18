"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import BadgeGrid from "@/components/achievement/BadgeGrid"
import SidebarFilter from "@/components/achievement/SidebarFilter"
import Navbar from "@/components/Navbar"

export default function AchievementPage() {
  const [data, setData] = useState([])
  const [filter, setFilter] = useState("SEMUA")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAchievements = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const query = filter === "SEMUA" ? "" : `?type=${encodeURIComponent(filter)}`
      const res = await fetch(`/api/achievement/user${query}`, {
        credentials: "include",
      })

      if (res.status === 401) {
        setData([])
        setError({
          status: 401,
          title: "Akses tidak tersedia",
          message: "Silakan masuk terlebih dahulu untuk melihat prestasi Anda.",
        })
        return
      }

      if (!res.ok) {
        const payload = await res.json().catch(() => null)
        setData([])
        setError({
          status: res.status,
          title: "Gagal memuat prestasi",
          message: payload?.message || "Terjadi masalah saat mengambil data prestasi.",
        })
        return
      }

      const json = await res.json()
      setData(json)
    } catch (err) {
      console.error("FETCH_ACHIEVEMENTS_ERROR:", err)
      setData([])
      setError({
        status: 500,
        title: "Terjadi kesalahan",
        message: "Tidak dapat memuat data prestasi saat ini. Coba lagi nanti.",
      })
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchAchievements()
  }, [fetchAchievements])

  return (
    <>
        <Navbar />
        <div className="grid gap-6 p-6 mt-15 bg-gray-50 min-h-screen lg:grid-cols-[280px_1fr]">
          <aside className="order-1 lg:order-1 w-full">
            <SidebarFilter filter={filter} setFilter={setFilter} />
          </aside>

          <div className="order-2 lg:order-2 flex-1">
            {loading ? (
                <p>Loading...</p>
            ) : (
                <BadgeGrid data={data} />
            )}
        </div>
        </div>
    </>
  )
}