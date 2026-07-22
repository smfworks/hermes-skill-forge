/**
 * Hermes Skill Forge — Export Utilities
 *
 * Utilities for exporting skills as reusable packages.
 */

import type { Skill, Lineage, EvaluationResult, SkillPackage } from "@/lib/types";

/**
 * Export a skill and its lineage as a reusable package.
 */
export function exportSkillPackage(
  skill: Skill,
  lineage: Lineage,
  allSkills: Skill[]
): SkillPackage {
  // Get all versions in this lineage
  const lineageSkills = allSkills.filter((s) => s.lineageId === lineage.id);

  // Sort by creation date
  const sortedSkills = lineageSkills.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // Collect all evaluations
  const evaluations: EvaluationResult[] = [];
  for (const s of lineageSkills) {
    evaluations.push(...s.performance.evaluations);
  }

  return {
    name: skill.name,
    description: skill.description,
    version: skill.version,
    author: skill.author,
    code: skill.code,
    metadata: skill.metadata,
    lineage: {
      name: lineage.name,
      description: lineage.description,
      versions: sortedSkills.map((s) => ({
        version: s.version,
        code: s.code,
        createdAt: s.createdAt,
        author: s.author,
      })),
    },
    evaluations,
  };
}

/**
 * Generate a download URL for a skill package.
 */
export function generateDownloadUrl(pkg: SkillPackage): string {
  const blob = new Blob([JSON.stringify(pkg, null, 2)], {
    type: "application/json",
  });
  return URL.createObjectURL(blob);
}

/**
 * Generate a formatted export string for display.
 */
export function formatExportString(pkg: SkillPackage): string {
  return JSON.stringify(pkg, null, 2);
}

/**
 * Generate export metadata for the package header.
 */
export function generateExportMetadata(pkg: SkillPackage): Record<string, unknown> {
  return {
    name: pkg.name,
    description: pkg.description,
    version: pkg.version,
    author: pkg.author,
    exportedAt: new Date().toISOString(),
    lineage: pkg.lineage.name,
    totalVersions: pkg.lineage.versions.length,
    totalEvaluations: pkg.evaluations.length,
  };
}
