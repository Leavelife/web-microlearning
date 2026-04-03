"use client"

import { useState } from "react"

export default function EditProfile({ user }) {
  const [username, setUsername] = useState(user.username)
  const [wilayah, setWilayah] = useState(user.wilayah || "")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)

    const res = await fetch("/api/profile", {
      method: "PATCH",
      body: JSON.stringify({ username, wilayah })
    })

    const data = await res.json()

    alert(data.message)
    setLoading(false)

    location.reload() // simple refresh
  }

  return (
    <div className="mt-6">
      <h4 className="font-semibold mb-2">Edit Profile</h4>

      <input
        className="border p-2 w-full mb-2 rounded"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />

      <input
        className="border p-2 w-full mb-2 rounded"
        value={wilayah}
        onChange={(e) => setWilayah(e.target.value)}
        placeholder="Wilayah"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Loading..." : "Simpan"}
      </button>
    </div>
  )
}