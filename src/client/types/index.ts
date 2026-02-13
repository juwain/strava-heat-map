export type SportCategory = 'bicycle' | 'running' | 'walking' | 'other';

export type DisplayMode = 'heatmap' | 'lines';

export interface BaseLayer {
  url: string;
  options: { attribution: string; maxZoom: number };
}

export interface HeatmapGradient {
  [intensity: number]: string;
}

export type LatLngTuple = L.LatLngTuple;

export type HeatPoint = [number, number, number];

export interface MapBounds {
  _southWest: { lat: number; lng: number };
  _northEast: { lat: number; lng: number };
}

export interface Activity {
  id: number;
  sport_type: string;
  start_date: string;
  polyline: string;
}

export interface ActivitiesCache {
  lastFetchedAt: number;
  activities: Activity[];
}

export interface SyncResult {
  added: number;
  total: number;
}

export interface StatsByCategory {
  bicycle: number;
  running: number;
  walking: number;
  other: number;
}

export interface CategoryTypes {
  bicycle: string[];
  running: string[];
  walking: string[];
}

// Extend Leaflet types for heatmap plugin
declare global {
  namespace L {
    interface HeatLayerObject {
      setOptions(options: unknown): HeatLayerObject;
      addTo(map: L.Map): HeatLayerObject;
      remove(): void;
    }

    interface Map {
      removeLayer(layer: HeatLayerObject | LayerGroup): this;
    }
  }
}

export {};
