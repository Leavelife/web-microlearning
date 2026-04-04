'use client'
import { useEffect, useState, useRef } from "react";
import ChartCard from "./ChartCard";
import FormMateriModal from "@/components/admin/materi/FormMateriModal";
import TableQuiz from "@/components/admin/quiz/TableQuiz";
import FormQuizModal from "@/components/admin/quiz/FormQuizModal";
import DetailQuiz from "@/components/admin/quiz/DetailQuiz";

function StatCard({ title, value }) {
  return (
    <div className="bg-white/5 backdrop-blur rounded-2xl p-4 shadow">
      <p className="text-sm text-gray-400">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}

function Sidebar() {
  const menu = ["Dashboard", "Materi", "Quiz", "Simulasi", "Gamifikasi"];
  return (
    <div className="w-64 h-screen bg-black/40 backdrop-blur p-4">
      <h1 className="text-xl font-bold mb-6">MICROLAB</h1>
      <ul className="space-y-3">
        {menu.map((item) => (
          <li key={item} className="hover:text-blue-400 cursor-pointer">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Topbar() {
  return (
    <div className="flex justify-between items-center p-4 border-b border-white/10">
      <input
        placeholder="Search..."
        className="bg-white/5 px-3 py-2 rounded-lg outline-none"
      />
      <div className="w-10 h-10 rounded-full bg-white/20" />
    </div>
  );
}

function TableMateri({ initialData = [] }) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!initialData || initialData.length === 0);
  const [error, setError] = useState(null);
  const [selectedMateri, setSelectedMateri] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const hasInitialized = useRef(false);
  const initialDataRef = useRef(initialData);

  // Fetch materi data on mount or when initialData changes
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

    const fetchMateri = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/materi");
        if (!res.ok) throw new Error("Failed to fetch materi");
        const result = await res.json();
        if (!cancelled) {
          setData(result.lessons || result.data || []);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchMateri();
    return () => {
      cancelled = true;
    };
  }, []); // Empty dependency array - only run once on mount

    const handleAdd = () => {
        setSelectedMateri(null);
        setIsOpen(true);
    };

    const handleEdit = (materi) => {
        setSelectedMateri(materi);
        setIsOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm("Yakin hapus materi?")) return;

        await fetch(`/api/admin/materi/${id}`, {
            method: "DELETE",
        });

        // refresh data (simple version)
        setData(prev => prev.filter(item => item.id !== id));
    };

  return (
    <div className="bg-white/5 rounded-2xl p-4">
      <div className="flex justify-between mb-4">
        <h2 className="font-bold">Materi</h2>
        <button onClick={handleAdd} className="bg-blue-500 px-3 py-1 rounded">Add</button>
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
            <th>Tipe</th>
            <th>Tahap</th>
            <th>Judul</th>
            <th>Deskripsi</th>
            <th>URL</th>
            <th>Tipe Unlock</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr key="loading-row">
              <td colSpan="8">Loading...</td>
            </tr>
          ) : data.length === 0 ? (
            <tr key="empty-row">
              <td colSpan="8">Tidak ada data</td>
            </tr>
          ) : (
            data.map((item, i) => (
              <tr key={item.id || `item-${i}`} className="border-t border-white/10">
                <td>{ i + 1}</td>
                <td>{item.tipe}</td>
                <td>{item.tahap}</td>
                <td>{item.judul}</td>
                <td className="max-w-xs truncate">{item.deskripsi}</td>
                <td>{item.urlKonten || item.url || "-"}</td>
                <td>{item.unlockType || "-"}</td>
                <td className="space-x-2">
                    <button
                        onClick={() => handleEdit(item)}
                        className="bg-green-500 px-2 m-3 rounded"
                    >
                        Edit
                    </button>

                    <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500 px-2 m-3 rounded"
                    >
                        Hapus
                    </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <FormMateriModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialData={selectedMateri}
        onSuccess={(newData) => {
            console.log('onSuccess called with:', newData);
            console.log('selectedMateri:', selectedMateri);

            if (selectedMateri) {
            // edit - update existing item
            console.log('Updating item with ID:', newData.id);
            setData(prev =>
                prev.map(item => {
                    console.log('Comparing:', item.id, 'with', newData.id);
                    return item.id === newData.id ? newData : item;
                })
            );
            } else {
            // add - prepend new item
            console.log('Adding new item');
            setData(prev => [newData, ...prev]);
            }

            // Reset selectedMateri after operation
            setSelectedMateri(null);
        }}
        />
    </div>
  );
}

export default function DashboardClient({ stats, initialMateri, initialQuiz, chartData }) {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'
  const [selectedQuizForDetail, setSelectedQuizForDetail] = useState(null);
  return (
    <div className="flex text-white min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <StatCard title="Total User" value={stats?.totalUsers ?? "-"} />
            <StatCard title="Total Materi" value={stats?.totalMateri ?? "-"} />
            <StatCard title="Total Quiz" value={stats?.totalQuiz ?? "-"} />
            <StatCard title="Total Simulasi" value={stats?.totalSimulasi ?? "-"} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-2xl h-72">
                <ChartCard title="Activity Trend" data={chartData?.activityTrend || []} dataKey="total" />
            </div>
            <div className="bg-white/5 rounded-2xl h-72">
                <ChartCard title="Quiz Trend" data={chartData?.quizTrend || []} dataKey="score" />
            </div>
          </div>

          <TableMateri initialData={initialMateri} />

          {viewMode === 'list' ? (
            <TableQuiz
              initialData={initialQuiz}
              onEdit={(quiz) => {
                setSelectedQuiz(quiz);
                setIsQuizModalOpen(true);
              }}
              onAdd={() => {
                setSelectedQuiz(null);
                setIsQuizModalOpen(true);
              }}
              onViewSoal={(quiz) => {
                setSelectedQuizForDetail(quiz);
                setViewMode('detail');
              }}
            />
          ) : (
            <div className="space-y-4">
              <button
                onClick={() => setViewMode('list')}
                className="bg-gray-500 px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                ← Back to Quiz List
              </button>
              <DetailQuiz quiz={selectedQuizForDetail} />
            </div>
          )}
        </div>
      </div>

      <FormQuizModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        initialData={selectedQuiz}
        onSuccess={() => {
          // Reset selectedQuiz after operation
          setSelectedQuiz(null);
        }}
      />
    </div>
  );
}
