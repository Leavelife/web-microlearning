'use client'
import { useEffect, useState, useRef } from "react";
import FormQuizModal from "./FormQuizModal";

function TableQuiz({ initialData = [], onViewSoal }) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!initialData || initialData.length === 0);
  const [error, setError] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [materiList, setMateriList] = useState([]);
  const hasInitialized = useRef(false);
  const initialDataRef = useRef(initialData);

  // Fetch quiz data on mount or when initialData changes
  useEffect(() => {
    // Prevent infinite loop - only initialize once
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const currentInitialData = initialDataRef.current;

    // If initialData is provided and not empty, use it
    if (currentInitialData && currentInitialData.length > 0) {
      setData(currentInitialData);
      setLoading(false);
      return;
    }

    // Otherwise fetch from API
    let cancelled = false;

    const fetchQuiz = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/quiz");
        if (!res.ok) throw new Error("Failed to fetch quiz");
        const result = await res.json();
        if (!cancelled) {
          setData(result.quizzes || result.data || []);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchQuiz();
    return () => {
      cancelled = true;
    };
  }, []); // Empty dependency array - only run once on mount

  // Fetch materi list for modal dropdown
  useEffect(() => {
    const fetchMateri = async () => {
      try {
        const res = await fetch("/api/admin/materi");
        const result = await res.json();
        setMateriList(result.lessons || result.data || []);
      } catch (err) {
        console.error("Failed to fetch materi:", err);
      }
    };

    if (isOpen) {
      fetchMateri();
    }
  }, [isOpen]);

  const handleAdd = () => {
    setSelectedQuiz(null);
    setIsOpen(true);
  };

  const handleEdit = (quiz) => {
    setSelectedQuiz(quiz);
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus quiz?")) return;

    try {
      const res = await fetch(`/api/admin/quiz/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // refresh data
        setData(prev => prev.filter(item => item.id !== id));
      } else {
        alert("Gagal menghapus quiz");
      }
    } catch (error) {
      alert("Terjadi kesalahan saat menghapus quiz");
    }
  };

  return (
    <div className="bg-white/5 rounded-2xl p-4">
      <div className="flex justify-between mb-4">
        <h2 className="font-bold">Quiz</h2>
        <button onClick={handleAdd} className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 transition-colors">
          Add Quiz
        </button>
      </div>

      {error && (
        <p className="text-red-400 mb-4">
          Error: {error}
        </p>
      )}

      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-400">
            <th>No</th>
            <th>Materi</th>
            <th>Judul Quiz</th>
            <th>Jumlah Soal</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr key="loading-row">
              <td colSpan="5">Loading...</td>
            </tr>
          ) : data.length === 0 ? (
            <tr key="empty-row">
              <td colSpan="5">Tidak ada data</td>
            </tr>
          ) : (
            data.map((item, i) => (
              <tr key={item.id || `quiz-${i}`} className="border-t border-white/10">
                <td>{i + 1}</td>
                <td>{item.materi?.judul || "N/A"}</td>
                <td>{item.judul}</td>
                <td>{item._count?.soal || item.soal?.length || 0}</td>
                <td className="space-x-2">
                  <button
                    onClick={() => onViewSoal && onViewSoal(item)}
                    className="bg-blue-500 px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                  >
                    View Soal
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-green-500 px-2 py-1 rounded hover:bg-green-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 px-2 py-1 rounded hover:bg-red-600 transition-colors"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <FormQuizModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialData={selectedQuiz}
        materiList={materiList}
        onSuccess={(newData) => {
          console.log('Quiz onSuccess called with:', newData);
          console.log('selectedQuiz:', selectedQuiz);

          if (selectedQuiz) {
            // edit - update existing item
            console.log('Updating quiz with ID:', newData.id);
            setData(prev =>
              prev.map(item => {
                console.log('Comparing:', item.id, 'with', newData.id);
                return item.id === newData.id ? newData : item;
              })
            );
          } else {
            // add - prepend new item
            console.log('Adding new quiz');
            setData(prev => [newData, ...prev]);
          }

          // Reset selectedQuiz after operation
          setSelectedQuiz(null);
        }}
      />
    </div>
  );
}

export default TableQuiz;