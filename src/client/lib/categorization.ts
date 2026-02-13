import type { SportCategory, CategoryTypes } from '../types/index.js';

export const CATEGORIES: CategoryTypes = {
  bicycle: ['Ride', 'MountainBikeRide', 'GravelRide', 'EBikeRide', 'VirtualRide'],
  running: ['Run', 'TrailRun', 'VirtualRun'],
  walking: ['Walk', 'Hike'],
};

/**
 * Get the sport category for a given Strava sport_type.
 * @param sportType The Strava sport type string
 * @returns The category ('bicycle', 'running', 'walking', or 'other')
 */
export function getCategory(sportType: string): SportCategory {
  for (const [cat, types] of Object.entries(CATEGORIES)) {
    if (types.includes(sportType)) {
      return cat as SportCategory;
    }
  }
  return 'other';
}
