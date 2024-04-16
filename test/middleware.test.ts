import { router } from '../src/middleware';
import * as assert from 'assert';

describe('Middleware', function () {
  it('route should be called and state should be changed', async function () {
    const ctx = { path: '/foo/bar/3', method: 'GET' };
    const r = {
      get: {
        '/foo/bar/3': async function (ctx, next) {
          ctx.body = await 'body';
          await next();
        }
      }
    };

    const middleware = router(r);
    await middleware(ctx, function () {
      (ctx as any).next = true;
    });

    snapshot(ctx);
  });

  it('routes and policy should be called but not next', async function () {
    const ctx = { path: '/foo/bar/3', method: 'GET' };
    const r = {
      get: {
        '/foo/:id/3': [
          async function (ctx, next) {
            ctx.body = await 'body';
            await next();
          },
          async function (ctx) {
            ctx.state = await 'state';
          }
        ]
      },
      policy: {
        '/foo/bar/3': async function (ctx, next) {
          (ctx as any).policy = true;
          await next();
        },
        '/foo/bar/:id': async function (ctx, next) {}
      }
    };

    const middleware = router(r);
    await middleware(ctx, function () {
      (ctx as any).next = true;
    });

    snapshot(ctx);
  });

  it('if nothing matches next is called', async function () {
    const ctx = { path: '/foo/bar/not-found', method: 'GET' };
    const r = {
      get: {
        '/foo/:id/3': async function (ctx) {
          ctx.body = await 'body';
        }
      },
      policy: {
        '/foo/bar/3': async function (ctx, next) {
          (ctx as any).policy = true;
          await next();
        }
      }
    };

    const middleware = router(r);
    await middleware(ctx, function () {
      (ctx as any).next = true;
    });

    snapshot(ctx);
  });

  it('routes and policy and prefix should be called but not next', async function () {
    const ctx = { path: '/foo/bar/3', method: 'GET' };
    const r = {
      get: {
        '/foo/:id/3': [
          async function (ctx, next) {
            ctx.body = await 'body';
            await next();
          },
          async function (ctx) {
            ctx.state = await 'state';
          }
        ]
      },
      policy: {
        '/foo/bar/3': async function (ctx, next) {
          (ctx as any).policy = true;
          await next();
        },
        '/foo/bar/:id': async function (ctx, next) {}
      },
      prefix: {
        '/': async function (ctx, next) {
          ctx.prefix = true;
          await next();
        }
      }
    };

    const middleware = router(r);
    await middleware(ctx, function () {
      (ctx as any).next = true;
    });

    snapshot(ctx);
  });

  it('it also exports routes', async function () {
    const ctx = { path: '/foo/bar/not-found', method: 'GET' };
    const r = {
      get: {
        '/foo/:id/3': async function (ctx) {
          ctx.body = await 'body';
        }
      },
      policy: {
        '/foo/bar/3': async function (ctx, next) {
          (ctx as any).policy = true;
          await next();
        }
      }
    };

    const middleware = router(r);

    snapshot(middleware.routes);
  });

  it('it also exports matching', async function () {
    const ctx = { path: '/foo/bar/not-found', method: 'GET' };
    const r = {
      get: {
        '/foo/:id/3': async function foo(ctx) {
          ctx.body = await 'body';
        }
      },
      policy: {
        '/foo/bar/3': async function (ctx, next) {
          (ctx as any).policy = true;
          await next();
        }
      }
    };

    const middleware = router(r);
    assert.deepEqual(middleware.matching('/foo/1/3'), {
      ctx: {
        _matchedRoute: '/foo/:id/3',
        method: 'GET',
        params: {
          id: '1'
        },
        path: '/foo/1/3'
      },
      middlewares: [r.get['/foo/:id/3']]
    });
    assert.deepEqual(middleware.matching('/foo/bar/3'), {
      ctx: {
        _matchedRoute: '/foo/:id/3',
        method: 'GET',
        params: {
          id: 'bar'
        },
        path: '/foo/bar/3'
      },
      middlewares: [r.policy['/foo/bar/3'], r.get['/foo/:id/3']]
    });
    assert.deepEqual(middleware.matching('/foo/test'), {
      ctx: {
        _matchedRoute: undefined,
        method: 'GET',
        params: {},
        path: '/foo/test'
      },
      middlewares: []
    });
  });
});
