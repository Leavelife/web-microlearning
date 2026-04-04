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
      <div className="bg-gray-900 p-6 rounded-2xl w-96 space-y-4 text-white">

        <h2 className="text-lg font-bold">
          {initialData ? "Edit Quiz" : "Tambah Quiz"}
        </h2>

        {/* 🔥 Pilih Materi */}
        <select
          value={form.materiId}
          onChange={(e) => handleMateriChange(e.target.value)}
          className="w-full p-2 bg-white/10 rounded"
        >
          <option value="">Pilih Materi</option>
          {materiList.map((m) => (
            <option key={m.id} value={m.id}>
              {m.judul}
            </option>
          ))}
        </select>

        {/* 🔥 Pilih Step */}
        <select
          value={form.materiStepId}
          onChange={(e) =>
            setForm({ ...form, materiStepId: e.target.value })
          }
          className="w-full p-2 bg-white/10 rounded"
          disabled={!form.materiId}
        >
          <option value="">Pilih Step</option>
          {steps.map((s) => (
            <option key={s.id} value={s.id}>
              {s.urutan}. {s.judul}
            </option>
          ))}
        </select>

        {/* 🔥 Judul Quiz */}
        <input
          type="text"
          placeholder="Judul Quiz"
          value={form.judul}
          onChange={(e) =>
            setForm({ ...form, judul: e.target.value })
          }
          className="w-full p-2 bg-white/10 rounded"
        />

        {/* 🔥 Deskripsi Quiz */}
        <textarea
          placeholder="Deskripsi Quiz"
          value={form.deskripsi}
          onChange={(e) =>
            setForm({ ...form, deskripsi: e.target.value })
          }
          className="w-full p-2 bg-white/10 rounded h-20 resize-none"
        />

        {/* 🔥 Durasi (menit) */}
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

        {/* 🔥 Passing Score */}
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

        {/* 🔥 Action */}
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