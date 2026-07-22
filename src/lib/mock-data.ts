/**
 * Hermes Skill Forge — Mock Data Store
 *
 * Generates realistic mock data demonstrating skill evolution for development
 * and demo purposes. In production, this would be replaced by real-time data
 * from a Hermes instance.
 */

import type {
  Skill,
  Lineage,
  EvaluationResult,
  EvolutionEvent,
  SystemState,
  SkillGraph,
  BranchPoint,
} from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

// Skill names for mock data
const SKILL_NAMES = [
  'Code Review Assistant',
  'Data Analysis Pipeline',
  'API Documentation Generator',
  'Test Case Creator',
  'Bug Triage Bot',
  'Refactoring Helper',
  'Security Scanner',
  'Performance Optimizer',
  'Schema Migration Tool',
  'Log Analyzer',
  'Prompt Engineer',
  'Knowledge Extractor',
];

const LINEAGE_NAMES = [
  'Code Quality Tools',
  'Data Processing Suite',
  'Documentation Automation',
  'Testing Infrastructure',
  'DevOps Utilities',
];

// Sample skill code templates
const CODE_TEMPLATES = {
  'Code Review Assistant': `import { ReviewContext } from '@hermes/core';

export async function reviewCode(context: ReviewContext) {
  const { code, language, focusAreas } = context;
  
  // Analyze code for issues
  const issues = await analyzeCode(code, language);
  
  // Filter by focus areas
  const relevantIssues = issues.filter(issue => 
    focusAreas.includes(issue.type)
  );
  
  return {
    summary: \`Found \${relevantIssues.length} issues\`,
    issues: relevantIssues,
    suggestions: generateSuggestions(relevantIssues),
  };
}

function analyzeCode(code: string, language: string) {
  // Implementation varies by version
  return [];
}

function generateSuggestions(issues: any[]) {
  return issues.map(issue => ({
    issue: issue.type,
    fix: \`Consider using \${getSuggestedFix(issue.type)}\`,
  }));
}

function getSuggestedFix(type: string) {
  const fixes = {
    'complexity': 'extract functions',
    'duplication': 'create a helper',
    'naming': 'use clearer names',
  };
  return fixes[type] || 'refactor';
}`,

  'Data Analysis Pipeline': `import { DataFrame } from '@hermes/data';

export async function analyzeData(input: any) {
  const df = new DataFrame(input);
  
  // Clean and transform
  df.clean();
  df.transform();
  
  // Statistical analysis
  const stats = df.describe();
  
  // Detect anomalies
  const anomalies = detectAnomalies(df);
  
  return {
    statistics: stats,
    anomalies,
    recommendations: generateRecommendations(stats, anomalies),
  };
}

function detectAnomalies(df: any) {
  return df.rows.filter(row => isOutlier(row));
}

function isOutlier(row: any) {
  return row.value > 2 * row.stdDev;
}

function generateRecommendations(stats: any, anomalies: any[]) {
  return anomalies.length > 0
    ? ['Investigate outliers in the data']
    : ['Data looks clean'];
}`,

  'API Documentation Generator': `import { APISpec } from '@hermes/types';

export async function generateDocs(spec: APISpec) {
  const docs = {
    endpoints: spec.endpoints.map(ep => ({
      path: ep.path,
      method: ep.method,
      description: ep.description,
      parameters: ep.parameters,
      examples: generateExamples(ep),
      errors: ep.errors,
    })),
    schemas: spec.schemas,
    authentication: spec.auth,
  };
  
  return formatDocs(docs);
}

function generateExamples(endpoint: any) {
  return endpoint.parameters.map(param => ({
    param: param.name,
    example: param.example || 'N/A',
  }));
}

function formatDocs(docs: any) {
  return JSON.stringify(docs, null, 2);
}`,
};

/**
 * Generate a single skill version.
 */
function generateSkill(
  name: string,
  lineageId: string,
  version: string,
  parentVersion: string | null,
  status: Skill['status'],
  author: Skill['author'],
  createdAt: string,
  performance?: Partial<Skill['performance']>
): Skill {
  const template = CODE_TEMPLATES[name as keyof typeof CODE_TEMPLATES] || `export async function execute(input: any) {
  // Skill: ${name}
  // Version: ${version}
  return { result: 'executed', input };
}`;

  return {
    id: uuidv4(),
    name,
    description: `${name} - v${version}`,
    author,
    status,
    lineageId,
    version,
    parentVersion,
    createdAt,
    updatedAt: createdAt,
    code: template,
    metadata: {
      tags: ['auto-generated'],
      dependencies: [],
      language: 'typescript',
    },
    performance: {
      usageCount: performance?.usageCount || Math.floor(Math.random() * 500),
      successRate: performance?.successRate || 0.7 + Math.random() * 0.25,
      avgExecutionTime: performance?.avgExecutionTime || 100 + Math.random() * 400,
      evaluations: performance?.evaluations || [],
    },
  };
}

