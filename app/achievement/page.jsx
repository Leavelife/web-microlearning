"use client"

import { useCallback, useEffect, useState } from "react"
import BadgeGrid from "@/components/achievement/BadgeGrid"
import SidebarFilter from "@/components/achievement/SidebarFilter"
import Navbar from "@/components/Navbar"

export default function AchievementPage() {
  const [data, setData] = useState([])
  const [filter, setFilter] = useState("SEMUA")
  const [loading, setLoading] = useState(true)

  const fetchAchievements = useCallback(async () => {
    setLoading(true)

    try {
      const query =
        filter === "SEMUA" ? "" : `?type=${filter}`

      const res = await fetch(`/api/achievement/user${query}`)
      const json = await res.json()

      setData(json)
    } catch (err) {
      console.error(err)
    }

    setLoading(false)
  }, [filter])

  useEffect(() => {
    fetchAchievements()
  }, [fetchAchievements])

  return (
    <>
        <Navbar />
        <div className="flex gap-6 p-6 mt-15 bg-gray-50 min-h-screen">
        <SidebarFilter filter={filter} setFilter={setFilter} />

        <div className="flex-1">
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