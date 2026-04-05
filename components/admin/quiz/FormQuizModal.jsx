"use client";
import { useState, useEffect } from "react";

export default function FormQuizModal({
  isOpen,
  onClose,
  initialData,
  onSuccess,
  materiList = [] // buat dropdown nanti
}) {
  const emptyForm = {
    materiId: "",
    materiStepId: "",
    judul: "",
    deskripsi: "",
    durasi: 30,
    passingScore: 70,
  };

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    if (initialData) {
      setForm({
        materiId: initialData.materiStep?.materi?.id || "",
        materiStepId: initialData.materiStepId || "",
        judul: initialData.judul || "",
        deskripsi: initialData.deskripsi || "",
        durasi: initialData.durasi || 30,
        passingScore: initialData.passingScore || 70,
      });
      // If editing, load steps for the materi
      if (initialData.materiStep?.materi?.id) {
        fetchSteps(initialData.materiStep.materi.id);
      }
    } else {
      setForm(emptyForm);
      setSteps([]);
    }
  }, [initialData]);

  const fetchSteps = async (materiId) => {
    try {
      const res = await fetch(`/api/admin/materi/${materiId}/step`);
      if (res.ok) {
        const data = await res.json();
        setSteps(data.steps || []);
      }
    } catch (err) {
      console.error("Failed to fetch steps", err);
    }
  };

  const handleMateriChange = (materiId) => {
    setForm({ ...form, materiId, materiStepId: "" });
    setSteps([]);
    if (materiId) {
      fetchSteps(materiId);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const method = initialData ? "PUT" : "POST";
      const url = initialData
        ? `/api/admin/quiz/${initialData.id}`
        : `/api/admin/quiz`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          materiStepId: form.materiStepId,
          judul: form.judul,
          deskripsi: form.deskripsi,
          durasi: form.durasi,
          passingScore: form.passingScore,
        }),
      });

      if (!res.ok) {
        throw new Error("Gagal menyimpan quiz");
      }

      const result = await res.json();
      const quiz = result.quiz || result;

      onSuccess(quiz);
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-2xl w-96 space-y-1 text-white">

        <h2 className="text-lg font-bold">
          {initialData ? "Edit Quiz" : "Tambah Quiz"}
        </h2>

        {/* Pilih Materi */}
        <div>
          <label htmlFor="materiId" className="block text-sm font-medium p-2 text-white">Materi</label>
          <select
            value={form.materiId}
            onChange={(e) => handleMateriChange(e.target.value)}
            className="w-full p-2 bg-white/10 rounded"
          >
            <option className="text-white bg-gray-900" value="">Pilih Materi</option>
            {materiList.map((m) => (
              <option className="text-white bg-gray-900" key={m.id} value={m.id}>
                {m.judul}
              </option>
            ))}
          </select>
        </div>

        {/* Pilih Step */}
        <div>
          <label htmlFor="materiStepId" className="block text-sm font-medium p-2 text-white">Step</label>
          <select
            value={form.materiStepId}
            onChange={(e) =>
              setForm({ ...form, materiStepId: e.target.value })
            }
            className="w-full p-2 bg-white/10 rounded"
            disabled={!form.materiId}
          >
            <option className="text-white bg-gray-900" value="">Pilih Step</option>
            {steps.map((s) => (
              <option className="text-white bg-gray-900" key={s.id} value={s.id}>
                {s.urutan}. {s.judul}
              </option>
            ))}
          </select>
        </div>

        {/* Judul Quiz */}
        <div>
          <label htmlFor="judul" className="block text-sm font-medium p-2 text-white">Judul</label>
          <input
            type="text"
            placeholder="Judul Quiz"
            value={form.judul}
            onChange={(e) =>
              setForm({ ...form, judul: e.target.value })
              }
            className="w-full p-2 bg-white/10 rounded"
          />
        </div>

        {/* Deskripsi Quiz */}
        <div>
          <label htmlFor="deskripsi" className="block text-sm font-medium p-2 text-white">Deskripsi</label>
          <textarea
            placeholder="Deskripsi Quiz"
            value={form.deskripsi}
            onChange={(e) =>
              setForm({ ...form, deskripsi: e.target.value })
            }
            className="w-full p-2 bg-white/10 rounded h-20 resize-none"
          />
        </div>

        {/* Durasi (menit) */}
        <div>
          <label htmlFor="durasi" className="block text-sm font-medium p-2 text-white">Durasi (menit)</label>
          <input
            type="number"
            placeholder="Durasi (menit)"
            value={form.durasi}
            onChange={(e) =>
              setForm({ ...form, durasi: Number(e.target.value) })
            }
            className="w-full p-2 bg-white/10 rounded"
            min="1"
          />
        </div>

        {/* Passing Score */}
        <div>
          <label htmlFor="passingScore" className="block text-sm font-medium p-2 text-white">Passing Score</label>
          <input
            type="number"
            placeholder="Passing Score"
            value={form.passingScore}
            onChange={(e) =>
              setForm({ ...form, passingScore: Number(e.target.value) })
            }
            className="w-full p-2 bg-white/10 rounded"
            min="0"
            max="100"
          />
        </div>

        {/* Action */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-500 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-3 py-1 bg-blue-500 rounded"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}