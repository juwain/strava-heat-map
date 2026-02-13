import type { StravaToken, StravaActivity, Activity, SyncResult } from '../types/strava.js';
import type { FastifyLoggerInstance } from 'fastify';
import { readTokens, writeTokens, readActivities, writeActivities } from './storage.js';

const STRAVA_OAUTH_TOKEN_URL = 'https://www.strava.com/api/v3/oauth/token';
const STRAVA_ACTIVITIES_URL = 'https://www.strava.com/api/v3/athlete/activities';
const TOKEN_EXPIRY_BUFFER_SECONDS = 300;
const ACTIVITIES_PER_PAGE = 200;
const RATE_LIMIT_SHORT_THRESHOLD = 90;
const RATE_LIMIT_DAILY_THRESHOLD = 900;

export interface StravaConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export async function exchangeTokenForAccessToken(
  code: string,
  config: StravaConfig,
): Promise<StravaToken> {
  const response = await fetch(STRAVA_OAUTH_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      grant_type: 'authorization_code',
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Token exchange failed: ${response.status} ${body}`);
  }

  const tokens = (await response.json()) as StravaToken;
  await writeTokens(tokens);
  return tokens;
}

export async function refreshAccessToken(
  refreshToken: string,
  config: StravaConfig,
): Promise<string> {
  const response = await fetch(STRAVA_OAUTH_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Token refresh failed: ${response.status} ${body}`);
  }

  const refreshed = (await response.json()) as StravaToken;
  await writeTokens(refreshed);
  return refreshed.access_token;
}

export async function getAccessToken(config: StravaConfig): Promise<string | null> {
  const tokens = await readTokens();
  if (!tokens) {
    return null;
  }

  const now = Math.floor(Date.now() / 1000);

  // Refresh if expiring within buffer seconds
  if (tokens.expires_at - now < TOKEN_EXPIRY_BUFFER_SECONDS) {
    return refreshAccessToken(tokens.refresh_token, config);
  }

  return tokens.access_token;
}

export async function fetchNewActivities(
  config: StravaConfig,
  logger: FastifyLoggerInstance,
): Promise<SyncResult> {
  const accessToken = await getAccessToken(config);
  if (!accessToken) {
    throw new Error('Not authenticated');
  }

  const cache = await readActivities();
  const existingIds = new Set(cache.activities.map((a) => a.id));
  const newActivities: Activity[] = [];
  let page = 1;
  let keepGoing = true;

  while (keepGoing) {
    const url = new URL(STRAVA_ACTIVITIES_URL);
    url.searchParams.set('after', String(cache.lastFetchedAt));
    url.searchParams.set('page', String(page));
    url.searchParams.set('per_page', String(ACTIVITIES_PER_PAGE));

    const response = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Strava API error ${response.status}: ${body}`);
    }

    // Check rate limits
    const rateLimitUsage = response.headers.get('x-ratelimit-usage');
    if (rateLimitUsage) {
      const [shortTerm, daily] = rateLimitUsage.split(',').map(Number);
      if (shortTerm >= RATE_LIMIT_SHORT_THRESHOLD || daily >= RATE_LIMIT_DAILY_THRESHOLD) {
        logger.warn({ shortTerm, daily }, 'Approaching rate limits, stopping fetch');
        keepGoing = false;
      }
    }

    const activities = (await response.json()) as StravaActivity[];
    if (activities.length === 0) {
      break;
    }

    for (const act of activities) {
      const polyline = act.map?.summary_polyline;
      if (!polyline) {
        continue; // skip indoor / no GPS
      }
      if (existingIds.has(act.id)) {
        continue; // deduplicate
      }

      existingIds.add(act.id);
      newActivities.push({
        id: act.id,
        sport_type: act.sport_type,
        start_date: act.start_date,
        polyline,
      });
    }

    if (activities.length < ACTIVITIES_PER_PAGE) {
      break; // last page
    }
    page++;
  }

  cache.activities.push(...newActivities);
  cache.lastFetchedAt = Math.floor(Date.now() / 1000);
  await writeActivities(cache);

  return { added: newActivities.length, total: cache.activities.length };
}
