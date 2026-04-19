"use client";
import { useCallback, useEffect, useState } from "react";
import FormStepModal from "./FormStepModal";

export default function TableStep({ materiId, onClose }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStep, setSelectedStep] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSteps = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/materi/${materiId}/step`);
      if (!res.ok) throw new Error("Failed to fetch steps");
      const result = await res.json();
      setData(result.steps || []);
    } catch (err) {
      setError(err.message);
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
    if (!confirm("Yakin hapus step?")) return;

    try {
      const res = await fetch(`/api/admin/materi/${materiId}/step/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setData(prev => prev.filter(item => item.id !== id));
      } else {
        alert("Gagal menghapus step");
      }
    } catch (error) {
      alert("Terjadi kesalahan saat menghapus step");
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
    <div className="bg-white/5 rounded-2xl p-4">
      <div className="flex justify-between mb-4">
        <h2 className="font-bold">Steps for Materi</h2>
        <div className="space-x-2">
          <button onClick={onClose} className="bg-gray-500 px-3 py-1 rounded hover:bg-gray-600 transition-colors">
            Back
          </button>
          <button onClick={handleAdd} className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 transition-colors">
            Add Step
          </button>
        </div>
      </div>

      {error && (
        <p className="text-red-400 mb-4">
          Error: {error}
        </p>
      )}

      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-400">
            <th>No</th>
            <th>Urutan</th>
            <th>Judul</th>
            <th>Total Konten</th>
            <th>Jenis Konten</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr key="loading-row">
              <td colSpan="5">Loading...</td>
            </tr>
          ) : data.length === 0 ? (
            <tr key="empty-row">
              <td colSpan="5">Tidak ada data</td>
            </tr>
          ) : (
            data.map((item, i) => (
              <tr key={item.id || `step-${i}`} className="border-t border-white/10">
                <td>{i + 1}</td>
                <td>{item.urutan}</td>
                <td>{item.judul}</td>
                <td>{item.contents?.length ?? 0}</td>
                <td>{item.contents?.map((content) => content.tipe).join(", ") || "-"}</td>
                <td className="space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-green-500 px-2 py-1 rounded hover:bg-green-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 px-2 py-1 rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

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