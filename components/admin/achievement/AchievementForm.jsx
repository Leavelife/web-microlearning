"use client"

import { useState, useRef } from "react"
import { createAchievement } from "@/actions/achievement"

export default function AchievementForm() {
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewSrc, setPreviewSrc] = useState("")
  const [imageError, setImageError] = useState("")
  const fileInputRef = useRef(null)

  function validate(formData) {
    const newErrors = {}

    const nama = formData.get("nama")?.trim()
    const deskripsi = formData.get("deskripsi")?.trim()
    const eventType = formData.get("eventType")?.trim()
    const expReward = Number(formData.get("expReward"))
    const gambar = formData.get("gambar")

    if (!nama) newErrors.nama = "Nama wajib diisi"
    if (!deskripsi) newErrors.deskripsi = "Deskripsi wajib diisi"
    if (!eventType) newErrors.eventType = "Jenis event wajib diisi"

    if (!expReward || expReward <= 0) {
      newErrors.expReward = "XP harus lebih dari 0"
    }

    if (!gambar || gambar.size === 0) {
      newErrors.gambar = "Gambar wajib diunggah"
    }

    return newErrors
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    setImageError("")
    if (!file) {
      setPreviewSrc("")
      return
    }

    if (!file.type.startsWith("image/")) {
      setImageError("File harus berupa gambar")
      setPreviewSrc("")
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setImageError("Ukuran gambar maksimal 2MB")
      setPreviewSrc("")
      return
    }

    const url = URL.createObjectURL(file)
    setPreviewSrc(url)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setServerError("")

    const formData = new FormData(e.target)
    const validation = validate(formData)

    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      return
    }

    setErrors({})
    setIsSubmitting(true)

    try {
      await createAchievement(formData)
      e.target.reset()
      setPreviewSrc("")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      setServerError(error?.message || "Terjadi kesalahan saat menyimpan achievement.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-black/9 rounded-2xl p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Tambah Achievement</h2>
        <p className="text-sm text-gray-400">
          Buat target baru yang akan dicapai pengguna.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* NAMA */}
        <div>
          <label className="block text-sm mb-2">Nama Achievement</label>
          <input name="nama" className="input" />
          {errors.nama && <p className="text-red-400 text-sm">{errors.nama}</p>}
        </div>

        {/* DESKRIPSI */}
        <div>
          <label className="block text-sm mb-2">Deskripsi</label>
          <textarea name="deskripsi" rows="3" className="input" />
          {errors.deskripsi && <p className="text-red-400 text-sm">{errors.deskripsi}</p>}
        </div>

        {/* EVENT TYPE */}
        <div>
          <label className="block text-sm mb-2">Jenis Event</label>
          <input name="eventType" className="input" />
          {errors.eventType && <p className="text-red-400 text-sm">{errors.eventType}</p>}
        </div>

        {/* EVENT KEY */}
        <div>
          <label className="block text-sm mb-2">Key Event (Opsional)</label>
          <input name="eventKey" className="input" />
          {errors.eventKey && <p className="text-red-400 text-sm">{errors.eventKey}</p>}
        </div>

        {/* XP + IMAGE */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm mb-2">XP Reward</label>
            <input name="expReward" type="number" className="input" />
            {errors.expReward && (
              <p className="text-red-400 text-sm">{errors.expReward}</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-2">Gambar Achievement</label>
            <input
              ref={fileInputRef}
              name="gambar"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageChange}
              className="input"
            />
            {errors.gambar && (
              <p className="text-red-400 text-sm">{errors.gambar}</p>
            )}
            {imageError && (
              <p className="text-red-400 text-sm">{imageError}</p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              Gambar disimpan di Cloudinary; maks. 2MB.
            </p>
          </div>
        </div>

        {/* IMAGE PREVIEW */}
        {previewSrc && (
          <div className="mt-4">
            <p className="text-sm text-gray-400 mb-2">Preview:</p>
            <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-600">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewSrc}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {serverError && (
          <p className="text-red-400 text-sm">{serverError}</p>
        )}

        <button
          className="w-full rounded-xl bg-blue-500 py-2 disabled:opacity-60"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Menyimpan..." : "Simpan Achievement"}
        </button>
      </form>
    </div>
  )
}