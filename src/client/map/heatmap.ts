import type { HeatPoint, Activity } from '../types/index.js';
import { decodePolyline } from '../lib/polyline.js';
import { getCategory } from '../lib/categorization.js';
import { GRADIENTS } from './layers.js';

export interface HeatmapRenderOptions {
  filter: string;
  activities: Activity[];
  map: L.Map;
  heatLayer: L.HeatLayerObject | null;
  linesLayer: L.LayerGroup | null;
  initialFitDone: boolean;
}

export interface HeatmapRenderResult {
  heatLayer: L.HeatLayerObject | null;
  initialFitDone: boolean;
}

/**
 * Render activities as a heatmap layer on the map.
 */
export function renderHeatmap(options: HeatmapRenderOptions): HeatmapRenderResult {
  const { map, heatLayer, linesLayer, filter, activities, initialFitDone } = options;

  if (heatLayer) {
    map.removeLayer(heatLayer);
  }
  if (linesLayer) {
    map.removeLayer(linesLayer);
  }

  const filtered =
    filter === 'all'
      ? activities
      : activities.filter((a) => getCategory(a.sport_type) === filter);

  const points: HeatPoint[] = [];
  const bounds: L.LatLngExpression[] = [];

  for (const act of filtered) {
    const decoded = decodePolyline(act.polyline);
    for (const p of decoded) {
      points.push([p[0], p[1], 0.5]); // lat, lng, intensity
      bounds.push([p[0], p[1]]);
    }
  }

  if (points.length === 0) {
    return { heatLayer: null, initialFitDone };
  }

  const newHeatLayer = (L as any).heatLayer(points, {
    radius: 16,
    blur: 10,
    maxZoom: 16,
    minOpacity: 0.25,
    gradient: GRADIENTS[filter] || GRADIENTS.all,
  }).addTo(map);

  let newInitialFitDone = initialFitDone;
  if (!initialFitDone) {
    map.fitBounds(L.latLngBounds(bounds as L.LatLngExpression[]));
    newInitialFitDone = true;
  }

  return { heatLayer: newHeatLayer, initialFitDone: newInitialFitDone };
}
