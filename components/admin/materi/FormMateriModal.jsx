/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useRef, useEffect } from "react";

export default function FormMateriModal({ isOpen, onClose, initialData, onSuccess }) {
  const defaultForm = {
    nomorMateri: "",
    judul: "",
    deskripsi: "",
    tipe: "",
    urlKonten: "",
    unlockType: "",
    tahap: 1,
  };

  const prevInitialDataRef = useRef(null);
  const [form, setForm] = useState(defaultForm);

  // Reset form when initialData changes or modal opens
  useEffect(() => {
    if (isOpen && prevInitialDataRef.current !== initialData?.id) {
      setForm(initialData || defaultForm);
      prevInitialDataRef.current = initialData?.id;
    }
  }, [isOpen, initialData]);

  const handleClose = () => {
    setForm(defaultForm);
    prevInitialDataRef.current = null;
    onClose();
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
    });
  };

  const handleSubmit = async () => {
    console.log('handleSubmit called, initialData:', initialData);
    console.log('Form data:', form);

    const method = initialData ? "PUT" : "POST";
    const url = initialData
      ? `/api/admin/materi/${initialData.id}`
      : `/api/admin/materi`;

    console.log('Request:', method, url);

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    console.log('Response status:', res.status);

    const data = await res.json();
    console.log('Response data:', data);

    // Extract lesson/data from response
    const newData = data.lesson || data.data || data;
    console.log('Extracted newData:', newData);

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

        <input name="nomorMateri" type="number" placeholder="Nomor Materi" onChange={handleChange} value={form.nomorMateri} className="w-full p-2 bg-white/10 rounded" />
        <input name="judul" placeholder="Judul" onChange={handleChange} value={form.judul} className="w-full p-2 bg-white/10 rounded" />
        <input name="deskripsi" placeholder="Deskripsi" onChange={handleChange} value={form.deskripsi} className="w-full p-2 bg-white/10 rounded" />
        <input name="tipe" placeholder="Tipe" onChange={handleChange} value={form.tipe} className="w-full p-2 bg-white/10 rounded" />
        <input name="urlKonten" placeholder="URL" onChange={handleChange} value={form.urlKonten} className="w-full p-2 bg-white/10 rounded" />
        <input name="tahap" type="number" placeholder="Tahap" onChange={handleChange} value={form.tahap} className="w-full p-2 bg-white/10 rounded" />
        <input name="unlockType" placeholder="Tipe Unlock" onChange={handleChange} value={form.unlockType} className="w-full p-2 bg-white/10 rounded" />

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