/**
 * How many pros have purchased a slot on this user request (max 4 in UI).
 * Prefer API `leads_count` (total across all pros). Do not rely on `leads[]` alone —
 * detail API may return only the current pro's lead rows.
 */
export function getLeadPurchaseSlotCount(
  detail:
    | { leads_count?: number | string | null; leads?: unknown[] | null }
    | null
    | undefined
): number {
  if (!detail) return 0;
  const raw = detail.leads_count;
  if (typeof raw === "number" && !Number.isNaN(raw)) {
    return Math.min(4, Math.max(0, raw));
  }
  if (typeof raw === "string" && raw.trim() !== "") {
    const n = parseInt(raw, 10);
    if (!Number.isNaN(n)) return Math.min(4, Math.max(0, n));
  }
  if (Array.isArray(detail.leads)) {
    return Math.min(4, Math.max(0, detail.leads.length));
  }
  return 0;
}
