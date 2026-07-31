/**
 * Shared auth session helpers for erranddo-web.
 * Token may be a plain Sanctum string ("id|plain") or a JSON blob with `.token`.
 */

const AUTH_KEYS = [
  "token",
  "role",
  "data",
  "isLoggedIn",
  "email",
  "mobile_number",
  "pending_request_data",
  "pending_request_token",
] as const;

const FLOW_KEYS = ["service", "post_code", "question"] as const;

export function getBearerToken(): string | null {
  const raw = localStorage.getItem("token");
  if (!raw || raw === "{}" || !raw.trim()) return null;

  let parsed = raw.trim();
  try {
    const obj = JSON.parse(raw);
    if (obj && typeof obj === "object" && obj.token) {
      parsed = String(obj.token).trim();
    }
  } catch {
    // plain token string
  }

  if (!parsed || parsed === "{}") return null;
  return parsed;
}

export function clearAuthStorage(options?: { clearServiceFlow?: boolean }) {
  for (const key of AUTH_KEYS) {
    localStorage.removeItem(key);
  }
  if (options?.clearServiceFlow !== false) {
    for (const key of FLOW_KEYS) {
      localStorage.removeItem(key);
    }
  }
}

let authExpiredLock = false;

/** Call on API 401 — clears local session once and notifies auth contexts. */
export function handleAuthExpired() {
  if (authExpiredLock) return;
  authExpiredLock = true;
  clearAuthStorage();
  window.dispatchEvent(new CustomEvent("auth:expired"));
  window.setTimeout(() => {
    authExpiredLock = false;
  }, 3000);
}
