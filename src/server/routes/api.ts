import type { FastifyInstance } from 'fastify';
import type { StravaConfig } from '../services/strava.js';
import { fetchNewActivities } from '../services/strava.js';
import { readActivities } from '../services/storage.js';

export function registerApiRoutes(
  fastify: FastifyInstance,
  config: StravaConfig,
): void {
  fastify.get('/api/activities', async () => {
    return readActivities();
  });

  fastify.post('/api/sync', async (request) => {
    return fetchNewActivities(config, request.log);
  });
}
