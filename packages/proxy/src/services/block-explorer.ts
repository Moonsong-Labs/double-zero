import type { FastifyReply } from 'fastify';
import { HttpHeader } from 'fastify/types/utils.js';

export async function pipeGetRequest(url: string, reply: FastifyReply) {
  const response = await fetch(url);

  addPipedHeader('content-type', reply, response);
  addPipedHeader('content-length', reply, response);

  return reply.send(response.body);
}

export async function pipePostRequest(
  url: string,
  body: object,
  reply: FastifyReply,
) {
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });

  addPipedHeader('content-type', reply, response);
  addPipedHeader('content-length', reply, response);

  return reply.send(response.body);
}

export function addPipedHeader(
  header: HttpHeader,
  reply: FastifyReply,
  response: Response,
) {
  const value = response.headers.get(header);
  if (value) {
    reply.header(header, value);
  }
}
