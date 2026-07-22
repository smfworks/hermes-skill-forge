"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  Code,
  GitBranch,
  Search,
  Settings,
  Zap,
  BarChart3,
  Clock,
} from "lucide-react";
import type { SystemState, Skill, Lineage } from "@/lib/types";
import { getSystemState } from "@/lib/mock-data";
import SkillGraph from "@/lib/components/SkillGraph";
import EvolutionFeed from "@/lib/components/EvolutionFeed";

export default function Home() {
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
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }}></div>
          </div>
          <p className="text-slate-400 mt-4">Initializing Skill Forge...</p>
          <p className="text-slate-500 text-sm mt-2">Loading skill evolution data</p>
        </div>
      </div>
    );
  }

  const { skills, lineages, events } = state;

  // Filter skills by search
  const filteredSkills = skills.filter((skill) =>
    skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    skill.version.includes(searchQuery) ||
    skill.lineageId.includes(searchQuery)
  );

  // Get latest version of each lineage
  const lineageLatest = lineages.map((lineage) => {
    const lineageSkills = skills.filter((s) => s.lineageId === lineage.id);
    const latest = lineageSkills.reduce((latest, current) =>
      new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
    );
    return { lineage, latest };
  });

  return (
    <div className="min-h-screen bg-gradient-cinematic hero-gradient">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Hermes Skill Forge</h1>
              <p className="text-sm text-slate-400">Visual studio for skill evolution</p>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <Link href="/lineages" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
              Lineages
            </Link>
            <Link href="/skills" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
              Skills
            </Link>
            <Link href="/events" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
              Evolution Feed
            </Link>
            <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* System Metrics Cards */}
        <section className="mb-8 fade-in">
          <h2 className="text-lg font-semibold text-white mb-4">Skill Ecosystem Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 stagger">
            <MetricCard
              title="Total Skills"
              value={skills.length.toString()}
              icon={Code}
              color="blue"
            />
            <MetricCard
              title="Active Lineages"
              value={lineages.filter(l => l.status === 'active').length.toString()}
              icon={GitBranch}
              color="purple"
            />
            <MetricCard
              title="Evolving Skills"
              value={skills.filter(s => s.status === 'evolving').length.toString()}
              icon={Activity}
              color="amber"
            />
            <MetricCard
              title="Success Rate"
              value={`${Math.round(skills.reduce((sum, s) => sum + s.performance.successRate, 0) / skills.length * 100)}%`}
              icon={BarChart3}
              color="green"
            />
          </div>
        </section>

        {/* Search */}
        <section className="mb-8 fade-in">
          <div className="relative max-w-2xl">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills by name, version, or lineage..."
              className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </section>

        {/* Skill Graph */}
        <section className="mb-8 fade-in">
          <h2 className="text-lg font-semibold text-white mb-4">Skill Evolution Graph</h2>
          <SkillGraph
            skills={filteredSkills}
            lineages={lineages}
            graph={state.graph}
          />
        </section>

        {/* Lineage Overview */}
        <section className="mb-8 fade-in">
          <h2 className="text-lg font-semibold text-white mb-4">Lineage Overview</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {lineageLatest.map(({ lineage, latest }) => (
              <Link
                key={lineage.id}
                href={`/lineage/${lineage.id}`}
                className="block bg-gradient-card border border-slate-800 rounded-xl p-6 transition-all duration-300 hover:border-slate-700"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-white">{lineage.name}</h3>
                    <p className="text-sm text-slate-400 mt-1">{lineage.description}</p>
                  </div>
                  <div className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                    {latest.version}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span>{latest.performance.usageCount} uses</span>
                  <span>{Math.round(latest.performance.successRate * 100)}% success</span>
                  <span>{lineage.branchPoints.length} branches</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Evolution Feed */}
        <section className="fade-in">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Evolution Events</h2>
          <EvolutionFeed events={events.slice(0, 20)} />
        </section>
      </main>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  color: "blue" | "purple" | "amber" | "green";
}

function MetricCard({ title, value, icon: Icon, color }: MetricCardProps) {
  const colorClasses = {
    blue: "bg-blue-500/20 text-blue-400",
    purple: "bg-purple-500/20 text-purple-400",
    amber: "bg-amber-500/20 text-amber-400",
    green: "bg-green-500/20 text-green-400",
  };

  return (
    <div className="bg-gradient-card border border-slate-800 rounded-xl p-6 transition-all duration-300 hover:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-2xl font-bold text-white">{value}</span>
      </div>
      <h3 className="text-sm font-medium text-slate-400">{title}</h3>
    </div>
  );
}
