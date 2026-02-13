export interface StravaToken {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  athlete: { id: number; username: string; [key: string]: unknown };
}

export interface StravaActivity {
  id: number;
  sport_type: string;
  start_date: string;
  map: { summary_polyline?: string; [key: string]: unknown };
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
