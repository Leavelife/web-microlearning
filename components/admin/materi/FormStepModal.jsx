"use client";
import { useState, useEffect } from "react";

export default function FormStepModal({
  isOpen,
  onClose,
  initialData,
  onSuccess,
  materiId,
}) {
  const emptyForm = {
    judul: "",
    tipe: "text",
    konten: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        judul: initialData.judul || "",
        tipe: initialData.tipe || "text",
        konten: initialData.konten || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const method = initialData ? "PUT" : "POST";
      const url = initialData
        ? `/api/admin/materi/${materiId}/step/${initialData.id}`
        : `/api/admin/materi/${materiId}/step`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Gagal menyimpan step");
      }

      const result = await res.json();
      const step = result.step || result;

      onSuccess(step);
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
          {initialData ? "Edit Step" : "Tambah Step"}
        </h2>

        {/* Judul Step */}
        <div>
          <label htmlFor="judul" className="block text-sm font-medium p-2 text-white">Judul</label>
          <input
          type="text"
          placeholder="Judul Step"
          value={form.judul}
          onChange={(e) => setForm({ ...form, judul: e.target.value })}
          className="w-full p-2 bg-white/10 rounded"
          />
        </div>

        {/* Tipe */}
        <div>
          <label htmlFor="tipe" className="block text-sm font-medium p-2 text-white">Tipe</label>
          <select
            value={form.tipe}
            onChange={(e) => setForm({ ...form, tipe: e.target.value })}
            className="w-full p-2 bg-white/10 rounded"
            >
            <option className="text-white bg-gray-900" value="text">Text</option>
            <option className="text-white bg-gray-900" value="video">Video</option>
            <option className="text-white bg-gray-900" value="image">Image</option>
          </select>
        </div>

        {/* Konten */}
        <div>
          <label htmlFor="konten" className="block text-sm font-medium p-2 text-white">Isi Konten</label>
          <textarea
            placeholder="Konten"
            value={form.konten}
            onChange={(e) => setForm({ ...form, konten: e.target.value })}
            className="w-full p-2 bg-white/10 rounded h-32"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-3 py-1 bg-gray-500 rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-3 py-1 bg-blue-500 rounded disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}