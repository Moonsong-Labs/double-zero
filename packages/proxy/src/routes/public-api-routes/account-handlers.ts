import { defaultHandler, Handler } from './handlers.js';
import { z } from 'zod';
import { addressSchema } from '../../utils/schemas.js';
import { isAddressEqual } from 'viem';
import { getUserOrThrow } from '../../services/user.js';
import { buildUrl } from '../../utils/url.js';
import { HttpError } from '../../utils/http-error.js';
import { publicTxSchema, withAddressSchema } from './schemas.js';
import { paginate, passIfAddressIsCurrentUser } from './generic-handlers.js';
import { addPipedHeader } from '../../services/block-explorer.js';

const withManyAddressesSchema = z.object({
  address: z
    .string()
    .transform((s) => s.split(',').map((s) => s.trim()))
    .pipe(z.array(addressSchema)),
});

/**
 * If transactions of current user are requested, every tx can be seen.
 * Otherwise, transactions only sent or received by current user are shown.
 *
 * No successful results are returned back with no changes.
 * Pagination is hacked for the first 1000 items.
 * @param app
 * @param req
 * @param reply
 */
const txlist: Handler = async (app, req, reply) => {
  const user = getUserOrThrow(req);
  const address = withAddressSchema.parse(req.query).address;

  const url = buildUrl(`${app.conf.proxyTarget}/api`, {
    ...req.query,
    page: 1,
    offset: 1000,
  });

  const response = await fetch(url);

  if (user === address) {
    addPipedHeader('content-type', reply, response);
    addPipedHeader('content-length', reply, response);
    return reply.send(response.body);
  }

  const data = await response.json().then(publicTxSchema.parse);

  if (data.status === '0') {
    return reply.send(data);
  }

  const result = data.result.filter(
    (tx) => isAddressEqual(tx.to, user) || isAddressEqual(tx.from, user),
  );
  const filtered = {
    ...data,
    result: paginate(result, req.query.page, req.query.offset),
  };

  return reply.send(filtered);
};

/**
 * For this action we do the simplest possible check. Tx has to be from or to current user.
 * @param app
 * @param req
 * @param reply
 */
const txlistinternal: Handler = async (app, req, reply) => {
  const user = getUserOrThrow(req);

  const url = buildUrl(`${app.conf.proxyTarget}/api`, {
    ...req.query,
    page: 1,
    offset: 1000,
  });

  const data = await fetch(url)
    .then((res) => res.json())
    .then(publicTxSchema.parse);

  if (data.status === '0') {
    return reply.send(data);
  }

  const result = data.result.filter(
    (tx) => isAddressEqual(tx.to, user) || isAddressEqual(tx.from, user),
  );
  const filtered = {
    ...data,
    result: paginate(result, req.query.page, req.query.offset),
  };

  return reply.send(filtered);
};

const balancemulti: Handler = async (app, req, reply) => {
  const user = getUserOrThrow(req);
  const addresses = withManyAddressesSchema.parse(req.query).address;

  if (!addresses.every((a) => isAddressEqual(a, user))) {
    throw new HttpError('Only own address can be checked', 403);
  }

  return defaultHandler(app, req, reply);
};
const balance = passIfAddressIsCurrentUser;
const tokenbalance = passIfAddressIsCurrentUser;
const tokentx = passIfAddressIsCurrentUser;
const tokennfttx = passIfAddressIsCurrentUser;
const getminedblocks = passIfAddressIsCurrentUser;

export const accountHandlers = {
  txlist,
  txlistinternal,
  balance,
  balancemulti,
  tokenbalance,
  tokentx,
  tokennfttx,
  getminedblocks,
};