/**
 * Generate a lineage with multiple skill versions.
 */
function generateLineage(
  name: string,
  description: string,
  skillName: string,
  numVersions: number
): { lineage: Lineage; skills: Skill[]; events: EvolutionEvent[]; branchPoints: BranchPoint[] } {
  const lineageId = uuidv4();
  const now = Date.now();
  const skills: Skill[] = [];
  const events: EvolutionEvent[] = [];
  const branchPoints: BranchPoint[] = [];

  // Generate root skill
  const rootSkill = generateSkill(
    skillName,
    lineageId,
    '1.0.0',
    null,
    'active',
    'agent',
    new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString()
  );
  skills.push(rootSkill);

  events.push({
    id: uuidv4(),
    timestamp: rootSkill.createdAt,
    type: 'skill_created',
    skillId: rootSkill.id,
    lineageId,
    message: `Skill "${skillName}" created (v1.0.0)`,
    details: { initial: true },
  });

  // Generate evolution versions
  let currentParent = rootSkill.id;
  let currentParentVersion = '1.0.0';
  let lastSuccessRate = 0.75;

  for (let i = 1; i < numVersions; i++) {
    const version = `${Math.floor(i / 10) + 1}.${i % 10}.0`;
    const isImprovement = Math.random() > 0.2;
    const successRate = isImprovement
      ? Math.min(0.98, lastSuccessRate + 0.03 + Math.random() * 0.05)
      : Math.max(0.5, lastSuccessRate - 0.1 - Math.random() * 0.1);

    const skill = generateSkill(
      skillName,
      lineageId,
      version,
      currentParentVersion,
      isImprovement ? 'active' : 'evolving',
      'agent',
      new Date(now - (30 - i * 2) * 24 * 60 * 60 * 1000).toISOString(),
      {
        usageCount: 50 + i * 30,
        successRate,
        avgExecutionTime: 200 - i * 10,
      }
    );
    skills.push(skill);
    lastSuccessRate = successRate;

    // Generate evolution event
    if (isImprovement) {
      events.push({
        id: uuidv4(),
        timestamp: skill.createdAt,
        type: 'skill_improved',
        skillId: skill.id,
        lineageId,
        message: `Skill "${skillName}" improved to v${version} (success rate: ${(successRate * 100).toFixed(1)}%)`,
        details: {
          oldVersion: currentParentVersion,
          newVersion: version,
          successRate: successRate,
          improvement: successRate - lastSuccessRate,
        },
      });
    } else {
      events.push({
        id: uuidv4(),
        timestamp: skill.createdAt,
        type: 'performance_regression',
        skillId: skill.id,
        lineageId,
        message: `Performance regression detected in "${skillName}" v${version}`,
        details: {
          oldVersion: currentParentVersion,
          newVersion: version,
          successRate: successRate,
          regression: lastSuccessRate - successRate,
        },
      });
    }

    currentParent = skill.id;
    currentParentVersion = version;
  }

  // Add a branch point
  if (numVersions > 3) {
    const branchIndex = Math.floor(numVersions / 2);
    const branchSkill = skills[branchIndex];
    const branchPoint: BranchPoint = {
      id: uuidv4(),
      lineageId,
      skillId: branchSkill.id,
      reason: 'Experimental approach to improve performance',
      createdAt: branchSkill.createdAt,
    };
    branchPoints.push(branchPoint);

    // Generate branched skill
    const branchedSkill = generateSkill(
      skillName,
      lineageId,
      `${branchIndex + 1}.0.0-experimental`,
      branchSkill.version,
      'experimental',
      'agent',
      new Date(now - (30 - branchIndex * 2 - 1) * 24 * 60 * 60 * 1000).toISOString(),
      {
        usageCount: 20,
        successRate: 0.6,
        avgExecutionTime: 150,
      }
    );
    skills.push(branchedSkill);

    events.push({
      id: uuidv4(),
      timestamp: branchedSkill.createdAt,
      type: 'branch_point',
      skillId: branchedSkill.id,
      lineageId,
      message: `Branch created from "${skillName}" v${branchSkill.version}`,
      details: {
        fromVersion: branchSkill.version,
        branchVersion: branchedSkill.version,
        reason: branchPoint.reason,
      },
    });
  }

  const lineage: Lineage = {
    id: lineageId,
    name,
    description,
    rootSkillId: rootSkill.id,
    branchPoints,
    createdAt: rootSkill.createdAt,
    status: 'active',
  };

  return { lineage, skills, events, branchPoints };
}

/**
 * Generate the complete graph structure.
 */
