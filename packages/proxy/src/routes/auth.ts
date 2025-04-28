import type { FastifyApp } from '../app.js';
import { generateNonce, SiweMessage } from 'siwe';
import {
  deleteAuthSession,
  readAuthSession,
  saveAuthSession,
} from '../services/auth-session.js';
import { getUserOrThrow } from '../services/user.js';
import { env } from '../env.js';
import { addressSchema } from '../utils/schemas.js';
import { z } from 'zod';
import { pipePostRequest } from '../services/block-explorer.js';

export default function authRoutes(app: FastifyApp) {
  app.get('/nonce', async (req, reply) => {
    const nonce = generateNonce();
    saveAuthSession(req, { nonce });
    reply.type('text/plain');
    return nonce;
  });

  app.post('/verify', async (req, reply) => {
    try {
      // biome-ignore lint/suspicious/noExplicitAny: validation is performed by siwe
      const { message, signature } = req.body as any;

      const siweMessage = new SiweMessage(message);
      const siwe = await siweMessage.verify({ signature });
      const session = readAuthSession(req);

      if (siwe.data.nonce !== session.nonce) {
        app.log.warn('Invalid nonce.');
        return reply.status(422).send({ message: 'Invalid nonce.' });
      }

      saveAuthSession(req, { siwe });
      return reply.send({ ok: true });
    } catch (err) {
      app.log.warn(err, 'Failed to verify signed message.');
      return reply
        .status(400)
        .send({ message: 'Failed to verify signed message.' });
    }
  });

  app.get('/logout', async (req, reply) => {
    deleteAuthSession(req);
    return reply.status(204).send();
  });

  app.get('/token', async (req, reply) => {
    const user = getUserOrThrow(req);
    return pipePostRequest(
      env.USER_TOKEN_URL,
      {
        address: user,
        secret: app.conf.createTokenSecret,
      },
      reply,
    );
  });

  app.get('/user', async (req, reply) => {
    const user = getUserOrThrow(req);
    return reply.send({ address: user });
  });

  // We define this routes only in development.
  if (env.NODE_ENV === 'development') {
    const becomesOpts = {
      schema: { querystring: z.object({ address: addressSchema }) },
    };
    app.get('/sudo', becomesOpts, async (req, _reply) => {
      try {
        saveAuthSession(req, {
          siwe: {
            success: true,
            data: new SiweMessage({
              address: req.query.address,
              domain: 'localhost',
              uri: 'http://localhost:3000',
              version: '1',
            }),
          },
        });
      } catch (e) {
        console.error(e);
      }
      return 'ok';
    });
  }
}
