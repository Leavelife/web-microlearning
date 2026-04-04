"use client";

import { useState } from "react";
import LessonCard from "./LessonCard";

export default function LessonGrid({ lessons }) {
  const [query, setQuery] = useState("");

  const filtered = lessons
    .filter((l) => l.tahap === 1) // ✅ penting
    .filter((l) =>
      l.judul.toLowerCase().includes(query.toLowerCase())
    );

  return (
    <>
      {/* SEARCH */}
      <div className="max-w-xl mx-auto mb-8">
        <input
          type="text"
          placeholder="Search materi..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </>
  );
}