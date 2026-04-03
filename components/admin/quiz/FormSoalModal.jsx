"use client";
import { useState, useEffect } from "react";

export default function FormSoalModal({
  isOpen,
  onClose,
  quizId,
  initialData,
  onSuccess
}) {
  const emptyForm = {
    pertanyaan: "",
    opsi: { A: "", B: "", C: "", D: "" },
    jawabanBenar: "A",
    score: 10
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  const handleSubmit = async () => {
    const method = initialData ? "PUT" : "POST";
    const submitData = initialData ? form : { ...form, quizId };

    const url = initialData
      ? `/api/admin/quiz/soal/${initialData.id}`
      : `/api/admin/quiz/soal`;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submitData),
    });

    const result = await res.json();
    const data = result.soal || result;
    onSuccess(data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-gray-900 p-6 rounded-2xl w-96 space-y-3">

        <input
          placeholder="Pertanyaan"
          value={form.pertanyaan}
          onChange={(e) => setForm({ ...form, pertanyaan: e.target.value })}
        />

        {["A","B","C","D"].map((key) => (
          <input
            key={key}
            placeholder={`Opsi ${key}`}
            value={form.opsi[key]}
            onChange={(e) =>
              setForm({
                ...form,
                opsi: { ...form.opsi, [key]: e.target.value }
              })
            }
          />
        ))}

        <select
          value={form.jawabanBenar}
          onChange={(e) =>
            setForm({ ...form, jawabanBenar: e.target.value })
          }
        >
          {["A","B","C","D"].map(opt => (
            <option key={opt}>{opt}</option>
          ))}
        </select>

        <input
          type="number"
          value={form.score}
          onChange={(e) =>
            setForm({ ...form, score: Number(e.target.value) })
          }
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit}>Save</button>
        </div>
      </div>
    </div>
  );
}