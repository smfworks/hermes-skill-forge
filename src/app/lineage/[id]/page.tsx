"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { GitBranch, Search, Code, BarChart2, Zap } from "lucide-react";
import type { SystemState, Lineage, Skill } from "@/lib/types";
import { getSystemState } from "@/lib/mock-data";
import VersionTimeline from "@/lib/components/VersionTimeline";

export default function LineagePage() {
  const params = useParams();
  const lineageId = params.id as string;
  const [state, setState] = useState<SystemState | null>(null);
  const [loading, setLoading] = useState(true);

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

  const lineage = state.lineages.find((l) => l.id === lineageId);
  if (!lineage) {
    return (
      <div className="min-h-screen bg-gradient-cinematic hero-gradient flex items-center justify-center">
        <div className="text-center">
          <GitBranch className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <p className="text-slate-400">Lineage not found</p>
          <Link href="/lineages" className="text-blue-400 hover:text-blue-300 mt-2 inline-block">
            ← Back to Lineages
          </Link>
        </div>
      </div>
    );
  }

  const lineageSkills = state.skills.filter((s) => s.lineageId === lineage.id);
  const latest = lineageSkills.reduce((latest, current) =>
    new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
  );

  return (
    <div className="min-h-screen bg-gradient-cinematic hero-gradient">
      <header className="border-b border-slate-800 bg-slate-900/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/lineages" className="text-slate-400 hover:text-white transition-colors">
                ←
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">{lineage.name}</h1>
                <p className="text-sm text-slate-400">{lineage.description}</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
              {lineage.status}
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Lineage Overview */}
        <section className="mb-8 fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-card border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Lineage Info</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-slate-400">Name</span>
                  <div className="text-white">{lineage.name}</div>
                </div>
                <div>
                  <span className="text-sm text-slate-400">Description</span>
                  <div className="text-sm text-slate-300">{lineage.description}</div>
                </div>
                <div>
                  <span className="text-sm text-slate-400">Status</span>
                  <div className="text-white capitalize">{lineage.status}</div>
                </div>
                <div>
                  <span className="text-sm text-slate-400">Created</span>
                  <div className="text-white">
                    {new Date(lineage.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-card border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Latest Version</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-slate-400">Name</span>
                  <div className="text-white">{latest.name}</div>
                </div>
                <div>
                  <span className="text-sm text-slate-400">Version</span>
                  <div className="text-white font-mono">{latest.version}</div>
                </div>
                <div>
                  <span className="text-sm text-slate-400">Success Rate</span>
                  <div className="text-white">{Math.round(latest.performance.successRate * 100)}%</div>
                </div>
                <div>
                  <span className="text-sm text-slate-400">Usage</span>
                  <div className="text-white">{latest.performance.usageCount}</div>
                </div>
                <Link
                  href={`/skill/${latest.id}`}
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                  <Code className="w-4 h-4" />
                  View Skill Detail
                </Link>
              </div>
            </div>

            <div className="bg-gradient-card border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Branch Points</h2>
              <div className="space-y-3">
                {lineage.branchPoints.length === 0 ? (
                  <p className="text-sm text-slate-400">No branch points</p>
                ) : (
                  lineage.branchPoints.map((bp) => {
                    const branchSkill = state.skills.find((s) => s.id === bp.skillId);
                    return (
                      <div key={bp.id} className="p-3 bg-slate-800/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <GitBranch className="w-4 h-4 text-amber-400" />
                          <span className="text-sm font-medium text-white">
                            {branchSkill?.version || 'Unknown'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{bp.reason}</p>
                        <span className="text-xs text-slate-500">
                          {new Date(bp.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Version Timeline */}
        <section className="fade-in">
          <h2 className="text-lg font-semibold text-white mb-4">Skill Evolution Timeline</h2>
          <VersionTimeline
            skill={latest}
            lineage={lineage}
            allSkills={state.skills}
          />
        </section>
      </main>
    </div>
  );
}
