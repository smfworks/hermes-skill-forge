/**
 * Hermes Skill Forge — Diff Utilities
 *
 * Utilities for computing and formatting code diffs between skill versions.
 */

import { diffLines, diffWords, Change } from 'diff';

/**
 * A diff hunk representing a change between two code versions.
 */
export interface DiffHunk {
  oldStart: number;
  newStart: number;
  oldLines: string[];
  newLines: string[];
  type: 'added' | 'removed' | 'unchanged';
}

/**
 * A formatted diff result with hunks and summary.
 */
export interface DiffResult {
  hunks: DiffHunk[];
  addedLines: number;
  removedLines: number;
  changedLines: number;
  similarity: number;
}

/**
 * Compute a line-by-line diff between two code strings.
 */
export function computeLineDiff(oldCode: string, newCode: string): DiffResult {
  const changes = diffLines(oldCode, newCode);
  const hunks: DiffHunk[] = [];
  let oldLineNum = 1;
  let newLineNum = 1;
  let addedLines = 0;
  let removedLines = 0;

  for (const change of changes) {
    if (change.added) {
      hunks.push({
        oldStart: oldLineNum,
        newStart: newLineNum,
        oldLines: [],
        newLines: change.value.split('\n').filter(l => l !== ''),
        type: 'added',
      });
      addedLines += change.count || 0;
      newLineNum += change.count || 0;
    } else if (change.removed) {
      hunks.push({
        oldStart: oldLineNum,
        newStart: newLineNum,
        oldLines: change.value.split('\n').filter(l => l !== ''),
        newLines: [],
        type: 'removed',
      });
      removedLines += change.count || 0;
      oldLineNum += change.count || 0;
    } else {
      const lines = change.value.split('\n').filter(l => l !== '');
      oldLineNum += lines.length;
      newLineNum += lines.length;
    }
  }

  const totalLines = Math.max(oldLineNum, newLineNum);
  const similarity = totalLines > 0 ? 1 - (addedLines + removedLines) / totalLines : 1;

  return {
    hunks,
    addedLines,
    removedLines,
    changedLines: addedLines + removedLines,
    similarity,
  };
}

/**
 * Compute a word-level diff for inline highlighting.
 */
export function computeWordDiff(oldLine: string, newLine: string): Change[] {
  return diffWords(oldLine, newLine);
}

/**
 * Format a diff result as a unified diff string.
 */
export function formatUnifiedDiff(oldCode: string, newCode: string, oldLabel = 'old', newLabel = 'new'): string {
  const changes = diffLines(oldCode, newCode);
  let result = `--- ${oldLabel}\n+++ ${newLabel}\n`;

  for (const change of changes) {
    if (change.added) {
      for (const line of change.value.split('\n')) {
        if (line) result += `+${line}\n`;
      }
    } else if (change.removed) {
      for (const line of change.value.split('\n')) {
        if (line) result += `-${line}\n`;
      }
    } else {
      for (const line of change.value.split('\n')) {
        if (line) result += ` ${line}\n`;
      }
    }
  }

  return result;
}

/**
 * Group diff changes into hunks for display.
 */
export function groupDiffHunks(oldCode: string, newCode: string, contextLines = 3): DiffHunk[] {
  const changes = diffLines(oldCode, newCode);
  const hunks: DiffHunk[] = [];
  let currentHunk: DiffHunk | null = null;
  let oldLineNum = 1;
  let newLineNum = 1;
  let contextBuffer: string[] = [];

  for (const change of changes) {
    if (change.added || change.removed) {
      if (!currentHunk) {
        currentHunk = {
          oldStart: Math.max(1, oldLineNum - contextLines),
          newStart: Math.max(1, newLineNum - contextLines),
          oldLines: [],
          newLines: [],
          type: change.added ? 'added' : 'removed',
        };
      }

      const lines = change.value.split('\n').filter(l => l !== '');
      if (change.added) {
        currentHunk.newLines.push(...lines);
        newLineNum += lines.length;
      } else {
        currentHunk.oldLines.push(...lines);
        oldLineNum += lines.length;
      }
    } else {
      const lines = change.value.split('\n').filter(l => l !== '');
      if (currentHunk) {
        currentHunk.oldLines.push(...lines);
        currentHunk.newLines.push(...lines);
        oldLineNum += lines.length;
        newLineNum += lines.length;

        // Close hunk after context lines
        if (lines.length > contextLines) {
          hunks.push(currentHunk);
          currentHunk = null;
        }
      }
    }
  }

  if (currentHunk) {
    hunks.push(currentHunk);
  }

  return hunks;
}
