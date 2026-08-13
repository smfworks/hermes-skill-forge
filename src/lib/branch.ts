export const MAX_REASON_LENGTH = 500;

export type BranchParseResult =
  | { ok: true; skillId: string; reason: string }
  | { ok: false; error: string };

export function parseBranchBody(body: unknown): BranchParseResult {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, error: "JSON object is required" };
  }
  const { skillId, reason } = body as { skillId?: unknown; reason?: unknown };
  if (typeof skillId !== "string" || skillId.trim().length === 0) {
    return { ok: false, error: "skillId is required" };
  }
  if (typeof reason !== "string" || reason.trim().length === 0) {
    return { ok: false, error: "reason is required and must be a non-empty string" };
  }
  const trimmed = reason.trim();
  if (trimmed.length > MAX_REASON_LENGTH) {
    return { ok: false, error: `reason exceeds ${MAX_REASON_LENGTH} characters` };
  }
  return { ok: true, skillId: skillId.trim(), reason: trimmed };
}
