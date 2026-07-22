import { NextRequest, NextResponse } from "next/server";
import { getSystemState } from "@/lib/mock-data";
import { exportSkillPackage, formatExportString, generateExportMetadata } from "@/lib/export-utils";

/**
 * GET /api/export?skillId=xxx
 * Export a skill as a reusable package.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const skillId = searchParams.get("skillId");

  if (!skillId) {
    return NextResponse.json(
      { error: "skillId parameter is required" },
      { status: 400 }
    );
  }

  const state = getSystemState();
  const skill = state.skills.find((s) => s.id === skillId);
  const lineage = state.lineages.find((l) => l.id === skill?.lineageId);

  if (!skill || !lineage) {
    return NextResponse.json(
      { error: "Skill or lineage not found" },
      { status: 404 }
    );
  }

  const pkg = exportSkillPackage(skill, lineage, state.skills);

  return NextResponse.json({
    package: pkg,
    metadata: generateExportMetadata(pkg),
    formatted: formatExportString(pkg),
  });
}
