"use client";
import { useState } from "react";
import TableSoal from "./TableSoal";
import FormSoalModal from "./FormSoalModal";

export default function DetailQuiz({ quiz }) {
  const [selectedSoal, setSelectedSoal] = useState(null);
  const [isSoalModalOpen, setIsSoalModalOpen] = useState(false);
  const [refreshSoal, setRefreshSoal] = useState(0);

  const onSoalSaved = () => {
    setSelectedSoal(null);
    setRefreshSoal((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Quiz Info */}
      <div className="bg-white/5 rounded-2xl p-4">
        <h2 className="text-xl font-bold mb-4">Detail Quiz: {quiz.judul}</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Materi:</span> {quiz.materi?.judul || "N/A"}
          </div>
          <div>
            <span className="text-gray-400">Deskripsi:</span> {quiz.deskripsi || "N/A"}
          </div>
          <div>
            <span className="text-gray-400">Durasi:</span> {quiz.durasi || 0} menit
          </div>
          <div>
            <span className="text-gray-400">Passing Score:</span> {quiz.passingScore || 0}
          </div>
        </div>
      </div>

      {/* Soal Table */}
      <TableSoal
        quizId={quiz.id}
        refresh={refreshSoal}
        onEdit={(soal) => {
          setSelectedSoal(soal);
          setIsSoalModalOpen(true);
        }}
        onAdd={() => {
          setSelectedSoal(null);
          setIsSoalModalOpen(true);
        }}
      />

      {/* Soal Modal */}
      <FormSoalModal
        isOpen={isSoalModalOpen}
        onClose={() => setIsSoalModalOpen(false)}
        quizId={quiz.id}
        initialData={selectedSoal}
        onSuccess={onSoalSaved}
      />
    </div>
  );
}