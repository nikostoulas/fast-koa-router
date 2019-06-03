import { router } from '../src/middleware';
import * as assert from 'assert';

describe('Middleware', function() {
  it('route should be called and state should be changed', async function() {
    const ctx = { path: '/foo/bar/3', method: 'GET' };
    const r = {
      get: {
        '/foo/bar/3': async function(ctx, next) {
          ctx.body = await 'body';
          await next();
        }
      }
    };

    const middleware = router(r);
    await middleware(ctx, function() {
      (ctx as any).next = true;
    });

    assert.deepEqual(ctx, {
      _matchedRoute: '/foo/bar/3',
      body: 'body',
      method: 'GET',
      params: {},
      path: '/foo/bar/3',
      next: true
    });
  });

  it('routes and policy should be called but not next', async function() {
    const ctx = { path: '/foo/bar/3', method: 'GET' };
    const r = {
      get: {
        '/foo/:id/3': [
          async function(ctx, next) {
            ctx.body = await 'body';
            await next();
          },
          async function(ctx) {
            ctx.state = await 'state';
          }
        ]
      },
      policy: {
        '/foo/bar/3': async function(ctx, next) {
          (ctx as any).policy = true;
          await next();
        }
      }
    };

    const middleware = router(r);
    await middleware(ctx, function() {
      (ctx as any).next = true;
    });

    assert.deepEqual(ctx, {
      _matchedRoute: '/foo/:id/3',
      body: 'body',
      method: 'GET',
      params: { id: 'bar' },
      policy: true,
      state: 'state',
      path: '/foo/bar/3'
    });
  });

  it('if nothing matches next is called', async function() {
    const ctx = { path: '/foo/bar/not-found', method: 'GET' };
    const r = {
      get: {
        '/foo/:id/3': async function(ctx) {
          ctx.body = await 'body';
        }
      },
      policy: {
        '/foo/bar/3': async function(ctx, next) {
          (ctx as any).policy = true;
          await next();
        }
      }
    };

    const middleware = router(r);
    await middleware(ctx, function() {
      (ctx as any).next = true;
    });

    assert.deepEqual(ctx, {
      _matchedRoute: undefined,
      method: 'GET',
      params: {},
      next: true,
      path: '/foo/bar/not-found'
    });
  });
});
