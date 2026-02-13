import type { DisplayMode } from '../types/index.js';

const MODE_TOGGLE_CLASS = 'mode-toggle';
const FILTER_TOGGLE_CLASS = 'toggle';
const BASEMAP_STORAGE_KEY = 'heatmap-basemap';
const MODE_STORAGE_KEY = 'heatmap-mode';

export interface ControlsState {
  activeFilter: string;
  activeMode: DisplayMode;
  onModeChange: (mode: DisplayMode) => void;
  onFilterChange: (filter: string) => void;
}

/**
 * Get the saved base layer name from localStorage.
 */
export function getSavedBaseLayer(): string | null {
  return localStorage.getItem(BASEMAP_STORAGE_KEY);
}

/**
 * Get the saved display mode from localStorage.
 */
export function getSavedMode(): DisplayMode {
  const saved = localStorage.getItem(MODE_STORAGE_KEY);
  return (saved === 'heatmap' || saved === 'lines') ? saved : 'heatmap';
}

/**
 * Save the current display mode to localStorage.
 */
export function saveMode(mode: DisplayMode): void {
  localStorage.setItem(MODE_STORAGE_KEY, mode);
}

/**
 * Initialize the mode toggle buttons.
 */
export function initModeToggle(state: ControlsState): void {
  const buttons = document.querySelectorAll(`.${MODE_TOGGLE_CLASS}`);

  // Set initial active state
  buttons.forEach((btn) => {
    const button = btn as HTMLButtonElement;
    if (button.dataset.mode === state.activeMode) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });

  // Add click handlers
  buttons.forEach((btn) => {
    const button = btn as HTMLButtonElement;
    button.addEventListener('click', () => {
      const mode = button.dataset.mode as DisplayMode;
      if (!mode || (mode !== 'heatmap' && mode !== 'lines')) return;

      // Update UI
      buttons.forEach((b) => b.classList.remove('active'));
      button.classList.add('active');

      // Save and notify
      saveMode(mode);
      state.activeMode = mode;
      state.onModeChange(mode);
    });
  });
}

/**
 * Initialize the sport-type filter toggle buttons.
 */
export function initFilterToggle(state: ControlsState): void {
  const buttons = document.querySelectorAll(`.${FILTER_TOGGLE_CLASS}`);

  buttons.forEach((btn) => {
    const button = btn as HTMLButtonElement;
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      if (!filter) return;

      // Update UI
      buttons.forEach((b) => b.classList.remove('active'));
      button.classList.add('active');

      // Notify
      state.activeFilter = filter;
      state.onFilterChange(filter);
    });
  });
}

/**
 * Initialize all control buttons.
 */
export function initControls(state: ControlsState): void {
  initModeToggle(state);
  initFilterToggle(state);
}
