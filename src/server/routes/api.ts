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

  fastify.post('/api/sync', async (request, reply) => {
    try {
      return await fetchNewActivities(config, request.log);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      request.log.error({ error: err }, 'Sync failed');

      // Return 401 for authentication errors, 500 for others
      if (
        message.includes('Not authenticated') ||
        message.includes('Token refresh failed') ||
        message.includes('Strava API error 401')
      ) {
        return reply.status(401).send({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Authentication failed. Please re-connect your Strava account.',
        });
      }

      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: message || 'Sync failed',
      });
    }
  });
}
