/**
 * Hermes Skill Forge — Data Models
 *
 * Clean, versioned data contracts for skills, lineages, versions,
 * and evolution events. These interfaces define the shape of data
 * exchanged between the Skill Forge frontend and backend.
 */

/**
 * A skill version represents a specific iteration of a skill.
 * Skills evolve over time, creating new versions within a lineage.
 */
export interface Skill {
  /** Unique identifier for this skill version */
  id: string;
  /** Human-readable name of the skill */
  name: string;
  /** Description of what the skill does */
  description: string;
  /** Who created this version: 'agent' or 'human' */
  author: 'agent' | 'human';
  /** Current status of this skill version */
  status: 'active' | 'evolving' | 'deprecated' | 'experimental';
  /** ID of the lineage this skill belongs to */
  lineageId: string;
  /** Semantic version string (e.g., "1.2.0") */
  version: string;
  /** ID of the parent skill version this was branched from, if any */
  parentVersion: string | null;
  /** ISO timestamp of when this version was created */
  createdAt: string;
  /** ISO timestamp of last update */
  updatedAt: string;
  /** The actual skill code */
  code: string;
  /** Additional metadata (tags, dependencies, etc.) */
  metadata: Record<string, unknown>;
  /** Performance metrics for this version */
  performance: {
    usageCount: number;
    successRate: number;
    avgExecutionTime: number;
    evaluations: EvaluationResult[];
  };
}

/**
 * A lineage groups related skill versions that share an evolutionary history.
 */
export interface Lineage {
  /** Unique identifier for this lineage */
  id: string;
  /** Name of the lineage */
  name: string;
  /** Description of the lineage's purpose */
  description: string;
  /** ID of the root skill version (origin of the lineage) */
  rootSkillId: string;
  /** Branch points within this lineage */
  branchPoints: BranchPoint[];
  /** ISO timestamp of creation */
  createdAt: string;
  /** Whether the lineage is still active or archived */
  status: 'active' | 'archived';
}

/**
 * A branch point marks where a skill lineage diverged.
 */
export interface BranchPoint {
  /** Unique identifier for this branch point */
  id: string;
  /** ID of the lineage this branch belongs to */
  lineageId: string;
  /** ID of the skill version at this branch point */
  skillId: string;
  /** Reason for the branch */
  reason: string;
  /** ISO timestamp */
  createdAt: string;
}

/**
 * An evaluation result measures a skill's performance on a specific task.
 */
export interface EvaluationResult {
  /** Unique identifier */
  id: string;
  /** ID of the skill version being evaluated */
  skillId: string;
  /** The task the skill was evaluated on */
  task: string;
  /** Score from 0 to 1 */
  score: number;
  /** Notes about the evaluation */
  notes: string;
  /** ISO timestamp */
  createdAt: string;
}

/**
 * An evolution event records a significant change in the skill ecosystem.
 */
export interface EvolutionEvent {
  /** Unique identifier */
  id: string;
  /** ISO timestamp of the event */
  timestamp: string;
  /** Type of evolution event */
  type:
    | 'skill_created'
    | 'skill_improved'
    | 'branch_point'
    | 'performance_regression'
    | 'manual_edit'
    | 'evolution_requested';
  /** ID of the skill involved */
  skillId: string;
  /** ID of the lineage involved */
  lineageId: string;
  /** Human-readable message about the event */
  message: string;
  /** Additional details about the event */
  details: Record<string, unknown>;
}

/**
 * Graph node for the skill visualization.
 */
export interface GraphNode {
  id: string;
  type: 'skill';
  name: string;
  version: string;
  status: Skill['status'];
  description: string;
  lineageId: string;
  parentVersion: string | null;
}

/**
 * Graph edge for the skill visualization.
 */
export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: 'evolution' | 'branch' | 'dependency';
  label?: string;
}

/**
 * Complete graph structure for visualization.
 */
export interface SkillGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

/**
 * Complete system state for the Skill Forge.
 */
export interface SystemState {
  skills: Skill[];
  lineages: Lineage[];
  events: EvolutionEvent[];
  graph: SkillGraph;
}

/**
 * Skill package format for export.
 */
export interface SkillPackage {
  name: string;
  description: string;
  version: string;
  author: string;
  code: string;
  metadata: Record<string, unknown>;
  lineage: {
    name: string;
    description: string;
    versions: Array<{
      version: string;
      code: string;
      createdAt: string;
      author: string;
    }>;
  };
  evaluations: EvaluationResult[];
}
