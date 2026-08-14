import { describe, expect, it } from "vitest";
import { MAX_REASON_LENGTH, parseBranchBody } from "@/lib/branch";

describe("parseBranchBody", () => {
  it("accepts a valid payload", () => {
    expect(parseBranchBody({ skillId: " abc ", reason: "  try another path  " })).toEqual({
      ok: true,
      skillId: "abc",
      reason: "try another path",
    });
  });

  it("rejects missing fields and oversize reasons", () => {
    expect(parseBranchBody(null).ok).toBe(false);
    expect(parseBranchBody({ skillId: "x" }).ok).toBe(false);
    expect(parseBranchBody({ reason: "y" }).ok).toBe(false);
    expect(parseBranchBody({ skillId: "x", reason: "   " }).ok).toBe(false);
    expect(parseBranchBody({ skillId: "x", reason: "r".repeat(MAX_REASON_LENGTH + 1) }).ok).toBe(false);
  });
});
