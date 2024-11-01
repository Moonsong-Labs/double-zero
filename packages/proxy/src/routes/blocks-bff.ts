import type { FastifyApp } from '../app.js';
import { buildUrl } from '../utils/url.js';
import { z } from 'zod';
import { pipeRequest } from '../services/block-explorer.js';

const blocksIndexSchema = {
  schema: {
    querystring: z.object({
      fromDate: z.optional(z.string()),
      toDate: z.optional(z.string()),
      page: z.optional(z.coerce.number()),
      limit: z.optional(z.coerce.number()),
    }),
  },
};

const blocksDetailSchema = {
  schema: {
    params: z.object({
      blockNumber: z.coerce.number(),
    }),
  },
};

export function blocksRoutes(app: FastifyApp) {
  app.get('/', blocksIndexSchema, async (req, reply) => {
    const targetUrl = buildUrl(`${app.conf.proxyTarget}/blocks`, req.query);
    return pipeRequest(targetUrl, reply);
  });

  app.get('/:blockNumber', blocksDetailSchema, async (_req, reply) => {
    const targetUrl = buildUrl(`${app.conf.proxyTarget}/blocks`, {});
    return pipeRequest(targetUrl, reply);
  });
}