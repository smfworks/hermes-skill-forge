import { NextRequest, NextResponse } from "next/server";
import { branchFromSkill } from "@/lib/mock-data";

/**
 * POST /api/branch
 * Create a new branch from a specific skill version.
 *
 * Body: { skillId: string, reason: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { skillId, reason } = body;

    if (!skillId || typeof skillId !== "string") {
      return NextResponse.json(
        { error: "skillId is required" },
        { status: 400 }
      );
    }

    if (!reason || typeof reason !== "string" || reason.trim().length === 0) {
      return NextResponse.json(
        { error: "reason is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    const result = branchFromSkill(skillId, reason.trim());
    if (!result) {
      return NextResponse.json(
        { error: "Skill not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      skill: result.skill,
      branchPoint: result.branchPoint,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create branch" },
      { status: 500 }
    );
  }
}
