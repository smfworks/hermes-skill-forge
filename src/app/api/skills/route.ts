import { NextResponse } from "next/server";
import { getSystemState } from "@/lib/mock-data";

export async function GET() {
  const state = getSystemState();
  return NextResponse.json(state.skills);
}
