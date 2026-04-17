/**
 * Pro aggregate review rating: display text vs star layout are separate concerns.
 * - normalize + label: raw average -> one-decimal display (business rules).
 * - stars: computed only from that one-decimal value (tenths), not from raw directly.
 */

export type ProAggregateStarLayout = {
  fullStars: number;
  hasHalfStar: boolean;
  emptyStars: number;
};

function clampRating(raw: number): number {
  if (!Number.isFinite(raw)) return 0;
  return Math.min(5, Math.max(0, raw));
}

/**
 * One-decimal display: if hundredths digit is 0, keep one decimal as-is;
 * otherwise ceil to next tenth (e.g. 4.21 -> 4.3, 4.91-4.99 -> 5.0).
 */
export function normalizeProAggregateRatingToOneDecimal(raw: number): number {
  const v = clampRating(raw);
  const n = Math.round(v * 100);
  const hundredthsDigit = n % 10;
  if (hundredthsDigit === 0) {
    return Math.round(n / 10) / 10;
  }
  const asFloat = n / 100;
  return Math.ceil(asFloat * 10 - 1e-9) / 10;
}

export function formatProAggregateRatingLabel(raw: number): string {
  return normalizeProAggregateRatingToOneDecimal(raw).toFixed(1);
}

/** Tenths integer t where displayed rating = t / 10 (e.g. 4.3 -> 43). */
function oneDecimalToTenths(d: number): number {
  const clamped = Math.min(5, Math.max(0, d));
  return Math.round(clamped * 10);
}

/**
 * Star visual from normalized one-decimal rating only (0.0, 0.1, …, 5.0).
 * Brackets per product spec (t = tenths):
 * 0; 1-7 half-step bands; 8-10 full bands; …; 41-47 -> 4.5; 48-50 -> 5.
 */
export function getProAggregateStarLayoutFromOneDecimal(d: number): ProAggregateStarLayout {
  const t = oneDecimalToTenths(d);

  if (t <= 0) {
    return { fullStars: 0, hasHalfStar: false, emptyStars: 5 };
  }

  let starUnits: number;
  if (t >= 1 && t <= 7) starUnits = 0.5;
  else if (t >= 8 && t <= 10) starUnits = 1;
  else if (t >= 11 && t <= 17) starUnits = 1.5;
  else if (t >= 18 && t <= 20) starUnits = 2;
  else if (t >= 21 && t <= 27) starUnits = 2.5;
  else if (t >= 28 && t <= 30) starUnits = 3;
  else if (t >= 31 && t <= 37) starUnits = 3.5;
  else if (t >= 38 && t <= 40) starUnits = 4;
  else if (t >= 41 && t <= 47) starUnits = 4.5;
  else if (t >= 48 && t <= 50) starUnits = 5;
  else if (t > 50) starUnits = 5;
  else starUnits = 0;

  const fullStars = Math.floor(starUnits);
  const hasHalfStar = starUnits - fullStars === 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return { fullStars, hasHalfStar, emptyStars };
}

export function getProAggregateStarLayoutFromRaw(raw: number): ProAggregateStarLayout {
  const d = normalizeProAggregateRatingToOneDecimal(raw);
  return getProAggregateStarLayoutFromOneDecimal(d);
}
