"use client"

import { useState } from "react"
import { useNotification } from "@/components/context/NotificationContext"

const PROVINSI = [
  "Aceh",
  "Sumatera Utara",
  "Sumatera Barat",
  "Riau",
  "Jambi",
  "Sumatera Selatan",
  "Bengkulu",
  "Lampung",
  "Kepulauan Bangka Belitung",
  "Kepulauan Riau",
  "DKI Jakarta",
  "Jawa Barat",
  "Jawa Tengah",
  "DI Yogyakarta",
  "Jawa Timur",
  "Banten",
  "Bali",
  "Nusa Tenggara Barat",
  "Nusa Tenggara Timur",
  "Kalimantan Barat",
  "Kalimantan Tengah",
  "Kalimantan Selatan",
  "Kalimantan Timur",
  "Kalimantan Utara",
  "Sulawesi Utara",
  "Sulawesi Tengah",
  "Sulawesi Selatan",
  "Sulawesi Tenggara",
  "Gorontalo",
  "Sulawesi Barat",
  "Maluku",
  "Maluku Utara",
  "Papua",
  "Papua Barat"
]

export default function EditProfile({ user }) {
    const [username, setUsername] = useState(user.username)
    const [wilayah, setWilayah] = useState(user.wilayah || "")
    const [loading, setLoading] = useState(false)
    const { showNotification } = useNotification()

    const handleSubmit = async () => {
        setLoading(true)

        try {
            const res = await fetch("/api/profile", {
            method: "PATCH",
            body: JSON.stringify({ username, wilayah,  })
            })

            const data = await res.json()

            if (res.ok) {
                showNotification({ message: "Berhasil Edit Profile!", type: "success", duration: 2000 })
                setTimeout(() => {
                    location.reload()
                }, 500)
            } else {
                showNotification({ message: data.error || `Kamu Telah Melebihi Batas Edit Profile "${user.editCount}x"`, type: "error", duration: 2000 })
            }
        } catch (error) {
            showNotification({ message: "Terjadi kesalahan", type: "error", duration: 2000 })
        } finally {
            setLoading(false)
        }
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

        <select
            className="border p-2 w-full mb-2 rounded"
            value={wilayah}
            onChange={(e) => setWilayah(e.target.value)}
        >
            <option value="">Pilih Provinsi</option>
            {PROVINSI.map((prov) => (
                <option key={prov} value={prov}>
                    {prov}
                </option>
            ))}
        </select>

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