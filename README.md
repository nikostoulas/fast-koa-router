# Fast Koa Router

It uses a simple routes json object. Routes order does not matter. Performance does not degrade with routes length.

## Installation

`npm install fast-koa-router`

## About

## Usage

```js
const routes = {
  get: {
    '/path': async function(ctx, next) {
      ctx.body = 'ok';
    },
    '/nested': {
      '/path': async function(ctx, next) {},
      '/path/:id': async function(ctx, next) {}
    }
  },
  post: {
    '/path': async function(ctx, next) {}
  },
  policy: {
    '/path': async function(ctx, next) {},
    '/nested': {
      '/path': async function(ctx, next) {},
      '/path/:id': async function(ctx, next) {}
    }
  },
  prefix: {
    '/': async function(ctx, next) {} // / matches all routes
  }
};

// or

const routes = {
  '/path': {
    get: async function(ctx, next) {
      ctx.body = 'ok';
    },
    post: async function(ctx, next) {},
    policy: async function(ctx, next) {}
  },
  '/nested': {
    '/path': { get: async function(ctx, next) {}, policy: async function(ctx, next) {} },
    '/path/:id': { get: async function(ctx, next) {}, policy: async function(ctx, next) {} }
  },
  prefix: {
    '/': async function(ctx, next) {} // / matches all routes
  }
};

// or

const routes = {
  get: {
    '/path': async function(ctx, next) {},
    '/nested/path': async function(ctx, next) {},
    '/nested/path/:id': async function(ctx, next) {}
  },
  post: {
    '/path': async function(ctx, next) {}
  },
  policy: {
    '/path': async function(ctx, next) {},
    '/nested/path': async function(ctx, next) {},
    '/nested/path/:id': async function(ctx, next) {}
  },
  prefix: {
    '/': async function(ctx, next) {} // / matches all routes
  }
};
```

Supports

- put
- post
- get
- delete
- patch

methods

```js
const Koa = require('koa');
const app = new Koa();
const { router } = require('fast-koa-router');

app.use(router(routes));
app.listen(8080);
```

### Debugging in console

```js
node
> const { router } = require('fast-koa-router');
> const route = router(routes);
> route.matching('/nested/path');
{
  ctx: {
    path: '/nested/path',
    method: 'GET',
    params: {},
    _matchedRoute: '/nested/path'
  },
  middlewares: [
    [AsyncFunction: '/nested/path'], // policy
    [AsyncFunction: '/'],            // prefix route
    [AsyncFunction: '/nested/path']  // get route
  ]
}
> route.routes 
// contains the compiled routes
```


## Star symbol

Sometimes you need to have a fallback if no route matches with the requested url. You can have routes that end with a star eg:

```js
const routes = {
  get: {
    '/path': async function(ctx, next) {},
    '/path/subpath': async function(ctx, next) {},
    '/path/*': async function(ctx, next) {
      ctx.body='Nothing in /path matches this request';
      ctx.status=404;
    },
    '/*': async function(ctx, next) {
      ctx.body='Nothing here';
      ctx.status=404;
    }
  }
```

Note that star symbol is only supported after version 1.1.0 and only when used in the end of a route.

There is no reason to use it in prefix routes. Prefix routes will always match get, post, delete, patch, put urls if they use the same prefix.

## Policies

Policies are used to add authentication and authorization or any other kind of middleware. It is like `all` and is executed before the matching route.
They must call next in order for the actual route to be executed.
Policies will be executed even if a matching get, post, put, delete, patch is not found
Policies are executed before anything else.

## Prefixes

Prefixes are also used to add middleware. Unlike policies they will only be executed if a matching
get, post, put, delete or patch is found. They are convenient to add authentication or authorization in many paths that start with a prefix eg: /api/v1

Prefixes are executed after policies and before other middleware.
Note than both in prefix and policy middleware ctx.params and ctx.\_matchedRoute are available.

## Fast

The path matching is pretty simple. Unlike other middlewares not all routes are checked so performance does not degrade with routes size.
However complex regex matching is not supported.

## Benchmark

Performances tests existing in this codebase and comparing fast-koa-router with @koa/router.

To start fast-koa-router example:
```
node performance-test/router/server.js
```

To start @koa/router example:
```
node performance-test/koa-router/server.js 
```

Metrics have been taken using ab: 
```
ab -k -n 1000000 -c 100 localhost:8080/api/v1/1/2
```

