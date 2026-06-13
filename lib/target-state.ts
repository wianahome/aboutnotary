/**
 * Normalizes target_state values from Supabase / n8n automations.
 * Treats null, undefined, empty strings, and literal "NULL" as absent.
 */
export function normalizeTargetState(
  value: string | null | undefined,
): string | null {
  if (value == null) {
    return null;
  }

  const trimmed = String(value).trim();

  if (trimmed === "" || trimmed.toUpperCase() === "NULL") {
    return null;
  }

  return trimmed;
}

export function isTargetStatePresent(
  value: string | null | undefined,
): value is string {
  return normalizeTargetState(value) !== null;
}

export function resolveTargetStateLabel(
  value: string | null | undefined,
  fallback = "General US",
): string {
  return normalizeTargetState(value) ?? fallback;
}
