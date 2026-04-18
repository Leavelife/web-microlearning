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
    const [isOpen, setIsOpen] = useState(false)
    const [username, setUsername] = useState(user.username)
    const [wilayah, setWilayah] = useState(user.wilayah || "")
    const [image, setImage] = useState(user.image || "")
    const [imageError, setImageError] = useState("")
    const [loading, setLoading] = useState(false)
    const { showNotification } = useNotification()

    const handleImageChange = (e) => {
        const file = e.target.files?.[0]
        setImageError("")
        if (!file) return

        if (!file.type.startsWith("image/")) {
            setImageError("File harus berupa gambar")
            return
        }

        // Batasi ukuran file 2MB agar payload aman saat dikirim JSON.
        if (file.size > 2 * 1024 * 1024) {
            setImageError("Ukuran gambar maksimal 2MB")
            return
        }

        const reader = new FileReader()
        reader.onload = () => {
            if (typeof reader.result === "string") {
                setImage(reader.result)
            }
        }
        reader.readAsDataURL(file)
    }

    const handleSubmit = async () => {
        setLoading(true)

        try {
            const res = await fetch("/api/profile", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, wilayah, image })
            })

            const data = await res.json()

            if (res.ok) {
                showNotification({ message: "Berhasil Edit Profile!", type: "success", duration: 2000 })
                setIsOpen(false)
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

    const handleCancel = () => {
        setUsername(user.username)
        setWilayah(user.wilayah || "")
        setImage(user.image || "")
        setImageError("")
        setIsOpen(false)
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800"
            >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit Profile
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Edit Profile</p>
                                <h4 className="mt-2 text-lg font-semibold text-slate-900">Perbarui data Anda</h4>
                            </div>
                            <button
                                onClick={handleCancel}
                                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Foto Profil</label>
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={image || "/default-avatar.png"}
                                            alt="Preview foto profil"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800"
                                    />
                                </div>
                                {imageError && (
                                    <p className="mt-2 text-xs text-red-500">{imageError}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
                                <input
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Username"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Wilayah</label>
                                <select
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
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
                            </div>
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={handleCancel}
                                className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-1 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Menyimpan..." : "Simpan"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}