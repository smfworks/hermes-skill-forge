"use client";

import { useState } from "react";
import type { Skill, Lineage } from "@/lib/types";
import { GitBranch, Clock, TrendingUp, TrendingDown, Minus, Code, Zap } from "lucide-react";
import { computeLineDiff } from "@/lib/diff-utils";

interface VersionTimelineProps {
  skill: Skill;
  lineage: Lineage;
  allSkills: Skill[];
}

export default function VersionTimeline({ skill, lineage, allSkills }: VersionTimelineProps) {
  const [selectedVersion, setSelectedVersion] = useState<Skill>(skill);
  const [compareVersion, setCompareVersion] = useState<Skill | null>(null);

  // Get all versions in this lineage
  const lineageSkills = allSkills
    .filter((s) => s.lineageId === lineage.id)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  // Compute diff between selected and compare version
  const diff = compareVersion
    ? computeLineDiff(compareVersion.code, selectedVersion.code)
    : null;

  return (
    <div className="space-y-6">
      {/* Version selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 overflow-x-auto pb-2">
          <span className="text-sm font-medium text-slate-300">Select version:</span>
          {lineageSkills.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedVersion(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                selectedVersion.id === s.id
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  : "bg-slate-800/30 text-slate-300 hover:bg-slate-700/30 border border-slate-700"
              }`}
            >
              v{s.version}
            </button>
          ))}
        </div>

        {/* Compare selector */}
        {lineageSkills.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Compare with:</span>
            <select
              value={compareVersion?.id || ""}
              onChange={(e) => {
                const s = lineageSkills.find((sk) => sk.id === e.target.value);
                setCompareVersion(s || null);
              }}
              className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">None</option>
              {lineageSkills
                .filter((s) => s.id !== selectedVersion.id)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    v{s.version}
                  </option>
                ))}
            </select>
          </div>
        )}
      </div>

      {/* Version details */}
      <div className="bg-gradient-card border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">{selectedVersion.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-slate-400">Version:</span>
              <code className="text-sm font-mono text-blue-400 bg-slate-900 px-2 py-0.5 rounded">
                {selectedVersion.version}
              </code>
              <span className="text-slate-500">•</span>
              <span className="text-sm text-slate-400">Author: {selectedVersion.author}</span>
              <span className="text-slate-500">•</span>
              <span className="text-sm text-slate-400">
                {new Date(selectedVersion.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            selectedVersion.status === "active" ? "bg-green-500/20 text-green-400" :
            selectedVersion.status === "evolving" ? "bg-amber-500/20 text-amber-400" :
            selectedVersion.status === "experimental" ? "bg-blue-500/20 text-blue-400" :
            "bg-slate-500/20 text-slate-400"
          }`}>
            {selectedVersion.status}
          </span>
        </div>

        {/* Performance metrics */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{selectedVersion.performance.usageCount}</div>
            <div className="text-xs text-slate-400">Usage Count</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{Math.round(selectedVersion.performance.successRate * 100)}%</div>
            <div className="text-xs text-slate-400">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{Math.round(selectedVersion.performance.avgExecutionTime)}ms</div>
            <div className="text-xs text-slate-400">Avg Time</div>
          </div>
        </div>

        {/* Diff summary if comparing */}
        {diff && (
          <div className="mb-4 p-3 bg-slate-900/50 rounded-lg">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-slate-300">Diff Summary</h4>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-green-400">
                  <TrendingUp className="w-3 h-3" />
                  +{diff.addedLines} added
                </span>
                <span className="flex items-center gap-1 text-red-400">
                  <TrendingDown className="w-3 h-3" />
                  -{diff.removedLines} removed
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Minus className="w-3 h-3" />
                  {Math.round(diff.similarity * 100)}% similar
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Code display */}
        <pre className="text-xs text-slate-300 bg-slate-900/50 rounded-lg p-4 overflow-x-auto max-h-96">
          {selectedVersion.code}
        </pre>
      </div>

      {/* Timeline view */}
      <div className="bg-gradient-card border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Evolution Timeline</h3>
        <div className="space-y-4">
          {lineageSkills.map((s, index) => {
            const isLatest = index === lineageSkills.length - 1;
            const isSelected = selectedVersion.id === s.id;
            const prevSkill = index > 0 ? lineageSkills[index - 1] : null;
            const performanceChange = prevSkill
              ? s.performance.successRate - prevSkill.performance.successRate
              : 0;

            return (
              <div key={s.id} className="relative">
                {/* Timeline line */}
                {index < lineageSkills.length - 1 && (
                  <div className="absolute left-6 top-10 bottom-0 w-0.5 bg-slate-700" />
                )}

                <div className="flex gap-4">
                  {/* Version marker */}
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      isSelected
                        ? "border-blue-400 bg-blue-500/20 glow-blue"
                        : isLatest
                        ? "border-purple-400 bg-purple-500/20"
                        : "border-slate-600 bg-slate-800"
                    }`}>
                      <Code className="w-5 h-5 text-white" />
                    </div>
                    <span className="mt-1 text-xs font-medium text-slate-300">
                      v{s.version}
                    </span>
                    {performanceChange !== 0 && (
                      <div className="mt-1 flex items-center gap-1">
                        {performanceChange > 0 ? (
                          <TrendingUp className="w-3 h-3 text-green-400" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-red-400" />
                        )}
                        <span className={`text-xs ${
                          performanceChange > 0 ? "text-green-400" : "text-red-400"
                        }`}>
                          {performanceChange > 0 ? "+" : ""}
                          {Math.round(performanceChange * 100)}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Version details */}
                  <div className="flex-1 bg-slate-800/30 border border-slate-700 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-sm font-medium text-white">{s.name}</span>
                        <span className="text-xs text-slate-500 ml-2">
                          {new Date(s.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        s.status === "active" ? "bg-green-500/20 text-green-400" :
                        s.status === "evolving" ? "bg-amber-500/20 text-amber-400" :
                        s.status === "experimental" ? "bg-blue-500/20 text-blue-400" :
                        "bg-slate-500/20 text-slate-400"
                      }`}>
                        {s.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span>Usage: {s.performance.usageCount}</span>
                      <span>Success: {Math.round(s.performance.successRate * 100)}%</span>
                      <span>Time: {Math.round(s.performance.avgExecutionTime)}ms</span>
                      {s.author === "human" && (
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-purple-400" />
                          Manual edit
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
