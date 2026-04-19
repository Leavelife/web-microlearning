"use client";
import { useState, useEffect } from "react";

const emptyForm = {
  judul: "",
  contents: [
    { tipe: "text", konten: "", urutan: 1 },
  ],
};

export default function FormStepModal({
  isOpen,
  onClose,
  initialData,
  onSuccess,
  materiId,
}) {

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        judul: initialData.judul || "",
        contents:
          initialData.contents?.length > 0
            ? initialData.contents.map((content, index) => ({
                tipe: content.tipe || "text",
                konten: content.konten || "",
                urutan: content.urutan ?? index + 1,
              }))
            : [{ tipe: "text", konten: "", urutan: 1 }],
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  const updateContent = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      contents: prev.contents.map((content, i) =>
        i === index ? { ...content, [field]: value } : content
      ),
    }));
  };

  const addContent = () => {
    setForm((prev) => ({
      ...prev,
      contents: [
        ...prev.contents,
        {
          tipe: "text",
          konten: "",
          urutan: prev.contents.length + 1,
        },
      ],
    }));
  };

  const removeContent = (index) => {
    setForm((prev) => {
      const nextContents = prev.contents.filter((_, i) => i !== index);
      return {
        ...prev,
        contents: nextContents.map((content, idx) => ({
          ...content,
          urutan: idx + 1,
        })),
      };
    });
  };

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

        <div className="space-y-4">
          {form.contents.map((content, index) => (
            <div key={index} className="bg-white/5 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <p className="font-medium">Konten {index + 1}</p>
                {form.contents.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeContent(index)}
                    className="text-red-400 hover:text-red-500"
                  >
                    Hapus
                  </button>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-[140px_1fr]">
                <div>
                  <label className="block text-sm font-medium p-2 text-white">Tipe</label>
                  <select
                    value={content.tipe}
                    onChange={(e) => updateContent(index, "tipe", e.target.value)}
                    className="w-full p-2 bg-gray-900 text-white rounded"
                  >
                    <option value="text">Text</option>
                    <option value="video">Video</option>
                    <option value="image">Image</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium p-2 text-white">Isi Konten</label>
                  <textarea
                    value={content.konten}
                    onChange={(e) => updateContent(index, "konten", e.target.value)}
                    placeholder="Masukkan isi konten atau URL"
                    className="w-full p-2 bg-white/10 rounded h-24"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addContent}
          className="px-4 py-2 bg-green-500 rounded hover:bg-green-600"
        >
          Tambah Konten
        </button>

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