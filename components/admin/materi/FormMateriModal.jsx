/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useRef, useEffect } from "react";

export default function FormMateriModal({ isOpen, onClose, initialData, onSuccess }) {
  const defaultForm = {
    judul: "",
    deskripsi: "",
    genre: "",
    thumbnail: null,
  };

  const prevInitialDataRef = useRef(null);
  const [form, setForm] = useState(defaultForm);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [imageError, setImageError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Reset form when initialData changes or modal opens
  useEffect(() => {
    if (isOpen && prevInitialDataRef.current !== initialData?.id) {
      setForm(initialData || defaultForm);
      setThumbnailPreview(initialData?.thumbnail || "");
      prevInitialDataRef.current = initialData?.id;
    }
  }, [isOpen, initialData]);

  const handleClose = () => {
    setForm(defaultForm);
    setThumbnailPreview("");
    setImageError("");
    prevInitialDataRef.current = null;
    onClose();
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file' && files?.[0]) {
      const file = files[0];
      setImageError("");

      if (!file.type.startsWith("image/")) {
        setImageError("File harus berupa gambar");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setImageError("Ukuran gambar maksimal 2MB");
        return;
      }

      const url = URL.createObjectURL(file);
      setThumbnailPreview(url);
      setForm({
        ...form,
        [name]: file,
      });
    } else {
      setForm({
        ...form,
        [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
      });
    }
  };

  const handleSubmit = async () => {
    try {
      if (!form.judul.trim()) {
        setImageError("Judul tidak boleh kosong");
        return;
      }

      setLoading(true);
      const method = initialData ? "PUT" : "POST";
      const url = initialData
        ? `/api/admin/materi/${initialData.id}`
        : `/api/admin/materi`;

      const formData = new FormData();
      formData.append('judul', form.judul);
      formData.append('deskripsi', form.deskripsi);
      formData.append('genre', form.genre);
      if (form.thumbnail instanceof File) {
        formData.append('thumbnail', form.thumbnail);
      }

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal menyimpan materi");
      }

      const newData = data.materi ?? data.lesson ?? data.data ?? data;
      if (!newData?.id) {
        throw new Error("Respons server tidak valid");
      }

      onSuccess(newData);
      handleClose();
    } catch (err) {
      setImageError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto border border-white/10">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900/95 border-b border-white/10 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            {initialData ? "✏️ Edit Materi" : "➕ Tambah Materi"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Judul */}
          <div className="space-y-2">
            <label htmlFor="judul" className="block text-sm font-semibold text-gray-200">
              Judul Materi <span className="text-red-400">*</span>
            </label>
            <input
              id="judul"
              name="judul"
              placeholder="Contoh: Pengenalan Jaringan Komputer"
              onChange={handleChange}
              value={form.judul}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Deskripsi */}
          <div className="space-y-2">
            <label htmlFor="deskripsi" className="block text-sm font-semibold text-gray-200">
              Deskripsi
            </label>
            <textarea
              id="deskripsi"
              name="deskripsi"
              placeholder="Jelaskan apa yang akan dipelajari dalam materi ini..."
              onChange={handleChange}
              value={form.deskripsi}
              rows={3}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Genre */}
          <div className="space-y-2">
            <label htmlFor="genre" className="block text-sm font-semibold text-gray-200">
              Genre/Kategori
            </label>
            <input
              id="genre"
              name="genre"
              placeholder="Contoh: Networking, Programming, dll"
              onChange={handleChange}
              value={form.genre}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Thumbnail */}
          <div className="space-y-3 border-t border-white/10 pt-4">
            <label htmlFor="thumbnail" className="block text-sm font-semibold text-gray-200">
              Thumbnail
            </label>
            <div className="relative">
              <input
                id="thumbnail"
                ref={fileInputRef}
                name="thumbnail"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                📤 Pilih Gambar
              </button>
            </div>
            <p className="text-xs text-gray-400">
              Format: JPG, PNG, WebP, GIF • Ukuran maks: 2MB
            </p>
          </div>

          {/* Thumbnail Preview */}
          {thumbnailPreview && (
            <div className="space-y-2 bg-white/5 p-4 rounded-lg border border-white/10">
              <p className="text-sm font-medium text-gray-300">Preview Thumbnail:</p>
              <div className="relative w-full h-40 rounded-lg overflow-hidden bg-black/30 border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {imageError && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-sm text-red-300">⚠️ {imageError}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-900/95 border-t border-white/10 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={handleClose}
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