import type { Activity, StatsByCategory } from '../types/index.js';
import { decodePolyline } from '../lib/polyline.js';
import { getCategory } from '../lib/categorization.js';
import { polylineDistanceKm } from '../lib/geo.js';
import { LINE_COLORS } from '../map/layers.js';

const STAT_LABELS: Record<string, string> = {
  bicycle: 'Bicycle',
  running: 'Running',
  walking: 'Walking',
  other: 'Other',
};

/**
 * Format a distance in kilometers as a string.
 */
export function formatKm(km: number): string {
  return Math.round(km) + ' km';
}

/**
 * Calculate distance statistics by category from activities.
 */
export function calculateStats(activities: Activity[]): StatsByCategory {
  const kmByCategory: StatsByCategory = { bicycle: 0, running: 0, walking: 0, other: 0 };

  for (const act of activities) {
    const cat = getCategory(act.sport_type);
    const points = decodePolyline(act.polyline);
    kmByCategory[cat] += polylineDistanceKm(points);
  }

  return kmByCategory;
}

/**
 * Update the stats panel in the DOM with activity statistics.
 */
export function updateStats(activities: Activity[]): void {
  const statsEl = document.getElementById('stats');
  if (!statsEl) return;

  if (activities.length === 0) {
    statsEl.style.display = 'none';
    return;
  }

  const kmByCategory = calculateStats(activities);
  let html = '';

  for (const cat of ['bicycle', 'running', 'walking', 'other'] as const) {
    const km = kmByCategory[cat];
    if (km === 0) continue;
    html += `<div class="stat-row">
      <span><span class="stat-dot" style="background:${LINE_COLORS[cat]}"></span>${STAT_LABELS[cat]}</span>
      <span class="stat-km">${formatKm(km)}</span>
    </div>`;
  }

  const total = kmByCategory.bicycle + kmByCategory.running + kmByCategory.walking + kmByCategory.other;
  html += `<div class="stat-row stat-total">
    <span>Total</span>
    <span class="stat-km">${formatKm(total)}</span>
  </div>`;

  statsEl.innerHTML = html;
  statsEl.style.display = 'block';
}
