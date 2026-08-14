import { NextRequest, NextResponse } from "next/server";
import { branchFromSkill } from "@/lib/mock-data";
import { parseBranchBody } from "@/lib/branch";

export async function POST(request: NextRequest) {
  try {
    const parsed = parseBranchBody(await request.json());
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }
    const result = branchFromSkill(parsed.skillId, parsed.reason);
    if (!result) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      skill: result.skill,
      branchPoint: result.branchPoint,
    });
  } catch {
    return NextResponse.json({ error: "Failed to create branch" }, { status: 500 });
  }
}
