"use client";

import type { EvolutionEvent } from "@/lib/types";
import {
  Activity,
  GitBranch,
  BarChart2,
  AlertTriangle,
  Edit,
  Zap,
  Clock,
} from "lucide-react";

interface EvolutionFeedProps {
  events: EvolutionEvent[];
}

export default function EvolutionFeed({ events }: EvolutionFeedProps) {
  const eventIcons = {
    skill_created: Activity,
    skill_improved: BarChart2,
    branch_point: GitBranch,
    performance_regression: AlertTriangle,
    manual_edit: Edit,
    evolution_requested: Zap,
  };

  const eventColors = {
    skill_created: "bg-blue-400",
    skill_improved: "bg-green-400",
    branch_point: "bg-amber-400",
    performance_regression: "bg-red-400",
    manual_edit: "bg-purple-400",
    evolution_requested: "bg-blue-400",
  };

  return (
    <div className="bg-gradient-card border border-slate-800 rounded-xl">
      <div className="p-4 border-b border-slate-800">
        <h3 className="font-medium text-white">Evolution Events</h3>
      </div>
      <div className="divide-y divide-slate-800 max-h-96 overflow-y-auto">
        {events.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No evolution events yet</p>
          </div>
        ) : (
          events.map((event) => {
            const Icon = eventIcons[event.type] || Activity;
            const colorClass = eventColors[event.type] || "bg-blue-400";

            return (
              <div key={event.id} className="p-4 hover:bg-slate-800/30 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${colorClass} pulse-slow`}></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-3 h-3 text-slate-400" />
                      <span className="text-xs text-slate-500 uppercase">
                        {event.type.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300">{event.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500">
                        {new Date(event.timestamp).toLocaleString()}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-slate-800 rounded-full text-slate-400">
                        {event.skillId.substring(0, 8)}...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
