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
    console.log('handleSubmit called, initialData:', initialData);
    console.log('Form data:', form);

    const method = initialData ? "PUT" : "POST";
    const url = initialData
      ? `/api/admin/materi/${initialData.id}`
      : `/api/admin/materi`;

    console.log('Request:', method, url);

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

    console.log('Response status:', res.status);

    const data = await res.json();
    console.log('Response data:', data);

    if (!res.ok) {
      alert(data.error || "Gagal menyimpan materi");
      return;
    }

    const newData = data.materi ?? data.lesson ?? data.data ?? data;
    if (!newData?.id) {
      alert("Respons server tidak valid");
      return;
    }

    onSuccess(newData);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-gray-900 p-6 rounded-2xl w-96 space-y-4">
        <h2 className="text-lg font-bold">
          {initialData ? "Edit Materi" : "Tambah Materi"}
        </h2>
        <div>
          <label htmlFor="judul" className="block text-sm font-medium p-2 text-white">Judul</label>
          <input name="judul" placeholder="Judul" onChange={handleChange} value={form.judul} className="w-full p-2 bg-white/10 rounded" />
        </div>
        <div>
          <label htmlFor="deskripsi" className="block text-sm font-medium p-2 text-white">Deskripsi</label>
          <input name="deskripsi" placeholder="Deskripsi" onChange={handleChange} value={form.deskripsi} className="w-full p-2 bg-white/10 rounded" />
        </div>
        <div>
          <label htmlFor="genre" className="block text-sm font-medium p-2 text-white">Genre</label>
          <input name="genre" placeholder="Genre" onChange={handleChange} value={form.genre} className="w-full p-2 bg-white/10 rounded" />
        </div>
        <div>
          <label htmlFor="thumbnail" className="block text-sm font-medium p-2 text-white">Thumbnail</label>
          <input
            ref={fileInputRef}
            name="thumbnail"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleChange}
            className="w-full p-2 bg-white/10 rounded text-white"
          />
          {imageError && (
            <p className="text-red-400 text-sm mt-1">{imageError}</p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            Gambar disimpan di Cloudinary; maks. 2MB.
          </p>
        </div>

        {/* THUMBNAIL PREVIEW */}
        {thumbnailPreview && (
          <div className="mt-4">
            <p className="text-sm text-gray-400 mb-2">Preview:</p>
            <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-600">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbnailPreview}
                alt="Thumbnail Preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <button onClick={handleClose} className="px-3 py-1 bg-gray-500 rounded">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-3 py-1 bg-blue-500 rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}