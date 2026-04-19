"use client";

import { useEffect, useMemo, useState } from "react";
import LessonCard from "./LessonCard";

export default function LessonGrid({ lessons }) {
  const [query, setQuery] = useState("");
  const [progressByMateriId, setProgressByMateriId] = useState({});

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/learn/progress", {
          credentials: "include",
        });
        if (!res.ok) {
          if (!cancelled) setProgressByMateriId({});
          return;
        }
        const data = await res.json();
        if (!cancelled && data?.byMateriId && typeof data.byMateriId === "object") {
          setProgressByMateriId(data.byMateriId);
        }
      } catch {
        if (!cancelled) setProgressByMateriId({});
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(
    () =>
      lessons
        .filter((l) => l.tahap === 1)
        .filter((l) => l.judul.toLowerCase().includes(query.toLowerCase())),
    [lessons, query]
  );

  return (
    <>
      <div className="max-w-xl mx-auto mb-8">
        <div className="relative group">
          
          {/* Icon */}
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-slate-400 group-focus-within:text-violet-500 transition"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>

          {/* Input */}
          <input
            type="text"
            placeholder="Cari materi..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="
              w-full pl-12 pr-4 py-3
              rounded-2xl
              bg-white/80 backdrop-blur
              border border-slate-200
              text-sm text-slate-700
              shadow-sm
              transition-all duration-200

              placeholder:text-slate-400

              focus:outline-none
              focus:ring-2 focus:ring-violet-500/30
              focus:border-violet-400
              focus:bg-white

              hover:border-slate-300
            "
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((lesson) => {
          const raw = progressByMateriId[lesson.id];
          const progressPercent =
            typeof raw === "number" && !Number.isNaN(raw) ? raw : undefined;

          return (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              progressPercent={progressPercent}
            />
          );
        })}
      </div>
    </>
  );
}
