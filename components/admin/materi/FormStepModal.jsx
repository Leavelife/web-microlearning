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
  const [imagePreviews, setImagePreviews] = useState({});
  const [error, setError] = useState("");

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
      // Set image previews for existing images
      const previews = {};
      initialData.contents?.forEach((content, index) => {
        if (content.tipe === "image" && content.konten) {
          previews[index] = content.konten;
        }
      });
      setImagePreviews(previews);
    } else {
      setForm(emptyForm);
      setImagePreviews({});
    }
    setError("");
  }, [initialData, isOpen]);

  const updateContent = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      contents: prev.contents.map((content, i) =>
        i === index ? { ...content, [field]: value } : content
      ),
    }));
  };

  const handleImageChange = (index, file) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreviews(prev => ({ ...prev, [index]: url }));
      updateContent(index, "konten", file); // Store file object
    } else {
      setImagePreviews(prev => {
        const newPreviews = { ...prev };
        delete newPreviews[index];
        return newPreviews;
      });
      updateContent(index, "konten", "");
    }
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
    if (form.contents.length <= 1) {
      setError("Minimal harus ada 1 konten");
      return;
    }
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

  const moveContent = (index, direction) => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === form.contents.length - 1)) {
      return;
    }

    setForm((prev) => {
      const newContents = [...prev.contents];
      const swapIndex = direction === 'up' ? index - 1 : index + 1;
      [newContents[index], newContents[swapIndex]] = [newContents[swapIndex], newContents[index]];
      
      return {
        ...prev,
        contents: newContents.map((content, idx) => ({
          ...content,
          urutan: idx + 1,
        })),
      };
    });
  };

  const handleSubmit = async () => {
    try {
      if (!form.judul.trim()) {
        setError("Judul step tidak boleh kosong");
        return;
      }

      if (form.contents.some(c => !c.konten)) {
        setError("Semua konten harus diisi");
        return;
      }

      setLoading(true);

      const method = initialData ? "PUT" : "POST";
      const url = initialData
        ? `/api/admin/materi/${materiId}/step/${initialData.id}`
        : `/api/admin/materi/${materiId}/step`;

      // Check if any content has image files
      const hasImages = form.contents.some(content => content.tipe === "image" && content.konten instanceof File);

      if (hasImages) {
        // Use FormData for file uploads
        const formData = new FormData();
        formData.append('judul', form.judul);
        
        form.contents.forEach((content, index) => {
          formData.append(`contents[${index}][tipe]`, content.tipe);
          formData.append(`contents[${index}][urutan]`, content.urutan.toString());
          if (content.tipe === "image" && content.konten instanceof File) {
            formData.append(`contents[${index}][file]`, content.konten);
          } else {
            formData.append(`contents[${index}][konten]`, content.konten);
          }
        });

        const res = await fetch(url, {
          method,
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Gagal menyimpan step");
        }

        const result = await res.json();
        const step = result.step || result;

        onSuccess(step);
        onClose();
      } else {
        // Use JSON for text-only content
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Gagal menyimpan step");
        }

        const result = await res.json();
        const step = result.step || result;

        onSuccess(step);
        onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/10">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900/95 border-b border-white/10 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            {initialData ? "✏️ Edit Step" : "➕ Tambah Step"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Judul Step */}
          <div className="space-y-2">
            <label htmlFor="judul" className="block text-sm font-semibold text-gray-200">
              Judul Step <span className="text-red-400">*</span>
            </label>
            <input
              id="judul"
              type="text"
              placeholder="Contoh: Pengenalan Konsep Dasar"
              value={form.judul}
              onChange={(e) => setForm({ ...form, judul: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Konten List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Konten Pembelajaran</h3>
              <span className="text-sm text-gray-400 bg-white/10 px-3 py-1 rounded-full">{form.contents.length} item</span>
            </div>

            {form.contents.map((content, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4 hover:border-white/20 transition-colors">
                {/* Content Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-blue-400 bg-white/10 w-8 h-8 rounded-full flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-300">
                      Konten {index + 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {form.contents.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => moveContent(index, 'up')}
                          disabled={index === 0}
                          className="px-2 py-1 text-sm bg-white/10 hover:bg-white/20 text-gray-300 rounded disabled:opacity-30 transition-colors"
                          title="Naik"
                        >
                          ⬆️
                        </button>
                        <button
                          type="button"
                          onClick={() => moveContent(index, 'down')}
                          disabled={index === form.contents.length - 1}
                          className="px-2 py-1 text-sm bg-white/10 hover:bg-white/20 text-gray-300 rounded disabled:opacity-30 transition-colors"
                          title="Turun"
                        >
                          ⬇️
                        </button>
                      </>
                    )}
                    {form.contents.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeContent(index)}
                        className="px-2 py-1 text-sm bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded transition-colors"
                        title="Hapus"
                      >
                        🗑️ Hapus
                      </button>
                    )}
                  </div>
                </div>

                {/* Content Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tipe Konten</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['text', 'video', 'image'].map((tipe) => (
                      <button
                        key={tipe}
                        type="button"
                        onClick={() => updateContent(index, "tipe", tipe)}
                        className={`px-3 py-2 rounded-lg font-medium transition-all ${
                          content.tipe === tipe
                            ? 'bg-blue-600 text-white border-blue-400'
                            : 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20'
                        } border`}
                      >
                        {tipe === 'text' && '📝 Text'}
                        {tipe === 'video' && '🎥 Video'}
                        {tipe === 'image' && '🖼️ Image'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Isi Konten {content.tipe === 'image' ? '(File)' : ''}
                  </label>
                  {content.tipe === "image" ? (
                    <div className="space-y-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(index, e.target.files[0])}
                        className="w-full px-4 py-3 bg-white/10 border border-dashed border-white/30 rounded-lg text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 hover:border-blue-500/50 transition-all cursor-pointer"
                      />
                      {imagePreviews[index] && (
                        <div className="relative bg-black/30 rounded-lg overflow-hidden border border-white/10">
                          <img
                            src={imagePreviews[index]}
                            alt={`Preview ${index}`}
                            className="w-full h-48 object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleImageChange(index, null)}
                            className="absolute top-2 right-2 px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm transition-colors"
                          >
                            ✕ Hapus
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <textarea
                      value={content.konten}
                      onChange={(e) => updateContent(index, "konten", e.target.value)}
                      placeholder={content.tipe === "video" ? "Masukkan URL video (YouTube, Vimeo, dll)" : "Masukkan isi konten di sini..."}
                      rows={4}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add Content Button */}
          <button
            type="button"
            onClick={addContent}
            className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            ➕ Tambah Konten
          </button>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-sm text-red-300">⚠️ {error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-900/95 border-t border-white/10 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span>
                Menyimpan...
              </>
            ) : (
              <>
                💾 Simpan
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}