"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Skill } from "@/lib/types";

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/skills")
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setSkills(Array.isArray(data) ? data : []))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "failed"));
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <Link href="/" className="text-blue-400 text-sm">
        ← Dashboard
      </Link>
      <h1 className="text-2xl font-bold mt-4 mb-6">Skills</h1>
      {error && <p className="text-red-400">{error}</p>}
      <ul className="space-y-2">
        {skills.map((skill) => (
          <li key={skill.id}>
            <Link href={`/skill/${skill.id}`} className="hover:text-blue-300">
              {skill.name} <span className="text-slate-500 font-mono">v{skill.version}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
