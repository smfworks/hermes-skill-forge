import { NextRequest, NextResponse } from "next/server";
import { requestEvolution } from "@/lib/mock-data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const skillId = typeof body?.skillId === "string" ? body.skillId.trim() : "";
    if (!skillId) {
      return NextResponse.json({ error: "skillId is required" }, { status: 400 });
    }
    const event = requestEvolution(skillId);
    if (!event) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, event });
  } catch {
    return NextResponse.json({ error: "Failed to request evolution" }, { status: 500 });
  }
}
