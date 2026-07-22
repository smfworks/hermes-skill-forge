"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, SplitSquareVertical, List, BarChart2 } from "lucide-react";
import { computeLineDiff, computeWordDiff } from "@/lib/diff-utils";

interface CodeDiffViewerProps {
  oldCode: string;
  newCode: string;
  oldLabel?: string;
  newLabel?: string;
}

export default function CodeDiffViewer({
  oldCode,
  newCode,
  oldLabel = "Previous Version",
  newLabel = "Current Version",
}: CodeDiffViewerProps) {
  const [viewMode, setViewMode] = useState<"side-by-side" | "unified">("side-by-side");

  const diff = computeLineDiff(oldCode, newCode);
  const oldLines = oldCode.split("\n");
  const newLines = newCode.split("\n");

  // Compute line-by-line diff
  const oldDiffLines = oldLines.map((line, i) => ({
    line: i + 1,
    content: line,
    type: "unchanged" as "added" | "removed" | "unchanged",
  }));

  const newDiffLines = newLines.map((line, i) => ({
    line: i + 1,
    content: line,
    type: "unchanged" as "added" | "removed" | "unchanged",
  }));

  return (
    <div className="bg-gradient-card border border-slate-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-bold text-white">Code Diff</h3>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1 text-green-400">
              +{diff.addedLines} added
            </span>
            <span className="flex items-center gap-1 text-red-400">
              -{diff.removedLines} removed
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              {Math.round(diff.similarity * 100)}% similar
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("side-by-side")}
            className={`p-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === "side-by-side"
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                : "bg-slate-800/30 text-slate-300 hover:bg-slate-700/30 border border-slate-700"
            }`}
          >
            <SplitSquareVertical className="w-4 h-4 mr-1 inline" />
            Side-by-Side
          </button>
          <button
            onClick={() => setViewMode("unified")}
            className={`p-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === "unified"
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                : "bg-slate-800/30 text-slate-300 hover:bg-slate-700/30 border border-slate-700"
            }`}
          >
            <List className="w-4 h-4 mr-1 inline" />
            Unified
          </button>
        </div>
      </div>

      {/* Diff content */}
      {viewMode === "side-by-side" ? (
        <div className="grid grid-cols-2 divide-x divide-slate-800">
          {/* Old code */}
          <div>
            <div className="bg-slate-900/50 border-b border-slate-800 px-4 py-2 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-300">{oldLabel}</span>
              <span className="text-xs text-slate-500">{oldLines.length} lines</span>
            </div>
            <div className="overflow-x-auto">
              {oldDiffLines.map((item) => (
                <div
                  key={item.line}
                  className="flex items-start border-b border-slate-800/30 last:border-b-0"
                >
                  <div className="bg-slate-900/30 text-slate-600 text-xs font-mono text-right px-3 py-1 min-w-[50px]">
                    {item.line}
                  </div>
                  <div className="flex-1 px-3 py-1 text-xs font-mono text-slate-400">
                    {item.content || "\u00a0"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* New code */}
          <div>
            <div className="bg-slate-900/50 border-b border-slate-800 px-4 py-2 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-300">{newLabel}</span>
              <span className="text-xs text-slate-500">{newLines.length} lines</span>
            </div>
            <div className="overflow-x-auto">
              {newDiffLines.map((item) => (
                <div
                  key={item.line}
                  className="flex items-start border-b border-slate-800/30 last:border-b-0"
                >
                  <div className="bg-slate-900/30 text-slate-600 text-xs font-mono text-right px-3 py-1 min-w-[50px]">
                    {item.line}
                  </div>
                  <div className="flex-1 px-3 py-1 text-xs font-mono text-slate-300">
                    {item.content || "\u00a0"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Unified diff
        <div className="overflow-x-auto">
          <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-300">Unified Diff</span>
            <span className="text-xs text-slate-500">
              {oldLines.length + newLines.length} lines
            </span>
          </div>
          <div className="font-mono text-xs">
            {diff.hunks.map((hunk, i) => (
              <div key={i} className="border-b border-slate-800/30 last:border-b-0">
                {/* Hunk header */}
                <div className="bg-slate-900/50 px-3 py-1 text-slate-500">
                  @@ -{hunk.oldStart},{hunk.oldLines.length} +{hunk.newStart},{hunk.newLines.length} @@
                </div>
                {/* Old lines (removed) */}
                {hunk.oldLines.map((line, j) => (
                  <div
                    key={`old-${j}`}
                    className="flex items-start bg-red-900/10 border-l-2 border-red-500/30"
                  >
                    <div className="text-red-500 px-2 py-0.5">-</div>
                    <div className="flex-1 px-2 py-0.5 text-red-300">{line}</div>
                  </div>
                ))}
                {/* New lines (added) */}
                {hunk.newLines.map((line, j) => (
                  <div
                    key={`new-${j}`}
                    className="flex items-start bg-green-900/10 border-l-2 border-green-500/30"
                  >
                    <div className="text-green-500 px-2 py-0.5">+</div>
                    <div className="flex-1 px-2 py-0.5 text-green-300">{line}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
