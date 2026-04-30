"use client";
import { useEffect, useState } from "react";
import FormMateriModal from "./FormMateriModal";

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white/5 rounded-lg p-4 animate-pulse">
          <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-white/10 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}

function TableMateriDesktop({ data, loading, error, onEdit, onManageSteps, onDelete }) {
  return (
    <div className="hidden lg:block overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10">
            <th className="px-4 py-3 text-gray-400 font-semibold">No</th>
            <th className="px-4 py-3 text-gray-400 font-semibold">Genre</th>
            <th className="px-4 py-3 text-gray-400 font-semibold">Judul</th>
            <th className="px-4 py-3 text-gray-400 font-semibold">Deskripsi</th>
            <th className="px-4 py-3 text-gray-400 font-semibold text-center">Steps</th>
            <th className="px-4 py-3 text-gray-400 font-semibold">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="px-4 py-4">
                <LoadingSkeleton />
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan="6" className="px-4 py-4 text-red-400">
                ❌ Error: {error}
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-4 py-8 text-center text-gray-400">
                <div className="text-4xl mb-2">📚</div>
                Tidak ada data materi
              </td>
            </tr>
          ) : (
            data.map((item, i) => (
              <tr key={item.id || `item-${i}`} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 text-gray-300">{i + 1}</td>
                <td className="px-4 py-3">
                  <span className="bg-blue-600/30 text-blue-200 px-2 py-1 rounded-full text-xs font-medium">
                    {item.genre || "-"}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-white">{item.judul}</td>
                <td className="px-4 py-3 text-gray-400 max-w-xs truncate">{item.deskripsi || "-"}</td>
                <td className="px-4 py-3 text-center">
                  <span className="bg-green-600/30 text-green-200 px-2 py-1 rounded-full text-xs font-medium">
                    {item.totalStep || 0}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => onEdit(item)}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                      title="Edit"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => onManageSteps && onManageSteps(item.id)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                      title="Manage Steps"
                    >
                      📝 Steps
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                      title="Delete"
                    >
                      🗑️ Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function TableMateriCard({ data, loading, error, onEdit, onManageSteps, onDelete }) {
  return (
    <div className="lg:hidden grid gap-4 sm:grid-cols-2">
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <div className="col-span-full text-red-400 p-4 bg-red-500/10 rounded-lg">
          ❌ Error: {error}
        </div>
      ) : data.length === 0 ? (
        <div className="col-span-full text-center text-gray-400 p-8">
          <div className="text-4xl mb-2">📚</div>
          Tidak ada data materi
        </div>
      ) : (
        data.map((item, i) => (
          <div
            key={item.id || `item-${i}`}
            className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all"
          >
            <div className="space-y-3">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-white line-clamp-2">{item.judul}</h3>
                  <span className="text-sm bg-blue-600/30 text-blue-200 px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
                    {item.genre || "-"}
                  </span>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2">{item.deskripsi || "Tanpa deskripsi"}</p>
              </div>

              <div className="flex justify-between items-center text-xs text-gray-400 bg-white/5 rounded px-3 py-2">
                <span>Steps: <span className="text-green-400 font-bold">{item.totalStep || 0}</span></span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(item)}
                  className="flex-1 px-2 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                  title="Edit"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => onManageSteps && onManageSteps(item.id)}
                  className="flex-1 px-2 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                  title="Steps"
                >
                  📝 Steps
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="px-2 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default function TableMateri({ initialData = [], onManageSteps, listVersion = 0 }) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMateri, setSelectedMateri] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchMateri = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/materi");
        if (!res.ok) throw new Error("Gagal mengambil data materi");
        const result = await res.json();
        if (!cancelled) {
          setData(result.materis || result.data || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchMateri();
    return () => {
      cancelled = true;
    };
  }, [listVersion]);

  const handleAdd = () => {
    setSelectedMateri(null);
    setIsOpen(true);
  };

  const handleEdit = (materi) => {
    setSelectedMateri(materi);
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus materi ini? Semua step dan konten akan dihapus.")) return;

    try {
      const res = await fetch(`/api/admin/materi/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        let msg = "Gagal menghapus materi";
        try {
          const body = await res.json();
          if (body?.error) msg = body.error;
        } catch {
          /* ignore */
        }
        alert(msg);
        return;
      }

      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert("Terjadi kesalahan saat menghapus materi");
    }
  };

  const filteredData = data.filter(item =>
    item.judul?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.genre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">📚 Materi Pembelajaran</h2>
          <p className="text-sm text-gray-400 mt-1">{filteredData.length} materi ditemukan</p>
        </div>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 sm:whitespace-nowrap"
        >
          ➕ Tambah Materi
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="🔍 Cari materi berdasarkan judul atau genre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Desktop Table */}
      <TableMateriDesktop
        data={filteredData}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onManageSteps={onManageSteps}
        onDelete={handleDelete}
      />

      {/* Mobile Card View */}
      <TableMateriCard
        data={filteredData}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onManageSteps={onManageSteps}
        onDelete={handleDelete}
      />

      {/* Modal */}
      <FormMateriModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialData={selectedMateri}
        onSuccess={(newData) => {
          if (selectedMateri) {
            setData((prev) =>
              prev.map((item) =>
                item.id === newData.id
                  ? {
                      ...item,
                      ...newData,
                      totalStep:
                        newData.totalStep !== undefined
                          ? newData.totalStep
                          : item.totalStep,
                      tahap:
                        newData.tahap !== undefined ? newData.tahap : item.tahap,
                    }
                  : item
              )
            );
          } else {
            setData((prev) => [
              {
                ...newData,
                totalStep: newData.totalStep ?? 0,
                tahap: newData.tahap ?? 1,
                tipe: newData.tipe ?? newData.genre,
              },
              ...prev,
            ]);
          }

          setSelectedMateri(null);
        }}
      />
    </div>
  );
}
