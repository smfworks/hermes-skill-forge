"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Code,
  GitBranch,
  BarChart2,
  Clock,
  Edit,
  Zap,
  Share2,
} from "lucide-react";
import type { Skill, Lineage, SystemState } from "@/lib/types";
import { getSystemState, editSkill, requestEvolution } from "@/lib/mock-data";
import VersionTimeline from "@/lib/components/VersionTimeline";
import CodeDiffViewer from "@/lib/components/CodeDiffViewer";

export default function SkillPage() {
  const params = useParams();
  const skillId = params.id as string;
  const [state, setState] = useState<SystemState | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editCode, setEditCode] = useState("");
  const [evolving, setEvolving] = useState(false);

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

  const skill = state.skills.find((s) => s.id === skillId);
  if (!skill) {
    return (
      <div className="min-h-screen bg-gradient-cinematic hero-gradient flex items-center justify-center">
        <div className="text-center">
          <Code className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <p className="text-slate-400">Skill not found</p>
          <Link href="/" className="text-blue-400 hover:text-blue-300 mt-2 inline-block">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const lineage = state.lineages.find((l) => l.id === skill.lineageId);
  if (!lineage) {
    return (
      <div className="min-h-screen bg-gradient-cinematic hero-gradient flex items-center justify-center">
        <p className="text-slate-400">Lineage not found</p>
      </div>
    );
  }

  const handleEdit = () => {
    setEditCode(skill.code);
    setEditing(true);
  };

  const handleSaveEdit = () => {
    editSkill(skill.id, editCode);
    setEditing(false);
    // Refresh state
    const data = getSystemState();
    setState(data);
  };

  const handleRequestEvolution = async () => {
    setEvolving(true);
    requestEvolution(skill.id);
    // Simulate async
    setTimeout(() => {
      setEvolving(false);
      const data = getSystemState();
      setState(data);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-cinematic hero-gradient">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">{skill.name}</h1>
                <p className="text-sm text-slate-400">
                  v{skill.version} • {lineage.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Skill
              </button>
              <button
                onClick={handleRequestEvolution}
                disabled={evolving}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 rounded-lg text-sm font-medium text-white flex items-center gap-2 transition-colors"
              >
                {evolving ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <Zap className="w-4 h-4" />
                )}
                Request Evolution
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Skill Overview */}
        <section className="mb-8 fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Skill Details */}
            <div className="bg-gradient-card border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Skill Details</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-slate-400">Name</span>
                  <div className="text-white">{skill.name}</div>
                </div>
                <div>
                  <span className="text-sm text-slate-400">Version</span>
                  <div className="text-white font-mono">{skill.version}</div>
                </div>
                <div>
                  <span className="text-sm text-slate-400">Status</span>
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      skill.status === "active" ? "bg-green-500/20 text-green-400" :
                      skill.status === "evolving" ? "bg-amber-500/20 text-amber-400" :
                      skill.status === "experimental" ? "bg-blue-500/20 text-blue-400" :
                      "bg-slate-500/20 text-slate-400"
                    }`}>
                      {skill.status}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-slate-400">Author</span>
                  <div className="text-white capitalize">{skill.author}</div>
                </div>
                <div>
                  <span className="text-sm text-slate-400">Lineage</span>
                  <div className="text-white">{lineage.name}</div>
                </div>
                <div>
                  <span className="text-sm text-slate-400">Created</span>
                  <div className="text-white">
                    {new Date(skill.createdAt).toLocaleString()}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-slate-400">Parent Version</span>
                  <div className="text-white font-mono">
                    {skill.parentVersion || "None (root)"}
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-gradient-card border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Performance</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-400">Usage Count</span>
                    <span className="text-2xl font-bold text-white">{skill.performance.usageCount}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${Math.min(100, skill.performance.usageCount / 5)}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-400">Success Rate</span>
                    <span className="text-2xl font-bold text-white">
                      {Math.round(skill.performance.successRate * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${skill.performance.successRate * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-400">Avg Execution Time</span>
                    <span className="text-2xl font-bold text-white">
                      {Math.round(skill.performance.avgExecutionTime)}ms
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full"
                      style={{ width: `${Math.min(100, skill.performance.avgExecutionTime / 10)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lineage Info */}
            <div className="bg-gradient-card border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Lineage</h2>
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
                  <span className="text-sm text-slate-400">Branch Points</span>
                  <div className="text-white">{lineage.branchPoints.length}</div>
                </div>
                <div>
                  <span className="text-sm text-slate-400">Created</span>
                  <div className="text-white">
                    {new Date(lineage.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <Link
                  href={`/lineage/${lineage.id}`}
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                  <GitBranch className="w-4 h-4" />
                  View Lineage
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Version Timeline */}
        <section className="mb-8 fade-in">
          <h2 className="text-lg font-semibold text-white mb-4">Version Timeline</h2>
          <VersionTimeline
            skill={skill}
            lineage={lineage}
            allSkills={state.skills}
          />
        </section>

        {/* Code Diff */}
        {state.skills.filter((s) => s.lineageId === lineage.id).length > 1 && (
          <section className="fade-in">
            <h2 className="text-lg font-semibold text-white mb-4">Compare Versions</h2>
            <div className="bg-gradient-card border border-slate-800 rounded-xl p-6">
              <p className="text-sm text-slate-400 mb-4">
                Select two versions to compare their code differences.
              </p>
              <CodeDiffViewer
                oldCode={state.skills
                  .filter((s) => s.lineageId === lineage.id)
                  .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())[0]
                  .code}
                newCode={skill.code}
                oldLabel="First Version"
                newLabel={`v${skill.version}`}
              />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
