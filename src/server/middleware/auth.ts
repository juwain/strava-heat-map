import type { FastifyRequest, FastifyReply } from 'fastify';
import { tokensExist } from '../services/storage.js';

export async function authGuard(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  if (request.url.startsWith('/api/')) {
    const hasTokens = await tokensExist();
    if (!hasTokens) {
      return reply.status(401).send({ error: 'Not authenticated' });
    }
  }
}
