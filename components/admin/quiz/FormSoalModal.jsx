"use client";
import { useState } from "react";

const OPTION_COLORS = {
  A: { badge: "bg-violet-600 text-white", card: "border-violet-500/40 bg-violet-500/10", ring: "ring-violet-500" },
  B: { badge: "bg-sky-600 text-white",    card: "border-sky-500/40 bg-sky-500/10",    ring: "ring-sky-500"    },
  C: { badge: "bg-emerald-600 text-white",card: "border-emerald-500/40 bg-emerald-500/10", ring: "ring-emerald-500" },
  D: { badge: "bg-amber-500 text-white",  card: "border-amber-500/40 bg-amber-500/10",  ring: "ring-amber-500"  },
};

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
    try { opsi = JSON.parse(opsi); } catch { opsi = {}; }
  }
  if (!opsi || typeof opsi !== "object") opsi = {};
  return {
    pertanyaan: data?.pertanyaan ?? "",
    opsi: { A: opsi.A ?? "", B: opsi.B ?? "", C: opsi.C ?? "", D: opsi.D ?? "" },
    jawabanBenar: data?.jawabanBenar ?? "A",
    score: Number(data?.score ?? 10),
  };
}

export default function FormSoalModal({ isOpen, onClose, quizId, initialData, onSuccess }) {
  const [form, setForm] = useState(() =>
    initialData ? mapSoalToForm(initialData) : getEmptyForm()
  );
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);

  const isEdit = Boolean(initialData);

  const handleSubmit = async () => {
    if (!form.pertanyaan.trim()) { setError("Pertanyaan tidak boleh kosong."); return; }
    for (const k of ["A","B","C","D"]) {
      if (!form.opsi[k].trim()) { setError(`Opsi ${k} tidak boleh kosong.`); return; }
    }

    setError(null);
    setLoading(true);
    try {
      const method     = isEdit ? "PUT" : "POST";
      const submitData = isEdit ? form : { ...form, quizId };
      const url        = isEdit
        ? `/api/admin/quiz/soal/${initialData.id}`
        : `/api/admin/quiz/soal`;

      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(submitData) });
      const result = await res.json();
      if (!res.ok) throw new Error(result?.message ?? "Gagal menyimpan soal.");
      const data = result.soal || result;
      onSuccess(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    /* ── Backdrop ── */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* ── Modal Card ── */}
      <div
        className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: "linear-gradient(145deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)",
          border: "1px solid rgba(111,39,255,0.25)",
          animation: "modalIn 0.22s cubic-bezier(.4,0,.2,1)",
        }}
      >
        {/* Glow accent */}
        <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, #6F27FF 0%, transparent 70%)" }} />

        {/* ── Header ── */}
        <div className="relative flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10">
          <div>
            <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold mb-0.5">
              {isEdit ? "Edit Soal" : "Tambah Soal"}
            </p>
            <h2 className="text-lg font-bold text-white leading-tight">Form Soal Quiz</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-150"
            aria-label="Tutup"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Body ── */}
        <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">

          {/* Error Banner */}
          {error && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
                <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {/* Pertanyaan */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
              Pertanyaan
            </label>
            <textarea
              rows={3}
              placeholder="Tulis pertanyaan di sini…"
              value={form.pertanyaan}
              onChange={(e) => setForm({ ...form, pertanyaan: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 resize-none outline-none transition-all duration-150 focus:ring-2 focus:ring-violet-500"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            />
          </div>

          {/* Opsi */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
              Pilihan Jawaban
            </label>
            <div className="space-y-2">
              {["A","B","C","D"].map((key) => {
                const colors   = OPTION_COLORS[key];
                const isAnswer = form.jawabanBenar === key;
                return (
                  <div
                    key={key}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all duration-150 ${
                      isAnswer ? `${colors.card} ring-2 ${colors.ring}` : "border-white/10 bg-white/5"
                    }`}
                  >
                    {/* Letter badge */}
                    <span className={`flex-shrink-0 w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center ${colors.badge}`}>
                      {key}
                    </span>
                    {/* Input */}
                    <input
                      type="text"
                      placeholder={`Isi opsi ${key}…`}
                      value={form.opsi[key]}
                      onChange={(e) => setForm({ ...form, opsi: { ...form.opsi, [key]: e.target.value } })}
                      className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
                    />
                    {/* Mark as answer radio */}
                    <button
                      type="button"
                      title="Jadikan jawaban benar"
                      onClick={() => setForm({ ...form, jawabanBenar: key })}
                      className={`flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all duration-150 flex items-center justify-center ${
                        isAnswer ? `${colors.badge} border-transparent` : "border-slate-600 hover:border-slate-400"
                      }`}
                    >
                      {isAnswer && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                          <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              Klik ikon centang di kanan untuk menandai jawaban yang benar.
            </p>
          </div>

          {/* Jawaban Benar (chip display) */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Jawaban Benar</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${OPTION_COLORS[form.jawabanBenar].badge}`}>
              Opsi {form.jawabanBenar}
            </span>
          </div>

          {/* Score */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
              Poin Score
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, score: Math.max(0, form.score - 5) })}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all duration-150 flex items-center justify-center"
              >−</button>
              <input
                type="number"
                min={0}
                value={form.score}
                onChange={(e) => setForm({ ...form, score: Number(e.target.value) })}
                className="w-20 text-center px-3 py-2 rounded-xl text-sm font-semibold text-white outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-150"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
              />
              <button
                type="button"
                onClick={() => setForm({ ...form, score: form.score + 5 })}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all duration-150 flex items-center justify-center"
              >+</button>
              <span className="text-xs text-slate-500">poin</span>
            </div>
          </div>

        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 flex items-center justify-end gap-3 border-t border-white/10">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-150 disabled:opacity-40"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
            style={{ background: loading ? "rgba(111,39,255,0.5)" : "linear-gradient(135deg, #6F27FF 0%, #8B5CF6 100%)", boxShadow: "0 4px 20px rgba(111,39,255,0.4)" }}
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Menyimpan…
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                </svg>
                {isEdit ? "Simpan Perubahan" : "Tambah Soal"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modal entrance animation */}
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}