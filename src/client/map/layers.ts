import type { HeatmapGradient } from '../types/index.js';

const OSM_ATTRIBUTION = '&copy; OpenStreetMap contributors';
const CARTO_ATTRIBUTION = OSM_ATTRIBUTION + ' &copy; CARTO';
const STADIA_ATTRIBUTION = OSM_ATTRIBUTION + ' &copy; Stadia Maps &copy; Stamen Design';

export interface BaseLayerConfig {
  url: string;
  attribution: string;
  maxZoom: number;
}

export const BASE_LAYERS: Record<string, BaseLayerConfig> = {
  'Dark Matter': {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: CARTO_ATTRIBUTION,
    maxZoom: 19,
  },
  Positron: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: CARTO_ATTRIBUTION,
    maxZoom: 19,
  },
  Voyager: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: CARTO_ATTRIBUTION,
    maxZoom: 19,
  },
  OSM: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: OSM_ATTRIBUTION,
    maxZoom: 19,
  },
  Toner: {
    url: 'https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.png',
    attribution: STADIA_ATTRIBUTION,
    maxZoom: 19,
  },
  Terrain: {
    url: 'https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png',
    attribution: STADIA_ATTRIBUTION,
    maxZoom: 18,
  },
  OpenTopoMap: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: OSM_ATTRIBUTION + ' &copy; OpenTopoMap',
    maxZoom: 17,
  },
};

export const GRADIENTS: Record<string, HeatmapGradient> = {
  all: {
    0.3: '#2b1ac1',
    0.5: '#a033c0',
    0.7: '#e06070',
    0.9: '#f0c050',
    1.0: '#f5e080',
  },
  bicycle: {
    0.3: '#1a5eb0',
    0.5: '#4a9ad8',
    0.7: '#7ec4f0',
    0.9: '#b0e0ff',
    1.0: '#d4eeff',
  },
  running: {
    0.3: '#b84000',
    0.5: '#e07030',
    0.7: '#f0a060',
    0.9: '#f8cc80',
    1.0: '#fde4b0',
  },
  walking: {
    0.3: '#1a6030',
    0.5: '#40a060',
    0.7: '#70d090',
    0.9: '#a8e8b8',
    1.0: '#d0f5d8',
  },
};

export const LINE_COLORS: Record<string, string> = {
  bicycle: '#00bfff',
  running: '#ff4500',
  walking: '#00e850',
  other: '#d4d4d4',
};
