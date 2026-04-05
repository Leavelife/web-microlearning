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
        <input
          type="text"
          placeholder="Search materi..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-black"
        />
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
