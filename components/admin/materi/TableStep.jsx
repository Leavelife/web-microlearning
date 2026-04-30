"use client";
import { useCallback, useEffect, useState } from "react";
import FormStepModal from "./FormStepModal";

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

function TableStepDesktop({ data, loading, error, onEdit, onDelete }) {
  return (
    <div className="hidden lg:block overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10">
            <th className="px-4 py-3 text-gray-400 font-semibold">No</th>
            <th className="px-4 py-3 text-gray-400 font-semibold">Urutan</th>
            <th className="px-4 py-3 text-gray-400 font-semibold">Judul</th>
            <th className="px-4 py-3 text-gray-400 font-semibold text-center">Total Konten</th>
            <th className="px-4 py-3 text-gray-400 font-semibold">Jenis Konten</th>
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
              <td colSpan="6" className="px-4 py-4">
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 space-y-2">
                  <p className="text-red-300 font-medium">❌ Error: {error}</p>
                  <p className="text-xs text-red-200">
                    💡 Tips: Pastikan ID materi valid dan Anda memiliki akses admin. Buka browser console (F12) untuk melihat detail error.
                  </p>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-4 py-8 text-center text-gray-400">
                <div className="text-4xl mb-2">📖</div>
                Tidak ada step dalam materi ini
              </td>
            </tr>
          ) : (
            data.map((item, i) => (
              <tr key={item.id || `step-${i}`} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 text-gray-300">{i + 1}</td>
                <td className="px-4 py-3">
                  <span className="bg-purple-600/30 text-purple-200 px-2 py-1 rounded-full text-xs font-medium">
                    {item.urutan || i + 1}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-white">{item.judul}</td>
                <td className="px-4 py-3 text-center">
                  <span className="bg-blue-600/30 text-blue-200 px-2 py-1 rounded-full text-xs font-medium">
                    {item.contents?.length ?? 0}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-400">
                  <div className="flex gap-1 flex-wrap">
                    {item.contents?.map((content, idx) => (
                      <span key={idx} className="bg-white/10 px-2 py-0.5 rounded text-xs">
                        {content.tipe}
                      </span>
                    )) || <span>-</span>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                      title="Edit"
                    >
                      ✏️ Edit
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

function TableStepCard({ data, loading, error, onEdit, onDelete }) {
  return (
    <div className="lg:hidden space-y-4">
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 space-y-2">
          <p className="text-red-300 font-medium">❌ Error: {error}</p>
          <p className="text-xs text-red-200">
            💡 Tips: Pastikan ID materi valid dan Anda memiliki akses admin. Buka browser console (F12) untuk melihat detail error.
          </p>
        </div>
      ) : data.length === 0 ? (
        <div className="col-span-full text-center text-gray-400 p-8">
          <div className="text-4xl mb-2">📖</div>
          Tidak ada step dalam materi ini
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {data.map((item, i) => (
            <div
              key={item.id || `step-${i}`}
              className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all"
            >
              <div className="space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-white line-clamp-2">{item.judul}</h3>
                    <span className="text-sm bg-purple-600/30 text-purple-200 px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
                      Step {item.urutan || i + 1}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-gray-400 bg-white/5 rounded px-3 py-2">
                    <strong>Konten:</strong> {item.contents?.length ?? 0} item
                  </div>
                  {item.contents?.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {item.contents.map((content, idx) => (
                        <span key={idx} className="bg-blue-600/30 text-blue-200 px-2 py-0.5 rounded text-xs font-medium">
                          {content.tipe === 'text' && '📝 Text'}
                          {content.tipe === 'video' && '🎥 Video'}
                          {content.tipe === 'image' && '🖼️ Image'}
                        </span>
                      ))}
                    </div>
                  )}
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
                    onClick={() => onDelete(item.id)}
                    className="px-2 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TableStep({ materiId, onClose }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStep, setSelectedStep] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [materiTitle, setMateriTitle] = useState("");

  const fetchSteps = useCallback(async () => {
    try {
      setLoading(true);
      
      // Validasi materiId
      if (!materiId) {
        throw new Error("ID materi tidak ditemukan");
      }

      const url = `/api/admin/materi/${materiId}/step`;
      console.log(`🔍 Fetching steps from: ${url}`);
      
      const res = await fetch(url);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMsg = errorData.error || `HTTP ${res.status}`;
        console.error(`❌ API Error (${res.status}):`, errorMsg);
        throw new Error(`Gagal mengambil data step: ${errorMsg}`);
      }
      
      const result = await res.json();
      console.log(`✅ Berhasil fetch ${result.steps?.length || 0} steps`);
      setData(result.steps || []);
      
      // Also fetch materi title for breadcrumb
      try {
        const materiRes = await fetch(`/api/admin/materi`);
        if (materiRes.ok) {
          const materiData = await materiRes.json();
          const materi = (materiData.materis || []).find(m => m.id === materiId);
          if (materi) {
            setMateriTitle(materi.judul);
            console.log(`📖 Materi title: ${materi.judul}`);
          }
        }
      } catch (err) {
        console.warn("Could not fetch materi title:", err);
      }
      
      setError(null);
    } catch (err) {
      console.error("❌ Fetch steps error:", err);
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [materiId]);

  useEffect(() => {
    fetchSteps();
  }, [fetchSteps]);

  const handleAdd = () => {
    setSelectedStep(null);
    setIsModalOpen(true);
  };

  const handleEdit = (step) => {
    setSelectedStep(step);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus step ini? Semua konten akan dihapus.")) return;

    try {
      const url = `/api/admin/materi/${materiId}/step/${id}`;
      const res = await fetch(url, {
        method: "DELETE",
      });

      if (res.ok) {
        setData(prev => prev.filter(item => item.id !== id));
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }
    } catch (error) {
      console.error("Delete step error:", error);
      alert(`❌ ${error.message}`);
    }
  };

  const handleSuccess = (step) => {
    if (selectedStep) {
      // Update
      setData(prev => prev.map(item => item.id === step.id ? step : item));
    } else {
      // Add
      setData(prev => [...prev, step]);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            📝 Kelola Step
          </h2>
          {materiTitle && (
            <p className="text-sm text-gray-400 mt-1">Materi: <span className="text-blue-300">{materiTitle}</span></p>
          )}
          <p className="text-sm text-gray-400 mt-1">{data.length} step tersedia</p>
          {materiId && (
            <p className="text-xs text-gray-500 mt-1 font-mono bg-white/5 px-2 py-1 rounded w-fit">ID: {materiId}</p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            ← Kembali
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 sm:whitespace-nowrap"
          >
            ➕ Tambah Step
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <TableStepDesktop
        data={data}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Mobile Card View */}
      <TableStepCard
        data={data}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modal */}
      <FormStepModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={selectedStep}
        onSuccess={handleSuccess}
        materiId={materiId}
      />
    </div>
  );
}