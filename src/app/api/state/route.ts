import { NextResponse } from "next/server";
import { getSystemState } from "@/lib/mock-data";

export async function GET() {
  const state = getSystemState();
  return NextResponse.json({
    skills: state.skills,
    lineages: state.lineages,
    events: state.events,
    graph: state.graph,
  });
}
