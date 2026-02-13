import type { Activity, ActivitiesCache, DisplayMode } from './types/index.js';
import { BASE_LAYERS } from './map/layers.js';
import { renderHeatmap } from './map/heatmap.js';
import { renderLines } from './map/lines.js';
import { updateStats } from './ui/stats.js';
import { getSavedBaseLayer, getSavedMode, initControls } from './ui/controls.js';
import { initSyncButton } from './ui/sync.js';

// Global state
let heatLayer: any = null;
let linesLayer: L.LayerGroup | null = null;
let allActivities: Activity[] = [];
let activeFilter = 'all';
let activeMode: DisplayMode = getSavedMode();
let initialFitDone = false;

/**
 * Initialize the Leaflet map.
 */
function initMap(): L.Map {
  const savedBase = getSavedBaseLayer();
  const baseLayerConfig = savedBase && BASE_LAYERS[savedBase]
    ? BASE_LAYERS[savedBase]
    : BASE_LAYERS['Dark Matter'];

  const mapContainer = document.querySelector('.map') as HTMLElement;
  if (!mapContainer) {
    throw new Error('Map container not found');
  }
  const map = L.map(mapContainer).setView([51.505, -0.09], 13);

  // Add the default base layer
  const defaultLayer = L.tileLayer(baseLayerConfig.url, {
    attribution: baseLayerConfig.attribution,
    maxZoom: baseLayerConfig.maxZoom,
  });
  defaultLayer.addTo(map);

  // Create layer control with all base layers
  const baseLayers: Record<string, L.TileLayer> = {};
  for (const [name, config] of Object.entries(BASE_LAYERS)) {
    baseLayers[name] = L.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: config.maxZoom,
    });
  }

  L.control.layers(baseLayers as any, undefined, { position: 'bottomleft' }).addTo(map);

  // Save base layer preference on change
  map.on('baselayerchange', (e: any) => {
    localStorage.setItem('heatmap-basemap', e.name);
  });

  return map;
}

/**
 * Render the current view (heatmap or lines) with the active filter.
 */
function render(map: L.Map): void {
  if (allActivities.length === 0) return;

  if (activeMode === 'lines') {
    const result = renderLines({
      filter: activeFilter,
      activities: allActivities,
      map,
      heatLayer,
      linesLayer,
      initialFitDone,
    });
    linesLayer = result.linesLayer;
    heatLayer = null;
    initialFitDone = result.initialFitDone;
  } else {
    const result = renderHeatmap({
      filter: activeFilter,
      activities: allActivities,
      map,
      heatLayer,
      linesLayer,
      initialFitDone,
    });
    heatLayer = result.heatLayer;
    linesLayer = null;
    initialFitDone = result.initialFitDone;
  }

  updateStats(allActivities);
}

/**
 * Load activities from the API.
 */
async function loadActivities(map: L.Map): Promise<void> {
  try {
    const res = await fetch('/api/activities');
    if (res.status === 401) {
      const authPrompt = document.querySelector('.auth-prompt');
      const controls = document.querySelector('.controls');
      if (authPrompt) authPrompt?.classList.remove('hidden');
      if (controls) controls?.classList.add('hidden');
      return;
    }

    const data = (await res.json()) as ActivitiesCache;
    allActivities = data.activities || [];
    if (allActivities.length > 0) {
      render(map);
    }

    const statusEl = document.querySelector('.status');
    if (statusEl) {
      (statusEl as HTMLElement).textContent = `${allActivities.length} activities`;
    }
  } catch (err) {
    console.error('Failed to load activities', err);
  }
}

/**
 * Initialize the application.
 */
export function initApp(): void {
  const map = initMap();

  // Initialize controls with callbacks
  initControls({
    activeFilter,
    activeMode,
    onModeChange: (mode: DisplayMode) => {
      activeMode = mode;
      render(map);
    },
    onFilterChange: (filter: string) => {
      activeFilter = filter;
      render(map);
    },
  });

  // Initialize sync button
  initSyncButton({
    onSyncComplete: (result) => {
      if (result.added > 0) {
        loadActivities(map);
      }
    },
    onSyncError: (error) => {
      console.error('Sync failed', error);
    },
  });

  // Load initial activities
  loadActivities(map);
}
