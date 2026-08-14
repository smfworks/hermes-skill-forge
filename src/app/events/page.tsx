"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { EvolutionEvent } from "@/lib/types";

export default function EventsPage() {
  const [events, setEvents] = useState<EvolutionEvent[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/events")
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setEvents(Array.isArray(data) ? data : []))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "failed"));
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <Link href="/" className="text-blue-400 text-sm">
        ← Dashboard
      </Link>
      <h1 className="text-2xl font-bold mt-4 mb-6">Evolution feed</h1>
      {error && <p className="text-red-400">{error}</p>}
      <ol className="space-y-3">
        {events.map((event) => (
          <li key={event.id} className="border border-slate-800 rounded-lg p-3">
            <div className="text-xs text-slate-500">{event.timestamp}</div>
            <div>{event.message}</div>
          </li>
        ))}
      </ol>
    </main>
  );
}
