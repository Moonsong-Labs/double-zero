import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { TestProxy } from './util/test-proxy-target.js';

describe('/blocks', () => {
  let backgroundApp: TestProxy | null = null;
  beforeAll(async () => {
    backgroundApp = new TestProxy();
    await backgroundApp.start();
  });

  afterAll(async () => {
    await backgroundApp?.stop();
  });

  beforeEach(() => {
    backgroundApp?.reset();
  });

  const secret = Buffer.alloc(32).fill(0).toString('hex');

  const testInstance = () =>
    buildApp(secret, 'development', 'http://localhost:9191', false);

  describe('GET /blocks', () => {
    it('it bypass the request ot the explorer', async () => {
      const app = testInstance();
      const res = await app.inject({
        method: 'GET',
        url: `/blocks`,
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual('From proxy');
    });
  });

  describe('GET /blocks', () => {
    it('it bypass the request ot the explorer', async () => {
      const app = testInstance();
      const res = await app.inject({
        method: 'GET',
        url: '/blocks',
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual('From proxy');
    });
  });

  describe('GET /blocks/:blockNumber', () => {
    const blockNumber = 40;
    it('it bypass the request ot the explorer', async () => {
      const app = testInstance();
      const res = await app.inject({
        method: 'GET',
        url: `/blocks/${blockNumber}`,
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual('From proxy');
    });
  });
});