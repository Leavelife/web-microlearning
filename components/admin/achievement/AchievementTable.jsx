"use client"

import { deleteAchievement } from "@/actions/achievement"

export default function AchievementTable({ data }) {
  return (
    <div className="bg-black/8 rounded-2xl p-4 overflow-x-auto">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-lg font-semibold">Daftar Achievement</h2>
        <span className="text-sm text-gray-400">Total achievement: {data.length}</span>
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-400">
            <th className="pb-3">No</th>
            <th className="pb-3">Nama</th>
            <th className="pb-3">Deskripsi</th>
            <th className="pb-3">XP</th>
            <th className="pb-3">Event Type</th>
            <th className="pb-3">Event Key</th>
            <th className="pb-3">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="6" className="py-6 text-center text-gray-400">
                Belum ada achievement.
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr key={item.id} className="border-t border-white/10">
                <td className="py-3 pr-4">{index + 1}</td>
                <td className="py-3 pr-4">{item.nama}</td>
                <td className="py-3 pr-4 max-w-xs truncate">{item.deskripsi}</td>
                <td className="py-3 pr-4">{item.expReward}</td>
                <td className="py-3 pr-4">{item.eventType}</td>
                <td className="py-3 pr-4">{item.eventKey || "-"}</td>
                <td className="py-3 pr-4 space-x-2">
                  <button
                    onClick={() => deleteAchievement(item.id)}
                    className="bg-red-500 px-2 py-1 rounded hover:bg-red-600 transition-colors text-sm text-white font-semibold"
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
