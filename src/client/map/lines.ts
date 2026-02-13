import type { Activity } from '../types/index.js';
import { decodePolyline } from '../lib/polyline.js';
import { getCategory } from '../lib/categorization.js';
import { LINE_COLORS } from './layers.js';

export interface LinesRenderOptions {
  filter: string;
  activities: Activity[];
  map: L.Map;
  heatLayer: L.HeatLayerObject | null;
  linesLayer: L.LayerGroup | null;
  initialFitDone: boolean;
}

export interface LinesRenderResult {
  linesLayer: L.LayerGroup | null;
  initialFitDone: boolean;
}

/**
 * Render activities as polylines on the map.
 */
export function renderLines(options: LinesRenderOptions): LinesRenderResult {
  const { map, heatLayer, linesLayer, filter, activities, initialFitDone } = options;

  if (linesLayer) {
    map.removeLayer(linesLayer);
  }
  if (heatLayer) {
    map.removeLayer(heatLayer);
  }

  const filtered =
    filter === 'all'
      ? activities
      : activities.filter((a) => getCategory(a.sport_type) === filter);

  const lines: L.Polyline[] = [];
  const bounds: L.LatLngExpression[] = [];

  for (const act of filtered) {
    const decoded = decodePolyline(act.polyline);
    if (decoded.length === 0) continue;

    const cat = getCategory(act.sport_type);
    const color = LINE_COLORS[cat] || LINE_COLORS.other;
    lines.push(L.polyline(decoded as L.LatLngExpression[], { color, weight: 2, opacity: 0.6 }));

    for (const p of decoded) {
      bounds.push([p[0], p[1]]);
    }
  }

  if (lines.length === 0) {
    return { linesLayer: null, initialFitDone };
  }

  const newLinesLayer = L.layerGroup(lines).addTo(map);

  let newInitialFitDone = initialFitDone;
  if (!initialFitDone) {
    map.fitBounds(L.latLngBounds(bounds as L.LatLngExpression[]));
    newInitialFitDone = true;
  }

  return { linesLayer: newLinesLayer, initialFitDone: newInitialFitDone };
}
