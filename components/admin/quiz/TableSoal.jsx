'use client'
import { useEffect, useState, useRef } from "react";

export default function TableSoal({ quizId, onEdit, onAdd, refresh = 0 }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!quizId) return;

    const fetchSoal = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/quiz/soal?quizId=${quizId}`);
        if (!res.ok) throw new Error("Failed to fetch soal");
        const result = await res.json();
        setData(result.soal || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSoal();
  }, [quizId, refresh]);

  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus soal?")) return;

    await fetch(`/api/admin/quiz/soal/${id}`, {
      method: "DELETE",
    });

    // refresh data
    setData(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="bg-white/5 rounded-2xl p-4">
      <div className="flex justify-between mb-4">
        <h3 className="font-bold">Soal Quiz</h3>
        <button
          onClick={onAdd}
          className="bg-blue-500 px-3 py-1 rounded"
        >
          Add Soal
        </button>
      </div>

      {error && (
        <p className="text-red-400 mb-4">Error: {error}</p>
      )}

      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-400">
            <th>No</th>
            <th>Pertanyaan</th>
            <th>Opsi A</th>
            <th>Opsi B</th>
            <th>Opsi C</th>
            <th>Opsi D</th>
            <th>Jawaban</th>
            <th>Score</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="9">Loading...</td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan="9">Tidak ada soal</td>
            </tr>
          ) : (
            data.map((item, i) => (
              <tr key={item.id} className="border-t border-white/10">
                <td>{item.nomorSoal || i + 1}</td>
                <td className="max-w-xs truncate">{item.pertanyaan}</td>
                <td className="max-w-xs truncate">{item.opsi?.A || "-"}</td>
                <td className="max-w-xs truncate">{item.opsi?.B || "-"}</td>
                <td className="max-w-xs truncate">{item.opsi?.C || "-"}</td>
                <td className="max-w-xs truncate">{item.opsi?.D || "-"}</td>
                <td>{item.jawabanBenar}</td>
                <td>{item.score}</td>
                <td className="space-x-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="bg-green-500 px-2 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 px-2 py-1 rounded text-sm"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}