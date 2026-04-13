"use client"

import { deleteLevel } from "@/actions/level"

export default function LevelTable({ data }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 shadow-sm overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Daftar Level</h2>
        <span className="text-sm text-gray-400">Total: {data.length}</span>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-gray-400">
            <th className="pb-3">No</th>
            <th className="pb-3">Nama</th>
            <th className="pb-3">Range EXP</th>
            <th className="pb-3">Gambar</th>
            <th className="pb-3">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="5" className="py-6 text-center text-gray-400">
                Belum ada level.
              </td>
            </tr>
          ) : (
            data.map((lvl, index) => (
              <tr key={lvl.id} className="border-t border-white/10">
                <td className="py-3 pr-4">{index + 1}</td>
                <td className="py-3 pr-4">{lvl.nama}</td>
                <td className="py-3 pr-4">{lvl.minExp} - {lvl.maxExp}</td>
                <td className="py-3 pr-4 max-w-xs truncate">{lvl.urlGambar}</td>
                <td className="py-3 pr-4">
                  <button
                    onClick={() => deleteLevel(lvl.id)}
                    className="rounded-xl bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-600 transition-colors"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}