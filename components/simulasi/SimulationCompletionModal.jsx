"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function SimulationCompletionModal({
  isOpen,
  score,
  correctCount,
  totalCount,
  expGained,
  simulationName,
  onReset,
}) {
  const router = useRouter();
  const [animatedExp, setAnimatedExp] = useState(0);
  const animationFrameRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      // Reset when modal closes
      hasAnimatedRef.current = false;
      setAnimatedExp(0);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    // Reset and start animation when modal opens
    hasAnimatedRef.current = false;
    setAnimatedExp(0);

    // Only animate once per modal opening
    if (hasAnimatedRef.current) {
      return;
    }

    hasAnimatedRef.current = true;

    // Animasi XP bar naik dari 0 ke expGained dalam 1 detik
    const startTime = Date.now();
    const duration = 1000; // 1 detik

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setAnimatedExp(Math.floor(progress * expGained));

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Ensure final value is set correctly
        setAnimatedExp(expGained);
        animationFrameRef.current = null;
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isOpen, expGained]);

  const handleExit = () => {
    router.push("/simulasi");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all animate-in fade-in scale-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Simulasi Selesai!</h2>
          <p className="text-purple-100">{simulationName}</p>
        </div>

        {/* Content */}
        <div className="px-6 py-8 space-y-6">
          {/* Score Info */}
          <div className="space-y-3">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Skor Akhir</p>
              <p className="text-3xl font-bold text-blue-600">{score}/100</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Benar</p>
                <p className="text-lg font-semibold text-gray-800">
                  {correctCount}/{totalCount}
                </p>
              </div>
            </div>
          </div>

          {/* XP Reward */}
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium text-gray-700">Penambahan XP</p>
              <p className="text-lg font-bold text-yellow-600">+{animatedExp} XP</p>
            </div>
            
            {/* XP Bar Animation */}
            <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-100 ease-out flex items-center justify-end pr-2"
                style={{
                  width: `${expGained > 0 ? (animatedExp / 1000) * 100 : 0}%`,
                }}
              >
                {animatedExp > 0 && (
                  <div className="text-xs font-bold text-white drop-shadow-sm">
                    {animatedExp}
                  </div>
                )}
              </div>
            </div>

            {expGained > 0 && (
              <p className="text-xs text-green-600 font-semibold">
                ✓ Bonus penyelesaian pertama kali!
              </p>
            )}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onReset}
            className="flex-1 px-4 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition shadow-sm"
          >
            Ulangi Simulasi
          </button>
          <button
            onClick={handleExit}
            className="flex-1 px-4 py-2.5 bg-gray-300 text-gray-800 font-medium rounded-lg hover:bg-gray-400 transition shadow-sm"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
}
