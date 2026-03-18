/**
 * Parses a recommended limit string into a structured object.
 * Handles formats: "≤ 4.0", "6.5 – 8.5", "20 – 200", "0 (Absent)"
 */
export function parseLimit(limitStr) {
  if (!limitStr) return null;

  if (limitStr.includes('Absent')) {
    return { type: 'absent', max: 0 };
  }

  const rangeMatch = limitStr.match(/([\d.]+)\s*[–-]\s*([\d.]+)/);
  if (rangeMatch) {
    return { type: 'range', min: parseFloat(rangeMatch[1]), max: parseFloat(rangeMatch[2]) };
  }

  const maxMatch = limitStr.match(/[≤<]\s*([\d.]+)/);
  if (maxMatch) {
    return { type: 'max', max: parseFloat(maxMatch[1]) };
  }

  return null;
}

const EDGE_THRESHOLD = 0.15;

/**
 * Returns 'in_range', 'edge', 'out_of_range', or 'na'
 */
export function getStatus(value, limitStr) {
  if (!value || value.trim() === '') return 'na';

  if (value === '+') return 'out_of_range';

  const num = parseFloat(value);
  if (isNaN(num)) return 'na';

  const limit = parseLimit(limitStr);
  if (!limit) return 'na';

  if (limit.type === 'absent') {
    return num === 0 ? 'in_range' : 'out_of_range';
  }

  if (limit.type === 'max') {
    const edgeLine = limit.max * (1 - EDGE_THRESHOLD);
    if (num > limit.max) return 'out_of_range';
    if (num >= edgeLine) return 'edge';
    return 'in_range';
  }

  if (limit.type === 'range') {
    const lowerEdge = limit.min + (limit.max - limit.min) * EDGE_THRESHOLD;
    const upperEdge = limit.max - (limit.max - limit.min) * EDGE_THRESHOLD;

    if (num < limit.min || num > limit.max) return 'out_of_range';
    if (num < lowerEdge || num > upperEdge) return 'edge';
    return 'in_range';
  }

  return 'na';
}

/**
 * Returns a 0–100 percentage for bar width.
 */
export function getBarPercent(value, limitStr) {
  if (!value || value === '+') return 0;

  const num = parseFloat(value);
  if (isNaN(num)) return 0;

  const limit = parseLimit(limitStr);
  if (!limit) return 0;

  if (limit.type === 'absent') {
    return num > 0 ? 100 : 0;
  }

  if (limit.type === 'max') {
    const scale = limit.max * 1.3;
    return Math.min(Math.max((num / scale) * 100, 2), 100);
  }

  if (limit.type === 'range') {
    const padding = (limit.max - limit.min) * 0.3;
    const scaleMin = Math.max(0, limit.min - padding);
    const scaleMax = limit.max + padding;
    const range = scaleMax - scaleMin;
    return Math.min(Math.max(((num - scaleMin) / range) * 100, 2), 100);
  }

  return 0;
}
