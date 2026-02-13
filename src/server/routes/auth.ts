import type { FastifyInstance } from 'fastify';
import type { StravaConfig } from '../services/strava.js';
import { exchangeTokenForAccessToken } from '../services/strava.js';

export function registerAuthRoutes(
  fastify: FastifyInstance,
  config: StravaConfig,
): void {
  fastify.get('/auth', async (request, reply) => {
    const url = new URL('https://www.strava.com/oauth/authorize');
    url.searchParams.set('client_id', config.clientId);
    url.searchParams.set('redirect_uri', config.redirectUri);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', 'activity:read_all');
    return reply.redirect(url.toString());
  });

  fastify.get('/auth/callback', async (request, reply) => {
    const { code } = request.query as { code?: string };
    if (!code) {
      return reply.status(400).send({ error: 'Missing code parameter' });
    }

    try {
      await exchangeTokenForAccessToken(code, config);
      return reply.redirect('/');
    } catch (error) {
      request.log.error({ error }, 'Token exchange failed');
      return reply.status(502).send({ error: 'Token exchange failed' });
    }
  });
}
