import { jest } from '@jest/globals';
import { rateLimitByIp } from '../src/middlewares/rateLimitByIp.js';

function runMiddleware(middleware, ip) {
  return new Promise((resolve) => {
    middleware({ ip }, {}, (error) => resolve(error));
  });
}

describe('rateLimitByIp', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('libera requisicoes ate o limite', async () => {
    const middleware = rateLimitByIp({ windowMs: 60000, max: 2 });

    expect(await runMiddleware(middleware, '10.0.0.1')).toBeUndefined();
    expect(await runMiddleware(middleware, '10.0.0.1')).toBeUndefined();
  });

  test('bloqueia com 429 ao exceder o limite', async () => {
    const middleware = rateLimitByIp({ windowMs: 60000, max: 1 });

    await runMiddleware(middleware, '10.0.0.2');
    const error = await runMiddleware(middleware, '10.0.0.2');

    expect(error).toMatchObject({ statusCode: 429 });
  });

  test('reinicia a contagem apos a janela de tempo', async () => {
    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1000);
    const middleware = rateLimitByIp({ windowMs: 1000, max: 1 });

    expect(await runMiddleware(middleware, '10.0.0.3')).toBeUndefined();
    expect(await runMiddleware(middleware, '10.0.0.3')).toMatchObject({ statusCode: 429 });

    nowSpy.mockReturnValue(5000);
    expect(await runMiddleware(middleware, '10.0.0.3')).toBeUndefined();
  });

  test('contagem e isolada por IP', async () => {
    const middleware = rateLimitByIp({ windowMs: 60000, max: 1 });

    expect(await runMiddleware(middleware, '10.0.0.4')).toBeUndefined();
    expect(await runMiddleware(middleware, '10.0.0.5')).toBeUndefined();
  });
});
