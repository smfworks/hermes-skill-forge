import { NextRequest, NextResponse } from "next/server";
import { editSkill } from "@/lib/mock-data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const skillId = typeof body?.skillId === "string" ? body.skillId.trim() : "";
    const code = typeof body?.code === "string" ? body.code : "";
    if (!skillId) {
      return NextResponse.json({ error: "skillId is required" }, { status: 400 });
    }
    if (code.trim().length === 0) {
      return NextResponse.json({ error: "code is required" }, { status: 400 });
    }
    if (code.length > 50_000) {
      return NextResponse.json({ error: "code exceeds 50000 characters" }, { status: 400 });
    }
    const skill = editSkill(skillId, code);
    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, skill });
  } catch {
    return NextResponse.json({ error: "Failed to edit skill" }, { status: 500 });
  }
}
