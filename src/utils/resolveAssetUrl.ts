/**
 * Builds a public URL for files stored as either a full URL or a path on the asset host (e.g. S3).
 * Optional override: set VITE_ASSET_BASE_URL in .env (no trailing slash).
 */
const DEFAULT_ASSET_BASE = "https://erranddo.s3.eu-west-2.amazonaws.com";

export function getAssetBaseUrl(): string {
  const fromEnv = import.meta.env.VITE_ASSET_BASE_URL as string | undefined;
  return (fromEnv && fromEnv.trim()) || DEFAULT_ASSET_BASE;
}

/** Returns empty string when path is missing (caller decides fallback image). */
export function resolveAssetUrl(path?: string | null): string {
  if (path == null) return "";
  const normalized = String(path).trim();
  if (!normalized) return "";
  if (/^https?:\/\//i.test(normalized)) return normalized;
  const base = getAssetBaseUrl().replace(/\/+$/, "");
  return `${base}/${normalized.replace(/^\/+/, "")}`;
}
