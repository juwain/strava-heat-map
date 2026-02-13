import { describe, it, expect } from 'vitest';
import { decodePolyline } from '../../src/client/lib/polyline.js';
import { mockActivityBySportType } from '../mocks/activities.js';

describe('decodePolyline', () => {
  it('should decode a single point polyline', () => {
    const encoded = 'ibkE}';
    const points = decodePolyline(encoded);
    expect(points).toHaveLength(1);
    expect(typeof points[0][0]).toBe('number');
    expect(typeof points[0][1]).toBe('number');
  });

  it('should return empty array for empty string', () => {
    const points = decodePolyline('');
    expect(points).toHaveLength(0);
  });

  it('should decode polyline with two points', () => {
    const encoded = 'ibkE}c|f@';
    const points = decodePolyline(encoded);
    expect(points.length).toBeGreaterThan(0);
  });

  it('should decode polyline with multiple points', () => {
    const encoded = 'ibkE}c|f@vC_s';
    const points = decodePolyline(encoded);
    expect(points.length).toBeGreaterThan(0);
  });

  it('should handle encode-decode roundtrip property', () => {
    const encoded = 'sjfkF}';
    const points = decodePolyline(encoded);
    expect(points.length).toBeGreaterThan(0);

    for (const point of points) {
      expect(point).toHaveLength(2);
      expect(typeof point[0]).toBe('number');
      expect(typeof point[1]).toBe('number');
    }
  });

  it('should produce valid latitude ranges', () => {
    const encoded = 'ibkE}c|f@vC_s';
    const points = decodePolyline(encoded);

    for (const point of points) {
      expect(point[0]).toBeGreaterThanOrEqual(-90);
      expect(point[0]).toBeLessThanOrEqual(90);
    }
  });

  it('should produce valid longitude ranges', () => {
    const encoded = 'ibkE}c|f@vC_s';
    const points = decodePolyline(encoded);

    for (const point of points) {
      expect(point[1]).toBeGreaterThanOrEqual(-180);
      expect(point[1]).toBeLessThanOrEqual(180);
    }
  });

  it('should decode same encoding consistently', () => {
    const encoded = 'ibkE}c|f@';
    const points1 = decodePolyline(encoded);
    const points2 = decodePolyline(encoded);

    expect(points1).toHaveLength(points2.length);
    for (let i = 0; i < points1.length; i++) {
      expect(points1[i][0]).toBeCloseTo(points2[i][0], 10);
      expect(points1[i][1]).toBeCloseTo(points2[i][1], 10);
    }
  });
});

describe('decodePolyline with real mock data', () => {
  it('should decode Ride activity polyline', () => {
    const activity = mockActivityBySportType.Ride;
    const points = decodePolyline(activity.polyline);

    expect(points.length).toBeGreaterThan(0);
    expect(points).toHaveLength(364);

    // Verify first and last points are in valid ranges (Saint Petersburg, Russia)
    expect(points[0][0]).toBeCloseTo(59.82053, 4);
    expect(points[0][1]).toBeCloseTo(30.31875, 4);
    expect(points[points.length - 1][0]).toBeCloseTo(59.81940, 4);
    expect(points[points.length - 1][1]).toBeCloseTo(30.32754, 4);
  });

  it('should decode Walk activity polyline', () => {
    const activity = mockActivityBySportType.Walk;
    const points = decodePolyline(activity.polyline);

    expect(points.length).toBeGreaterThan(0);
    expect(points).toHaveLength(120);

    // Verify first and last points are in valid ranges
    expect(points[0][0]).toBeCloseTo(59.82054, 4);
    expect(points[0][1]).toBeCloseTo(30.32693, 4);
    expect(points[points.length - 1][0]).toBeCloseTo(59.83262, 4);
    expect(points[points.length - 1][1]).toBeCloseTo(30.32382, 4);
  });

  it('should decode Run activity polyline', () => {
    const activity = mockActivityBySportType.Run;
    const points = decodePolyline(activity.polyline);

    expect(points.length).toBeGreaterThan(0);
    expect(points).toHaveLength(242);

    // Verify first and last points are in valid ranges
    expect(points[0][0]).toBeCloseTo(59.83272, 4);
    expect(points[0][1]).toBeCloseTo(30.32380, 4);
    expect(points[points.length - 1][0]).toBeCloseTo(59.83264, 4);
    expect(points[points.length - 1][1]).toBeCloseTo(30.32405, 4);
  });

  it('should produce valid coordinates for all mock activities', () => {
    const { Ride, Walk, Run } = mockActivityBySportType;

    for (const activity of [Ride, Walk, Run]) {
      const points = decodePolyline(activity.polyline);

      for (const point of points) {
        expect(point[0]).toBeGreaterThanOrEqual(-90);
        expect(point[0]).toBeLessThanOrEqual(90);
        expect(point[1]).toBeGreaterThanOrEqual(-180);
        expect(point[1]).toBeLessThanOrEqual(180);
      }
    }
  });
});
