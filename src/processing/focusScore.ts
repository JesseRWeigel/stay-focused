/**
 * Focus score processing utilities.
 *
 * For headsets with native focus metrics (Neurosity), we pass through directly.
 * For raw-data headsets, we'll compute focus from theta/beta ratio here.
 * This is a placeholder for Phase 2 when more headsets are added.
 */

export interface FocusThresholds {
  /** Below this value, user is considered unfocused (triggers alerts) */
  low: number;
  /** Above this value, user is in high focus / flow state */
  high: number;
}

export const DEFAULT_THRESHOLDS: FocusThresholds = {
  low: 0.2,
  high: 0.7,
};

export function getFocusLevel(
  score: number,
  thresholds: FocusThresholds = DEFAULT_THRESHOLDS
): 'low' | 'medium' | 'high' {
  if (score < thresholds.low) return 'low';
  if (score >= thresholds.high) return 'high';
  return 'medium';
}

/**
 * Compute focus from theta/beta band power ratio.
 * Higher beta relative to theta generally indicates more focused attention.
 * Returns a normalized 0-1 score.
 */
export function focusFromBandPower(theta: number, beta: number): number {
  if (theta === 0 && beta === 0) return 0.5;
  const ratio = beta / (theta + beta);
  return Math.max(0, Math.min(1, ratio));
}
