type ApiErrorBody = {
  message?: string;
  error?: string;
};

export function parseRateLimitMessage(
  response: Response,
  data?: ApiErrorBody | null
): string {
  if (data?.message) return data.message;

  const retryAfter = response.headers.get("Retry-After");
  if (retryAfter) {
    const seconds = Number(retryAfter);
    if (Number.isFinite(seconds) && seconds > 0) {
      return `Too many requests. Please try again in ${Math.ceil(seconds)} seconds.`;
    }
  }

  return "Too many requests. Please try again later.";
}

export function isRateLimited(response: Response): boolean {
  return response.status === 429;
}

export function getApiErrorMessage(
  response: Response,
  data?: ApiErrorBody | null,
  fallback = "Something went wrong. Please try again."
): string {
  if (isRateLimited(response)) {
    return parseRateLimitMessage(response, data);
  }
  return data?.message || data?.error || fallback;
}
