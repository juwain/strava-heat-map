import fs from 'node:fs/promises';
import path from 'node:path';
import type { StravaToken, ActivitiesCache } from '../types/strava.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const TOKENS_PATH = path.join(DATA_DIR, 'tokens.json');
const ACTIVITIES_PATH = path.join(DATA_DIR, 'activities.json');

// Ensure data directory exists
export async function ensureDataDir(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Ignore if directory already exists
  }
}

export async function readTokens(): Promise<StravaToken | null> {
  try {
    const content = await fs.readFile(TOKENS_PATH, 'utf-8');
    return JSON.parse(content) as StravaToken;
  } catch {
    return null;
  }
}

export async function writeTokens(tokens: StravaToken): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(TOKENS_PATH, JSON.stringify(tokens, null, 2));
}

export async function tokensExist(): Promise<boolean> {
  try {
    await fs.access(TOKENS_PATH);
    return true;
  } catch {
    return false;
  }
}

export async function readActivities(): Promise<ActivitiesCache> {
  try {
    const content = await fs.readFile(ACTIVITIES_PATH, 'utf-8');
    return JSON.parse(content) as ActivitiesCache;
  } catch {
    return { lastFetchedAt: 0, activities: [] };
  }
}

export async function writeActivities(cache: ActivitiesCache): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(ACTIVITIES_PATH, JSON.stringify(cache, null, 2));
}

export async function activitiesExist(): Promise<boolean> {
  try {
    await fs.access(ACTIVITIES_PATH);
    return true;
  } catch {
    return false;
  }
}
