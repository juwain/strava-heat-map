import { describe, it, expect } from 'vitest';
import { getCategory, CATEGORIES } from '../../src/client/lib/categorization.js';
import type { SportCategory } from '../../src/client/types/index.js';
import { mockActivityBySportType } from '../mocks/activities.js';

describe('getCategory', () => {
  it('should categorize Ride as bicycle', () => {
    expect(getCategory('Ride')).toBe('bicycle');
  });

  it('should categorize MountainBikeRide as bicycle', () => {
    expect(getCategory('MountainBikeRide')).toBe('bicycle');
  });

  it('should categorize GravelRide as bicycle', () => {
    expect(getCategory('GravelRide')).toBe('bicycle');
  });

  it('should categorize EBikeRide as bicycle', () => {
    expect(getCategory('EBikeRide')).toBe('bicycle');
  });

  it('should categorize VirtualRide as bicycle', () => {
    expect(getCategory('VirtualRide')).toBe('bicycle');
  });

  it('should categorize Run as running', () => {
    expect(getCategory('Run')).toBe('running');
  });

  it('should categorize TrailRun as running', () => {
    expect(getCategory('TrailRun')).toBe('running');
  });

  it('should categorize VirtualRun as running', () => {
    expect(getCategory('VirtualRun')).toBe('running');
  });

  it('should categorize Walk as walking', () => {
    expect(getCategory('Walk')).toBe('walking');
  });

  it('should categorize Hike as walking', () => {
    expect(getCategory('Hike')).toBe('walking');
  });

  it('should categorize unknown sport types as other', () => {
    expect(getCategory('UnknownSport')).toBe('other');
    expect(getCategory('Swim')).toBe('other');
    expect(getCategory('AlpineSki')).toBe('other');
    expect(getCategory('Workout')).toBe('other');
  });

  it('should be case sensitive', () => {
    expect(getCategory('ride')).toBe('other'); // lowercase
    expect(getCategory('RUN')).toBe('other'); // uppercase
  });
});

describe('CATEGORIES', () => {
  it('should have all expected categories', () => {
    expect(Object.keys(CATEGORIES)).toContain('bicycle');
    expect(Object.keys(CATEGORIES)).toContain('running');
    expect(Object.keys(CATEGORIES)).toContain('walking');
  });

  it('should have arrays of sport types for each category', () => {
    expect(Array.isArray(CATEGORIES.bicycle)).toBe(true);
    expect(Array.isArray(CATEGORIES.running)).toBe(true);
    expect(Array.isArray(CATEGORIES.walking)).toBe(true);
  });

  it('should have expected sport types for bicycle', () => {
    expect(CATEGORIES.bicycle).toContain('Ride');
    expect(CATEGORIES.bicycle).toContain('MountainBikeRide');
    expect(CATEGORIES.bicycle).toContain('GravelRide');
    expect(CATEGORIES.bicycle).toContain('EBikeRide');
    expect(CATEGORIES.bicycle).toContain('VirtualRide');
  });

  it('should have expected sport types for running', () => {
    expect(CATEGORIES.running).toContain('Run');
    expect(CATEGORIES.running).toContain('TrailRun');
    expect(CATEGORIES.running).toContain('VirtualRun');
  });

  it('should have expected sport types for walking', () => {
    expect(CATEGORIES.walking).toContain('Walk');
    expect(CATEGORIES.walking).toContain('Hike');
  });

  it('should not have overlapping sport types between categories', () => {
    const all = [
      ...CATEGORIES.bicycle,
      ...CATEGORIES.running,
      ...CATEGORIES.walking,
    ];
    const unique = new Set(all);
    expect(all.length).toBe(unique.size);
  });
});

describe('getCategory with real mock data', () => {
  it('should categorize mock Ride activity as bicycle', () => {
    const activity = mockActivityBySportType.Ride;
    expect(getCategory(activity.sport_type)).toBe('bicycle');
  });

  it('should categorize mock Walk activity as walking', () => {
    const activity = mockActivityBySportType.Walk;
    expect(getCategory(activity.sport_type)).toBe('walking');
  });

  it('should categorize mock Run activity as running', () => {
    const activity = mockActivityBySportType.Run;
    expect(getCategory(activity.sport_type)).toBe('running');
  });

  it('should have valid categories for all mock activities', () => {
    const validCategories: SportCategory[] = ['bicycle', 'running', 'walking', 'other'];
    const { Ride, Walk, Run } = mockActivityBySportType;

    for (const activity of [Ride, Walk, Run]) {
      const category = getCategory(activity.sport_type);
      expect(validCategories).toContain(category);
    }
  });
});
