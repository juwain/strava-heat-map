const EARTH_RADIUS_KM = 6371;

/**
 * Calculate the great-circle distance between two points using the Haversine formula.
 * @param lat1 Latitude of first point in degrees
 * @param lon1 Longitude of first point in degrees
 * @param lat2 Latitude of second point in degrees
 * @param lon2 Longitude of second point in degrees
 * @returns Distance in kilometers
 */
export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Calculate the total distance of a polyline by summing distances between consecutive points.
 * @param points Array of [lat, lng] tuples
 * @returns Total distance in kilometers
 */
export function polylineDistanceKm(points: L.LatLngTuple[]): number {
  let km = 0;
  for (let i = 1; i < points.length; i++) {
    km += haversineKm(
      points[i - 1][0],
      points[i - 1][1],
      points[i][0],
      points[i][1],
    );
  }
  return km;
}
