import { normalizeOpsi } from "@/lib/quiz-normalize";

export default function QuestionCard({ data, onAnswer, selected }) {
  if (!data) return null;

  const opsi = normalizeOpsi(data.opsi);
  const entries = Object.entries(opsi).filter(
    ([, v]) => v != null && String(v).trim() !== ""
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-900">
        {data.pertanyaan}
      </h2>

      {entries.length === 0 ? (
        <p className="text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
          Soal ini belum memiliki opsi jawaban yang valid.
        </p>
      ) : (
        <div className="space-y-3">
          {entries.map(([key, value]) => (
            <button
              key={key}
              type="button"
              onClick={() => onAnswer(data.id, key)}
              className={`w-full text-left px-4 py-3 rounded-lg border transition-colors
                ${
                  selected === key
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white border-gray-200 text-gray-800 hover:bg-gray-50"
                }`}
            >
              <span className="font-medium text-gray-400 mr-2">{key}.</span>
              {String(value)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
