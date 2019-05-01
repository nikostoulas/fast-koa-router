# Fast Koa Router

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
  }
};
```

Supports

- put
- post
- get
- post
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


## Policies

Policies are used for authentication and authorization.
They must call next in order for the actual route to be executed.


## Fast

The path matching is pretty simple. Unlike other middlewares not all routes are checked so performance does not degrade with routes size. 
However complex regex matching is not supported.