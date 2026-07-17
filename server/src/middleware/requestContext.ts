import { randomUUID } from 'node:crypto';
import type { RequestHandler } from 'express';

export const requestContext: RequestHandler = (request, response, next) => {
  const requestId = request.header('x-request-id')?.slice(0, 128) || randomUUID();
  request.requestId = requestId;
  response.setHeader('x-request-id', requestId);
  next();
};
