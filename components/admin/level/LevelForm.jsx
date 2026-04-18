"use client"

import { useState } from "react"
import { createLevel } from "@/actions/level"

export default function LevelForm() {
  const [errors, setErrors] = useState({})

  function validate(formData) {
    const newErrors = {}

    const nama = formData.get("nama")?.trim()
    const minExp = Number(formData.get("minExp"))
    const maxExp = Number(formData.get("maxExp"))
    const urlGambar = formData.get("urlGambar")?.trim()

    if (!nama) newErrors.nama = "Nama wajib diisi"

    if (minExp < 0) newErrors.minExp = "Min EXP tidak valid"
    if (maxExp <= minExp) newErrors.maxExp = "Max harus lebih besar dari Min"

    if (!urlGambar) {
      newErrors.urlGambar = "URL gambar wajib diisi"
    }
    return newErrors
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    const validation = validate(formData)

    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      return
    }

    setErrors({})
    await createLevel(formData)
    e.target.reset()
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Tambah Level</h2>
        <p className="text-sm text-gray-400">Tambahkan level baru dengan rentang EXP yang jelas.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nama" className="block text-sm font-medium text-gray-300 mb-2">
            Nama Level
          </label>
          <input
            id="nama"
            name="nama"
            placeholder="Nama Level"
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
          />
          {errors.nama && <p className="text-red-400 mt-2 text-sm">{errors.nama}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="minExp" className="block text-sm font-medium text-gray-300 mb-2">
              Min EXP
            </label>
            <input
              id="minExp"
              name="minExp"
              type="number"
              placeholder="Min EXP"
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
            />
            {errors.minExp && <p className="text-red-400 mt-2 text-sm">{errors.minExp}</p>}
          </div>

          <div>
            <label htmlFor="maxExp" className="block text-sm font-medium text-gray-300 mb-2">
              Max EXP
            </label>
            <input
              id="maxExp"
              name="maxExp"
              type="number"
              placeholder="Max EXP"
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
            />
            {errors.maxExp && <p className="text-red-400 mt-2 text-sm">{errors.maxExp}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="urlGambar" className="block text-sm font-medium text-gray-300 mb-2">
            URL Gambar
          </label>
          <input
            id="urlGambar"
            name="urlGambar"
            placeholder="URL Gambar"
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
          />
          {errors.urlGambar && <p className="text-red-400 mt-2 text-sm">{errors.urlGambar}</p>}
        </div>

        <button className="w-full rounded-xl bg-blue-500 px-4 py-3 text-white font-semibold hover:bg-blue-600 transition-colors">
          Simpan Level
        </button>
      </form>
    </div>
  )
}