function generateGraph(skills: Skill[], lineages: Lineage[]): SkillGraph {
  const nodes = skills.map((skill) => ({
    id: skill.id,
    type: 'skill' as const,
    name: skill.name,
    version: skill.version,
    status: skill.status,
    description: skill.description,
    lineageId: skill.lineageId,
    parentVersion: skill.parentVersion,
  }));

  const edges = skills
    .filter((skill) => skill.parentVersion !== null)
    .map((skill) => {
      const parent = skills.find((s) => s.version === skill.parentVersion && s.lineageId === skill.lineageId);
      return {
        id: `edge-${skill.id}`,
        source: parent ? parent.id : skill.id,
        target: skill.id,
        type: 'evolution' as const,
        label: 'evolved',
      };
    });

  return { nodes, edges };
}

let store: SystemState | null = null;

/**
 * Get the current system state (singleton).
 */
export function getSystemState(): SystemState {
  if (!store) {
    store = generateSystemState();
  }
  return store;
}

/**
 * Generate complete system state with mock data.
 */
export function generateSystemState(): SystemState {
  const lineages: Lineage[] = [];
  const skills: Skill[] = [];
  const events: EvolutionEvent[] = [];

  // Generate 5 lineages with varying numbers of versions
  const lineageConfigs = [
    { name: LINEAGE_NAMES[0], desc: 'Tools for automated code quality assessment', skill: SKILL_NAMES[0], versions: 8 },
    { name: LINEAGE_NAMES[1], desc: 'Pipeline for data processing and analysis', skill: SKILL_NAMES[1], versions: 6 },
    { name: LINEAGE_NAMES[2], desc: 'Automated API documentation generation', skill: SKILL_NAMES[2], versions: 5 },
    { name: LINEAGE_NAMES[3], desc: 'Testing infrastructure and automation', skill: SKILL_NAMES[3], versions: 7 },
    { name: LINEAGE_NAMES[4], desc: 'DevOps utilities and tooling', skill: SKILL_NAMES[4], versions: 4 },
  ];

  for (const config of lineageConfigs) {
    const result = generateLineage(config.name, config.desc, config.skill, config.versions);
    lineages.push(result.lineage);
    skills.push(...result.skills);
    events.push(...result.events);
  }

  // Sort events by timestamp (newest first)
  events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const graph = generateGraph(skills, lineages);

  return { skills, lineages, events, graph };
}

/**
 * Reset the store with fresh mock data.
 */
export function resetStore(): SystemState {
  store = generateSystemState();
  return store;
}

/**
 * Simple event emitter for real-time updates.
 */
type EventListener = (state: SystemState) => void;
const listeners: Set<EventListener> = new Set();

export function subscribeToState(listener: EventListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function broadcastChange(): void {
  if (store) {
    listeners.forEach((listener) => listener(store!));
  }
}

/**
 * Inject a manual edit to a skill.
 */
export function editSkill(skillId: string, newCode: string): Skill | null {
  if (!store) {
    store = generateSystemState();
  }

  const skill = store.skills.find((s) => s.id === skillId);
  if (!skill) return null;

  // Create a new version
  const versionParts = skill.version.split('.');
  const newVersion = `${versionParts[0]}.${parseInt(versionParts[1]) + 1}.0`;

  const newSkill: Skill = {
    ...skill,
    id: uuidv4(),
    version: newVersion,
    parentVersion: skill.version,
    code: newCode,
    author: 'human',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  store.skills.push(newSkill);

  // Update graph
  store.graph.nodes.push({
    id: newSkill.id,
    type: 'skill',
    name: newSkill.name,
    version: newSkill.version,
    status: newSkill.status,
    description: newSkill.description,
    lineageId: newSkill.lineageId,
    parentVersion: newSkill.parentVersion,
  });

  store.graph.edges.push({
    id: `edge-${newSkill.id}`,
    source: skill.id,
    target: newSkill.id,
    type: 'evolution',
    label: 'edited',
  });

  // Add event
  store.events.unshift({
    id: uuidv4(),
    timestamp: newSkill.createdAt,
    type: 'manual_edit',
    skillId: newSkill.id,
    lineageId: newSkill.lineageId,
    message: `Manual edit applied to "${newSkill.name}" (v${newVersion})`,
    details: {
      oldVersion: skill.version,
      newVersion,
      author: 'human',
    },
  });

  broadcastChange();
  return newSkill;
}

/**
 * Request further evolution of a skill.
 */
export function requestEvolution(skillId: string): EvolutionEvent | null {
  if (!store) {
    store = generateSystemState();
  }

  const skill = store.skills.find((s) => s.id === skillId);
  if (!skill) return null;

  const event: EvolutionEvent = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    type: 'evolution_requested',
    skillId: skill.id,
    lineageId: skill.lineageId,
    message: `Evolution requested for "${skill.name}" (v${skill.version})`,
    details: {
      skillId: skill.id,
      currentVersion: skill.version,
    },
  };

  store.events.unshift(event);
  broadcastChange();
  return event;
}
