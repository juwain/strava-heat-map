import 'dotenv/config';
import fastify from 'fastify';
import path from 'node:path';
import { authGuard } from './middleware/auth.js';
import { registerAuthRoutes } from './routes/auth.js';
import { registerApiRoutes } from './routes/api.js';

const { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, REDIRECT_URI } = process.env;

if (!STRAVA_CLIENT_ID || !STRAVA_CLIENT_SECRET || !REDIRECT_URI) {
  throw new Error(
    'Missing required environment variables: STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, REDIRECT_URI',
  );
}

const server = fastify({ logger: true });

// Serve static files
await server.register(import('@fastify/static'), {
  root: path.join(process.cwd(), 'public'),
});

// Register routes
registerAuthRoutes(server, {
  clientId: STRAVA_CLIENT_ID,
  clientSecret: STRAVA_CLIENT_SECRET,
  redirectUri: REDIRECT_URI,
});
registerApiRoutes(server, {
  clientId: STRAVA_CLIENT_ID,
  clientSecret: STRAVA_CLIENT_SECRET,
  redirectUri: REDIRECT_URI,
});

// Auth guard for /api/* routes
server.addHook('onRequest', authGuard);

// Start server
server.listen({ port: 3000 }, (err) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});
