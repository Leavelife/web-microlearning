import { normalizeOpsi } from "@/lib/quiz-normalize";

export default function QuestionCard({ data, onAnswer, selected }) {
  if (!data) return null;

  const opsi = normalizeOpsi(data.opsi);
  const entries = Object.entries(opsi).filter(
    ([, v]) => v != null && String(v).trim() !== ""
  );

  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Pertanyaan
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900 leading-tight">
            {data.pertanyaan}
          </h2>
        </div>
        <div className="rounded-3xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
          {data.score ? `Nilai soal: ${data.score}` : "Nilai soal: 1"}
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900">
          Soal ini belum memiliki opsi jawaban yang valid.
        </div>
      ) : (
        <div className="grid gap-3">
          {entries.map(([key, value]) => {
            const isSelected = selected === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onAnswer(data.id, key)}
                aria-pressed={isSelected}
                className={`group w-full rounded-3xl border px-4 py-4 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
                  isSelected
                    ? "border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-900/10"
                    : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                      {key}
                    </span>
                    Pilihan
                  </span>
                  {isSelected && (
                    <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100">
                      Dipilih
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-700">{String(value)}</p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
