"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GitBranch, Search, Code, BarChart2 } from "lucide-react";
import type { SystemState, Lineage, Skill } from "@/lib/types";
import { getSystemState } from "@/lib/mock-data";

export default function LineagesPage() {
  const [state, setState] = useState<SystemState | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const data = getSystemState();
    setState(data);
    setLoading(false);
  }, []);

  if (loading || !state) {
    return (
      <div className="min-h-screen bg-gradient-cinematic hero-gradient flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const filteredLineages = state.lineages.filter((l) =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-cinematic hero-gradient">
      <header className="border-b border-slate-800 bg-slate-900/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-slate-400 hover:text-white transition-colors">
                ←
              </Link>
              <h1 className="text-xl font-bold text-white">Lineages</h1>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search lineages..."
                className="pl-10 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="space-y-4">
          {filteredLineages.map((lineage) => {
            const lineageSkills = state.skills.filter((s) => s.lineageId === lineage.id);
            const latest = lineageSkills.reduce((latest, current) =>
              new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
            );

            return (
              <Link
                key={lineage.id}
                href={`/lineage/${lineage.id}`}
                className="block bg-gradient-card border border-slate-800 rounded-xl p-6 transition-all duration-300 hover:border-slate-700"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <GitBranch className="w-5 h-5 text-purple-400" />
                      <h3 className="text-lg font-bold text-white">{lineage.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                        v{latest.version}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mb-3">{lineage.description}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Code className="w-4 h-4" />
                        {lineageSkills.length} versions
                      </span>
                      <span className="flex items-center gap-1">
                        <BarChart2 className="w-4 h-4" />
                        {Math.round(latest.performance.successRate * 100)}% success
                      </span>
                      <span className="flex items-center gap-1">
                        <GitBranch className="w-4 h-4" />
                        {lineage.branchPoints.length} branches
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
