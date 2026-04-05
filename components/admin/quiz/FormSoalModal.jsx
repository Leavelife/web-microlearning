"use client";
import { useState } from "react";

function getEmptyForm() {
  return {
    pertanyaan: "",
    opsi: { A: "", B: "", C: "", D: "" },
    jawabanBenar: "A",
    score: 10,
  };
}

function mapSoalToForm(data) {
  let opsi = data?.opsi;
  if (typeof opsi === "string") {
    try {
      opsi = JSON.parse(opsi);
    } catch {
      opsi = {};
    }
  }
  if (!opsi || typeof opsi !== "object") opsi = {};
  return {
    pertanyaan: data?.pertanyaan ?? "",
    opsi: {
      A: opsi.A ?? "",
      B: opsi.B ?? "",
      C: opsi.C ?? "",
      D: opsi.D ?? "",
    },
    jawabanBenar: data?.jawabanBenar ?? "A",
    score: Number(data?.score ?? 10),
  };
}

export default function FormSoalModal({
  isOpen,
  onClose,
  quizId,
  initialData,
  onSuccess
}) {
  // State awal hanya dipakai saat instance baru (parent mengatur key saat buka modal).
  const [form, setForm] = useState(() =>
    initialData ? mapSoalToForm(initialData) : getEmptyForm()
  );

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