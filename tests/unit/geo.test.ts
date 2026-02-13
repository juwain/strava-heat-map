import { describe, it, expect } from 'vitest';
import { haversineKm, polylineDistanceKm } from '../../src/client/lib/geo.js';
import { decodePolyline } from '../../src/client/lib/polyline.js';
import { mockActivityBySportType } from '../mocks/activities.js';

describe('haversineKm', () => {
  it('should calculate distance between two points', () => {
    // Distance from NYC to LA approximately 3944 km
    const nyc = [40.7128, -74.0060] as L.LatLngTuple;
    const la = [34.0522, -118.2437] as L.LatLngTuple;
    const distance = haversineKm(nyc[0], nyc[1], la[0], la[1]);
    expect(distance).toBeCloseTo(3944, -2); // Within 100km
  });

  it('should return 0 for same point', () => {
    const point = [51.5074, -0.1278] as L.LatLngTuple;
    const distance = haversineKm(point[0], point[1], point[0], point[1]);
    expect(distance).toBe(0);
  });

  it('should calculate short distances accurately', () => {
    // Two points in London, approximately 1km apart
    const point1 = [51.5074, -0.1278] as L.LatLngTuple;
    const point2 = [51.5174, -0.1278] as L.LatLngTuple;
    const distance = haversineKm(point1[0], point1[1], point2[0], point2[1]);
    expect(distance).toBeCloseTo(1.11, 0); // Within 0.5km
  });

  it('should handle points crossing the equator', () => {
    const north = [1.0, 0.0] as L.LatLngTuple;
    const south = [-1.0, 0.0] as L.LatLngTuple;
    const distance = haversineKm(north[0], north[1], south[0], south[1]);
    expect(distance).toBeCloseTo(222, -1); // ~222km for 2 degrees latitude
  });

  it('should handle points crossing the prime meridian', () => {
    const east = [0.0, 1.0] as L.LatLngTuple;
    const west = [0.0, -1.0] as L.LatLngTuple;
    const distance = haversineKm(east[0], east[1], west[0], west[1]);
    expect(distance).toBeGreaterThan(0);
    expect(distance).toBeLessThan(300); // Should be reasonable
  });
});

describe('polylineDistanceKm', () => {
  it('should return 0 for empty array', () => {
    const points: L.LatLngTuple[] = [];
    const distance = polylineDistanceKm(points);
    expect(distance).toBe(0);
  });

  it('should return 0 for single point', () => {
    const points: L.LatLngTuple[] = [[51.5074, -0.1278]];
    const distance = polylineDistanceKm(points);
    expect(distance).toBe(0);
  });

  it('should calculate distance for two points', () => {
    const points: L.LatLngTuple[] = [
      [51.5074, -0.1278], // London
      [48.8566, 2.3522],  // Paris
    ];
    const distance = polylineDistanceKm(points);
    expect(distance).toBeCloseTo(344, -1); // ~344km London to Paris
  });

  it('should sum distances for multiple points', () => {
    const points: L.LatLngTuple[] = [
      [51.5074, -0.1278], // London
      [52.5200, 13.4050], // Berlin
      [48.8566, 2.3522],  // Paris
    ];
    const distance = polylineDistanceKm(points);
    expect(distance).toBeGreaterThan(500); // Should be substantial
    expect(distance).toBeLessThan(2000);   // But reasonable
  });

  it('should handle path along same latitude', () => {
    // Points along equator
    const points: L.LatLngTuple[] = [
      [0.0, 0.0],
      [0.0, 1.0],
      [0.0, 2.0],
    ];
    const distance = polylineDistanceKm(points);
    expect(distance).toBeCloseTo(222, -1); // ~111km per degree at equator
  });
});

describe('polylineDistanceKm with real mock data', () => {
  it('should calculate distance for Ride activity', () => {
    const activity = mockActivityBySportType.Ride;
    const points = decodePolyline(activity.polyline);
    const distance = polylineDistanceKm(points);

    expect(distance).toBeGreaterThan(0);
    expect(distance).toBeCloseTo(14.62, 1); // ~14.62 km
  });

  it('should calculate distance for Walk activity', () => {
    const activity = mockActivityBySportType.Walk;
    const points = decodePolyline(activity.polyline);
    const distance = polylineDistanceKm(points);

    expect(distance).toBeGreaterThan(0);
    expect(distance).toBeCloseTo(1.57, 1); // ~1.57 km
  });

  it('should calculate distance for Run activity', () => {
    const activity = mockActivityBySportType.Run;
    const points = decodePolyline(activity.polyline);
    const distance = polylineDistanceKm(points);

    expect(distance).toBeGreaterThan(0);
    expect(distance).toBeCloseTo(5.48, 1); // ~5.48 km
  });

  it('should calculate positive distances for all mock activities', () => {
    const { Ride, Walk, Run } = mockActivityBySportType;

    for (const activity of [Ride, Walk, Run]) {
      const points = decodePolyline(activity.polyline);
      const distance = polylineDistanceKm(points);
      expect(distance).toBeGreaterThan(0);
    }
  });
});
